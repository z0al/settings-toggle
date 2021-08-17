export interface Command {
	name: string;
	callback: () => Promise<unknown>;
}

export interface ConfigurationSchema {
	// There are more but we don't care
	type: 'string' | 'boolean';
	enum?: any[];
	enumDescriptions?: string[];
}

export interface Configuration extends ConfigurationSchema {
	key: string;
	currentValue?: any;
	defaultValue?: any;
	globalValue?: any;
	workspaceValue?: any;
}
