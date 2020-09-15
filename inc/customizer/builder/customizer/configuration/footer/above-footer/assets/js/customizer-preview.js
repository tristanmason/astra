/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra
 * @since x.x.x
 */

( function( $ ) {

	var section = 'section-above-footer-builder';
	var selector = '.site-above-footer-wrap[data-section="section-above-footer-builder"]';

	// Footer Height.
	astra_css(
		'astra-settings[hba-footer-height]',
		'min-height',
		selector,
		'px'
	);

	// Footer Line Height.
	astra_css(
		'astra-settings[hba-footer-height]',
		'line-height',
		selector,
		'px'
	);

	// Border Bottom width.
	astra_css(
		'astra-settings[hba-footer-separator]',
		'border-bottom-width',
		selector,
		'px'
	);

	// Border Color.

	astra_css(
		'astra-settings[hba-footer-bottom-border-color]',
		'border-bottom-color',
		selector
	);

	var dynamicStyle = selector + ' {';
		dynamicStyle += 'border-bottom-style: solid';
	dynamicStyle += '} ';

	astra_add_dynamic_css( 'hba-footer-bottom-border-color', dynamicStyle );

	// Responsive BG styles > Above Footer Row.
	astra_apply_responsive_background_css( 'astra-settings[hba-footer-bg-obj-responsive]', selector, 'desktop' );
	astra_apply_responsive_background_css( 'astra-settings[hba-footer-bg-obj-responsive]', selector, 'tablet' );
	astra_apply_responsive_background_css( 'astra-settings[hba-footer-bg-obj-responsive]', selector, 'mobile' );

	// Advanced CSS Generation.
	astra_builder_advanced_css( section, selector );

} )( jQuery );
