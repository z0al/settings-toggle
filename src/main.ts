// Packages
import { workspace, ExtensionContext } from 'vscode';

// Ours
import { Commands } from './api';
import { commands } from './commands';
import { SettingsSchemaUri } from './constants';
import { buildInternalSchema } from './lib/schema';

export async function activate(ctx: ExtensionContext) {
	// Inspect the JSON schema of the configurations to get the types and
	// enum values.
	//
	// Credit: https://github.com/sandy081/settings-picker
	buildInternalSchema(
		(await workspace.openTextDocument(SettingsSchemaUri)).getText()
	);

	workspace.onDidChangeTextDocument((e) => {
		if (e.document.uri.toString() === SettingsSchemaUri.toString()) {
			buildInternalSchema(e.document.getText());
		}
	});

	// Register commands
	commands.forEach((cmd) => {
		ctx.subscriptions.push(Commands.register(cmd));
	});
}
