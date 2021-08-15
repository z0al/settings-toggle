// Ours
import { isDefined } from './lib/is';
import { Settings, Window } from './api';
import { ExtensionId } from './constants';
import { getLabel } from './lib/getLabel';
import { byCategory, byHierarchy } from './lib/sort';
import { Command, Configuration, QuickPickItem } from './types';

const buildCommand = (mode: 'global' | 'workspace') => {
	const isWorkspace = mode === 'workspace';
	const title = 'Settings' + (isWorkspace ? ' (Workspace)' : '');

	const createConfigurationItem = (config: Configuration) => {
		const hasValue = isDefined(
			isWorkspace ? config.workspaceValue : config.globalValue
		);
		const isModified = isDefined(
			isWorkspace ? config.globalValue : config.workspaceValue
		);
		const modifier = isWorkspace ? 'User' : 'Workspace';

		return {
			...config,
			label: getLabel(config.key),
			detail: JSON.stringify(config.currentValue),
			description: isModified
				? hasValue
					? `(Also modified in: ${modifier})`
					: `(Modified in: ${modifier})`
				: '',
		};
	};

	return async () => {
		const settings = new Settings(isWorkspace);

		// @ts-expect-error
		const config: Configuration & QuickPickItem =
			await Window.showQuickPick(
				title,
				'Search settings',
				settings
					.getItems(createConfigurationItem)
					.sort(byHierarchy)
					.sort(byCategory)
			);

		if (!config) {
			return;
		}

		// Booleans
		if (config.type === 'boolean') {
			return settings.set(config.key, !config.currentValue);
		}

		// Non-Enums
		if (config.type !== 'string' || !config.enum) {
			// Open User/Workspace settings and highlight or jump to the
			// target config.key
			return settings.open(config.key);
		}

		// Enums

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
				value: label,
				description: isDefaultValue(label)
					? '(Default)'
					: isCurrentValue(label)
					? '(Current)'
					: !isWorkspace && isWorkspaceValue(label)
					? '(Workspace)'
					: '',
			}))
		);

		if (!targetValue) {
			return;
		}

		return settings.set(config.key, targetValue.value);
	};
};

export const toggle: Command = {
	name: `${ExtensionId}.toggle`,
	callback: buildCommand('global'),
};

export const toggleWorkspace: Command = {
	name: `${ExtensionId}.toggle-workspace`,
	callback: buildCommand('workspace'),
};

export const commands = [toggle, toggleWorkspace];
