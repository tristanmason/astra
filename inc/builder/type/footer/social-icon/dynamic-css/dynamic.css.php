<?php
/**
 * Social Icons control - Dynamic CSS
 *
 * @package Astra Builder
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Social Icons Colors
 */
add_filter( 'astra_dynamic_theme_css', 'astra_fb_social_icon_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Social Icons Colors.
 *
 * @since x.x.x
 */
function astra_fb_social_icon_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	if ( ! Astra_Builder_Helper::is_component_loaded( 'footer', 'social' ) ) {
		return $dynamic_css;
	}

	$dynamic_css .= Astra_Social_Component_Dynamic_CSS::astra_social_dynamic_css( 'footer', $dynamic_css, $dynamic_css_filtered = '' );

	$alignment = astra_get_option( 'footer-social-alignment' );

	$desktop_alignment = ( isset( $alignment['desktop'] ) ) ? $alignment['desktop'] : '';
	$tablet_alignment  = ( isset( $alignment['tablet'] ) ) ? $alignment['tablet'] : '';
	$mobile_alignment  = ( isset( $alignment['mobile'] ) ) ? $alignment['mobile'] : '';

	/**
	 * Social Icon CSS.
	 */
	$css_output_desktop = array(

		'.ast-footer-social-wrap' => array(
			'text-align' => $desktop_alignment,
		),

	);

	/**
	 * Social_icons CSS.
	 */
	$css_output_tablet = array(

		'.ast-footer-social-wrap' => array(
			'text-align' => $tablet_alignment,
		),

	);

	/**
	 * Social_icons CSS.
	 */
	$css_output_mobile = array(

		'.ast-footer-social-wrap' => array(
			'text-align' => $mobile_alignment,
		),

	);

	/* Parse CSS from array() */
	$css_output  = astra_parse_css( $css_output_desktop );
	$css_output .= astra_parse_css( $css_output_tablet, '', astra_get_tablet_breakpoint() );
	$css_output .= astra_parse_css( $css_output_mobile, '', astra_get_mobile_breakpoint() );

	$dynamic_css .= $css_output;

	return $dynamic_css;
}
