<?php
/**
 * HTML component.
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

define( 'ASTRA_HEADER_STICKY_DIR', ASTRA_THEME_DIR . 'inc/customizer/builder/customizer/configuration/header/sticky' );
define( 'ASTRA_HEADER_STICKY_URI', ASTRA_THEME_URI . 'inc/customizer/builder/customizer/configuration/header/sticky' );

if ( ! class_exists( 'Astra_Sticky_Header_Component' ) ) {

	/**
	 * Heading Initial Setup
	 *
	 * @since x.x.x
	 */
	class Astra_Sticky_Header_Component {

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {

			require_once ASTRA_HEADER_STICKY_DIR . '/class-astra-sticky-header-component-loader.php';

		}
	}

	/**
	 *  Kicking this off by creating an object.
	 */
	new Astra_Sticky_Header_Component();

}
