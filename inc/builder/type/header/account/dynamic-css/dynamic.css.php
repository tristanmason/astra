<?php
/**
 * Account - Dynamic CSS
 *
 * @package Astra
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Account
 */
add_filter( 'astra_dynamic_theme_css', 'astra_hb_account_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Account.
 *
 * @since x.x.x
 */
function astra_hb_account_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	if ( ! Astra_Builder_Helper::is_component_loaded( 'header', 'account' ) ) {
		return $dynamic_css;
	}

	$_section  = 'section-header-account';
	$selector  = '.ast-header-account-wrap';
	$icon_size = astra_get_option( 'header-account-icon-size' );

	$icon_size_desktop = ( isset( $icon_size ) && isset( $icon_size['desktop'] ) && ! empty( $icon_size['desktop'] ) ) ? $icon_size['desktop'] : 20;
	
	$icon_size_tablet = ( isset( $icon_size ) && isset( $icon_size['tablet'] ) && ! empty( $icon_size['tablet'] ) ) ? $icon_size['tablet'] : 20;

	$icon_size_mobile = ( isset( $icon_size ) && isset( $icon_size['mobile'] ) && ! empty( $icon_size['mobile'] ) ) ? $icon_size['mobile'] : 20;

	$image_width = astra_get_option( 'header-account-image-width' );

	$image_width_desktop = ( isset( $image_width ) && isset( $image_width['desktop'] ) && ! empty( $image_width['desktop'] ) ) ? $image_width['desktop'] : 20;
	
	$image_width_tablet = ( isset( $image_width ) && isset( $image_width['tablet'] ) && ! empty( $image_width['tablet'] ) ) ? $image_width['tablet'] : 20;

	$image_width_mobile = ( isset( $image_width ) && isset( $image_width['mobile'] ) && ! empty( $image_width['mobile'] ) ) ? $image_width['mobile'] : 20;

	$margin          = astra_get_option( 'header-account-margin' );
	$margin_selector = '.ast-header-account-wrap';

	// Menu.
	$menu_divider_toggle = astra_get_option( 'header-account-menu-item-border' );
	$menu_divider_color  = astra_get_option( 'header-account-menu-item-b-color' );
	$menu_container_border     = astra_get_option( 'header-account-menu-container-border' );

	$menu_divider_color = ( true === $menu_divider_toggle ) ? $menu_divider_color : '';

	$menu_container_border_top = ( isset( $menu_container_border ) && ! empty( $menu_container_border['top'] ) ) ? $menu_container_border['top'] : 0;

	$menu_container_border_bottom = ( isset( $menu_container_border ) && ! empty( $menu_container_border['bottom'] ) ) ? $menu_container_border['bottom'] : 0;

	$menu_container_border_right = ( isset( $menu_container_border ) && ! empty( $menu_container_border['right'] ) ) ? $menu_container_border['right'] : 0;

	$menu_container_border_left = ( isset( $menu_container_border ) && ! empty( $menu_container_border['left'] ) ) ? $menu_container_border['left'] : 0;

	// Spacing.
	$menu_spacing = astra_get_option( 'header-account-menu-spacing' );
	
	/**
	 * account CSS.
	 */
	$css_output_desktop = array(

		$selector . ' .ast-header-account-icon:before' => array(
			'color'     => esc_attr( astra_get_option( 'header-account-icon-color' ) ),
			'font-size' => astra_get_css_value( $icon_size_desktop, 'px' ),
		),
		$selector . ' .ast-header-account-type-avatar .avatar' => array(
			'width' => astra_get_css_value( $image_width_desktop, 'px' ),
		),
		$selector . ' ul'                     => array(
			'border-top-width'    => astra_get_css_value( $menu_container_border_top, 'px' ),
			'border-bottom-width' => astra_get_css_value( $menu_container_border_bottom, 'px' ),
			'border-right-width'  => astra_get_css_value( $menu_container_border_right, 'px' ),
			'border-left-width'   => astra_get_css_value( $menu_container_border_left, 'px' ),
			'border-color'        => esc_attr( astra_get_option( 'header-account-menu-container-b-color' ) ),
			'border-style'        => 'solid',
		),
		$selector . ' .ast-account-nav-menu .menu-item .menu-link'       => array(
			// 'color'          => $menu_resp_color_desktop,
			'padding-top'    => astra_responsive_spacing( $menu_spacing, 'top', 'desktop' ),
			'padding-bottom' => astra_responsive_spacing( $menu_spacing, 'bottom', 'desktop' ),
			'padding-left'   => astra_responsive_spacing( $menu_spacing, 'left', 'desktop' ),
			'padding-right'  => astra_responsive_spacing( $menu_spacing, 'right', 'desktop' ),
		),
		$margin_selector                               => array(
			// Margin CSS.
			'margin-top'    => astra_responsive_spacing( $margin, 'top', 'desktop' ),
			'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'desktop' ),
			'margin-left'   => astra_responsive_spacing( $margin, 'left', 'desktop' ),
			'margin-right'  => astra_responsive_spacing( $margin, 'right', 'desktop' ),
		),
	);

	$css_output_tablet = array(

		$selector . ' .ast-header-account-icon:before' => array(
			'font-size' => astra_get_css_value( $icon_size_tablet, 'px' ),
		),
		$selector . ' .ast-header-account-type-avatar .avatar' => array(
			'width' => astra_get_css_value( $image_width_tablet, 'px' ),
		),
		$selector . ' .ast-account-nav-menu .menu-item .menu-link' => array(
			// 'color'          => $menu_resp_color_tablet,
			'padding-top'    => astra_responsive_spacing( $menu_spacing, 'top', 'tablet' ),
			'padding-bottom' => astra_responsive_spacing( $menu_spacing, 'bottom', 'tablet' ),
			'padding-left'   => astra_responsive_spacing( $menu_spacing, 'left', 'tablet' ),
			'padding-right'  => astra_responsive_spacing( $menu_spacing, 'right', 'tablet' ),
		),
		$margin_selector                               => array(
			// Margin CSS.
			'margin-top'    => astra_responsive_spacing( $margin, 'top', 'tablet' ),
			'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'tablet' ),
			'margin-left'   => astra_responsive_spacing( $margin, 'left', 'tablet' ),
			'margin-right'  => astra_responsive_spacing( $margin, 'right', 'tablet' ),
		),
	);

	$css_output_mobile = array(

		$selector . ' .ast-header-account-icon:before' => array(
			'font-size' => astra_get_css_value( $icon_size_mobile, 'px' ),
		),
		$selector . ' .ast-header-account-type-avatar .avatar' => array(
			'width' => astra_get_css_value( $image_width_mobile, 'px' ),
		),
		$selector . ' .ast-account-nav-menu .menu-item .menu-link' => array(
			// 'color'          => $menu_resp_color_mobile,
			'padding-top'    => astra_responsive_spacing( $menu_spacing, 'top', 'mobile' ),
			'padding-bottom' => astra_responsive_spacing( $menu_spacing, 'bottom', 'mobile' ),
			'padding-left'   => astra_responsive_spacing( $menu_spacing, 'left', 'mobile' ),
			'padding-right'  => astra_responsive_spacing( $menu_spacing, 'right', 'mobile' ),
		),
		$margin_selector                               => array(
			// Margin CSS.
			'margin-top'    => astra_responsive_spacing( $margin, 'top', 'mobile' ),
			'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'mobile' ),
			'margin-left'   => astra_responsive_spacing( $margin, 'left', 'mobile' ),
			'margin-right'  => astra_responsive_spacing( $margin, 'right', 'mobile' ),
		),
	);

	if ( true === $menu_divider_toggle ) {
		// Menu Divider.
		$css_output_desktop[ $selector . ' .menu-item .menu-link' ]              = array(
			'border-bottom-width' => '1px',
			'border-color'        => $menu_divider_color,
			'border-style'        => 'solid',
		);
		$css_output_desktop[ $selector . ' .menu-item:last-child > .menu-link' ] = array(
			'border-style' => 'none',
		);
		$css_output_mobile[ '.ast-header-break-point ' . $selector . ' .account-main-navigation .menu-item .menu-link, .ast-header-break-point ' . $selector . ' .account-main-navigation .menu-item .menu-link' ] = array(
			'border-bottom-width' => '1px',
			'border-color'        => $menu_divider_color,
			'border-style'        => 'solid',
		);
		$css_output_mobile['.ast-header-break-point .ast-builder-menu .menu-item:last-child > .menu-link, .ast-header-break-point .ast-builder-menu .menu-item:last-child > .menu-link']                           = array(
			'border-style' => 'none',
		);
		$css_output_tablet[ '.ast-header-break-point ' . $selector . ' .account-main-navigation .menu-link, .ast-header-break-point ' . $selector . ' .account-main-navigation .menu-item .menu-link' ]            = array(
			'border-bottom-width' => '1px',
			'border-color'        => $menu_divider_color,
			'border-style'        => 'solid',
		);
		$css_output_tablet['.ast-header-break-point .ast-builder-menu .menu-item:last-child > .menu-link, .ast-header-break-point .ast-builder-menu .menu-item:last-child > .menu-link']                           = array(
			'border-style' => 'none',
		);
	} else {

		$css_output_desktop[ $selector . ' .menu-item .menu-link' ] = array(
			'border-style' => 'none',
		);
		$css_output_tablet[ '.ast-header-break-point ' . $selector . ' .account-main-navigation .menu-item .menu-link, .ast-header-break-point ' . $selector . ' .account-main-navigation .menu-item .menu-link' ] = array(
			'border-style' => 'none',
		);
		$css_output_mobile[ '.ast-header-break-point ' . $selector . ' .account-main-navigation .menu-item .menu-link, .ast-header-break-point ' . $selector . ' .account-main-navigation .menu-item .menu-link' ] = array(
			'border-style' => 'none',
		);
	}

	/* Parse CSS from array() */
	$css_output  = astra_parse_css( $css_output_desktop );
	$css_output .= astra_parse_css( $css_output_tablet, '', astra_get_tablet_breakpoint() );
	$css_output .= astra_parse_css( $css_output_mobile, '', astra_get_mobile_breakpoint() );

	$dynamic_css .= $css_output;

	return $dynamic_css;
}
