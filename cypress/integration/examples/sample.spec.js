describe('Visual Regression Testing - http://stat.wpastra.com/', () => {
	const url = 'http://stat.wpastra.com/';
	it('Should not add any visual change', function () {
		cy.visit(url);
		cy.captureDocument();
	});
});
describe('Starter Sites VR - https://websitedemos.net/outdoor-adventure-08/', () => {
	const pages = [];
	it('Check frontpage', () => {
		const frontpage = 'https://websitedemos.net/outdoor-adventure-08/';
		cy.visit(frontpage);
		cy.captureDocument();
		cy.get('#site-navigation').then(($headerMenu) => {
			[...$headerMenu.find('.menu-item a')].forEach(($url) => {
				const url = $url.href;
				if (url.includes('#')) {
					return;
				}
				if (frontpage.replace(/\/*$/, '') === url.replace(/\/*$/, '')) {
					return;
				}

				pages.push($url.href);
			});
		});
	});
	it('Check additional pages', () => {
		pages.forEach((page) => {
			cy.visit(page);
			cy.captureDocument(true, 'Check additional link - ' + page);
		});
	});
});
