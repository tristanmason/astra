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

	for ( var index = 1; index <= AstraBuilderButtonData.header_button_count; index++ ) {

		var prefix = 'button' + index;
		var selector = '.ast-header-button-' + index + ' .ast-builder-button-wrap';

		// Button Text Color.
		astra_color_responsive_css( 
			'hfb-button-color', 
			'astra-settings[header-' + prefix + '-text-color]', 
			'color', 
			selector + ' .ast-custom-button' 
		);
		astra_color_responsive_css( 
			'hfb-button-color-h', 
			'astra-settings[header-' + prefix + '-text-h-color]', 
			'color', 
			selector + ':hover .ast-custom-button' 
		);
		
		// Button Background Color.
		astra_color_responsive_css( 
			'hfb-button-bg-color', 
			'astra-settings[header-' + prefix + '-back-color]', 
			'background-color', 
			selector + ' .ast-custom-button' 
		);
		astra_color_responsive_css( 
			'hfb-button-bg-color-h', 
			'astra-settings[header-' + prefix + '-back-h-color]', 
			'background-color', 
			selector + ':hover .ast-custom-button' 
		);

		// Button Typography.
		astra_responsive_font_size(
			'astra-settings[header-' + prefix + '-font-size]',
			selector + ' .ast-custom-button'
		);

		// Border Radius.
		astra_css(
			'astra-settings[header-' + prefix + '-border-radius]',
			'border-radius',
			selector + ' .ast-custom-button',
			'px'
		);

		// Border Color.
		astra_color_responsive_css( 
			'hfb-button-border-color', 
			'astra-settings[header-' + prefix + '-border-color]', 
			'border-color', 
			selector + ' .ast-custom-button' 
		);
		astra_color_responsive_css( 
			'hfb-button-border-color-h', 
			'astra-settings[header-' + prefix + '-border-h-color]', 
			'border-color', 
			selector + ' .ast-custom-button:hover' 
		);

		// Advanced CSS Generation.
		astra_builder_advanced_css( 'section-hb-button-' + index, selector + ' .ast-custom-button' );
	}

	// Border Size for Button 1.
	wp.customize( 'astra-settings[header-button1-border-size]', function( setting ) {
		setting.bind( function( border ) {
			var dynamicStyle = '.ast-header-button-1 .ast-builder-button-wrap .ast-custom-button {';
				dynamicStyle += 'border-top-width:'  + border.top + 'px;';
				dynamicStyle += 'border-right-width:'  + border.right + 'px;';
				dynamicStyle += 'border-left-width:'   + border.left + 'px;';
				dynamicStyle += 'border-bottom-width:'   + border.bottom + 'px;';
				dynamicStyle += '} ';
			astra_add_dynamic_css( 'astra-settings[header-button1-border-size]', dynamicStyle );
		} );
	} );

	// Border Size for Button 2.
	wp.customize( 'astra-settings[header-button2-border-size]', function( setting ) {
		setting.bind( function( border ) {
			var dynamicStyle = '.ast-header-button-2 .ast-builder-button-wrap .ast-custom-button {';
				dynamicStyle += 'border-top-width:'  + border.top + 'px;';
				dynamicStyle += 'border-right-width:'  + border.right + 'px;';
				dynamicStyle += 'border-left-width:'   + border.left + 'px;';
				dynamicStyle += 'border-bottom-width:'   + border.bottom + 'px;';
				dynamicStyle += '} ';
			astra_add_dynamic_css( 'astra-settings[header-button2-border-size]', dynamicStyle );
		} );
	} );

} )( jQuery );
		