<?php
/**
 * Below Footer control - Dynamic CSS
 *
 * @package Astra Builder
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Below Footer CSS
 */
add_filter( 'astra_dynamic_theme_css', 'astra_fb_below_footer_dynamic_css' );

/**
 * Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
 * @return String Generated dynamic CSS for below Footer.
 *
 * @since x.x.x
 */
function astra_fb_below_footer_dynamic_css( $dynamic_css, $dynamic_css_filtered = '' ) {

	if ( ! Astra_Builder_Helper::is_footer_row_empty( 'below' ) ) {
		return $dynamic_css;
	}

	$_section = 'section-below-footer-builder';

	$selector = '.site-below-footer-wrap[data-section="section-below-footer-builder"]';

	$footer_bg     = astra_get_option( 'hbb-footer-bg-obj-responsive' );
	$footer_height = astra_get_option( 'hbb-footer-height' );

	$css_output_desktop = array(

		$selector => astra_get_responsive_background_obj( $footer_bg, 'desktop' ),
	);

	$css_output_desktop[ $selector ]['min-height'] = astra_get_css_value( $footer_height, 'px' );

	$css_output_tablet = array(

		$selector => astra_get_responsive_background_obj( $footer_bg, 'tablet' ),
	);
	$css_output_mobile = array(

		$selector => astra_get_responsive_background_obj( $footer_bg, 'mobile' ),
	);

	/* Parse CSS from array() */
	$css_output  = astra_parse_css( $css_output_desktop );
	$css_output .= astra_parse_css( $css_output_tablet, '', astra_get_tablet_breakpoint() );
	$css_output .= astra_parse_css( $css_output_mobile, '', astra_get_mobile_breakpoint() );

	$dynamic_css .= $css_output;

	$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_advanced_margin_padding_css( $_section, $selector );

	return $dynamic_css;
}
