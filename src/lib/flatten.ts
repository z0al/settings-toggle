// Packages
import { flatten as flat } from 'flat';

export function flatten(json: Record<string, any>) {
	// Convert to plain object
	json = JSON.parse(JSON.stringify(json));

	return flat(json, { safe: true }) as Record<string, any>;
}
