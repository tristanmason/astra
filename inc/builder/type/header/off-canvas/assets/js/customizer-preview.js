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
	// Close Icon Color.
	astra_css(
		'astra-settings[off-canvas-close-color]',
		'color',
		'.ast-mobile-popup-drawer.active .ast-mobile-popup-inner',
	);

	// Off-Canvas Background Color.
	wp.customize( 'astra-settings[off-canvas-background]', function( value ) {
		value.bind( function( bg_obj ) {
			var dynamicStyle = ' .ast-mobile-popup-drawer.active .ast-mobile-popup-inner, .ast-mobile-header-wrap .ast-mobile-header-content { {{css}} }';
			astra_background_obj_css( wp.customize, bg_obj, 'off-canvas-background', dynamicStyle );
		} );
	} );

	wp.customize( 'astra-settings[off-canvas-inner-spacing]', function ( value ) {
        value.bind( function ( spacing ) {
			var dynamicStyle = '';
			if( spacing != '' ) {
				dynamicStyle += '.ast-mobile-popup-content > *, .ast-mobile-header-content > * {';
				dynamicStyle += 'padding-top: ' + spacing + 'px;';
				dynamicStyle += 'padding-bottom: ' + spacing + 'px;';
				dynamicStyle += '} ';
			}
			astra_add_dynamic_css( 'off-canvas-inner-spacing', dynamicStyle );
        } );
	} );

	wp.customize( 'astra-settings[mobile-header-type]', function ( value ) {
        value.bind( function ( newVal ) {

			var mobile_header = document.querySelectorAll( "#ast-mobile-header" );
			var desktop_header = document.querySelectorAll( "#ast-desktop-header" );
			var header_type = newVal;
			var off_canvas_slide = ( typeof ( wp.customize._value['astra-settings[off-canvas-slide]'] ) != 'undefined' ) ? wp.customize._value['astra-settings[off-canvas-slide]']._value : 'right';

			var side_class = '';

			if ( 'off-canvas' === header_type ) {

				if ( 'left' === off_canvas_slide ) {

					side_class = 'ast-mobile-popup-left';
				} else {

					side_class = 'ast-mobile-popup-right';
				}
			} else if ( 'full-width' === header_type ) {

				side_class = 'ast-mobile-popup-full-width';
			}

			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-left' );
			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-right' );
			jQuery('.ast-mobile-popup-drawer').removeClass( 'ast-mobile-popup-full-width' );
			jQuery('.ast-mobile-popup-drawer').addClass( side_class );

			if( 'full-width' === header_type ) {

				header_type = 'off-canvas';
			}

			for ( var k = 0; k < mobile_header.length; k++ ) {
				mobile_header[k].setAttribute( 'data-type', header_type );
			}
			for ( var k = 0; k < desktop_header.length; k++ ) {
				desktop_header[k].setAttribute( 'data-type', header_type );
			}

			var event = new CustomEvent( "astMobileHeaderTypeChange",
				{
					"detail": { 'type' : header_type }
				}
			);

			document.dispatchEvent(event);
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

	var tablet_break_point    = astraBuilderPreview.tablet_break_point || 768,
		mobile_break_point    = astraBuilderPreview.mobile_break_point || 544;
		
	wp.customize( 'astra-settings[popup-width]', function ( value ) {
        value.bind( function ( newval ) {
			var dynamicStyle = '';
			if ( '' !== newval.desktop ) {
                dynamicStyle += '.ast-mobile-popup-drawer.active .ast-mobile-popup-inner {';
                dynamicStyle += 'max-width: ' + newval.desktop + '%;';
				dynamicStyle += '} ';
			}
			if ( '' !== newval.tablet ) {
				dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
				dynamicStyle += '.ast-mobile-popup-drawer.active .ast-mobile-popup-inner {';
				dynamicStyle += 'max-width: ' + newval.tablet + '%;';
				dynamicStyle += '} ';
				dynamicStyle += '} ';
			}
			if ( '' !== newval.mobile ) {
				dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
				dynamicStyle += '.ast-mobile-popup-drawer.active .ast-mobile-popup-inner {';
				dynamicStyle += 'max-width: ' + newval.mobile + '%;';
				dynamicStyle += '} ';
				dynamicStyle += '} ';
			}
			astra_add_dynamic_css( 'popup-width', dynamicStyle );
        } );
	} );

    // Padding.
    wp.customize( 'astra-settings[popup-padding]', function( value ) {
        value.bind( function( padding ) {
            if(
                padding.desktop.bottom != '' || padding.desktop.top != '' || padding.desktop.left != '' || padding.desktop.right != '' ||
                padding.tablet.bottom != '' || padding.tablet.top != '' || padding.tablet.left != '' || padding.tablet.right != '' ||
                padding.mobile.bottom != '' || padding.mobile.top != '' || padding.mobile.left != '' || padding.mobile.right != ''
            ) {
                var dynamicStyle = '';
                dynamicStyle += '.ast-mobile-popup-drawer.active .ast-desktop-popup-content, .ast-mobile-popup-drawer.active .ast-mobile-popup-content {';
                dynamicStyle += 'padding-left: ' + padding['desktop']['left'] + padding['desktop-unit'] + ';';
                dynamicStyle += 'padding-right: ' + padding['desktop']['right'] + padding['desktop-unit'] + ';';
                dynamicStyle += 'padding-top: ' + padding['desktop']['top'] + padding['desktop-unit'] + ';';
                dynamicStyle += 'padding-bottom: ' + padding['desktop']['bottom'] + padding['desktop-unit'] + ';';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                dynamicStyle += '.ast-mobile-popup-drawer.active .ast-desktop-popup-content, .ast-mobile-popup-drawer.active .ast-mobile-popup-content {';
                dynamicStyle += 'padding-left: ' + padding['tablet']['left'] + padding['tablet-unit'] + ';';
                dynamicStyle += 'padding-right: ' + padding['tablet']['right'] + padding['tablet-unit'] + ';';
                dynamicStyle += 'padding-top: ' + padding['tablet']['top'] + padding['tablet-unit'] + ';';
                dynamicStyle += 'padding-bottom: ' + padding['tablet']['bottom'] + padding['tablet-unit'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                dynamicStyle += '.ast-mobile-popup-drawer.active .ast-desktop-popup-content, .ast-mobile-popup-drawer.active .ast-mobile-popup-content {';
                dynamicStyle += 'padding-left: ' + padding['mobile']['left'] + padding['mobile-unit'] + ';';
                dynamicStyle += 'padding-right: ' + padding['mobile']['right'] + padding['mobile-unit'] + ';';
                dynamicStyle += 'padding-top: ' + padding['mobile']['top'] + padding['mobile-unit'] + ';';
                dynamicStyle += 'padding-bottom: ' + padding['mobile']['bottom'] + padding['mobile-unit'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';
                astra_add_dynamic_css( 'popup-padding', dynamicStyle );
            } else {
                astra_add_dynamic_css( 'popup-padding', '' );
            }
        } );
	} );
	
} )( jQuery );
