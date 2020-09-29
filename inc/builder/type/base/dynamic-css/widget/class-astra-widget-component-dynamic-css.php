<?php
/**
 * Astra Widget Component Dynamic CSS.
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
class Astra_Widget_Component_Dynamic_CSS {

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
	public static function astra_widget_dynamic_css( $builder_type = 'header', $dynamic_css, $dynamic_css_filtered = '' ) {


		$no_of_widgets = 'header' === $builder_type ? Astra_Builder_Helper::$num_of_header_widgets : Astra_Builder_Helper::$num_of_footer_widgets;

		for ( $index = 1; $index <= $no_of_widgets; $index++ ) {

			if ( ! Astra_Builder_Helper::is_component_loaded( $builder_type, 'widget-' . $index ) ) {
				continue;
			}

			$_section = 'sidebar-widgets-' . $builder_type . '-widget-' . $index;
			$selector = '.' . $builder_type . '-widget-area[data-section="sidebar-widgets-' . $builder_type . '-widget-' . $index . '"]';


			/**
			 * Copyright CSS.
			 */
			$css_output_desktop = array(

				$selector . ' .' . $builder_type . '-widget-area-inner' => array(
					'color' => astra_get_option(  $builder_type . '-widget-' . $index . '-color' ),
				),
				$selector . ' .' . $builder_type . '-widget-area-inner a' => array(
					'color' => astra_get_option(  $builder_type . '-widget-' . $index . '-link-color' ),
				),
				$selector . ' .widget-title' => array(
					'color' => astra_get_option(  $builder_type . '-widget-' . $index . '-title-color' ),
				),
			);

			/* Parse CSS from array() */
			$css_output   = astra_parse_css( $css_output_desktop );
			$dynamic_css .= $css_output;
		}

		return $dynamic_css;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Widget_Component_Dynamic_CSS();
