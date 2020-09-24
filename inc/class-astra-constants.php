<?php
/**
 * Astra Constants
 *
 * @package Astra
 * @since 1.2.7
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'Astra_Builder_Helper' ) ) :

	/**
	 * Astra_Builder_Helper
	 *
	 * @since 1.2.7
	 */
	class Astra_Builder_Helper {



		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance = null;

		/**
		 *  Initiator
		 */
		public static function get_instance() {

			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}






	}
	/**
	*  Prepare if class 'Astra_Builder_Loader' exist.
	*  Kicking this off by calling 'get_instance()' method
	*/
	Astra_Builder_Helper::get_instance();
endif;
