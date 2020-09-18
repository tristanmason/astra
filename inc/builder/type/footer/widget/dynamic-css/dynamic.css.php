<?php
/**
 * WIdget control - Dynamic CSS
 *
 * @package Astra Builder
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Heading Colors
 */
add_filter( 'astra_dynamic_theme_css', 'astra_fb_widget_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Heading Colors.
 *
 * @since x.x.x
 */
function astra_fb_widget_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	for ( $index = 1; $index <= Astra_Constants::$num_of_footer_widgets; $index++ ) {

		if ( ! Astra_Builder_Helper::is_component_loaded( 'footer', 'widget-' . $index ) ) {
			continue;
		}

		$_section = 'sidebar-widgets-footer-widget-' . $index;
		$selector = '.footer-widget-area[data-section="sidebar-widgets-footer-widget-' . $index . '"]';

		$alignment = astra_get_option( 'footer-widget-alignment-' . $index );

		$desktop_alignment = ( isset( $alignment['desktop'] ) ) ? $alignment['desktop'] : '';
		$tablet_alignment  = ( isset( $alignment['tablet'] ) ) ? $alignment['tablet'] : '';
		$mobile_alignment  = ( isset( $alignment['mobile'] ) ) ? $alignment['mobile'] : '';

		/**
		 * Copyright CSS.
		 */
		$css_output_desktop = array(

			$selector . ' .footer-widget-area-inner'   => array(
				'text-align' => $desktop_alignment,
				'color'      => astra_get_option( 'footer-widget-' . $index . '-color' ),
			),
			$selector . ' .footer-widget-area-inner a' => array(
				'color' => astra_get_option( 'footer-widget-' . $index . '-link-color' ),
			),
			$selector . ' .widget-title'               => array(
				'color' => astra_get_option( 'footer-widget-' . $index . '-title-color' ),
			),
		);

		$css_output_tablet = array(
			$selector . ' .footer-widget-area-inner' => array(
				'text-align' => $tablet_alignment,
			),
		);

		$css_output_mobile = array(
			$selector . ' .footer-widget-area-inner' => array(
				'text-align' => $mobile_alignment,
			),
		);

		/* Parse CSS from array() */
		$css_output  = astra_parse_css( $css_output_desktop );
		$css_output .= astra_parse_css( $css_output_tablet, '', astra_get_tablet_breakpoint() );
		$css_output .= astra_parse_css( $css_output_mobile, '', astra_get_mobile_breakpoint() );

		$dynamic_css .= $css_output;
	}

	return $dynamic_css;
}
