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

	astra_builder_widget_css( 'header' );

	for( var index = 1; index <= AstraBuilderWidgetData.num_of_header_widgets ; index++ ) {
		( function( index ) {

			var section = 'sidebar-widgets-header-widget-' + index;
			var selector = '.header-widget-area[data-section="sidebar-widgets-header-widget-' + index + '"]';
			// Advanced Visibility CSS Generation.
			astra_builder_visibility_css( section, selector );

		})( index );
	}

} )( jQuery );
