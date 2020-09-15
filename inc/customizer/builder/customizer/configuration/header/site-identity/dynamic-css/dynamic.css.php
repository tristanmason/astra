<?php
/**
 * Site Identity - Dynamic CSS
 *
 * @package Astra
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Site Identity
 */
add_filter( 'astra_dynamic_theme_css', 'astra_hb_site_identity_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for Site Identity.
 *
 * @since x.x.x
 */
function astra_hb_site_identity_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	if ( ! Astra_Builder_Helper::is_component_loaded( 'header', 'logo' ) ) {
		return $dynamic_css;
	}

	$_section = 'title_tagline';
	$selector = '.ast-builder-layout-element .ast-site-identity';

	$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_advanced_margin_css( $_section, $selector );

	return $dynamic_css;
}
