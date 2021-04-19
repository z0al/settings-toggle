export type {
	QuickPickItem,
	TextEditor,
	ExtensionContext,
} from 'vscode';

export interface Command {
	name: string;
	callback: () => Promise<unknown>;
}

export interface Configuration {
	key: string;
	currentValue?: any;
	defaultValue?: any;
	globalValue?: any;
	workspaceValue?: any;
}
