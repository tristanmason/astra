<?php
/**
 * Astra Generate Markup Class.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2021, Astra
 * @link        https://wpastra.com/
 * @since       Astra x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Astra_Attr
 */
class Astra_Markup {

	/**
	 * Initialuze the Class.
	 *
	 * @since x.x.x
	 */
	public function __construct() {

		if ( ! Astra_Builder_Helper::apply_flex_based_css() ) {
			// Add filters here.
			add_filter( 'astra_markup_footer-widget-div_open', array( $this, 'footer_widget_div_open' ) );
			add_filter( 'astra_markup_footer-widget-div_close', array( $this, 'footer_widget_div_close' ) );
		}
		add_filter( 'astra_attr_footer-widget-area-inner_output', array( $this, 'footer_widget_area_inner' ) );
	}

	/**
	 * Footer widget opening div.
	 * 
	 * @since x.x.x
	 * @param array $args div attributes.
	 * @return array.
	 */
	public function footer_widget_div_open( $args ) {
		$args['open']  = '<div %s>';
		$args['class'] = 'footer-widget-area-inner site-info-inner';
		return $args;   
	}

	/**
	 * Footer widget closing div.
	 * 
	 * @since x.x.x
	 * @param array $args div attributes.
	 * @return array.
	 */
	public function footer_widget_div_close( $args ) {
		$args['close'] = '</div>';
		return $args;   
	}

	/**
	 * Footer widget inner class.
	 *
	 * @since x.x.x
	 * @return string.
	 */
	public function footer_widget_area_inner() {
		return Astra_Builder_Helper::apply_flex_based_css() ? 'footer-widget-area-inner' : '';
	}
}

/**
 * Kicking this off by calling 'get_instance()' method
 */
new Astra_Markup();
