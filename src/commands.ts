// Ours
import { Settings, Command } from './api';
import { Toggle, ToggleWorkspace } from './constants';

const buildCommand = (mode: 'global' | 'workspace') => {
	const opts = {
		workspace: mode === 'workspace',
	};

	return async () => {
		const settings = new Settings(opts);

		// await settings.open();

		// const editor = Window.activeEditor();

		// if (!editor) {
		// 	return;
		// }

		// const json = new ConfigEditor(editor);
		// json.jumpTo(73);
	};
};

export const toggle: Command = {
	name: Toggle,
	callback: buildCommand('global'),
};

export const toggleWorkspace: Command = {
	name: ToggleWorkspace,
	callback: buildCommand('workspace'),
};

export const commands = [toggle, toggleWorkspace];
