// Ours
import { Commands } from './api';
import { commands } from './commands';
import { ExtensionContext } from './types';

export function activate(ctx: ExtensionContext) {
	// vscode.languages.registerDocumentSymbolProvider(Configuration.fileInfo, {
	// 	provideDocumentSymbols: (doc) => {
	// 		return [
	// 			{
	// 				kind: 7,
	// 				name: 'My Test',
	// 				children: [],
	// 				containerName: 'Test Container Name',
	// 				detail: 'Test details',
	// 				location: new vscode.Location(
	// 					doc.uri,
	// 					new vscode.Position(0, 10)
	// 				),
	// 			},
	// 		];
	// 	},
	// });

	// Register commands
	commands.forEach((cmd) => {
		ctx.subscriptions.push(Commands.register(cmd));
	});
}
