// Packages
import * as vscode from 'vscode';
import waitFor from 'p-wait-for';

// Ours
import { Command, Configuration } from './types';
import { configurationsSchema } from './lib/schema';
import { getCurrentValue } from './lib/getCurrentValue';

export const Commands = {
	execute: (cmd: string, ...args: any[]) => {
		return vscode.commands.executeCommand(cmd, ...args);
	},

	register: (cmd: Command) => {
		return vscode.commands.registerCommand(cmd.name, cmd.callback);
	},
};

export const Window = {
	/**
	 * Get currently active editor
	 */
	activeEditor: () => vscode.window.activeTextEditor,

	/**
	 * An event which fires when the active editor has changed.
	 * Note that the event also fires when the active editor changes
	 * to undefined.
	 */
	onActiveChanged: vscode.window.onDidChangeActiveTextEditor,

	/**
	 * Show a selection list
	 */
	showQuickPick: async <
		T extends vscode.QuickPickItem & { isActive?: boolean }
	>(
		title: string,
		placeHolder: string,
		items: T[],
		onFocus?: (item: T) => void
	) => {
		const qp = vscode.window.createQuickPick<T>();

		qp.items = items;
		qp.title = title;
		qp.placeholder = placeHolder;
		qp.matchOnDetail = true;
		qp.matchOnDescription = false;
		qp.activeItems = items.filter((item) => item.isActive);

		qp.onDidChangeActive((items) => {
			// We don't support canPickMany
			const item = items[0];
			onFocus?.(item);
		});

		return new Promise<T | undefined>((resolve) => {
			qp.onDidAccept(() => {
				qp.hide();

				// We don't support canPickMany
				const item = qp.selectedItems[0];
				resolve(item);
			});

			qp.onDidHide(() => resolve(undefined));

			qp.show();
		});
	},
};

export class Settings {
	/**
	 * A DocumentFilter to match global and workspace settings
	 */
	static fileInfo = {
		language: 'jsonc',
		pattern: '**/settings.json',
	};

	constructor(private workspaceMode?: boolean) {}

	getConfigTarget = () => {
		return this.workspaceMode ? 'workspace' : 'global';
	};

	/**
	 * Check if JSON settings file is opened in the currently active
	 * editor
	 */
	private isActive = () => {
		const doc = Window.activeEditor()?.document;

		if (!doc) {
			return false;
		}

		// TODO: compatibility with other editors?
		const fileExt = this.workspaceMode
			? 'vscode/settings.json'
			: 'User/settings.json';

		return (
			doc.fileName.endsWith(fileExt) &&
			doc.languageId === Settings.fileInfo.language
		);
	};

	private waitForEditor = () => {
		if (this.isActive()) {
			return true;
		}

		return waitFor(() => this.isActive());
	};

	private jumpToKey = async (configKey: string) => {
		if (!this.isActive()) {
			return;
		}

		const editor = Window.activeEditor();

		if (!editor) {
			return;
		}

		let symbols: vscode.DocumentSymbol[] = [];

		const getSymbol = () => {
			return symbols.find((s) => s.name === configKey);
		};

		await waitFor(
			async () => {
				// @ts-expect-error
				symbols = await Commands.execute(
					'vscode.executeDocumentSymbolProvider',
					editor.document.uri
				);

				return !!getSymbol();
			},
			{ timeout: 500 }
		);

		const range = getSymbol()?.range;

		if (range) {
			editor.revealRange(range);
			editor.selection = new vscode.Selection(range.end, range.end);
		}
	};

	/**
	 * Change the value of a given configuration key
	 */
	set = (key: string, value: any) => {
		const configs = vscode.workspace.getConfiguration();

		return configs.update(
			key,
			value,
			this.workspaceMode
				? vscode.ConfigurationTarget.Workspace
				: vscode.ConfigurationTarget.Global
		);
	};

	/**
	 * Open user preferred settings editor and jump to the
	 * configuration item
	 */
	open = async (configKey: string) => {
		// Check the user preferred Settings Editor
		const preferredEditor = getCurrentValue({
			...vscode.workspace
				.getConfiguration()
				.inspect('workbench.settings.editor'),
			target: this.getConfigTarget(),
		});

		// Settings (UI)
		if (preferredEditor === 'ui') {
			return Commands.execute(
				'workbench.action.openSettings',
				configKey
			);
		}

		// Settings (JSON)
		const cmd = this.workspaceMode
			? 'workbench.action.openWorkspaceSettingsFile'
			: 'workbench.action.openSettingsJson';

		await Commands.execute(cmd);
		await this.waitForEditor();

		// Force-set the value in order to appear in the editor
		await this.set(
			configKey,
			getCurrentValue({
				...vscode.workspace.getConfiguration().inspect(configKey),
				target: this.getConfigTarget(),
			})
		);

		return this.jumpToKey(configKey);
	};

	getItems = <T>(transform: (config: Configuration) => T): T[] => {
		const config = vscode.workspace.getConfiguration();

		const items: T[] = [];

		configurationsSchema.forEach((schema, key) => {
			const inspected = config.inspect(key);

			const values = {
				globalValue: inspected?.globalValue,
				defaultValue: inspected?.defaultValue,
				workspaceValue: inspected?.workspaceValue,
			};

			const currentValue = getCurrentValue({
				target: this.getConfigTarget(),
				...values,
			});

			items.push(
				transform({ key, ...schema, ...values, currentValue })
			);
		});

		return items;
	};
}
