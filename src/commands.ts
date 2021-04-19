// Ours
import { isDefined } from './lib/is';
import { byCategory } from './lib/sort';
import { Settings, Window } from './api';
import { getLabel } from './lib/getLabel';
import { Toggle, ToggleWorkspace } from './constants';
import { Command, Configuration, QuickPickItem } from './types';

const typeOf = (c: Configuration, t: 'boolean' | 'string') => {
	return (
		typeof c.defaultValue === t ||
		typeof c.globalValue === t ||
		typeof c.workspaceValue === t
	);
};

const getCompletions = (
	c: Configuration
): QuickPickItem[] | undefined => {
	if (typeOf(c, 'boolean')) {
		return [true, false].map((v) => ({
			label: JSON.stringify(v),
		}));
	}

	return undefined;
};

const buildCommand = (mode: 'global' | 'workspace') => {
	const isWorkspace = mode === 'workspace';
	const options = { workspace: isWorkspace };

	const title = 'Settings' + (isWorkspace ? ' (Workspace)' : '');

	const createConfigurationItem = (config: Configuration) => {
		const isModifiedInWorkspace =
			!isWorkspace && isDefined(config.workspaceValue);

		return {
			...config,
			label: getLabel(config.key),
			detail: config.currentValue,

			// In global settings mode we want to indicate if a
			// value is overwritten in workspace level
			description: isModifiedInWorkspace
				? isDefined(config.globalValue)
					? '(Also modified in: Workspace)'
					: '(Modified in: Workspace)'
				: '',
		};
	};

	return async () => {
		const settings = new Settings(options);

		// @ts-expect-error
		const config: Configuration &
			QuickPickItem = await Window.showQuickPick(
			title,
			'Select to toggle or open a configuration',
			settings
				.getItems(createConfigurationItem)
				.sort((a, b) => byCategory(a.key, b.key))
		);

		if (!config) {
			return;
		}

		const completions = getCompletions(config);

		if (!completions) {
			// TODO: .open() should accept a config to jump to
			return await settings.open();
		}

		// TODO: Should actually save the user input
		await Window.showQuickPick(title, config.label, completions);
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
