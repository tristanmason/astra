// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@percy/cypress';

const scrollToBottom = require('scroll-to-bottomjs');

/**
 * Capture and compare the fullpage snapshots.
 *
 */
 Cypress.Commands.add('captureDocument', (generalMaskAndClip = true, screenShotName = false) => {
	if (generalMaskAndClip) {
		const maskElement =
			'.elementor-element-31b9e15, .pikaday__display--pikaday, .elementor-widget-video, label[for="vscf_captcha"],.elementor-widget-google_maps,.pikaday__display,.elementor-video-iframe';
		const clipElement =
			'.widget_top_rated_products, .wpcf7-quiz-label, .eaw-typed-text,.product .related.products,.captcha_img,.elementor-element-38f7ff1e,.elementor-widget-container[style*="will-change"], .particles-js-canvas-el,.product_list_widget li + li, .exclusive.products';
		cy.maskAndClip(maskElement, clipElement);
	}
	cy.window().then((cyWindow) =>
		scrollToBottom({
			remoteWindow: cyWindow,
		}),
	);
	cy.wait(5000);
	cy.percySnapshot(screenShotName);
});

/**
 * Capture and compare the fullpage snapshots.
 *
 * @param {string} path The path to store the snapshot.
 */
 Cypress.Commands.add('maskAndClip', (maskSelectors, clipSelectors, hideElements) => {
	cy.get('body').then(($body) => {
		// synchronously query from body
		// to find which element was created
		if ($body.find(maskSelectors).length) {
			cy.get(maskSelectors).invoke(
				'css',
				'background',
				'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWBAMAAACWdajhAAAAG1BMVEUAAAD///+fn59fX18fHx/f398/Pz9/f3+/v78mHjoVAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC00lEQVR4nO2WTW/TQBCGN7Hj9Nip68THWmo5x1Ir5ei0CnDstoA4OghEjg0Czlil8LeZmV3HCUlQIa64vI9UrT3exs+OZz+MAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHkeHHJvxP98bOnxCK2j9FRuv2xGH1tbX7Yj/L60sNiagE2Pe2eSzi8ub9fn49am2lzZ5Jn2Dh5ui1goe6O1I+nWTExOe0U0p0bFN7lvRmiaF/vW5/pNyTeuAQzmJNXPHfSui2GtFlmOp9Mt4TDnfDDn6QXp+20tLOdRMScYWSfmCXq1pZWlxKXM1T0ZRxW/t0vcw81rT5DzM2bVDcVQGdGvmfBPa2+JK/fbWYicxC1nJZMNVrYiuJUHuUY8KM0skg05rMZAsXnO/E2MmnG1jjznjpQyiFa1p4r7hnfz8qlafuHZy34r6QsvQaVluQr7uiIk8MPkRu3M72TGZHqlVX3HlxJKFYhn3Whqa+DbkzFTHTmWJavFDeSBj+u2X99IyUrNuoOtaGtLWJ1Yy1CwQ4ccz1eJL2+wYzz/ZlrQmMuDOplbHay2/N61qXbiYdlpuZIHdtqH9m5Zma4tWb6nlO65ma0r08/1Sy6uGltKvrdZWTwupKXmtqVLbnrRCNWhqixcPX/LiO3AdeAVpreTdTOzqtDtyWlzBM3KTk2diV9qIV8nFcGUmHkvMa2WyVM1SN7ZZO1pu3XKL1EDjNm7WKyvtQGbqSJenntcS9YNaayL5rGI/LffT8mVar/JZWr7kS3kNL/i6unM715bOo4o3mj69iSqvVaXllWU31epTXMw5nQf0I+SpULSgVe+J3XqP03Im+RQSWpDR7VJ3uox3vqbkKbaxz/rC/XMoE/FCymFvrZUTRDryH/dL4k4OY3tfnyD0XBA8pCOvJWeGIk+9Ft/JcUI6ngZ77dUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6KX6rsak4Q9c5cAAAAAElFTkSuQmCC) #000 no-repeat center center',
			);
			cy.get(maskSelectors).invoke('css', 'color', 'transparent');
			if ($body.find(maskSelectors).find('*').length > 0) {
				cy.get(maskSelectors).children().invoke('css', 'visibility', 'hidden');
			}
		}
		if ($body.find(clipSelectors).length) {
			cy.get(clipSelectors).invoke('css', 'display', 'none');
		}
		if (hideElements && hideElements.length > 0 && $body.find(hideElements).length) {
			cy.get(hideElements).invoke('css', 'visibility', 'hidden');
		}
	});
});
