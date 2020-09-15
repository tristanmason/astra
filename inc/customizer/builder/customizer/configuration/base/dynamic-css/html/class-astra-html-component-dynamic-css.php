<?php
/**
 * Astra HTML Component Dynamic CSS.
 *
 * @package     astra-builder
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       x.x.x
 */

// No direct access, please.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register Builder Dynamic CSS.
 *
 * @since x.x.x
 */
class Astra_Html_Component_Dynamic_CSS {

	/**
	 * Dynamic CSS
	 *
	 * @param string $builder_type Builder Type.
	 * @param  string $dynamic_css          Astra Dynamic CSS.
	 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
	 * @return String Generated dynamic CSS for Heading Colors.
	 *
	 * @since x.x.x
	 */
	public static function astra_html_dynamic_css( $builder_type = 'header', $dynamic_css, $dynamic_css_filtered = '' ) {

		$number_of_html = ( 'header' === $builder_type ) ? Astra_Builder_Loader::$num_of_header_html : Astra_Builder_Loader::$num_of_footer_html;

		for ( $index = 1; $index <= $number_of_html; $index++ ) {

			if ( ! Astra_Builder_Helper::is_component_loaded( $builder_type, 'html-' . $index ) ) {
				continue;
			}

			$_section = ( 'header' === $builder_type ) ? 'section-hb-html-' . $index : 'section-fb-html-' . $index;

			$selector = ( 'header' === $builder_type ) ? '.site-header-section .ast-builder-layout-element.ast-header-html-' . $index : '.footer-widget-area[data-section="section-fb-html-' . $index . '"]';

			$css_output = array(

				$selector . ' .ast-builder-html-element' => array(
					'color' => esc_attr( astra_get_option( $builder_type . '-html-' . $index . 'color' ) ),
				),

			);

			/* Parse CSS from array() */
			$css_output = astra_parse_css( $css_output );

			$dynamic_css .= $css_output;

			$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_advanced_margin_css( $_section, $selector );

			$dynamic_css .= Astra_Builder_Base_Dynamic_CSS::prepare_advanced_typography_css( $_section, $selector );
		}

		return $dynamic_css;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Html_Component_Dynamic_CSS();
