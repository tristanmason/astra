/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra Builder
 * @since x.x.x
 */

( function( $ ) {

    let selector = '.ast-footer-copyright .ast-footer-html-inner';

    // HTML color.
    astra_css(
        'astra-settings[footer-copyright-color]',
        'color',
        selector
    );

    wp.customize( 'astra-settings[footer-copyright-alignment]', function( value ) {
        value.bind( function( alignment ) {
            if( alignment.desktop != '' || alignment.tablet != '' || alignment.mobile != '' ) {
                var dynamicStyle = '';
                dynamicStyle += '.ast-footer-copyright {';
                dynamicStyle += 'text-align: ' + alignment['desktop'] + ';';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: 768px) {';
                dynamicStyle += '.ast-footer-copyright {';
                dynamicStyle += 'text-align: ' + alignment['tablet'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: 544px) {';
                dynamicStyle += '.ast-footer-copyright {';
                dynamicStyle += 'text-align: ' + alignment['mobile'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                astra_add_dynamic_css( 'footer-copyright-alignment', dynamicStyle );
            }
        } );
    } );

    // Advanced CSS Generation.
    astra_builder_advanced_css( 'section-footer-copyright', selector );

    // Typography CSS Generation.
    astra_builder_typography_css( 'section-footer-copyright', selector );
    
} )( jQuery );
		