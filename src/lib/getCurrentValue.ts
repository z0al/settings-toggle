// Ours
import { isDefined } from './is';

export function getCurrentValue(opts: {
	target: 'global' | 'workspace';
	defaultValue?: unknown;
	globalValue?: unknown;
	workspaceValue?: unknown;
}) {
	const hasGlobalValue = isDefined(opts.globalValue);
	const hasDefaultValue = isDefined(opts.defaultValue);
	const hasWorkspaceValue = isDefined(opts.workspaceValue);

	const currentValue =
		opts.target === 'workspace' && hasWorkspaceValue
			? opts.workspaceValue
			: hasGlobalValue
			? opts.globalValue
			: // Fallback to worksapceValue when the default value is
			// undefined. Useful work things like `tasks`.
			hasDefaultValue
			? opts.defaultValue
			: opts.workspaceValue;

	return currentValue;
}
