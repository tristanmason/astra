// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// $(npm bin)/cypress open
// $(npm bin)/cypress run
// $(npm bin)/cypress run --record --key 7a5c1c56-739b-4c13-b00b-d889bdef9071

/**
 * @type {Cypress.PluginConfig}
 */
 module.exports = (on) => {
	//	addMatchImageSnapshotPlugin(on, config);

	on('before:browser:launch', (browser, launchOptions) => {
		if (browser.name === 'chrome' && browser.isHeadless) {
			launchOptions.args.push('--window-size=1366,768');
			launchOptions.args.push('--force-device-scale-factor=1');
			return launchOptions;
		}
	});
};
const percyHealthCheck = require('@percy/cypress/task');

module.exports = (on) => {
	on('task', percyHealthCheck);
};
