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
	$menu_divider_toggle   = astra_get_option( 'header-account-menu-item-border' );
	$menu_divider_color    = astra_get_option( 'header-account-menu-item-b-color' );
	$menu_container_border = astra_get_option( 'header-account-menu-container-border' );

	$menu_divider_color = ( true === $menu_divider_toggle ) ? $menu_divider_color : '';

	$menu_container_border_top = ( isset( $menu_container_border ) && ! empty( $menu_container_border['top'] ) ) ? $menu_container_border['top'] : 0;

	$menu_container_border_bottom = ( isset( $menu_container_border ) && ! empty( $menu_container_border['bottom'] ) ) ? $menu_container_border['bottom'] : 0;

	$menu_container_border_right = ( isset( $menu_container_border ) && ! empty( $menu_container_border['right'] ) ) ? $menu_container_border['right'] : 0;

	$menu_container_border_left = ( isset( $menu_container_border ) && ! empty( $menu_container_border['left'] ) ) ? $menu_container_border['left'] : 0;

	// Spacing.
	$menu_spacing = astra_get_option( 'header-account-menu-spacing' );

	// Menu colors.
	$menu_resp_color           = astra_get_option( 'header-account-menu-color-responsive' );
	$menu_resp_bg_color        = astra_get_option( 'header-account-menu-bg-obj-responsive' );
	$menu_resp_color_hover     = astra_get_option( 'header-account-menu-h-color-responsive' );
	$menu_resp_bg_color_hover  = astra_get_option( 'header-account-menu-h-bg-color-responsive' );
	$menu_resp_color_active    = astra_get_option( 'header-account-menu-a-color-responsive' );
	$menu_resp_bg_color_active = astra_get_option( 'header-account-menu-a-bg-color-responsive' );

	$menu_resp_color_desktop = ( isset( $menu_resp_color['desktop'] ) ) ? $menu_resp_color['desktop'] : '';
	$menu_resp_color_tablet  = ( isset( $menu_resp_color['tablet'] ) ) ? $menu_resp_color['tablet'] : '';
	$menu_resp_color_mobile  = ( isset( $menu_resp_color['mobile'] ) ) ? $menu_resp_color['mobile'] : '';

	$menu_resp_color_hover_desktop = ( isset( $menu_resp_color_hover['desktop'] ) ) ? $menu_resp_color_hover['desktop'] : '';
	$menu_resp_color_hover_tablet  = ( isset( $menu_resp_color_hover['tablet'] ) ) ? $menu_resp_color_hover['tablet'] : '';
	$menu_resp_color_hover_mobile  = ( isset( $menu_resp_color_hover['mobile'] ) ) ? $menu_resp_color_hover['mobile'] : '';

	$menu_resp_bg_color_hover_desktop = ( isset( $menu_resp_bg_color_hover['desktop'] ) ) ? $menu_resp_bg_color_hover['desktop'] : '';
	$menu_resp_bg_color_hover_tablet  = ( isset( $menu_resp_bg_color_hover['tablet'] ) ) ? $menu_resp_bg_color_hover['tablet'] : '';
	$menu_resp_bg_color_hover_mobile  = ( isset( $menu_resp_bg_color_hover['mobile'] ) ) ? $menu_resp_bg_color_hover['mobile'] : '';

	$menu_resp_color_active_desktop = ( isset( $menu_resp_color_active['desktop'] ) ) ? $menu_resp_color_active['desktop'] : '';
	$menu_resp_color_active_tablet  = ( isset( $menu_resp_color_active['tablet'] ) ) ? $menu_resp_color_active['tablet'] : '';
	$menu_resp_color_active_mobile  = ( isset( $menu_resp_color_active['mobile'] ) ) ? $menu_resp_color_active['mobile'] : '';

	$menu_resp_bg_color_active_desktop = ( isset( $menu_resp_bg_color_active['desktop'] ) ) ? $menu_resp_bg_color_active['desktop'] : '';
	$menu_resp_bg_color_active_tablet  = ( isset( $menu_resp_bg_color_active['tablet'] ) ) ? $menu_resp_bg_color_active['tablet'] : '';
	$menu_resp_bg_color_active_mobile  = ( isset( $menu_resp_bg_color_active['mobile'] ) ) ? $menu_resp_bg_color_active['mobile'] : '';

	// Typography.
	$menu_font_family    = astra_get_option( 'header-account-menu-font-family' );
	$menu_font_size      = astra_get_option( 'header-account-menu-font-size' );
	$menu_font_weight    = astra_get_option( 'header-account-menu-font-weight' );
	$menu_text_transform = astra_get_option( 'header-account-menu-text-transform' );
	$menu_line_height    = astra_get_option( 'header-account-menu-line-height' );

	$menu_font_size_desktop      = ( isset( $menu_font_size['desktop'] ) ) ? $menu_font_size['desktop'] : '';
	$menu_font_size_tablet       = ( isset( $menu_font_size['tablet'] ) ) ? $menu_font_size['tablet'] : '';
	$menu_font_size_mobile       = ( isset( $menu_font_size['mobile'] ) ) ? $menu_font_size['mobile'] : '';
	$menu_font_size_desktop_unit = ( isset( $menu_font_size['desktop-unit'] ) ) ? $menu_font_size['desktop-unit'] : '';
	$menu_font_size_tablet_unit  = ( isset( $menu_font_size['tablet-unit'] ) ) ? $menu_font_size['tablet-unit'] : '';
	$menu_font_size_mobile_unit  = ( isset( $menu_font_size['mobile-unit'] ) ) ? $menu_font_size['mobile-unit'] : '';
	
	/**
	 * Account CSS.
	 */
	$css_output_desktop = array(

		$selector . ' .ast-header-account-type-icon .ahfb-svg-iconset svg path, ' . $selector . ' .ast-header-account-type-icon .ahfb-svg-iconset svg circle' => array(
			'fill' => esc_attr( astra_get_option( 'header-account-icon-color' ) ),
		),
		$selector . ' .ast-header-account-type-icon .ahfb-svg-iconset svg' => array(
			'height' => astra_get_css_value( $icon_size_desktop, 'px' ),
			'width'  => astra_get_css_value( $icon_size_desktop, 'px' ),
		),
		$selector . ' .ast-header-account-type-avatar .avatar' => array(
			'width' => astra_get_css_value( $image_width_desktop, 'px' ),
		),
		$selector . ' ul'                               => array(
			'border-top-width'    => astra_get_css_value( $menu_container_border_top, 'px' ),
			'border-bottom-width' => astra_get_css_value( $menu_container_border_bottom, 'px' ),
			'border-right-width'  => astra_get_css_value( $menu_container_border_right, 'px' ),
			'border-left-width'   => astra_get_css_value( $menu_container_border_left, 'px' ),
			'border-color'        => esc_attr( astra_get_option( 'header-account-menu-container-b-color' ) ),
			'border-style'        => 'solid',
		),
		$selector . ' .ast-account-nav-menu .menu-item .menu-link' => array(
			'color'          => $menu_resp_color_desktop,
			'padding-top'    => astra_responsive_spacing( $menu_spacing, 'top', 'desktop' ),
			'padding-bottom' => astra_responsive_spacing( $menu_spacing, 'bottom', 'desktop' ),
			'padding-left'   => astra_responsive_spacing( $menu_spacing, 'left', 'desktop' ),
			'padding-right'  => astra_responsive_spacing( $menu_spacing, 'right', 'desktop' ),
		),
		$margin_selector                                => array(
			// Margin CSS.
			'margin-top'    => astra_responsive_spacing( $margin, 'top', 'desktop' ),
			'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'desktop' ),
			'margin-left'   => astra_responsive_spacing( $margin, 'left', 'desktop' ),
			'margin-right'  => astra_responsive_spacing( $margin, 'right', 'desktop' ),
		),
		$selector . ' .menu-item:hover > .menu-link'    => array(
			'color'      => $menu_resp_color_hover_desktop,
			'background' => $menu_resp_bg_color_hover_desktop,
		),
		$selector . ' .menu-item.current-menu-item > .menu-link' => array(
			'color'      => $menu_resp_color_active_desktop,
			'background' => $menu_resp_bg_color_active_desktop,
		),
		$selector . ' .ast-account-nav-menu .menu-link' => array(
			'font-family'    => astra_get_font_family( $menu_font_family ),
			'font-weight'    => esc_attr( $menu_font_weight ),
			'font-size'      => astra_get_font_css_value( $menu_font_size_desktop, $menu_font_size_desktop_unit ),
			'line-height'    => esc_attr( $menu_line_height ),
			'text-transform' => esc_attr( $menu_text_transform ),
		),
	);

	$css_output_desktop[ $selector . ' .ast-account-nav-menu' ] = astra_get_responsive_background_obj( $menu_resp_bg_color, 'desktop' );

	$css_output_tablet = array(

		$selector . ' .ast-header-account-type-icon .ahfb-svg-iconset svg' => array(
			'height' => astra_get_css_value( $icon_size_tablet, 'px' ),
			'width'  => astra_get_css_value( $icon_size_tablet, 'px' ),
		),
		$selector . ' .ast-header-account-type-avatar .avatar' => array(
			'width' => astra_get_css_value( $image_width_tablet, 'px' ),
		),
		$selector . ' .ast-account-nav-menu .menu-item .menu-link' => array(
			'color'          => $menu_resp_color_tablet,
			'padding-top'    => astra_responsive_spacing( $menu_spacing, 'top', 'tablet' ),
			'padding-bottom' => astra_responsive_spacing( $menu_spacing, 'bottom', 'tablet' ),
			'padding-left'   => astra_responsive_spacing( $menu_spacing, 'left', 'tablet' ),
			'padding-right'  => astra_responsive_spacing( $menu_spacing, 'right', 'tablet' ),
		),
		$selector . ' .menu-item:hover > .menu-link'    => array(
			'color'      => $menu_resp_color_hover_tablet,
			'background' => $menu_resp_bg_color_hover_tablet,
		),
		$selector . ' .menu-item.current-menu-item > .menu-link' => array(
			'color'      => $menu_resp_color_active_tablet,
			'background' => $menu_resp_bg_color_active_tablet,
		),
		$margin_selector                                => array(
			// Margin CSS.
			'margin-top'    => astra_responsive_spacing( $margin, 'top', 'tablet' ),
			'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'tablet' ),
			'margin-left'   => astra_responsive_spacing( $margin, 'left', 'tablet' ),
			'margin-right'  => astra_responsive_spacing( $margin, 'right', 'tablet' ),
		),
		$selector . ' .ast-account-nav-menu .menu-link' => array(
			'font-size' => astra_get_font_css_value( $menu_font_size_tablet, $menu_font_size_tablet_unit ),
		),
	);

	$css_output_tablet[ $selector . ' .ast-account-nav-menu' ] = astra_get_responsive_background_obj( $menu_resp_bg_color, 'tablet' );

	$css_output_mobile = array(

		$selector . ' .ast-header-account-type-icon .ahfb-svg-iconset svg' => array(
			'height' => astra_get_css_value( $icon_size_mobile, 'px' ),
			'width'  => astra_get_css_value( $icon_size_mobile, 'px' ),
		),
		$selector . ' .ast-header-account-type-avatar .avatar' => array(
			'width' => astra_get_css_value( $image_width_mobile, 'px' ),
		),
		$selector . ' .ast-account-nav-menu .menu-item .menu-link' => array(
			'color'          => $menu_resp_color_mobile,
			'padding-top'    => astra_responsive_spacing( $menu_spacing, 'top', 'mobile' ),
			'padding-bottom' => astra_responsive_spacing( $menu_spacing, 'bottom', 'mobile' ),
			'padding-left'   => astra_responsive_spacing( $menu_spacing, 'left', 'mobile' ),
			'padding-right'  => astra_responsive_spacing( $menu_spacing, 'right', 'mobile' ),
		),
		$selector . ' .menu-item:hover > .menu-link'    => array(
			'color'      => $menu_resp_color_hover_mobile,
			'background' => $menu_resp_bg_color_hover_mobile,
		),
		$selector . ' .menu-item.current-menu-item > .menu-link' => array(
			'color'      => $menu_resp_color_active_mobile,
			'background' => $menu_resp_bg_color_active_mobile,
		),
		$margin_selector                                => array(
			// Margin CSS.
			'margin-top'    => astra_responsive_spacing( $margin, 'top', 'mobile' ),
			'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'mobile' ),
			'margin-left'   => astra_responsive_spacing( $margin, 'left', 'mobile' ),
			'margin-right'  => astra_responsive_spacing( $margin, 'right', 'mobile' ),
		),
		$selector . ' .ast-account-nav-menu .menu-link' => array(
			'font-size' => astra_get_font_css_value( $menu_font_size_mobile, $menu_font_size_mobile_unit ),
		),
	);

	$css_output_mobile[ $selector . ' .ast-account-nav-menu' ] = astra_get_responsive_background_obj( $menu_resp_bg_color, 'mobile' );

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
