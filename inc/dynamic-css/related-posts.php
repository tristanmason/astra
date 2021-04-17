<?php
/**
 * Related Posts - Dynamic CSS
 *
 * @package astra-builder
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_filter( 'astra_dynamic_theme_css', 'astra_related_posts_css', 11 );

/**
 * Related Posts - Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @return String Generated dynamic CSS for Related Posts.
 *
 * @since x.x.x
 */
function astra_related_posts_css( $dynamic_css ) {

	if ( ast_target_rules_for_related_posts() ) {

		$link_color       = astra_get_option( 'link-color' );
		$related_posts_grid = astra_get_option( 'related-posts-grid', 2 );

		$css_desktop_output = array(
			'.ast-single-related-posts-container .ast-grid-' . $related_posts_grid => array(
				'grid-template-columns' => 'repeat(' . $related_posts_grid . ', 1fr)',
			),
			'.ast-related-posts-inner-section .ast-date-meta .posted-on, .ast-related-posts-inner-section .ast-date-meta .posted-on *' => array(
				'background' => esc_attr( $link_color ),
				'color'      => astra_get_foreground_color( $link_color ),
			),
			'.ast-related-posts-inner-section .ast-date-meta .posted-on .date-month, .ast-related-posts-inner-section .ast-date-meta .posted-on .date-year' => array(
				'color' => astra_get_foreground_color( $link_color ),
			),
		);

		$dynamic_css .= astra_parse_css( $css_desktop_output );

		$css_max_tablet_output = array(
			'.ast-single-related-posts-container .ast-related-posts-wrapper .ast-related-post' => array(
				'width' => '100%',
			),
			'.ast-single-related-posts-container .ast-grid-' . $related_posts_grid => array(
				'grid-template-columns' => 'repeat(2, 1fr)',
			),
		);

		$dynamic_css .= astra_parse_css( $css_max_tablet_output, '', astra_addon_get_tablet_breakpoint() );

		$css_max_mobile_output = array(
			'.ast-single-related-posts-container .ast-grid-' . $related_posts_grid => array(
				'grid-template-columns' => '1fr',
			),
		);

		$dynamic_css .= astra_parse_css( $css_max_mobile_output, '', astra_addon_get_mobile_breakpoint() );

		return $dynamic_css;
	}

	return $dynamic_css;
}
