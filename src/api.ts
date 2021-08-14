// Packages
import * as vscode from 'vscode';

// Ours
import { Command, Configuration } from './types';
import { configurationsSchema } from './lib/schema';
import { getCurrentValue } from './lib/getCurrentValue';

export const Commands = {
	execute: (cmd: string) => {
		return vscode.commands.executeCommand(cmd);
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
	showQuickPick: async <T extends vscode.QuickPickItem>(
		title: string,
		placeHolder: string,
		items: T[]
	) =>
		await vscode.window.showQuickPick<T>(items, {
			title,
			placeHolder,
			matchOnDetail: true,
			matchOnDescription: false,
			// ignoreFocusOut: true,
		}),
};

export class JsonEditor {
	constructor(private editor: vscode.TextEditor) {}

	private reveal = (range: vscode.Range) => {
		this.editor.revealRange(range);
		this.editor.selection = new vscode.Selection(range.end, range.end);
	};

	/**
	 * Jump to line number
	 *
	 * Copied & modified from:
	 * https://github.com/mathbookpeace/vscode-ext-just-go-to-line
	 */
	jumpTo = (line: number) => {
		// TODO: handle column position
		const targetLine = line - 1;
		const lastLine = this.editor.document.lineCount - 1;

		const { range } = this.editor.document.lineAt(
			Math.max(0, Math.min(targetLine, lastLine))
		);

		this.reveal(range);
	};
}

export class Settings {
	/**
	 * A DocumentFilter to match global and workspace settings
	 */
	static fileInfo = {
		language: 'jsonc',
		pattern: '**/settings.json',
	};

	constructor(private opts: { workspace?: boolean } = {}) {}

	/**
	 * Check if JSON settings file is opened in the currently active
	 * editor
	 */
	private isActive = () => {
		// FIXIME: compatibility with other editors?
		const fileExt = this.opts.workspace
			? '.vscode/settings.json'
			: '/User/settings.json';

		const doc = Window.activeEditor()?.document;

		if (!doc) {
			return false;
		}

		return (
			doc.fileName.endsWith(fileExt) &&
			doc.languageId === Settings.fileInfo.language
		);
	};

	private waitUntilActive = () => {
		if (this.isActive()) {
			return true;
		}

		return new Promise<void>((resolve) => {
			const { dispose } = Window.onActiveChanged(() => {
				if (!this.isActive()) {
					return;
				}

				dispose();
				resolve();
			});
		});
	};

	/**
	 * Change the value of a given configuration key
	 */
	set = (key: string, value: any) => {
		const configs = vscode.workspace.getConfiguration();

		return configs.update(
			key,
			value,
			this.opts.workspace
				? vscode.ConfigurationTarget.Workspace
				: vscode.ConfigurationTarget.Global
		);
	};

	/**
	 * Open global or workspace JSON settings and wait for the file
	 * to be active
	 */
	open = async (): Promise<boolean> => {
		if (this.isActive()) {
			return true;
		}

		const cmd = this.opts.workspace
			? 'workbench.action.openWorkspaceSettings'
			: 'workbench.action.openSettingsJson';

		try {
			await Commands.execute(cmd);
		} catch (e) {
			return false;
		}

		await this.waitUntilActive();

		return true;
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
				target: this.opts.workspace ? 'workspace' : 'global',
				...values,
			});

			items.push(
				transform({ key, ...schema, ...values, currentValue })
			);
		});

		return items;
	};
}
