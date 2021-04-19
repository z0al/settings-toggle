// Ours
import { isObject, isEmptyObject } from './is';

export interface FlattenOptions<T> {
	input: Record<string, any>;

	/**
	 * Exclude certain keys from being flattened or
	 * included in the final list
	 */
	exclude?: (key: string, value: any) => boolean;

	/**
	 * Apply transformations to the final key/value
	 */
	transform?: (key: string, value: any) => T;

	/**
	 * Control how deep the flattening goes
	 */
	deeper?: (key: string, value: any) => boolean;
}

export function flatten<T>({
	input,
	exclude,
	transform,
	deeper,
}: FlattenOptions<T>): T[] {
	const output: any[] = [];

	const transformAndAdd = (key: string, value: any) => {
		output.push(transform ? transform(key, value) : [key, value]);
	};

	const step = (obj: any, parentPath: string) =>
		Object.keys(obj).forEach((name) => {
			const value = obj[name];
			const key = parentPath ? parentPath + '.' + name : name;

			if (exclude?.(key, value)) {
				return;
			}

			if (!isObject(value) || isEmptyObject(value)) {
				return transformAndAdd(key, value);
			}

			deeper?.(key, value)
				? step(value, key)
				: transformAndAdd(key, value);
		});

	step(input, '');

	return output;
}
