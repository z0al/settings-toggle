// Packages
import { isMatch } from 'micromatch';

// Ours
import { Configuration } from '../types';

const common = [
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
];

function getCategoryIndex(key: string) {
	// Common
	if (common.includes(key)) {
		return common.indexOf(key);
	}

	const startIndex = common.length;

	// Editor
	if (key.startsWith('editor.') || key.startsWith('diffEditor.')) {
		// Editor > Cursor
		// ['editor.cursor*']
		if (key.startsWith('editor.cursor')) {
			return startIndex + 1;
		}

		// Editor > Find
		// ['editor.find.*']
		if (key.startsWith('editor.find.')) {
			return startIndex + 2;
		}

		// Editor > Font
		// ['editor.font*']
		if (key.startsWith('editor.font')) {
			return startIndex + 3;
		}

		// Editor > Format
		// ['editor.format*']
		if (key.startsWith('editor.format')) {
			return startIndex + 4;
		}

		// Editor > Diff Editor
		// ['diffEditor.*']
		if (key.startsWith('diffEditor.')) {
			return startIndex + 5;
		}

		// Editor > Minimap
		// ['editor.minimap.*']
		if (key.startsWith('editor.minimap.')) {
			return startIndex + 6;
		}

		// Editor > Suggestions
		// ['editor.*suggest*']
		if (isMatch(key, 'editor.*suggest*')) {
			return startIndex + 7;
		}

		// Editor > Files
		// ['files.*']
		if (key.startsWith('files.')) {
			return startIndex + 8;
		}

		// Other e.g. editor.accessibilitySupport
		return startIndex + 9;
	}

	// Workbench
	if (
		key.startsWith('workbench.') ||
		key.startsWith('zenmode.') ||
		key.startsWith('screencastMode.')
	) {
		// Workbench > Appearance
		if (
			isMatch(key, [
				'workbench.activityBar.*',
				'workbench.*color*',
				'workbench.fontAliasing',
				'workbench.iconTheme',
				'workbench.sidebar.location',
				'workbench.*.visible',
				'workbench.tips.enabled',
				'workbench.tree.*',
				'workbench.view.*',
			])
		) {
			return startIndex + 10;
		}

		// Workbench > Breadcrumbs
		// ['breadcrumbs.*']
		if (key.startsWith('breadcrumbs.')) {
			return startIndex + 11;
		}

		// Workbench > Editor Management
		// ['workbench.editor.*']
		if (key.startsWith('workbench.editor.')) {
			return startIndex + 12;
		}

		// Workbench > Settings Editor
		// ['workbench.settings.*']
		if (key.startsWith('workbench.settings.')) {
			return startIndex + 13;
		}

		// Workbench > Zen Mode
		// ['zenmode.*']
		if (key.startsWith('zenmode.')) {
			return startIndex + 14;
		}

		// Workbench > Screencast Mode
		// ['screencastMode.*']
		if (key.startsWith('screencastMode.')) {
			return startIndex + 15;
		}

		// Other e.g. workbench.startupEditor
		return startIndex + 16;
	}

	// Window

	// ['window.*newwindow*']
	if (isMatch(key, 'window.*newwindow*')) {
		return startIndex + 17;
	}

	// Features

	// Features > Explorer
	// ['explorer.*', 'outline.*']
	if (isMatch(key, ['explorer.*', 'outline.*'])) {
		return startIndex + 18;
	}

	// Features > Search
	// ['search.*']
	if (key.startsWith('search.')) {
		return startIndex + 19;
	}

	// Features > Debug
	// ['debug.*', 'launch']
	if (isMatch(key, ['debug.*', 'launch'])) {
		return startIndex + 20;
	}

	// Features > Testing
	// ['testing.*']
	if (key.startsWith('testing.')) {
		return startIndex + 21;
	}

	// Features > SCM
	// ['scm.*']
	if (key.startsWith('scm.')) {
		return startIndex + 22;
	}

	// Features > Extensions
	// ['extensions.*']
	if (key.startsWith('extensions.')) {
		return startIndex + 23;
	}

	// Features > Terminal
	// ['terminal.*']
	if (key.startsWith('terminal.')) {
		return startIndex + 24;
	}

	// Features > Task
	// ['task.*']
	if (key.startsWith('task.')) {
		return startIndex + 25;
	}

	// Features > Problems
	// ['problems.*']
	if (key.startsWith('problems.')) {
		return startIndex + 26;
	}

	// Features > Output
	// ['output.*']
	if (key.startsWith('output.')) {
		return startIndex + 27;
	}

	// Features > Comments
	// ['comments.*']
	if (key.startsWith('comments.')) {
		return startIndex + 28;
	}

	// Features > Remote
	// ['remote.*']
	if (key.startsWith('remote.')) {
		return startIndex + 29;
	}

	// Features > Timeline
	// ['timeline.*']
	if (key.startsWith('timeline.')) {
		return startIndex + 30;
	}

	// Features > Notebook
	// ['notebook.*']
	if (key.startsWith('notebook.')) {
		return startIndex + 31;
	}

	// Application

	// Application > Proxy
	// ['http.*']
	if (key.startsWith('http.')) {
		return startIndex + 32;
	}

	// Application > Keyboard
	// ['keyboard.*']
	if (key.startsWith('keyboard.')) {
		return startIndex + 33;
	}

	// Application > Update
	// ['update.*']
	if (key.startsWith('update.')) {
		return startIndex + 34;
	}

	// Application > Telemetry
	// ['telemetry.*']
	if (key.startsWith('telemetry.')) {
		return startIndex + 35;
	}

	// Application > Settings Sync
	// ['settingsSync.*']
	if (key.startsWith('settingsSync.')) {
		return startIndex + 36;
	}

	// Security

	// Security > Workspace
	// ['security.workspace.*']
	if (key.startsWith('security.workspace.')) {
		return startIndex + 37;
	}

	// Other e.g. Extension configs
	return startIndex + 100;
}

export function byCategory(a: Configuration, b: Configuration) {
	return getCategoryIndex(a.key) - getCategoryIndex(b.key);
}

export function byHierarchy(a: Configuration, b: Configuration) {
	const isACommon = common.includes(a.key);
	const isBCommon = common.includes(b.key);

	if (isACommon) {
		return -1;
	}

	if (isBCommon) {
		return 1;
	}

	return a.key.split('.').length - b.key.split('.').length;
}
