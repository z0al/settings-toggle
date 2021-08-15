// Packages
import sortBy from 'lodash.sortby';

// Ours
import { Configuration } from '../types';

const categories = [
	{
		name: 'Commonly Used',
		children: [
			'files.autoSave',
			'editor.fontSize',
			'editor.fontFamily',
			'editor.tabSize',
			'editor.renderWhitespace',
			'editor.cursorStyle',
			'editor.multiCursorModifier',
			'editor.insertSpaces',
			'editor.wordWrap',
			'files.exclude',
			'files.associations',
			'workbench.editor.enablePreview',
		],
	},
	{
		name: 'Text Editor',
		prefix: 'editor.',
		children: [
			'editor.cursor*',
			'editor.find.*',
			'editor.font*',
			'editor.format*',
			'diffEditor.*',
			'editor.minimap.*',
			'editor.*suggest*',
			'files.*',
		],
	},
	{
		name: 'Workbench',
		prefix: 'workbench.',
		children: [
			'workbench.activityBar.*',
			'workbench.*color*',
			'workbench.fontAliasing',
			'workbench.iconTheme',
			'workbench.sidebar.location',
			'workbench.*.visible',
			'workbench.tips.enabled',
			'workbench.tree.*',
			'workbench.view.*',
			'breadcrumbs.*',
			'workbench.editor.*',
			'workbench.settings.*',
			'zenmode.*',
			'screencastMode.*',
		],
	},
	{
		name: 'Window',
		prefix: 'window.',
		children: ['window.*newwindow*'],
	},
	{
		name: 'Features',
		children: [
			'explorer.*',
			'outline.*',
			'search.*',
			'debug.*',
			'launch',
			'testing.*',
			'scm.*',
			'extensions.*',
			'terminal.*',
			'task.*',
			'problems.*',
			'output.*',
			'comments.*',
			'remote.*',
			'timeline.*',
			'notebook.*',
		],
	},
	{
		name: 'Application',
		children: [
			'http.*',
			'keyboard.*',
			'update.*',
			'telemetry.*',
			'settingsSync.*',
		],
	},
	{
		name: 'Security',
		prefix: 'security.',
		children: [],
	},
];

function matchPattern(pattern: string, key: string) {
	if (!pattern.includes('*')) {
		return pattern === key;
	}

	if (pattern.indexOf('*') === pattern.length - 1) {
		return key.startsWith(pattern.slice(0, -1));
	}

	return pattern
		.split('*')
		.every((p) => key.toLowerCase().includes(p.toLowerCase()));
}

function getCategoryIndex(key: string) {
	for (const [index, category] of categories.entries()) {
		const { prefix, children } = category;

		if (prefix && !key.startsWith(prefix)) {
			continue;
		}

		const matchIndex = children.findIndex((pattern) =>
			matchPattern(pattern, key)
		);

		if (matchIndex >= 0) {
			return Number(`${index}.${matchIndex}`);
		}

		if (prefix && matchIndex < 0) {
			return index;
		}
	}

	return 10000;
}

export function categorize<T extends Configuration>(configs: T[]) {
	return sortBy(
		configs,
		({ key }) => getCategoryIndex(key),
		({ key }) => key.split('.').length,
		({ key }) => key
	);
}
