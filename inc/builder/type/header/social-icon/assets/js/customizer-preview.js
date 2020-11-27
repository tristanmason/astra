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

	astra_builder_social_css( 'header', astraBuilderHeaderSocial.header_social_count );

	for( var index = 1; index <= astraBuilderHeaderSocial.header_social_count ; index++ ) {
		( function( index ) {

			var selector = '.ast-builder-layout-element[data-section="section-hb-social-icons-' + index + '"]';
			var section = 'section-hb-social-icons-' + index;
		
			// Advanced Visibility CSS Generation.
			astra_builder_visibility_css( section, selector );

		})( index );
	}
	
} )( jQuery );
