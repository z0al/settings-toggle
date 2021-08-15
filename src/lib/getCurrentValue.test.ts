// Ours
import { getCurrentValue } from './getCurrentValue';

describe('getCurrentValue', () => {
	it('gets the target value when available', () => {
		const values = {
			globalValue: 'globalValue',
			defaultValue: 'defaultValue',
			workspaceValue: 'workspaceValue',
		};

		expect(getCurrentValue({ target: 'global', ...values })).toEqual(
			'globalValue'
		);

		expect(getCurrentValue({ target: 'workspace', ...values })).toEqual(
			'workspaceValue'
		);
	});

	it('falls back to default value when necessary', () => {
		const values = {
			defaultValue: 'defaultValue',
		};

		expect(getCurrentValue({ target: 'global', ...values })).toEqual(
			'defaultValue'
		);

		expect(getCurrentValue({ target: 'workspace', ...values })).toEqual(
			'defaultValue'
		);
	});

	it('falls back to workspace value when the default is undefined', () => {
		const values = {
			workspaceValue: 'workspaceValue',
		};

		expect(getCurrentValue({ target: 'global', ...values })).toEqual(
			'workspaceValue'
		);

		expect(getCurrentValue({ target: 'workspace', ...values })).toEqual(
			'workspaceValue'
		);
	});
});
