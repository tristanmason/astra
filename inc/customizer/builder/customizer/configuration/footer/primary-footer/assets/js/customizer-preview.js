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

	var section = 'section-primary-footer-builder';
	var selector = '.site-primary-footer-wrap[data-section="section-primary-footer-builder"]';

	// Primary Header - Layout.
	wp.customize( 'astra-settings[hb-footer-main-layout-width]', function( setting ) {
		setting.bind( function( layout ) {

			var dynamicStyle = '';

			if ( 'content' == layout ) {
				dynamicStyle = '.ast-site-footer .site-container {';
				dynamicStyle += 'max-width: ' + AstraBuilderPrimaryFooterData.footer_content_width + 'px;';
				dynamicStyle += 'margin-left: auto;';
				dynamicStyle += 'margin-right: auto;';
				dynamicStyle += '} ';
			}

			if ( 'full' == layout ) {
				dynamicStyle = '.ast-site-footer .site-container {';
					dynamicStyle += 'max-width: 100%';
				dynamicStyle += '} ';
			}

			astra_add_dynamic_css( 'hb-footer-main-layout-width', dynamicStyle );

		} );
	} );

	// Border Bottom width.
	astra_css(
		'astra-settings[hb-footer-main-sep]',
		'border-bottom-width',
		selector,
		'px'
	);

	// Widget Content Color.
    astra_css(
        'astra-settings[hb-footer-widget-color]',
        'color',
        selector + ' .footer-widget-area-inner'
    );

    // Widget Title Color.
    astra_css(
        'astra-settings[hb-footer-widget-title-color]',
        'color',
        selector + ' .widget-title'
    );

	// Border Color.
	astra_css(
		'astra-settings[hb-footer-main-sep-color]',
		'border-color',
		selector,
	);

	var dynamicStyle = selector + ' {';
		dynamicStyle += 'border-bottom-style: solid';
	dynamicStyle += '} ';

	astra_add_dynamic_css( 'hb-footer-main-sep-color', dynamicStyle );

	// Responsive BG styles > Primary Footer Row.
	astra_apply_responsive_background_css( 'astra-settings[hb-footer-bg-obj-responsive]', selector, 'desktop' );
	astra_apply_responsive_background_css( 'astra-settings[hb-footer-bg-obj-responsive]', selector, 'tablet' );
	astra_apply_responsive_background_css( 'astra-settings[hb-footer-bg-obj-responsive]', selector, 'mobile' );

	// Advanced CSS Generation.
	astra_builder_advanced_css( section, selector );

	// Advanced CSS for Header Builder.
	astra_builder_advanced_css( 'section-footer-builder-layout', '.astra-hfb-header .ast-main-footer-wrap' );

} )( jQuery );
