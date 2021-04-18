// Packages
import { expect } from 'chai';

// Ours
import { getCurrentValue } from './getCurrentValue';

describe('getCurrentValue', () => {
	it('gets the target value when available', () => {
		const values = {
			globalValue: 'globalValue',
			defaultValue: 'defaultValue',
			workspaceValue: 'workspaceValue',
		};

		expect(getCurrentValue({ target: 'global', ...values })).to.equal(
			'"globalValue"'
		);

		expect(
			getCurrentValue({ target: 'workspace', ...values })
		).to.equal('"workspaceValue"');
	});

	it('falls back to default value when necessary', () => {
		const values = {
			defaultValue: 'defaultValue',
		};

		expect(getCurrentValue({ target: 'global', ...values })).to.equal(
			'"defaultValue"'
		);

		expect(
			getCurrentValue({ target: 'workspace', ...values })
		).to.equal('"defaultValue"');
	});

	it('falls back to workspace value when the default is undefined', () => {
		const values = {
			workspaceValue: 'workspaceValue',
		};

		expect(getCurrentValue({ target: 'global', ...values })).to.equal(
			'"workspaceValue"'
		);

		expect(
			getCurrentValue({ target: 'workspace', ...values })
		).to.equal('"workspaceValue"');
	});
});
