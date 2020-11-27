<?php
/**
 * HTML control - Dynamic CSS
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
add_filter( 'astra_dynamic_theme_css', 'astra_hb_html_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Heading Colors.
 *
 * @since 3.0.0
 */
function astra_hb_html_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	$dynamic_css .= Astra_Html_Component_Dynamic_CSS::astra_html_dynamic_css( 'header' );

	for ( $index = 1; $index <= Astra_Builder_Helper::$num_of_header_html; $index++ ) {

		if ( ! Astra_Builder_Helper::is_component_loaded( 'header', 'html-' . $index ) ) {
			continue;
		}

		$_section = 'section-hb-html-' . $index;
		$selector = '.ast-header-html-' . $index . '[data-section="section-hb-html-' . $index . '"]';

		$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_visibility_css( $_section, $selector );
	}

	return $dynamic_css;
}
