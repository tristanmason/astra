<?php
/**
 * Search - Dynamic CSS
 *
 * @package Astra
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Search
 */
add_filter( 'astra_dynamic_theme_css', 'astra_hb_search_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Search.
 *
 * @since x.x.x
 */
function astra_hb_search_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	if ( ! Astra_Builder_Helper::is_component_loaded( 'header', 'search' ) ) {
		return $dynamic_css;
	}

	$_section  = 'section-header-search';
	$selector  = '.ast-header-search';
	$icon_size = astra_get_option( 'header-search-icon-space' );

	$icon_size_desktop = ( isset( $icon_size ) && isset( $icon_size['desktop'] ) ) ? $icon_size['desktop'] : '';

	$icon_size_tablet = ( isset( $icon_size ) && isset( $icon_size['tablet'] ) ) ? $icon_size['tablet'] : '';

	$icon_size_mobile = ( isset( $icon_size ) && isset( $icon_size['mobile'] ) ) ? $icon_size['mobile'] : '';

	/**
	 * Search CSS.
	 */
	$css_output_desktop = array(

		$selector . ' .astra-search-icon' => array(
			'color'     => esc_attr( astra_get_option( 'header-search-icon-color' ) ),
			'font-size' => astra_get_css_value( $icon_size_desktop, 'px' ),
		),
	);

	$css_output_tablet = array(

		$selector . ' .astra-search-icon' => array(
			'font-size' => astra_get_css_value( $icon_size_tablet, 'px' ),
		),
	);

	$css_output_mobile = array(

		$selector . ' .astra-search-icon' => array(
			'font-size' => astra_get_css_value( $icon_size_mobile, 'px' ),
		),
	);

	/* Parse CSS from array() */
	$css_output  = astra_parse_css( $css_output_desktop );
	$css_output .= astra_parse_css( $css_output_tablet, '', astra_get_tablet_breakpoint() );
	$css_output .= astra_parse_css( $css_output_mobile, '', astra_get_mobile_breakpoint() );

	$dynamic_css .= $css_output;

	$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_advanced_margin_css( $_section, '.astra-hfb-header .site-header-section > .ast-header-search' );

	return $dynamic_css;
}
