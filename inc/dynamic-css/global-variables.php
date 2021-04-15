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
			if ( is_archive() || is_home() || is_search() ) {
				$global_css_variables = '
				:root {
					--primary-padding: 4em 0;
					--secondary-padding: 4em;

					--article-padding: 5.34em 6.67em;
					--article-margin: 0;
					--article-bottom-border: 1px solid #eeeeee;

					--body-background-color: #f5f5f5;
					--content-background-color: #ffffff;
				}';
			} elseif ( is_singular() ) {
				$global_css_variables = '
				:root {
					--primary-padding: 4em 0;
					--secondary-padding: 4em;

					--article-padding: 5.34em 6.67em;
					--article-margin: 0;
					--article-bottom-border: 0;

					--body-background-color: #f5f5f5;
					--content-background-color: #ffffff;

					--post-navigation-border: 0;
					--post-navigation-padding: 2em 3.33333em 0 3.33333em;

					--entry-header-margin: 2em;
				}';
			}
			break;

		default:
			$global_css_variables = '';
			break;
	}

	$dynamic_css .= Astra_Enqueue_Scripts::trim_css( $global_css_variables );

	return $dynamic_css;
}
