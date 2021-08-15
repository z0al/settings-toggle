// Ours
import { getLabel } from './getLabel';

describe('getLabel', () => {
	const examples = [
		{
			key: 'editor',
			title: 'Editor',
		},
		{
			key: 'editor.fontFamily',
			title: 'Editor › Font Family',
		},
		{
			key: 'editor.trimAutoWhitespace',
			title: 'Editor › Trim Auto Whitespace',
		},
		{
			key: 'editor.semanticHighlighting.enabled',
			title: 'Editor › Semantic Highlighting: Enabled',
		},
		{
			key: 'terminal.integrated.automationShell.windows',
			title: 'Terminal › Integrated › Automation Shell: Windows',
		},

		// Programming languages configs
		{
			key: 'css.lint.validProperties',
			title: 'CSS › Lint: Valid Properties',
		},
		{
			key: 'json.format.enable',
			title: 'JSON › Format: Enable',
		},
		{
			key: 'debug.javascript.codelens.npmScripts',
			title: 'Debug › JavaScript › Codelens: Npm Scripts',
		},
	];

	examples.forEach((ex) => {
		it(`Turns "${ex.key}" into "${ex.title}"`, () => {
			expect(getLabel(ex.key)).toEqual(ex.title);
		});
	});
});
