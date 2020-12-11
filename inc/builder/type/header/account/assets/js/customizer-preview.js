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

	var tablet_break_point    = astraBuilderPreview.tablet_break_point || 768,
		mobile_break_point    = astraBuilderPreview.mobile_break_point || 544;

	var selector = '.ast-header-account-wrap';

	// Menu Typography.
	astra_generate_outside_font_family_css(
		'astra-settings[header-account-menu-font-family]',
		selector + ' .ast-account-nav-menu .menu-link'
	);
	astra_generate_font_weight_css(
		'astra-settings[header-account-menu-font-family]',
		'astra-settings[header-account-menu-font-weight]',
		'font-weight',
		selector + ' .ast-account-nav-menu .menu-link'
	);
	astra_css(
		'astra-settings[header-account-menu-text-transform]',
		'text-transform',
		selector + ' .ast-account-nav-menu .menu-link'
	);
	astra_responsive_font_size(
		'astra-settings[header-account-menu-font-size]',
		selector + ' .ast-account-nav-menu .menu-link'
	);
	astra_css(
		'astra-settings[header-account-menu-line-height]',
		'line-height',
		selector + ' .ast-account-nav-menu .menu-link'
	);
	astra_css(
		'astra-settings[header-account-menu-letter-spacing]',
		'letter-spacing',
		selector + ' .ast-account-nav-menu .menu-link',
		'px'
	);

	// Icon Color.
	astra_css(
		'astra-settings[header-account-icon-color]',
		'color',
		selector + ' .ast-header-account-icon:before'
	);

	// Menu - Border Color.
	astra_css(
		'astra-settings[header-account-menu-container-b-color]',
		'border-color',
		selector + ' ul '
	);

	// Menu - Normal Color
	astra_color_responsive_css(
		'astra-account-menu-color-preview',
		'astra-settings[header-account-menu-color-responsive]',
		'color',
		selector + ' .main-header-menu .menu-item > .menu-link'
	);

	// Menu - Hover Color
	astra_color_responsive_css(
		'astra-account-menu-h-color-preview',
		'astra-settings[header-account-menu-h-color-responsive]',
		'color',
		selector + ' .menu-item:hover > .menu-link'
	);

	// Menu - Active Color
	astra_color_responsive_css(
		'astra-account-menu-active-color-preview',
		'astra-settings[header-account-menu-a-color-responsive]',
		'color',
		selector + ' .menu-item.current-menu-item > .menu-link'
	);

	// Menu - Normal Background
	astra_apply_responsive_background_css( 'astra-settings[header-account-menu-bg-obj-responsive]', selector + ' .ast-account-nav-menu', 'desktop' );
	astra_apply_responsive_background_css( 'astra-settings[header-account-menu-bg-obj-responsive]', selector + ' .ast-account-nav-menu', 'tablet' );
	astra_apply_responsive_background_css( 'astra-settings[header-account-menu-bg-obj-responsive]', selector + ' .ast-account-nav-menu', 'mobile' );

	// Menu - Hover Background
	astra_color_responsive_css(
		'astra-account-menu-bg-preview',
		'astra-settings[header-account-menu-h-bg-color-responsive]',
		'background',
		selector + ' .menu-item:hover > .menu-link'
	);

	// Menu - Active Background
	astra_color_responsive_css(
		'astra-account-menu',
		'astra-settings[header-account-menu-a-bg-color-responsive]',
		'background',
		selector + ' .menu-item.current-menu-item > .menu-link'
	);

	// Icon Size.
	wp.customize( 'astra-settings[header-account-icon-size]', function( value ) {
		value.bind( function( size ) {
			if(
				size.desktop != '' || size.desktop != '' || size.desktop != '' || size.desktop != '' ||
				size.tablet != '' || size.tablet != '' || size.tablet != '' || size.tablet != '' ||
				size.mobile != '' || size.mobile != '' || size.mobile != '' || size.mobile != ''
			) {
				var dynamicStyle = '';
				dynamicStyle += selector + ' .ast-header-account-icon:before {';
				dynamicStyle += 'font-size: ' + size.desktop + 'px' + ';';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
				dynamicStyle += selector + ' .ast-header-account-icon:before {';
				dynamicStyle += 'font-size: ' + size.tablet + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
				dynamicStyle += selector + ' .ast-header-account-icon:before {';
				dynamicStyle += 'font-size: ' + size.mobile + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';
				astra_add_dynamic_css( 'header-account-icon-size', dynamicStyle );
			}
		} );
	} );

	// Image Width.
	wp.customize( 'astra-settings[header-account-image-width]', function( value ) {
		value.bind( function( size ) {
			if(
				size.desktop != '' || size.desktop != '' || size.desktop != '' || size.desktop != '' ||
				size.tablet != '' || size.tablet != '' || size.tablet != '' || size.tablet != '' ||
				size.mobile != '' || size.mobile != '' || size.mobile != '' || size.mobile != ''
			) {
				var dynamicStyle = '';
				dynamicStyle += selector + ' .ast-header-account-type-avatar .avatar {';
				dynamicStyle += 'width: ' + size.desktop + 'px' + ';';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
				dynamicStyle += selector + ' .ast-header-account-type-avatar .avatar {';
				dynamicStyle += 'width: ' + size.tablet + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
				dynamicStyle += selector + ' .ast-header-account-type-avatar .avatar {';
				dynamicStyle += 'width: ' + size.mobile + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';
				astra_add_dynamic_css( 'header-account-image-width', dynamicStyle );
			}
		} );
	} );
	
	/**
	 * Header Menu 1 > Submenu border Color
	 */
	wp.customize( 'astra-settings[header-account-menu-item-b-color]', function ( value ) {
		value.bind( function (color) {
			var insideBorder = wp.customize('astra-settings[header-account-menu-item-border]').get();
			if ( '' != color ) {
				if ( true == insideBorder ) {

					var dynamicStyle = '';

					dynamicStyle += '.ast-desktop .ast-header-account-wrap .account-main-navigation .menu-item .menu-link, .ast-header-break-point .ast-header-account-wrap .account-main-navigation .menu-item .menu-link';
					dynamicStyle += '{';
					dynamicStyle += 'border-bottom-width:' + ( ( true === insideBorder ) ? '1px;' : '0px;' );
					dynamicStyle += 'border-color:' + color + ';';
					dynamicStyle += 'border-style: solid;';
					dynamicStyle += '}';
					dynamicStyle += '.ast-desktop .ast-header-account-wrap .menu-item:last-child > .menu-link, .ast-header-account-wrap .menu-item:last-child > .menu-link { border-style: none; }';

					astra_add_dynamic_css('header-account-menu-item-b-color', dynamicStyle);
				}
			} else {
				wp.customize.preview.send('refresh');
			}
		});
	});

	/**
	 * Header Menu 1 > Submenu border Color
	 */
	wp.customize( 'astra-settings[header-account-menu-item-border]', function( value ) {
		value.bind( function( border ) {
			var color = wp.customize( 'astra-settings[header-account-menu-item-b-color]' ).get();

			if( true === border  ) {

				var dynamicStyle = '.ast-desktop .ast-header-account-wrap .account-main-navigation .menu-link, .ast-header-break-point .ast-header-account-wrap .account-main-navigation .menu-item .menu-link';

				dynamicStyle += '{';
				dynamicStyle += 'border-bottom-width:' + ( ( true === border ) ? '1px;' : '0px;' );
				dynamicStyle += 'border-color:'        + color + ';';
				dynamicStyle += 'border-style: solid;';
				dynamicStyle += '}';
				dynamicStyle += '.ast-desktop .ast-header-account-wrap .menu-item:last-child > .menu-link{ border-style: none; }';

				astra_add_dynamic_css( 'header-account-menu-item-border', dynamicStyle );
			} else {
				wp.customize.preview.send( 'refresh' );
			}

		} );
	} );

	// Menu 1 > Sub Menu Border Size.
	wp.customize( 'astra-settings[header-account-menu-container-border]', function( setting ) {
		setting.bind( function( border ) {

			var dynamicStyle = '.ast-desktop .ast-header-account-wrap ul {';
			dynamicStyle += 'border-top-width:'  + border.top + 'px;';
			dynamicStyle += 'border-right-width:'  + border.right + 'px;';
			dynamicStyle += 'border-left-width:'   + border.left + 'px;';
			dynamicStyle += 'border-style: solid;';
			dynamicStyle += 'border-bottom-width:'   + border.bottom + 'px;';

			dynamicStyle += '}';
			astra_add_dynamic_css( 'header-account-menu-container-border', dynamicStyle );

		} );
	} );
	
	// Menu Spacing.
	wp.customize( 'astra-settings[header-account-menu-spacing]', function( value ) {
		value.bind( function( padding ) {
			var dynamicStyle = '';
			dynamicStyle += '.ast-header-account-wrap .menu-item .menu-link {';
			dynamicStyle += 'padding-left: ' + padding['desktop']['left'] + padding['desktop-unit'] + ';';
			dynamicStyle += 'padding-right: ' + padding['desktop']['right'] + padding['desktop-unit'] + ';';
			dynamicStyle += 'padding-top: ' + padding['desktop']['top'] + padding['desktop-unit'] + ';';
			dynamicStyle += 'padding-bottom: ' + padding['desktop']['bottom'] + padding['desktop-unit'] + ';';
			dynamicStyle += '} ';

			dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
			dynamicStyle += '.ast-header-break-point .ast-header-account-wrap .menu-item .menu-link {';
			dynamicStyle += 'padding-left: ' + padding['tablet']['left'] + padding['tablet-unit'] + ';';
			dynamicStyle += 'padding-right: ' + padding['tablet']['right'] + padding['tablet-unit'] + ';';
			dynamicStyle += 'padding-top: ' + padding['tablet']['top'] + padding['tablet-unit'] + ';';
			dynamicStyle += 'padding-bottom: ' + padding['tablet']['bottom'] + padding['tablet-unit'] + ';';
			dynamicStyle += '} ';
			dynamicStyle += '} ';

			dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
			dynamicStyle += '.ast-header-break-point .ast-header-account-wrap .menu-item .menu-link {';
			dynamicStyle += 'padding-left: ' + padding['mobile']['left'] + padding['mobile-unit'] + ';';
			dynamicStyle += 'padding-right: ' + padding['mobile']['right'] + padding['mobile-unit'] + ';';
			dynamicStyle += 'padding-top: ' + padding['mobile']['top'] + padding['mobile-unit'] + ';';
			dynamicStyle += 'padding-bottom: ' + padding['mobile']['bottom'] + padding['mobile-unit'] + ';';
			dynamicStyle += '} ';
			dynamicStyle += '} ';

			astra_add_dynamic_css( 'header-account-menu-spacing', dynamicStyle );
		} );
	} );

	// Margin.
    wp.customize( 'astra-settings[header-account-margin]', function( value ) {
        value.bind( function( margin ) {
            if(
                margin.desktop.bottom != '' || margin.desktop.top != '' || margin.desktop.left != '' || margin.desktop.right != '' ||
                margin.tablet.bottom != '' || margin.tablet.top != '' || margin.tablet.left != '' || margin.tablet.right != '' ||
                margin.mobile.bottom != '' || margin.mobile.top != '' || margin.mobile.left != '' || margin.mobile.right != ''
            ) {
				var selector = '.ast-header-account-wrap';
                var dynamicStyle = '';
                dynamicStyle += selector + ' {';
                dynamicStyle += 'margin-left: ' + margin['desktop']['left'] + margin['desktop-unit'] + ';';
                dynamicStyle += 'margin-right: ' + margin['desktop']['right'] + margin['desktop-unit'] + ';';
                dynamicStyle += 'margin-top: ' + margin['desktop']['top'] + margin['desktop-unit'] + ';';
                dynamicStyle += 'margin-bottom: ' + margin['desktop']['bottom'] + margin['desktop-unit'] + ';';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                dynamicStyle += selector + ' {';
                dynamicStyle += 'margin-left: ' + margin['tablet']['left'] + margin['tablet-unit'] + ';';
                dynamicStyle += 'margin-right: ' + margin['tablet']['right'] + margin['tablet-unit'] + ';';
                dynamicStyle += 'margin-top: ' + margin['tablet']['top'] + margin['desktop-unit'] + ';';
                dynamicStyle += 'margin-bottom: ' + margin['tablet']['bottom'] + margin['desktop-unit'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';

                dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                dynamicStyle += selector + ' {';
                dynamicStyle += 'margin-left: ' + margin['mobile']['left'] + margin['mobile-unit'] + ';';
                dynamicStyle += 'margin-right: ' + margin['mobile']['right'] + margin['mobile-unit'] + ';';
                dynamicStyle += 'margin-top: ' + margin['mobile']['top'] + margin['desktop-unit'] + ';';
                dynamicStyle += 'margin-bottom: ' + margin['mobile']['bottom'] + margin['desktop-unit'] + ';';
                dynamicStyle += '} ';
                dynamicStyle += '} ';
                astra_add_dynamic_css( 'header-account-margin', dynamicStyle );
            }
        } );
    } );

} )( jQuery );
