<?php
/**
 * WIDGET component.
 *
 * @package     Astra Builder
 * @author      Brainstorm Force
 * @copyright   Copyright (c) 2020, Brainstorm Force
 * @link        https://www.brainstormforce.com
 * @since       Astra x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'ASTRA_BUILDER_FOOTER_WIDGET_DIR', ASTRA_THEME_DIR . 'inc/customizer/builder/customizer/configuration/footer/widget' );
define( 'ASTRA_BUILDER_FOOTER_WIDGET_URI', ASTRA_THEME_URI . 'inc/customizer/builder/customizer/configuration/footer/widget' );

if ( ! class_exists( 'Astra_Footer_Widget_Component' ) ) {

	/**
	 * Heading Initial Setup
	 *
	 * @since x.x.x
	 */
	class Astra_Footer_Widget_Component {

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {

			require_once ASTRA_BUILDER_FOOTER_WIDGET_DIR . '/class-astra-footer-widget-component-loader.php';

			// Include front end files.
			if ( ! is_admin() ) {
				require_once ASTRA_BUILDER_FOOTER_WIDGET_DIR . '/dynamic-css/dynamic.css.php';
			}
		}
	}

	/**
	 *  Kicking this off by creating an object.
	 */
	new Astra_Footer_Widget_Component();

}
