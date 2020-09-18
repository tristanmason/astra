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

	var section = 'section-below-footer-builder';
	var selector = '.site-below-footer-wrap[data-section="section-below-footer-builder"]';

	// Footer Vertical Alignment.
    astra_css(
        'astra-settings[hbb-footer-vertical-alignment]',
        'align-items',
        selector + ' .ast-builder-grid-row'
    );


	// Header Height.
	astra_css(
		'astra-settings[hbb-footer-height]',
		'min-height',
		selector,
		'px'
	);

	// Header Line Height.
	astra_css(
		'astra-settings[hbb-footer-height]',
		'line-height',
		selector,
		'px'
	);

	// Primary Header - Layout.
	wp.customize( 'astra-settings[hbb-footer-layout-width]', function( setting ) {
		setting.bind( function( layout ) {

			var dynamicStyle = '';

			if ( 'content' == layout ) {
				dynamicStyle = selector + ' .ast-site-footer .site-container {';
				dynamicStyle += 'max-width: ' + AstraBuilderPrimaryFooterData.footer_content_width + 'px;';
				dynamicStyle += 'margin-left: auto;';
				dynamicStyle += 'margin-right: auto;';
				dynamicStyle += '} ';
			}

			if ( 'full' == layout ) {
				dynamicStyle = selector + ' .ast-site-footer .site-container {';
					dynamicStyle += 'max-width: 100%';
					dynamicStyle += 'padding-right: 35px; padding-left: 35px;';
				dynamicStyle += '} ';
			}

			astra_add_dynamic_css( 'hbb-footer-layout-width', dynamicStyle );

		} );
	} );


	// Responsive BG styles > Below Footer Row.
	astra_apply_responsive_background_css( 'astra-settings[hbb-footer-bg-obj-responsive]', selector, 'desktop' );
	astra_apply_responsive_background_css( 'astra-settings[hbb-footer-bg-obj-responsive]', selector, 'tablet' );
	astra_apply_responsive_background_css( 'astra-settings[hbb-footer-bg-obj-responsive]', selector, 'mobile' );

	// Advanced CSS Generation.
	astra_builder_advanced_css( section, selector );

} )( jQuery );
