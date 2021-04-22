// Ours
import { ConfigurationSchema } from '../types';

export const configurationsSchema = new Map<
	string,
	ConfigurationSchema
>();

// Inspect the JSON schema of the configurations to get the types and
// enum values.
//
// Credit: https://github.com/sandy081/settings-picker
export function buildInternalSchema(text: string) {
	const schemaJson = JSON.parse(text);

	const parse = ({ properties, allOf }: any) => {
		if (properties) {
			for (const key in properties) {
				const { type, enumDescriptions, ...props } = properties[key];

				configurationsSchema.set(key, {
					type,
					enum: props.enum,
					enumDescriptions,
				});
			}
		}

		allOf?.forEach(parse);
	};

	parse(schemaJson);
}
