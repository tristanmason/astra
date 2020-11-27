<?php
/**
 * WIdget control - Dynamic CSS
 *
 * @package Astra Builder
 * @since 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Heading Colors
 */
add_filter( 'astra_dynamic_theme_css', 'astra_hb_widget_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Heading Colors.
 *
 * @since 3.0.0
 */
function astra_hb_widget_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	$dynamic_css .= Astra_Widget_Component_Dynamic_CSS::astra_widget_dynamic_css( 'header' );

	for ( $index = 1; $index <= Astra_Builder_Helper::$num_of_header_widgets; $index++ ) {

		if ( ! Astra_Builder_Helper::is_component_loaded( 'header', 'widget-' . $index ) ) {
			continue;
		}

		$_section = 'sidebar-widgets-header-widget-' . $index;
		$selector = '.header-widget-area[data-section="sidebar-widgets-header-widget-' . $index . '"]';

		$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_visibility_css( $_section, $selector );
	}

	return $dynamic_css;
}
