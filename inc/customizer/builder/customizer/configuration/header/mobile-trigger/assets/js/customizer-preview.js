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
	
	// Trigger Icon Color.
	astra_css(
		'astra-settings[mobile-header-toggle-btn-color]',
		'fill',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-toggle-icon .ast-mobile-svg',
	);

	// Trigger Label Color.
	astra_css(
		'astra-settings[mobile-header-toggle-btn-color]',
		'color',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-wrap .mobile-menu',
	);

	// Trigger Icon Width.
	astra_css(
		'astra-settings[mobile-header-toggle-icon-size]',
		'width',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-toggle-icon .ast-mobile-svg',
		'px'
	);

	// Trigger Icon Height.
	astra_css(
		'astra-settings[mobile-header-toggle-icon-size]',
		'height',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-toggle-icon .ast-mobile-svg',
		'px'
	);

	// Trigger Button Background Color.
	astra_css(
		'astra-settings[mobile-header-toggle-btn-bg-color]',
		'background',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .menu-toggle.ast-mobile-menu-trigger-fill',
	);

	// Border Size for Trigger Button.
	wp.customize( 'astra-settings[mobile-header-toggle-btn-border-size]', function( setting ) {
		setting.bind( function( border ) {
			var dynamicStyle = '[data-section="section-header-mobile-trigger"] .ast-button-wrap .menu-toggle.main-header-menu-toggle {';
				dynamicStyle += 'border-top-width:'  + border.top + 'px;';
				dynamicStyle += 'border-right-width:'  + border.right + 'px;';
				dynamicStyle += 'border-left-width:'   + border.left + 'px;';
				dynamicStyle += 'border-bottom-width:'   + border.bottom + 'px;';
				dynamicStyle += '} ';
			astra_add_dynamic_css( 'astra-settings[mobile-header-toggle-btn-border-size]', dynamicStyle );
		} );
	} );

	// Border Radius.
	astra_css(
		'astra-settings[mobile-header-toggle-border-radius]',
		'border-radius',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .menu-toggle.main-header-menu-toggle',
		'px'
	);

	// Border Color.
	astra_css(
		'astra-settings[mobile-header-toggle-border-color]',
		'border-color',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .menu-toggle.ast-mobile-menu-trigger-outline, [data-section="section-header-mobile-trigger"] .ast-button-wrap .menu-toggle.ast-mobile-menu-trigger-fill'
	);
	
	// Padding for Trigger Button.
	wp.customize( 'astra-settings[mobile-header-toggle-btn-padding]', function( setting ) {
		setting.bind( function( padding ) {
			var dynamicStyle = '[data-section="section-header-mobile-trigger"] .ast-button-wrap .menu-toggle.main-header-menu-toggle {';
				dynamicStyle += 'padding-top:'  + padding.top + 'px;';
				dynamicStyle += 'padding-right:'  + padding.right + 'px;';
				dynamicStyle += 'padding-left:'   + padding.left + 'px;';
				dynamicStyle += 'padding-bottom:'   + padding.bottom + 'px;';
				dynamicStyle += '} ';
			astra_add_dynamic_css( 'astra-settings[mobile-header-toggle-btn-padding]', dynamicStyle );
		} );
	} );

	// Margin for Trigger Button.
	wp.customize( 'astra-settings[mobile-header-toggle-btn-margin]', function( setting ) {
		setting.bind( function( margin ) {
			var dynamicStyle = '[data-section="section-header-mobile-trigger"] .ast-button-wrap .menu-toggle.main-header-menu-toggle {';
				dynamicStyle += 'margin-top:'  + margin.top + 'px;';
				dynamicStyle += 'margin-right:'  + margin.right + 'px;';
				dynamicStyle += 'margin-left:'   + margin.left + 'px;';
				dynamicStyle += 'margin-bottom:'   + margin.bottom + 'px;';
				dynamicStyle += '} ';
			astra_add_dynamic_css( 'astra-settings[mobile-header-toggle-btn-margin]', dynamicStyle );
		} );
	} );

	// Trigger Typography.
	astra_generate_outside_font_family_css(
		'astra-settings[mobile-header-label-font-family]',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-wrap .mobile-menu'
	);
	astra_css(
		'astra-settings[mobile-header-label-font-weight]',
		'font-weight',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-wrap .mobile-menu'
	);
	astra_css(
		'astra-settings[mobile-header-label-text-transform]',
		'text-transform',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-wrap .mobile-menu'
	);
	astra_css(
		'astra-settings[mobile-header-label-font-size]',
		'font-size',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-wrap .mobile-menu',
		'px'
	);
	astra_css(
		'astra-settings[mobile-header-label-line-height]',
		'line-height',
		'[data-section="section-header-mobile-trigger"] .ast-button-wrap .mobile-menu-wrap .mobile-menu'
	);

} )( jQuery );
