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

if ( ! class_exists( 'Astra_Constants' ) ) :

	/**
	 * Astra_Constants
	 *
	 * @since 1.2.7
	 */
	class Astra_Constants {

		/**
		 * Config context general tab.
		 *
		 * @var string[][]
		 */
		public static $general_tab = array(
			array(
				'setting' => 'ast_selected_tab',
				'value'   => 'general',
			),
		);

		/**
		 * Config context design tab.
		 *
		 * @var string[][]
		 */
		public static $design_tab = array(
			array(
				'setting' => 'ast_selected_tab',
				'value'   => 'design',
			),
		);
	}

endif;
