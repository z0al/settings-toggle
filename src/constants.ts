// Packages
import { Uri } from 'vscode';

// Extension name
export const Extension = 'power-settings';

// Commands
const cmd = (name: string) => `${Extension}.${name}`;

export const Toggle = cmd('toggle');
export const ToggleWorkspace = cmd('toggle-workspace');

export const SettingsSchemaUri = Uri.parse(
	'vscode://schemas/settings/default'
);
