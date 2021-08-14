// Ours
import { isDefined } from './lib/is';
import { byCategory } from './lib/sort';
import { Settings, Window } from './api';
import { getLabel } from './lib/getLabel';
import { Toggle, ToggleWorkspace } from './constants';
import { Command, Configuration, QuickPickItem } from './types';

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
			detail: JSON.stringify(config.currentValue),

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

		if (config.type === 'boolean') {
			return await settings.set(config.key, !config.currentValue);
		}

		if (config.type === 'string' && config.enum) {
			const isDefaultValue = (value: unknown) =>
				config.defaultValue === value;

			const isCurrentValue = (value: unknown) =>
				config.currentValue === value;

			const isWorkspaceValue = (value: unknown) =>
				config.workspaceValue === value;

			const targetValue: any = await Window.showQuickPick(
				title,
				config.label,
				config.enum.map((label) => ({
					label,
					description: isDefaultValue(label)
						? '(Default)'
						: isCurrentValue(label)
						? '(Current)'
						: !isWorkspace && isWorkspaceValue(label)
						? '(Workspace)'
						: '',
				}))
			);

			if (targetValue) {
				await settings.set(config.key, targetValue.label);
			}

			return;
		}

		// TODO: .open() should accept a config to jump to
		return await settings.open();
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
