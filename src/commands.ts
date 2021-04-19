// Ours
import { Command } from './types';
import { byCategory } from './lib/sort';
import { Settings, Window } from './api';
import { Toggle, ToggleWorkspace } from './constants';

const buildCommand = (mode: 'global' | 'workspace') => {
	const isWorkspace = mode === 'workspace';
	const opts = {
		workspace: isWorkspace,
	};

	return async () => {
		const settings = new Settings(opts);

		const value = await Window.showQuickPick(
			`Select to toggle or open a configuration ${
				isWorkspace ? '(Workspace)' : ''
			}`,
			settings.getItems().sort((a, b) => byCategory(a.key, b.key))
		);

		console.log(value);
		// TODO: get completion values
		// TODO: open file when necessary
		// await settings.open();
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
