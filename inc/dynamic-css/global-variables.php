<?php
/**
 * Global CSS Variables - Dynamic CSS
 *
 * @package astra
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_filter( 'astra_dynamic_theme_css', 'astra_css_global_variables', 5 );

/**
 * Global CSS Variables - Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @return String Generate dynamic CSS for Global CSS Variables.
 *
 * @since x.x.x
 */
function astra_css_global_variables( $dynamic_css ) {

	switch ( astra_get_content_layout() ) {
		case 'content-boxed-container':
			$global_css_variables = '
			:root {
				--primary-padding: 4em 0;
				--secondary-padding: 4em;
				--article-padding: 5.34em 6.67em;


				--body-background-color: #f5f5f5;
				--content-background-color: #ffffff;
			}
			.ast-row {
				margin-left: 0;
    			margin-right: 0;
			}';
			break;

		default:
			$global_css_variables = '';
			break;
	}

	$dynamic_css .= Astra_Enqueue_Scripts::trim_css( $global_css_variables );

	return $dynamic_css;
}
