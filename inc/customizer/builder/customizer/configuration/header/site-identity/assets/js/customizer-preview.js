/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra HF Builder.
 * @since x.x.x
 */

( function( $ ) {

	var selector = '.ast-builder-layout-element .ast-site-identity';

	// Advanced CSS Generation.
	astra_builder_advanced_margin_css( 'title_tagline', selector );

} )( jQuery );
