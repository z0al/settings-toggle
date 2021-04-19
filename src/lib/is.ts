export function isAlphanumeric(str: string) {
	return /^([0-9]|[a-z])+([0-9a-z]+)$/i.test(str);
}

export function isDefined(v: unknown) {
	return v !== undefined;
}

export function isObject(v: any) {
	return v && typeof v === 'object' && !Array.isArray(v);
}

export function isEmptyObject(v: any) {
	return isObject(v) && Object.keys(v).length === 0;
}
