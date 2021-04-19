// Packages
import { expect } from 'chai';

// Ours
import { flatten } from './flatten';

const sample = {
	editor: {
		tabSize: 4,
		insertSpaces: false,
		wordBasedSuggestionsMode: 'matchingDocuments',
		semanticHighlighting: { enabled: 'configuredByTheme' },
		maxTokenizationLineLength: 20000,
		codeLens: true,
		codeLensFontFamily: '',
		codeLensFontSize: 0,
		cursorBlinking: 'blink',
		cursorWidth: 0,
		find: {
			cursorMoveOnType: true,
			autoFindInSelection: 'never',
		},
		fontSize: 13,
		fontWeight: 'normal',
		highlightActiveIndentGuide: true,
		hover: { enabled: true, delay: 300, sticky: true },
		letterSpacing: 0,
		lineHeight: 0,
		lineNumbers: 'relative',
		matchBrackets: 'always',
		mouseWheelScrollSensitivity: 1,
		multiCursorModifier: 'alt',
		padding: { top: 0, bottom: 0 },
		parameterHints: { enabled: true, cycle: false },
		peekWidgetDefaultFocus: 'tree',
		rulers: [],
		scrollBeyondLastColumn: 5,
		showFoldingControls: 'mouseover',
		snippetSuggestions: 'inline',
		smartSelect: { selectLeadingAndTrailingWhitespace: true },
		suggestFontSize: 0,
		suggestSelection: 'recentlyUsed',
		tabCompletion: 'off',
		unusualLineTerminators: 'prompt',
		wordWrap: 'on',
		wordWrapColumn: 80,
		wrappingIndent: 'same',
		wrappingStrategy: 'simple',
		showDeprecated: true,
		inlineHints: {
			enabled: true,
			fontSize: 0,
		},
		rename: { enablePreview: true },
		defaultFormatter: null,
		codeActionsOnSave: {},
		formatOnSave: true,
		formatOnSaveMode: 'file',
	},
	keyboard: { dispatch: 'code' },
	problems: {
		decorations: { enabled: true },
		autoReveal: true,
	},
	remote: {
		extensionKind: { 'pub.name': ['ui'] },
	},
	files: {
		participants: { timeout: 60000 },
		exclude: {
			'**/.git': true,
			'**/.svn': true,
			'**/.hg': true,
			'**/CVS': true,
			'**/.DS_Store': true,
		},
		associations: {},
		encoding: 'utf8',
		eol: 'auto',
		enableTrash: true,
		autoSave: 'off',
		autoSaveDelay: 1000,
		watcherExclude: {
			'**/.git/s/**': true,
			'**/.git/subtree-cache/**': true,
			'**/node_modules/**': true,
			'**/.hg/store/**': true,
		},
		hotExit: 'onExit',
		defaultLanguage: '',
		maxMemoryForLargeFilesMB: 4096,
		restoreUndoStack: true,
		saveConflictResolution: 'askUser',
	},
};

describe('flatten', () => {
	it('should flatten all values', () => {
		expect(
			flatten({ input: sample, deeper: () => true })
		).to.deep.equal([
			['editor.tabSize', 4],
			['editor.insertSpaces', false],
			['editor.wordBasedSuggestionsMode', 'matchingDocuments'],
			['editor.semanticHighlighting.enabled', 'configuredByTheme'],
			['editor.maxTokenizationLineLength', 20000],
			['editor.codeLens', true],
			['editor.codeLensFontFamily', ''],
			['editor.codeLensFontSize', 0],
			['editor.cursorBlinking', 'blink'],
			['editor.cursorWidth', 0],
			['editor.find.cursorMoveOnType', true],
			['editor.find.autoFindInSelection', 'never'],
			['editor.fontSize', 13],
			['editor.fontWeight', 'normal'],
			['editor.highlightActiveIndentGuide', true],
			['editor.hover.enabled', true],
			['editor.hover.delay', 300],
			['editor.hover.sticky', true],
			['editor.letterSpacing', 0],
			['editor.lineHeight', 0],
			['editor.lineNumbers', 'relative'],
			['editor.matchBrackets', 'always'],
			['editor.mouseWheelScrollSensitivity', 1],
			['editor.multiCursorModifier', 'alt'],
			['editor.padding.top', 0],
			['editor.padding.bottom', 0],
			['editor.parameterHints.enabled', true],
			['editor.parameterHints.cycle', false],
			['editor.peekWidgetDefaultFocus', 'tree'],
			['editor.rulers', []],
			['editor.scrollBeyondLastColumn', 5],
			['editor.showFoldingControls', 'mouseover'],
			['editor.snippetSuggestions', 'inline'],
			['editor.smartSelect.selectLeadingAndTrailingWhitespace', true],
			['editor.suggestFontSize', 0],
			['editor.suggestSelection', 'recentlyUsed'],
			['editor.tabCompletion', 'off'],
			['editor.unusualLineTerminators', 'prompt'],
			['editor.wordWrap', 'on'],
			['editor.wordWrapColumn', 80],
			['editor.wrappingIndent', 'same'],
			['editor.wrappingStrategy', 'simple'],
			['editor.showDeprecated', true],
			['editor.inlineHints.enabled', true],
			['editor.inlineHints.fontSize', 0],
			['editor.rename.enablePreview', true],
			['editor.defaultFormatter', null],
			['editor.codeActionsOnSave', {}],
			['editor.formatOnSave', true],
			['editor.formatOnSaveMode', 'file'],
			['keyboard.dispatch', 'code'],
			['problems.decorations.enabled', true],
			['problems.autoReveal', true],
			['remote.extensionKind.pub.name', ['ui']],
			['files.participants.timeout', 60000],
			['files.exclude.**/.git', true],
			['files.exclude.**/.svn', true],
			['files.exclude.**/.hg', true],
			['files.exclude.**/CVS', true],
			['files.exclude.**/.DS_Store', true],
			['files.associations', {}],
			['files.encoding', 'utf8'],
			['files.eol', 'auto'],
			['files.enableTrash', true],
			['files.autoSave', 'off'],
			['files.autoSaveDelay', 1000],
			['files.watcherExclude.**/.git/s/**', true],
			['files.watcherExclude.**/.git/subtree-cache/**', true],
			['files.watcherExclude.**/node_modules/**', true],
			['files.watcherExclude.**/.hg/store/**', true],
			['files.hotExit', 'onExit'],
			['files.defaultLanguage', ''],
			['files.maxMemoryForLargeFilesMB', 4096],
			['files.restoreUndoStack', true],
			['files.saveConflictResolution', 'askUser'],
		]);
	});

	it('should respect options.exclude', () => {
		const exclude = (key: string) => {
			return !key.startsWith('files');
		};

		expect(
			flatten({ input: sample, deeper: () => true, exclude })
		).to.deep.equal([
			['files.participants.timeout', 60000],
			['files.exclude.**/.git', true],
			['files.exclude.**/.svn', true],
			['files.exclude.**/.hg', true],
			['files.exclude.**/CVS', true],
			['files.exclude.**/.DS_Store', true],
			['files.associations', {}],
			['files.encoding', 'utf8'],
			['files.eol', 'auto'],
			['files.enableTrash', true],
			['files.autoSave', 'off'],
			['files.autoSaveDelay', 1000],
			['files.watcherExclude.**/.git/s/**', true],
			['files.watcherExclude.**/.git/subtree-cache/**', true],
			['files.watcherExclude.**/node_modules/**', true],
			['files.watcherExclude.**/.hg/store/**', true],
			['files.hotExit', 'onExit'],
			['files.defaultLanguage', ''],
			['files.maxMemoryForLargeFilesMB', 4096],
			['files.restoreUndoStack', true],
			['files.saveConflictResolution', 'askUser'],
		]);
	});

	it('should respect options.deeper', () => {
		expect(
			flatten({
				input: sample,
				exclude: (key: string) => {
					return !key.startsWith('files');
				},
				deeper: (key) => {
					return !/exclude$/i.test(key);
				},
			})
		).to.deep.equal([
			['files.participants.timeout', 60000],
			[
				'files.exclude',
				{
					'**/.git': true,
					'**/.svn': true,
					'**/.hg': true,
					'**/CVS': true,
					'**/.DS_Store': true,
				},
			],
			['files.associations', {}],
			['files.encoding', 'utf8'],
			['files.eol', 'auto'],
			['files.enableTrash', true],
			['files.autoSave', 'off'],
			['files.autoSaveDelay', 1000],
			[
				'files.watcherExclude',
				{
					'**/.git/s/**': true,
					'**/.git/subtree-cache/**': true,
					'**/node_modules/**': true,
					'**/.hg/store/**': true,
				},
			],
			['files.hotExit', 'onExit'],
			['files.defaultLanguage', ''],
			['files.maxMemoryForLargeFilesMB', 4096],
			['files.restoreUndoStack', true],
			['files.saveConflictResolution', 'askUser'],
		]);
	});

	it('should pass all keys/values to transform', () => {
		// transform to [key, value]
		expect(
			flatten({
				input: sample,
				deeper: () => true,
				transform: () => ['key', 'value'],
			})
		).to.deep.equal(
			'_'
				.repeat(75)
				.split('')
				.map(() => ['key', 'value'])
		);

		// Transform to custom value
		expect(
			flatten({
				input: sample,
				deeper: () => true,
				transform: () => 'value',
			})
		).to.deep.equal(
			'_'
				.repeat(75)
				.split('')
				.map(() => 'value')
		);
	});
});
