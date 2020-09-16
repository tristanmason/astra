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
	// Close Icon Color.
	astra_css(
		'astra-settings[off-canvas-close-color]',
		'color',
		'.ast-mobile-popup-drawer.active .ast-mobile-popup-inner',
	);

	// Off-Canvas Background Color.
	wp.customize( 'astra-settings[off-canvas-background]', function( value ) {
		value.bind( function( bg_obj ) {
			var dynamicStyle = ' .ast-mobile-popup-drawer.active .ast-mobile-popup-inner, .ast-mobile-popup-drawer.active .main-navigation .main-header-menu { {{css}} }';
			astra_background_obj_css( wp.customize, bg_obj, 'off-canvas-background', dynamicStyle );
		} );
	} );

	wp.customize( 'astra-settings[mobile-header-type]', function ( value ) {
        value.bind( function ( newval ) {
            
			jQuery('.ast-mobile-header-wrap ').attr( "data-type", newval ).trigger( 'ahfb-mobile-header-type-change' );
        } );
	} );

	wp.customize( 'astra-settings[off-canvas-layout]', function ( value ) {
        value.bind( function ( newval ) {
			
			var off_canvas_slide = ( typeof ( wp.customize._value['astra-settings[off-canvas-slide]'] ) != 'undefined' ) ? wp.customize._value['astra-settings[off-canvas-slide]']._value : 'right';

			var side_class = '';

			if ( 'side-panel' === newval ) {

				if ( 'left' === off_canvas_slide ) {

					side_class = 'ast-mobile-popup-left';
				} else {

					side_class = 'ast-mobile-popup-right';
				}
			} else {

				side_class = 'ast-mobile-popup-full-width';
			}

			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-left' );
			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-right' );
			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-full-width' );
			jQuery('.ast-mobile-popup-drawer').addClass( side_class );
        } );
	} );

	wp.customize( 'astra-settings[off-canvas-slide]', function ( value ) {
        value.bind( function ( newval ) {
			
			var side_class = '';

			if ( 'left' === newval ) {

				side_class = 'ast-mobile-popup-left';
			} else {

				side_class = 'ast-mobile-popup-right';
			}

			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-left' );
			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-right' );
			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-full-width' );
			jQuery('.ast-mobile-popup-drawer').addClass( side_class );
        } );
	} );
} )( jQuery );