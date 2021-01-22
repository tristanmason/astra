<?php
/**
 * EDD Cart - Dynamic CSS
 *
 * @package Astra
 * @since 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Search
 */
add_filter( 'astra_dynamic_theme_css', 'astra_hb_edd_cart_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Search.
 *
 * @since 3.0.0
 */
function astra_hb_edd_cart_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	if ( ! Astra_Builder_Helper::is_component_loaded( 'edd-cart', 'header' ) ) {
		return $dynamic_css;
	}

	$selector                = '.ast-edd-site-header-cart';
	$theme_color             = astra_get_option( 'theme-color' );
	$link_color              = astra_get_option( 'link-color', $theme_color );
	$header_cart_icon_style  = astra_get_option( 'edd-header-cart-icon-style' );
	$header_cart_icon_color  = astra_get_option( 'edd-header-cart-icon-color', $theme_color );
	$header_cart_icon_radius = astra_get_option( 'edd-header-cart-icon-radius' );
	$cart_h_color            = astra_get_foreground_color( $header_cart_icon_color );

	$btn_color    = astra_get_option( 'button-color' );
	$btn_bg_color = astra_get_option( 'button-bg-color', $theme_color );

	if ( empty( $btn_color ) ) {
		$btn_color = astra_get_foreground_color( $theme_color );
	}

	/**
	 * - EDD cart styles.
	 */
	$cart_text_color      = astra_get_option( 'header-edd-cart-text-color' );
	$cart_link_color      = astra_get_option( 'header-edd-cart-link-color', $link_color );
	$cart_bg_color        = astra_get_option( 'header-edd-cart-background-color' );
	$cart_separator_color = astra_get_option( 'header-edd-cart-separator-color' );

	$checkout_button_text_color   = astra_get_option( 'header-edd-checkout-btn-text-color', $btn_color );
	$checkout_button_bg_color     = astra_get_option( 'header-edd-checkout-btn-background-color', $btn_bg_color );
	$checkout_button_text_h_color = astra_get_option( 'header-edd-checkout-btn-text-hover-color', $btn_color );
	$checkout_button_bg_h_color   = astra_get_option( 'header-edd-checkout-btn-bg-hover-color', $btn_bg_color );

	$header_cart_icon = '';
	/**
	 * EDD Cart CSS.
	 */
	$css_output_desktop = array(

		$selector . ' .ast-edd-cart-menu-wrap .count, ' . $selector . ' .ast-edd-cart-menu-wrap .count:after' => array(
			'color'        => $theme_color,
			'border-color' => $theme_color,
		),
		$selector . ' .ast-edd-cart-menu-wrap:hover .count' => array(
			'color'            => esc_attr( $cart_h_color ),
			'background-color' => esc_attr( $theme_color ),
		),
		$selector . ' .ast-icon-shopping-cart' => array(
			'color' => $theme_color,
		),

		/**
		 * General EDD Cart tray color for widget
		 */
		$selector . ' .widget_edd_cart_widget a, ' . $selector . ' .widget_edd_cart_widget a.edd-remove-from-cart, ' . $selector . ' .widget_edd_cart_widget .cart-total' => array(
			'color' => esc_attr( $cart_link_color ),
		),
		$selector . ' .widget_edd_cart_widget a.edd-remove-from-cart:after' => array(
			'color'        => esc_attr( $cart_link_color ),
			'border-color' => esc_attr( $cart_link_color ),
		),
		$selector . ' .widget_edd_cart_widget span, ' . $selector . ' .widget_edd_cart_widget strong, ' . $selector . ' .widget_edd_cart_widget *' => array(
			'color' => esc_attr( $cart_text_color ),
		),
		'.ast-builder-layout-element ' . $selector . ' .widget_edd_cart_widget' => array(
			'background-color' => esc_attr( $cart_bg_color ),
			'border-color'     => esc_attr( $cart_bg_color ),
		),
		'.ast-builder-layout-element ' . $selector . ' .widget_edd_cart_widget:before, .ast-builder-layout-element ' . $selector . ' .widget_edd_cart_widget:after' => array(
			'border-bottom-color' => esc_attr( $cart_bg_color ),
		),
		$selector . ' .widget_edd_cart_widget .edd-cart-item, ' . $selector . ' .widget_edd_cart_widget .edd-cart-number-of-items, ' . $selector . ' .widget_edd_cart_widget .edd-cart-meta' => array(
			'border-bottom-color' => esc_attr( $cart_separator_color ),
		),

		/**
		 * Checkout button color for widget
		 */
		'.ast-edd-site-header-cart .widget_edd_cart_widget .edd_checkout a, .widget_edd_cart_widget .edd_checkout a' => array(
			'color'            => esc_attr( $checkout_button_text_color ),
			'border-color'     => esc_attr( $checkout_button_bg_color ),
			'background-color' => esc_attr( $checkout_button_bg_color ),
		),
		'.ast-edd-site-header-cart .widget_edd_cart_widget .edd_checkout a:hover, .widget_edd_cart_widget .edd_checkout a:hover' => array(
			'color'            => esc_attr( $checkout_button_text_h_color ),
			'background-color' => esc_attr( $checkout_button_bg_h_color ),
		),
	);

	/**
	 * Header Cart color
	 */
	if ( 'none' !== $header_cart_icon_style ) {

		/**
		 * Header Cart Icon colors
		 */
		$header_cart_icon = array(

			$selector . ' .ast-edd-cart-menu-wrap .count' => array(
				'color'        => esc_attr( astra_get_option( 'edd-header-cart-icon-color' ) ),
				'border-color' => esc_attr( astra_get_option( 'edd-header-cart-icon-color' ) ),
			),
			$selector . ' .ast-edd-cart-menu-wrap .count:after' => array(
				'color'        => esc_attr( astra_get_option( 'edd-header-cart-icon-color' ) ),
				'border-color' => esc_attr( astra_get_option( 'edd-header-cart-icon-color' ) ),
			),
			$selector . ' .ast-icon-shopping-cart'        => array(
				'color' => esc_attr( astra_get_option( 'edd-header-cart-icon-color' ) ),
			),

			// Default icon colors.
			'.ast-edd-cart-menu-wrap .count, .ast-edd-cart-menu-wrap .count:after' => array(
				'border-color' => esc_attr( $header_cart_icon_color ),
				'color'        => esc_attr( $header_cart_icon_color ),
			),
			// Outline icon hover colors.
			$selector . ' .ast-edd-cart-menu-wrap:hover .count' => array(
				'color'            => esc_attr( $cart_h_color ),
				'background-color' => esc_attr( $header_cart_icon_color ),
			),
			// Outline icon colors.
			'.ast-edd-menu-cart-outline .ast-addon-cart-wrap' => array(
				'background' => '#ffffff',
				'border'     => '1px solid ' . $header_cart_icon_color,
				'color'      => esc_attr( $header_cart_icon_color ),
			),
			// Outline Info colors.
			$selector . ' .ast-menu-cart-outline .ast-edd-header-cart-info-wrap' => array(
				'color' => esc_attr( $header_cart_icon_color ),
			),
			// Fill icon Color.
			'.ast-edd-site-header-cart.ast-edd-menu-cart-fill .ast-edd-cart-menu-wrap .count,.ast-edd-menu-cart-fill .ast-addon-cart-wrap, .ast-edd-menu-cart-fill .ast-addon-cart-wrap .ast-edd-header-cart-info-wrap, .ast-edd-menu-cart-fill .ast-addon-cart-wrap .ast-icon-shopping-cart' => array(
				'background-color' => esc_attr( $header_cart_icon_color ),
				'color'            => esc_attr( $cart_h_color ),
			),

			// Border radius.
			'.ast-edd-site-header-cart.ast-edd-menu-cart-outline .ast-addon-cart-wrap, .ast-edd-site-header-cart.ast-edd-menu-cart-fill .ast-addon-cart-wrap, .ast-edd-site-header-cart.ast-edd-menu-cart-outline .count, .ast-edd-site-header-cart.ast-edd-menu-cart-fill .count, .ast-edd-site-header-cart.ast-edd-menu-cart-outline .ast-addon-cart-wrap .ast-edd-header-cart-info-wrap, .ast-edd-site-header-cart.ast-edd-menu-cart-fill .ast-addon-cart-wrap .ast-edd-header-cart-info-wrap' => array(
				'border-radius' => astra_get_css_value( $header_cart_icon_radius, 'px' ),
			),
		);

		$header_cart_icon = astra_parse_css( $header_cart_icon );
	}

	/* Parse CSS from array() */
	$css_output  = astra_parse_css( $css_output_desktop );
	$css_output .= $header_cart_icon;

	$css_output .= Astra_Builder_Base_Dynamic_CSS::prepare_visibility_css( 'section-header-edd-cart', '.ast-header-edd-cart' );

	$dynamic_css .= $css_output;

	return $dynamic_css;
}
