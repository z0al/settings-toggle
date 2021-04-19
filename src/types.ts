// Packages
import { QuickPickItem } from 'vscode';

export type {
	QuickPickItem,
	TextEditor,
	ExtensionContext,
} from 'vscode';

export interface Command {
	name: string;
	callback: () => Promise<void>;
}

export interface Configuration extends QuickPickItem {
	key: string;
	currentValue?: unknown;
	defaultValue?: unknown;
	globalValue?: unknown;
	workspaceValue?: unknown;
}
