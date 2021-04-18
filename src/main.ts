// Ours
import { Commands } from './api';
import { commands } from './commands';
import { ExtensionContext } from './types';

export function activate(ctx: ExtensionContext) {
	// Register commands
	commands.forEach((cmd) => {
		ctx.subscriptions.push(Commands.register(cmd));
	});
}
