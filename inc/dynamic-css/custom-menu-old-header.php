<?php
/**
 * Old Header Menu Last Item - Dynamic CSS
 *
 * @package astra
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_filter( 'astra_dynamic_theme_css', 'astra_old_header_custom_menu_css' );

/**
 * Old Header Menu Last Item - Dynamic CSS.
 *
 * @param string $dynamic_css 
 * @since x.x.x
 */
function astra_old_header_custom_menu_css( $dynamic_css ) {

	$menu_item = astra_get_option( 'header-main-rt-section' );
	if ( false === Astra_Builder_Helper::$is_header_footer_builder_active ) {

		if ( 'widget' == $menu_item ) {

			$static_css = '
            .ast-header-widget-area {
                line-height: 1.65;
            }
            .ast-header-widget-area .widget-title,
            .ast-header-widget-area .no-widget-text {
                margin-bottom: 0;
            }
            .ast-header-widget-area .widget {
                margin: .5em;
                display: inline-block;
                vertical-align: middle;
            }
            .ast-header-widget-area .widget p {
                margin-bottom: 0;
            }
            .ast-header-widget-area .widget ul {
                position: static;
                border: 0;
                width: auto;
            }
            .ast-header-widget-area .widget ul a {
                border: 0;
            }
            
            .ast-header-widget-area .widget.widget_search .search-field,
            .ast-header-widget-area .widget.widget_search .search-field:focus {
                padding: 10px 45px 10px 15px;
            }
            .ast-header-widget-area .widget:last-child {
                margin-bottom: 0.5em;
                margin-right: 0;
            }
            .submenu-with-border .ast-header-widget-area .widget ul {
                position: static;
                border: 0;
                width: auto;
            }
            .submenu-with-border .ast-header-widget-area .widget ul a {
                border: 0;
            }
            .ast-header-break-point .ast-header-widget-area .widget {
                margin: .5em 0;
                display: block;
            }';
		}   
		$dynamic_css .= Astra_Enqueue_Scripts::trim_css( $static_css );
	}
	return $dynamic_css;
}
