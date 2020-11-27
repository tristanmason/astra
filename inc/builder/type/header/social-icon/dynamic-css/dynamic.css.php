<?php
/**
 * Heading Colors - Dynamic CSS
 *
 * @package Astra
 * @since 2.1.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Heading Colors
 */
add_filter( 'astra_dynamic_theme_css', 'astra_hb_social_icon_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Heading Colors.
 *
 * @since 2.1.4
 */
function astra_hb_social_icon_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	$dynamic_css .= Astra_Social_Component_Dynamic_CSS::astra_social_dynamic_css( 'header' );

	for ( $index = 1; $index <= Astra_Builder_Helper::$num_of_header_social_icons; $index++ ) {

		if ( ! Astra_Builder_Helper::is_component_loaded( 'header', 'social-icons-' . $index ) ) {
			continue;
		}

		$selector = '.ast-builder-layout-element[data-section="section-hb-social-icons-' . $index . '"]';
		$_section = 'section-hb-social-icons-' . $index;

		$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_visibility_css( $_section, $selector );
	}

	return $dynamic_css;
}
