<?php
/**
 * Butons - Dynamic CSS
 *
 * @package Astra
 * @since 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Heading Colors
 */
add_filter( 'astra_dynamic_theme_css', 'astra_hb_button_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Heading Colors.
 *
 * @since 3.0.0
 */
function astra_hb_button_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	$dynamic_css .= Astra_Button_Component_Dynamic_CSS::astra_button_dynamic_css( 'header' );

	for ( $index = 1; $index <= Astra_Builder_Helper::$num_of_header_button; $index++ ) {

		if ( ! Astra_Builder_Helper::is_component_loaded( 'header', 'button-' . $index ) ) {
			continue;
		}

		$_section = 'section-hb-button-' . $index;
		$selector = '.ast-header-button-' . $index . '[data-section="section-hb-button-' . $index . '"]';

		$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_visibility_css( $_section, $selector );
	}

	return $dynamic_css;
}
