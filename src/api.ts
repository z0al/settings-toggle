// Packages
import * as vscode from 'vscode';

// Ours
import { Command } from './types';
import { isDefined } from './lib/is';
import { flatten } from './lib/flatten';
import { getLabel } from './lib/getLabel';
import { groupByCategory } from './lib/sort';

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
	showQuickPick: async (
		placeHolder: string,
		items: vscode.QuickPickItem[]
	) =>
		await vscode.window.showQuickPick(items, {
			placeHolder,
			matchOnDetail: true,
			matchOnDescription: false,
			ignoreFocusOut: true,
		}),
};

export class JsonEditor {
	constructor(private editor: vscode.TextEditor) {}

	private reveal = (range: vscode.Range) => {
		this.editor.revealRange(range);
		this.editor.selection = new vscode.Selection(range.end, range.end);
	};

	/**
	 * Jumpt to line number
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
	 * Check if JSON settings file is opened in the currentlly active
	 * editor
	 */
	private isActive = () => {
		// FIXIME: compatiblity with other editors
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

	getItems = () => {
		const config = vscode.workspace.getConfiguration();

		const keys = Object.keys(flatten(config)).filter((k) => {
			// Omit language keys & false positives
			return !/\[|\*/.test(k);
		});

		// TODO: write a custom flatten function that doesn't go deeper
		// in keys that ends with /exclude/i or starts with "["
		// It should also accept a mapper function to avoid another iteration

		return keys.sort(groupByCategory).map((key) => {
			const values = config.inspect(key);

			const hasGlobalValue = isDefined(values?.globalValue);
			const hasDefaultValue = isDefined(values?.defaultValue);
			const hasWorkspaceValue = isDefined(values?.workspaceValue);

			const currentValue = JSON.stringify(
				this.opts.workspace && hasWorkspaceValue
					? values?.workspaceValue
					: hasGlobalValue
					? values?.globalValue
					: // Fallback to worksapceValue when the default value is
					// undefined. Useful work things like `tasks`.
					hasDefaultValue
					? values?.defaultValue
					: values?.workspaceValue
			);

			const isModifiedInWorkspace =
				!this.opts.workspace && hasWorkspaceValue;

			return {
				key,
				currentValue,
				globalValue: values?.globalValue,
				defaultValue: values?.defaultValue,
				workspaceValue: values?.workspaceValue,

				label: getLabel(key),
				detail: currentValue,
				// In global settings mode we want to indicate if a value
				// is overwritten in workspace level
				description: isModifiedInWorkspace
					? hasGlobalValue
						? '(Also modified in: Workspace)'
						: '(Modified in: Workspace)'
					: '',
			};
		});
	};
}
