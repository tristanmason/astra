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

	// Header Height.
	astra_css(
		'astra-settings[hba-header-height]',
		'min-height',
		'.ast-above-header-bar',
		'px'
	);

	// Header Line Height.
	astra_css(
		'astra-settings[hba-header-height]',
		'line-height',
		'.ast-above-header-bar',
		'px'
	);

	// Border Bottom width.
	astra_css(
		'astra-settings[hba-header-separator]',
		'border-bottom-width',
		'.ast-above-header.ast-above-header-bar, .ast-above-header-bar',
		'px'
	);

	// Border Color.
	astra_css(
		'astra-settings[hba-header-bottom-border-color]',
		'border-color',
		'.ast-above-header.ast-above-header-bar, .ast-above-header-bar',
	);

	astra_css(
		'astra-settings[hba-header-bottom-border-color]',
		'border-color',
		'.ast-above-header-bar',
	);

	var dynamicStyle = '.ast-above-header-bar {';
		dynamicStyle += 'border-bottom-style: solid';
	dynamicStyle += '} ';

	astra_add_dynamic_css( 'hba-header-bottom-border-color', dynamicStyle );

	// Responsive BG styles > Below Header Row.
	astra_apply_responsive_background_css( 'astra-settings[hba-header-bg-obj-responsive]', '.ast-above-header.ast-above-header-bar', 'desktop' );
	astra_apply_responsive_background_css( 'astra-settings[hba-header-bg-obj-responsive]', '.ast-above-header.ast-above-header-bar', 'tablet' );
	astra_apply_responsive_background_css( 'astra-settings[hba-header-bg-obj-responsive]', '.ast-above-header.ast-above-header-bar', 'mobile' );

	// Advanced CSS Generation.
	astra_builder_advanced_css( 'section-above-header-builder', '.ast-above-header.ast-above-header-bar' );

} )( jQuery );
