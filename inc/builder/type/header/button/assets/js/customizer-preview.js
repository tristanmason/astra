/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra
 * @since 3.0.0
 */

( function( $ ) {

	astra_builder_button_css( 'header', AstraBuilderButtonData.header_button_count );

	for( var index = 1; index <= AstraBuilderButtonData.header_button_count ; index++ ) {
		( function( index ) {

			var section = 'section-hb-button-' + index;
			var selector = '.ast-header-button-' + index + '[data-section="section-hb-button-' + index + '"]';
			// Advanced Visibility CSS Generation.
			astra_builder_visibility_css( section, selector );

		})( index );
	}

} )( jQuery );
		