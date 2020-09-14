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

	var selector = '.ast-header-search';

	// Icon Color.
	astra_css(
		'astra-settings[header-search-icon-color]',
		'color',
		selector + ' .astra-search-icon'
	);

	// Icon Size.
	astra_css(
		'astra-settings[header-search-icon-space]',
		'font-size',
		selector + ' .astra-search-icon',
		'px'
	);

	// Icon Size.
	wp.customize( 'astra-settings[header-search-icon-space]', function( value ) {
		value.bind( function( size ) {
			if(
				size.desktop != '' || size.desktop != '' || size.desktop != '' || size.desktop != '' ||
				size.tablet != '' || size.tablet != '' || size.tablet != '' || size.tablet != '' ||
				size.mobile != '' || size.mobile != '' || size.mobile != '' || size.mobile != ''
			) {
				var dynamicStyle = '';
				dynamicStyle += selector + ' .astra-search-icon {';
				dynamicStyle += 'font-size: ' + size.desktop + 'px' + ';';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: 768px) {';
				dynamicStyle += selector + ' .astra-search-icon {';
				dynamicStyle += 'font-size: ' + size.tablet + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: 544px) {';
				dynamicStyle += selector + ' .astra-search-icon {';
				dynamicStyle += 'font-size: ' + size.mobile + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';
				astra_add_dynamic_css( 'header-search-icon-space', dynamicStyle );
			}
		} );
	} );

	// Advanced CSS Generation.
	astra_builder_advanced_css( 'section-hb-search', '.astra-hfb-header .site-header-section > .ast-header-search' );

} )( jQuery );
