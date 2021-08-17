// Ours
import { isDefined } from './lib/is';
import { getLabel } from './lib/getLabel';
import { categorize } from './lib/categorize';
import { Settings, showQuickPick } from './api';
import { Command, Configuration } from './types';
import { ExtensionId, ExtensionName } from './constants';

const stripDoubleQuotes = (str?: string) => {
	return str?.replace(/^"|"$/g, '');
};

const buildCommand = (mode: 'global' | 'workspace') => {
	const isWorkspace = mode === 'workspace';
	const title = ExtensionName + (isWorkspace ? ' (Workspace)' : '');

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
			detail: stripDoubleQuotes(JSON.stringify(config.currentValue)),
			description: isModified
				? hasValue
					? `(Also modified in: ${modifier})`
					: `(Modified in: ${modifier})`
				: '',
		};
	};

	return async () => {
		const settings = new Settings(isWorkspace);

		const config = await showQuickPick(
			title,
			'Search settings',
			categorize(settings.getItems(createConfigurationItem))
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

		// The value to revert to on cancel
		const resetValue = isWorkspace
			? config.workspaceValue
			: config.globalValue;

		const targetValue = await showQuickPick(
			title,
			config.label,
			config.enum.map((label) => ({
				label,
				value: label,
				// Preselect the current value
				isActive: label === config.currentValue,
				description: isDefaultValue(label)
					? '(Default)'
					: isCurrentValue(label)
					? '(Current)'
					: !isWorkspace && isWorkspaceValue(label)
					? '(Workspace)'
					: '',
			})),
			// Temporarily apply value on focus
			(item) => {
				settings.set(config.key, item.value);
			}
		);

		// Revert setting to the original or set a new value
		return settings.set(config.key, targetValue?.value || resetValue);
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
