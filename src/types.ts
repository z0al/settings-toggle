export type {
	QuickPickItem,
	TextEditor,
	ExtensionContext,
} from 'vscode';

export interface Command {
	name: string;
	callback: () => Promise<void>;
}

export interface ConfigurationValue {
	key: string;
	defaultValue: unknown;
	globalValue: unknown;
	workspaceValue?: unknown;
}
