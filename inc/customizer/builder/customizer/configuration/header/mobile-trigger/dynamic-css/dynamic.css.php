<?php
/**
 * Mobile Trigger - Dynamic CSS
 *
 * @package astra-builder
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Mobile Trigger.
 */
add_filter( 'astra_dynamic_theme_css', 'astra_mobile_trigger_row_setting', 11 );

/**
 * Mobile Trigger - Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Heading Colors.
 *
 * @since x.x.x
 */
function astra_mobile_trigger_row_setting( $dynamic_css, $dynamic_css_filtered = '' ) {

	$parse_css = '';

	$_section = 'section-header-mobile-trigger';

	$selector = '[data-section="section-header-mobile-trigger"]';

	$icon_size              = astra_get_option( 'mobile-header-toggle-icon-size' );
	$off_canvas_close_color = astra_get_option( 'off-canvas-close-color' );
	$icon_color             = astra_get_option( 'mobile-header-toggle-btn-color' );
	$trigger_bg             = astra_get_option( 'mobile-header-toggle-btn-bg-color' );
	$trigger_border_width   = astra_get_option( 'mobile-header-toggle-btn-border-size' );
	$trigger_border_color   = astra_get_option( 'mobile-header-toggle-border-color' );
	$trigger_border_radius  = astra_get_option( 'mobile-header-toggle-border-radius' );
	$trigger_padding        = astra_get_option( 'mobile-header-toggle-btn-padding' );
	$trigger_margin         = astra_get_option( 'mobile-header-toggle-btn-margin' );
	$font_family            = astra_get_option( 'mobile-header-label-font-family' );
	$font_weight            = astra_get_option( 'mobile-header-label-font-weight' );
	$font_size              = astra_get_option( 'mobile-header-label-font-size' );
	$text_transform         = astra_get_option( 'mobile-header-label-text-transform' );
	$line_height            = astra_get_option( 'mobile-header-label-line-height' );

	// Border.
	$trigger_border_width_top = ( isset( $trigger_border_width ) && isset( $trigger_border_width['top'] ) ) ? $trigger_border_width['top'] : 0;

	$trigger_border_width_bottom = ( isset( $trigger_border_width ) && isset( $trigger_border_width['bottom'] ) ) ? $trigger_border_width['bottom'] : 0;

	$trigger_border_width_right = ( isset( $trigger_border_width ) && isset( $trigger_border_width['right'] ) ) ? $trigger_border_width['right'] : 0;

	$trigger_border_width_left = ( isset( $trigger_border_width ) && isset( $trigger_border_width['left'] ) ) ? $trigger_border_width['left'] : 0;

	// Padding.
	$trigger_padding_top = ( isset( $trigger_padding ) && isset( $trigger_padding['top'] ) ) ? $trigger_padding['top'] : 0;

	$trigger_padding_bottom = ( isset( $trigger_padding ) && isset( $trigger_padding['bottom'] ) ) ? $trigger_padding['bottom'] : 0;

	$trigger_padding_right = ( isset( $trigger_padding ) && isset( $trigger_padding['right'] ) ) ? $trigger_padding['right'] : 0;

	$trigger_padding_left = ( isset( $trigger_padding ) && isset( $trigger_padding['left'] ) ) ? $trigger_padding['left'] : 0;

	// Margin.
	$trigger_margin_top = ( isset( $trigger_margin ) && isset( $trigger_margin['top'] ) ) ? $trigger_margin['top'] : 0;

	$trigger_margin_bottom = ( isset( $trigger_margin ) && isset( $trigger_margin['bottom'] ) ) ? $trigger_margin['bottom'] : 0;

	$trigger_margin_right = ( isset( $trigger_margin ) && isset( $trigger_margin['right'] ) ) ? $trigger_margin['right'] : 0;

	$trigger_margin_left = ( isset( $trigger_margin ) && isset( $trigger_margin['left'] ) ) ? $trigger_margin['left'] : 0;

	/**
	 * Off-Canvas CSS.
	 */
	$css_output = array(

		$selector . ' .ast-button-wrap .mobile-menu-toggle-icon .ast-mobile-svg' => array(
			'width'  => astra_get_css_value( $icon_size, 'px' ),
			'height' => astra_get_css_value( $icon_size, 'px' ),
			'fill'   => $icon_color,
		),
		$selector . ' .ast-button-wrap .mobile-menu-wrap .mobile-menu' => array(
			// Color.
			'color'          => $icon_color,

			// Typography.
			'font-family'    => astra_get_css_value( $font_family, 'font' ),
			'font-weight'    => astra_get_css_value( $font_weight, 'font' ),
			'font-size'      => astra_get_css_value( $font_size, 'px' ),
			'line-height'    => esc_attr( $line_height ),
			'text-transform' => esc_attr( $text_transform ),
		),
		$selector . ' .ast-button-wrap .menu-toggle' => array(
			// Padding.
			'padding-top'    => astra_get_css_value( $trigger_padding_top, 'px' ),
			'padding-bottom' => astra_get_css_value( $trigger_padding_bottom, 'px' ),
			'padding-right'  => astra_get_css_value( $trigger_padding_right, 'px' ),
			'padding-left'   => astra_get_css_value( $trigger_padding_left, 'px' ),

			// Margin.
			'margin-top'     => astra_get_css_value( $trigger_margin_top, 'px' ),
			'margin-bottom'  => astra_get_css_value( $trigger_margin_bottom, 'px' ),
			'margin-right'   => astra_get_css_value( $trigger_margin_right, 'px' ),
			'margin-left'    => astra_get_css_value( $trigger_margin_left, 'px' ),
		),
		$selector . ' .ast-button-wrap .ast-mobile-menu-trigger-fill, ' . $selector . ' .ast-button-wrap .ast-mobile-menu-trigger-minimal' => array(
			// Color & Border.
			'color'  => esc_attr( $icon_color ),
			'border' => 'none',
		),
		$selector . ' .ast-button-wrap .ast-mobile-menu-trigger-outline' => array(
			// Background.
			'background'          => 'transparent',
			'color'               => esc_attr( $icon_color ),
			'border-top-width'    => astra_get_css_value( $trigger_border_width_top, 'px' ),
			'border-bottom-width' => astra_get_css_value( $trigger_border_width_bottom, 'px' ),
			'border-right-width'  => astra_get_css_value( $trigger_border_width_right, 'px' ),
			'border-left-width'   => astra_get_css_value( $trigger_border_width_left, 'px' ),
			'border-style'        => 'solid',
			'border-color'        => $trigger_border_color,
			'border-radius'       => astra_get_css_value( $trigger_border_radius, 'px' ),
		),
		$selector . ' .ast-button-wrap .ast-mobile-menu-trigger-fill' => array(
			'background'    => esc_attr( $trigger_bg ),
			'border-radius' => astra_get_css_value( $trigger_border_radius, 'px' ),
		),
		$selector . ' .ast-button-wrap .ast-mobile-menu-trigger-minimal' => array(
			'background' => 'transparent',
		),
	);

	/* Parse CSS from array() */
	$css_output = astra_parse_css( $css_output );

	$dynamic_css .= $css_output;

	return $dynamic_css;
}
