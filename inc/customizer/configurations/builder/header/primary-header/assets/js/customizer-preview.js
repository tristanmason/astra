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
		'astra-settings[hb-header-height]',
		'min-height',
		'.ast-primary-header-bar, .ast-mobile-header-wrap .ast-builder-grid-row-container-inner',
		'px'
	);

	// Header Line Height.
	astra_css(
		'astra-settings[hb-header-height]',
		'line-height',
		'.ast-primary-header-bar, .ast-mobile-header-wrap .ast-builder-grid-row-container-inner',
		'px'
	);

	// Primary Header - Layout > Content Width.
	wp.customize( 'astra-settings[hb-header-main-layout-width]', function( setting ) {
		setting.bind( function( layout ) {

			var dynamicStyle = '';

			if ( 'content' !== layout ) {
				dynamicStyle += '#masthead .ast-container {';
				dynamicStyle += 'max-width: unset;';
				dynamicStyle += 'padding-left: 35px;';
				dynamicStyle += 'padding-right: 35px;';
				dynamicStyle += '} ';

			} else {
				dynamicStyle = '#masthead .ast-container {';
				dynamicStyle += 'max-width: 100%';
				dynamicStyle += 'padding-left: 20px;';
				dynamicStyle += 'padding-right: 20px;';
				dynamicStyle += '} ';
			}

			dynamicStyle +=  '@media (max-width: ' + AstraBuilderPrimaryHeaderData.header_break_point + 'px) {';
			dynamicStyle += '#masthead .ast-mobile-header-wrap .ast-above-header-bar, #masthead .ast-mobile-header-wrap .ast-primary-header-bar, #masthead .ast-mobile-header-wrap .ast-below-header-bar {';
			dynamicStyle += 'padding-left: 20px;';
			dynamicStyle += 'padding-right: 20px;';
			dynamicStyle += '} ';
			dynamicStyle += '} ';

			astra_add_dynamic_css( 'hb-header-main-layout-width', dynamicStyle );
		} );
	} );

	// Border Bottom width.
	astra_css(
		'astra-settings[hb-header-main-sep]',
		'border-bottom-width',
		'.ast-header-break-point .ast-primary-header-bar, .ast-primary-header-bar',
		'px'
	);

	// Border Color.

	astra_css(
		'astra-settings[hb-header-main-sep-color]',
		'border-color',
		'.ast-primary-header-bar',
	);
	
	astra_css(
		'astra-settings[hb-header-main-sep-color]',
		'border-color',
		'.ast-header-break-point .ast-primary-header-bar, .ast-primary-header-bar',
	);

	

	var dynamicStyle = '.ast-primary-header-bar {';
		dynamicStyle += 'border-bottom-style: solid';
	dynamicStyle += '} ';

	astra_add_dynamic_css( 'hb-header-main-sep-color', dynamicStyle );

	// Responsive BG styles > Primary Header Row.
	astra_apply_responsive_background_css( 'astra-settings[hb-header-bg-obj-responsive]', '.ast-primary-header-bar.main-header-bar', 'desktop' );
	astra_apply_responsive_background_css( 'astra-settings[hb-header-bg-obj-responsive]', '.ast-primary-header-bar.ast-primary-header.main-header-bar', 'tablet' );
	astra_apply_responsive_background_css( 'astra-settings[hb-header-bg-obj-responsive]', '.ast-primary-header-bar.ast-primary-header.main-header-bar', 'mobile' );

	// Advanced CSS Generation.
	astra_builder_advanced_css( 'section-primary-header-builder', '.ast-desktop .ast-primary-header-bar, .ast-header-break-point .ast-primary-header-bar' );

	// Advanced CSS for Header Builder.
	astra_builder_advanced_css( 'section-header-builder-layout', '.astra-hfb-header .site-header' );

} )( jQuery );
