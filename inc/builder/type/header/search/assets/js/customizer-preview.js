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

	var tablet_break_point    = astraBuilderPreview.tablet_break_point || 768,
		mobile_break_point    = astraBuilderPreview.mobile_break_point || 544;

	var selector = '.ast-header-search';
	var section = 'section-header-search';

	console.log( tablet_break_point );
	console.log( mobile_break_point );

	// Icon Color.
	astra_css(
		'astra-settings[header-search-icon-color]',
		'color',
		selector + ' .astra-search-icon, ' + selector + ' .search-field::placeholder' 
	);

	// Icon Size.
	astra_css(
		'astra-settings[header-search-icon-space]',
		'font-size',
		selector + ' .astra-search-icon',
		'px'
	);

	// Header search visibility.
	wp.customize( 'astra-settings[' + section + '-hide-desktop]', function( setting ) {
		setting.bind( function( desktop_visible ) {

			var dynamicStyle = '';
			var is_hidden = ( ! desktop_visible ) ? 'flex' : 'none';

			// dynamicStyle +=  '@media (min-width: ' + tablet_break_point + 'px) {';
			dynamicStyle += '.ast-desktop .ast-header-search {';
			dynamicStyle += 'display: ' + is_hidden + ';';
			dynamicStyle += '} ';				
			// dynamicStyle += '} ';

			astra_add_dynamic_css( section + '-hide-desktop', dynamicStyle );
		} );
	} );
	
	// Header search visibility.
	wp.customize( 'astra-settings[' + section + '-hide-tablet]', function( setting ) {
		setting.bind( function( tablet_visible ) {

			var dynamicStyle = '';
			var is_hidden = ( ! tablet_visible ) ? 'flex' : 'none';

			dynamicStyle +=  '@media (min-width: ' + mobile_break_point + 'px) and (max-width: ' + tablet_break_point + 'px) {';
			dynamicStyle += '.ast-header-break-point .ast-header-search {';
			dynamicStyle += 'display: ' + is_hidden + ';';
			dynamicStyle += '} ';
			dynamicStyle += '} ';

			astra_add_dynamic_css( section + '-hide-tablet', dynamicStyle );
		} );
	} );

	// Header search visibility.
	wp.customize( 'astra-settings[' + section + '-hide-mobile]', function( setting ) {
		setting.bind( function( mobile_visible ) {

			var dynamicStyle = '';
			var is_hidden = ( ! mobile_visible ) ? 'flex' : 'none';

			dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
			dynamicStyle += '.ast-header-break-point .ast-header-search {';
			dynamicStyle += 'display: ' + is_hidden + ';';
			dynamicStyle += '} ';
			dynamicStyle += '} ';

			astra_add_dynamic_css( section + '-hide-mobile', dynamicStyle );
		} );
	} );

	// Icon Size.
	wp.customize( 'astra-settings[header-search-icon-space]', function( value ) {
		value.bind( function( size ) {
			if(
				size.desktop != '' || size.desktop != '' || size.desktop != '' || size.desktop != '' ||
				size.tablet != '' || size.tablet != '' || size.tablet != '' || size.tablet != '' ||
				size.mobile != '' || size.mobile != '' || size.mobile != '' || size.mobile != ''
			) {
				var dynamicStyle = '';
				dynamicStyle += selector + ' .astra-search-icon {';
				dynamicStyle += 'font-size: ' + size.desktop + 'px' + ';';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
				dynamicStyle += selector + ' .astra-search-icon {';
				dynamicStyle += 'font-size: ' + size.tablet + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';

				dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
				dynamicStyle += selector + ' .astra-search-icon {';
				dynamicStyle += 'font-size: ' + size.mobile + 'px' + ';';
				dynamicStyle += '} ';
				dynamicStyle += '} ';
				astra_add_dynamic_css( 'header-search-icon-space', dynamicStyle );
			}
		} );
	} );

	// Margin.
    wp.customize( 'astra-settings[section-header-search-margin]', function( value ) {
        value.bind( function( margin ) {
            if(
                margin.desktop.bottom != '' || margin.desktop.top != '' || margin.desktop.left != '' || margin.desktop.right != '' ||
                margin.tablet.bottom != '' || margin.tablet.top != '' || margin.tablet.left != '' || margin.tablet.right != '' ||
                margin.mobile.bottom != '' || margin.mobile.top != '' || margin.mobile.left != '' || margin.mobile.right != ''
            ) {
				var selector = '.astra-hfb-header .site-header-section > .ast-header-search, .astra-hfb-header .ast-header-search';
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
                astra_add_dynamic_css( 'header-search-margin', dynamicStyle );
            }
        } );
    } );

} )( jQuery );
