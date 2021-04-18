export function isAlphanumeric(str: string) {
	return /^([0-9]|[a-z])+([0-9a-z]+)$/i.test(str);
}

export function isDefined(v: unknown) {
	return v !== undefined;
}
