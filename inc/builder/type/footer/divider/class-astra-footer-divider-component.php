<?php
/**
 * Divider component.
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

define( 'ASTRA_BUILDER_FOOTER_DIVIDER_DIR', ASTRA_THEME_DIR . 'inc/builder/type/footer/divider' );
define( 'ASTRA_BUILDER_FOOTER_DIVIDER_URI', ASTRA_THEME_URI . 'inc/builder/type/footer/divider' );

if ( ! class_exists( 'Astra_Footer_Divider_Component' ) ) {

	/**
	 * Heading Initial Setup
	 *
	 * @since x.x.x
	 */
	class Astra_Footer_Divider_Component {

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {

			// @codingStandardsIgnoreStart WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
			require_once ASTRA_BUILDER_FOOTER_DIVIDER_DIR . '/class-astra-footer-divider-component-loader.php';

			// Include front end files.
			if ( ! is_admin() ) {
				require_once ASTRA_BUILDER_FOOTER_DIVIDER_DIR . '/dynamic-css/dynamic.css.php';
			}
			// @codingStandardsIgnoreEnd WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
		}
	}

	/**
	 *  Kicking this off by creating an object.
	 */
	new Astra_Footer_Divider_Component();

}
