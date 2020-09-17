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

    var tablet_break_point    = AstraBuilderWIDGETData.tablet_break_point || 768,
        mobile_break_point    = AstraBuilderWIDGETData.mobile_break_point || 544;

    wp.customize( 'astra-settings[footer-widget-alignment-1]', function( value ) {
        value.bind( function( alignment ) {
            if( alignment.desktop != '' || alignment.tablet != '' || alignment.mobile != '' ) {
                var dynamicStyle = '';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-1"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['desktop'] + ';';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-1"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['tablet'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-1"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['mobile'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                astra_add_dynamic_css( 'footer-widget-alignment-1', dynamicStyle );
            }
        } );
    } );

    wp.customize( 'astra-settings[footer-widget-alignment-2]', function( value ) {
        value.bind( function( alignment ) {
            if( alignment.desktop != '' || alignment.tablet != '' || alignment.mobile != '' ) {
                var dynamicStyle = '';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['desktop'] + ';';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['tablet'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['mobile'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                astra_add_dynamic_css( 'footer-widget-alignment-2', dynamicStyle );
            }
        } );
    } );
    
    wp.customize( 'astra-settings[footer-widget-alignment-3]', function( value ) {
        value.bind( function( alignment ) {
            if( alignment.desktop != '' || alignment.tablet != '' || alignment.mobile != '' ) {
                var dynamicStyle = '';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['desktop'] + ';';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['tablet'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['mobile'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                astra_add_dynamic_css( 'footer-widget-alignment-3', dynamicStyle );
            }
        } );
    } );

    wp.customize( 'astra-settings[footer-widget-alignment-4]', function( value ) {
        value.bind( function( alignment ) {
            if( alignment.desktop != '' || alignment.tablet != '' || alignment.mobile != '' ) {
                var dynamicStyle = '';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['desktop'] + ';';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['tablet'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                dynamicStyle += '.footer-widget-area[data-section="sidebar-widgets-footer-widget-2"] .footer-widget-area-inner {';
                dynamicStyle += 'text-align: ' + alignment['mobile'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                astra_add_dynamic_css( 'footer-widget-alignment-4', dynamicStyle );
            }
        } );
    } );

    for ( var index = 1; index <= AstraBuilderWIDGETData.footer_widget_count; index++ ) {

        var selector = '.footer-widget-area[data-section="sidebar-widgets-footer-widget-' + index + '"]';

        // Widget Content Color.
        astra_css(
            'astra-settings[footer-widget-' + index + '-color]',
            'color',
            selector + ' .footer-widget-area-inner'
        );

        // Widget Title Color.
        astra_css(
            'astra-settings[footer-widget-' + index + '-link-color]',
            'color',
            selector + ' .footer-widget-area-inner a'
        );

        // Widget Link Color.
        astra_css(
            'astra-settings[footer-widget-' + index + '-title-color]',
            'color',
            selector + ' .widget-title'
        );
    }

} )( jQuery );
