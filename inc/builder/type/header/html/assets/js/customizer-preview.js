/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra Builder
 * @since 3.0.0
 */

( function( $ ) {

    astra_builder_html_css( 'header', AstraBuilderHTMLData.header_html_count );

    for( var index = 1; index <= AstraBuilderHTMLData.header_html_count ; index++ ) {
		( function( index ) {

            let selector = '.ast-header-html-' + index + '[data-section="section-hb-html-' + index + '"]';

            let section = 'section-hb-html-' + index;
        
			// Advanced Visibility CSS Generation.
			astra_builder_visibility_css( section, selector );

		})( index );
	}
    
} )( jQuery );
		