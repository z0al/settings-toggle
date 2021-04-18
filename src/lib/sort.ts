// Packages
import { isMatch } from 'micromatch';

function getCategoryIndex(key: string) {
	// Editor
	if (key.startsWith('editor.') || key.startsWith('diffEditor.')) {
		// Editor > Cursor
		// ['editor.cursor*']
		if (key.startsWith('editor.cursor')) {
			return 1;
		}

		// Editor > Find
		// ['editor.find.*']
		if (key.startsWith('editor.find.')) {
			return 2;
		}

		// Editor > Font
		// ['editor.font*']
		if (key.startsWith('editor.font')) {
			return 3;
		}

		// Editor > Format
		// ['editor.format*']
		if (key.startsWith('editor.format')) {
			return 4;
		}

		// Editor > Diff Editor
		// ['diffEditor.*']
		if (key.startsWith('diffEditor.')) {
			return 5;
		}

		// Editor > Minimap
		// ['editor.minimap.*']
		if (key.startsWith('editor.minimap.')) {
			return 6;
		}

		// Editor > Suggestions
		// ['editor.*suggest*']
		if (isMatch(key, 'editor.*suggest*')) {
			return 7;
		}

		// Editor > Files
		// ['files.*']
		if (key.startsWith('files.')) {
			return 8;
		}

		// Other e.g. editor.accessibilitySupport
		return 9;
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
			return 10;
		}

		// Workbench > Breadcrumbs
		// ['breadcrumbs.*']
		if (key.startsWith('breadcrumbs.')) {
			return 11;
		}

		// Workbench > Editor Management
		// ['workbench.editor.*']
		if (key.startsWith('workbench.editor.')) {
			return 12;
		}

		// Workbench > Settings Editor
		// ['workbench.settings.*']
		if (key.startsWith('workbench.settings.')) {
			return 13;
		}

		// Workbench > Zen Mode
		// ['zenmode.*']
		if (key.startsWith('zenmode.')) {
			return 14;
		}

		// Workbench > Screencast Mode
		// ['screencastMode.*']
		if (key.startsWith('screencastMode.')) {
			return 15;
		}

		// Other e.g. workbench.startupEditor
		return 16;
	}

	// Window

	// ['window.*newwindow*']
	if (isMatch(key, 'window.*newwindow*')) {
		return 17;
	}

	// Features

	// Features > Explorer
	// ['explorer.*', 'outline.*']
	if (isMatch(key, ['explorer.*', 'outline.*'])) {
		return 18;
	}

	// Features > Search
	// ['search.*']
	if (key.startsWith('search.')) {
		return 19;
	}

	// Features > Debug
	// ['debug.*', 'launch']
	if (isMatch(key, ['debug.*', 'launch'])) {
		return 20;
	}

	// Features > Testing
	// ['testing.*']
	if (key.startsWith('testing.')) {
		return 21;
	}

	// Features > SCM
	// ['scm.*']
	if (key.startsWith('scm.')) {
		return 22;
	}

	// Features > Extensions
	// ['extensions.*']
	if (key.startsWith('extensions.')) {
		return 23;
	}

	// Features > Terminal
	// ['terminal.*']
	if (key.startsWith('terminal.')) {
		return 24;
	}

	// Features > Task
	// ['task.*']
	if (key.startsWith('task.')) {
		return 25;
	}

	// Features > Problems
	// ['problems.*']
	if (key.startsWith('problems.')) {
		return 26;
	}

	// Features > Output
	// ['output.*']
	if (key.startsWith('output.')) {
		return 27;
	}

	// Features > Comments
	// ['comments.*']
	if (key.startsWith('comments.')) {
		return 28;
	}

	// Features > Remote
	// ['remote.*']
	if (key.startsWith('remote.')) {
		return 29;
	}

	// Features > Timeline
	// ['timeline.*']
	if (key.startsWith('timeline.')) {
		return 30;
	}

	// Features > Notebook
	// ['notebook.*']
	if (key.startsWith('notebook.')) {
		return 31;
	}

	// Application

	// Application > Proxy
	// ['http.*']
	if (key.startsWith('http.')) {
		return 32;
	}

	// Application > Keyboard
	// ['keyboard.*']
	if (key.startsWith('keyboard.')) {
		return 33;
	}

	// Application > Update
	// ['update.*']
	if (key.startsWith('update.')) {
		return 34;
	}

	// Application > Telemetry
	// ['telemetry.*']
	if (key.startsWith('telemetry.')) {
		return 35;
	}

	// Application > Settings Sync
	// ['settingsSync.*']
	if (key.startsWith('settingsSync.')) {
		return 36;
	}

	// Security

	// Security > Workspace
	// ['security.workspace.*']
	if (key.startsWith('security.workspace.')) {
		return 37;
	}

	// Other e.g. Extension configs
	return 100;
}

export function groupByCategory(a: string, b: string) {
	return getCategoryIndex(a) - getCategoryIndex(b);
}
