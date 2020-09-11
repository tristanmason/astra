<?php
/**
 * Below Footer component.
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

define( 'ASTRA_BUILDER_FOOTER_BELOW_FOOTER_DIR', ASTRA_THEME_DIR . 'inc/customizer/builder/customizer/configuration/footer/below-footer' );
define( 'ASTRA_BUILDER_FOOTER_BELOW_FOOTER_URI', ASTRA_THEME_URI . 'inc/builder/customizer/configuration/footer/below-footer' );

if ( ! class_exists( 'Astra_Below_Footer' ) ) {

	/**
	 * Below Footer Initial Setup
	 *
	 * @since x.x.x
	 */
	class Astra_Below_Footer {

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {

			require_once ASTRA_BUILDER_FOOTER_BELOW_FOOTER_DIR . '/class-astra-below-footer-component-loader.php';

			// Include front end files.
			if ( ! is_admin() ) {
				require_once ASTRA_BUILDER_FOOTER_BELOW_FOOTER_DIR . '/dynamic-css/dynamic.css.php';
			}
		}
	}

	/**
	 *  Kicking this off by creating an object.
	 */
	new Astra_Below_Footer();

}
