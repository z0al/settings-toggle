// Packages
import { capitalCase } from 'capital-case';

// Known terms that need special casing e.g. Programming
// languages names
const Terms = new Map([
	['atd', 'ATD'],
	['bat', 'Batch'],
	['c', 'C'],
	['coffeescript', 'CoffeeScript'],
	['cpp', 'C++'],
	['cram', 'Cram Test'],
	['csharp', 'C#'],
	['css', 'CSS'],
	['dockercompose', 'Compose'],
	['dockerfile', 'Docker'],
	['editorconfig', 'EditorConfig'],
	['fsharp', 'F#'],
	['git-commit', 'Git Commit Message'],
	['git-rebase', 'Git Rebase Message'],
	['graphql', 'GraphQL'],
	['hlsl', 'HLSL'],
	['html', 'HTML'],
	['jade', 'Pug'],
	['javascript', 'JavaScript'],
	['javascriptreact', 'JavaScript React'],
	['json', 'JSON'],
	['jsonc', 'JSON with Comments'],
	['jsx', 'JSX'],
	['juliamarkdown', 'Julia Markdown'],
	['objective-c', 'Objective-C'],
	['objective-cpp', 'Objective-C++'],
	['ocaml.interface', 'OCaml Interface'],
	['ocaml.menhir', 'Menhir'],
	['ocaml.merlin', 'Merlin'],
	['ocaml.META', 'META'],
	['ocaml.oasis', 'OASIS'],
	['ocaml.ocamlbuild', 'OCamlbuild'],
	['ocaml.ocamldoc', 'OCamldoc'],
	['ocaml.ocamlformat', 'OCamlFormat'],
	['ocaml.ocamllex', 'OCamllex'],
	['ocaml.opam-install', 'opam install'],
	['ocaml.opam', 'opam'],
	['ocaml', 'OCaml'],
	['perl6', 'Perl 6'],
	['php', 'PHP'],
	['plaintext', 'Plain Text'],
	['powershell', 'PowerShell'],
	['scss', 'SCSS'],
	['shaderlab', 'ShaderLab'],
	['shellscript', 'Shell Script'],
	['sql', 'SQL'],
	['toml', 'TOML'],
	['typescript', 'TypeScript'],
	['typescriptreact', 'TypeScript React'],
	['vb', 'Visual Basic'],
	['xml', 'XML'],
	['xsl', 'XSL'],
	['yaml', 'YAML'],
]);

/**
 * Converts a config key into a human readable path. Inspired by
 * VS Code's Settings UI view.
 */
export function getLabel(key: string) {
	const pathSeparator = ' › ';
	const itemSeparator = ': ';

	const segments = key.split('.').map((k) => {
		return Terms.get(k) || capitalCase(k);
	});

	// E.g. Files: Auto Save
	if (segments.length < 3) {
		return segments.join(pathSeparator);
	}

	// E.g Editor > Hover: Enabled
	const path = segments.slice(0, -2).join(pathSeparator);
	const item = segments.slice(-2).join(itemSeparator);
	return [path, item].join(pathSeparator);
}
