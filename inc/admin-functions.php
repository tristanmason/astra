<?php
/**
 * Admin functions - Functions that add some functionality to WordPress admin panel
 *
 * @package Astra
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register menus
 */
if ( ! function_exists( 'astra_register_menu_locations' ) ) {

	/**
	 * Register menus
	 *
	 * @since 1.0.0
	 */
	function astra_register_menu_locations() {

		/**
		 * Primary Menus
		 */
		register_nav_menus(
			array(
				'primary' => __( 'Primary Menu', 'astra' ),
			)
		);

		if ( Astra_Constants::$is_new_hfb_activated ) {

			/**
			 * Register the Secondary & Mobile menus.
			 */
			register_nav_menus(
				array(
					'secondary_menu' => __( 'Secondary Menu', 'astra' ),
				)
			);

		}

		/**
		 * Footer Menus
		 */
		register_nav_menus(
			array(
				'footer_menu' => __( 'Footer Menu', 'astra' ),
			)
		);

	}
}

add_action( 'init', 'astra_register_menu_locations' );
