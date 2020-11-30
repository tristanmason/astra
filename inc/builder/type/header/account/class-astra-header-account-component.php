<?php
/**
 * Account for Astra theme.
 *
 * @package     astra-builder
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'ASTRA_HEADER_ACCOUNT_DIR', ASTRA_THEME_DIR . 'inc/builder/type/header/account' );
define( 'ASTRA_HEADER_ACCOUNT_URI', ASTRA_THEME_URI . 'inc/builder/type/header/account' );

if ( ! class_exists( 'Astra_Header_Account_Component' ) ) {

	/**
	 * Heading Initial Setup
	 *
	 * @since x.x.x
	 */
	class Astra_Header_Account_Component {

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {

			// @codingStandardsIgnoreStart WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
			require_once ASTRA_HEADER_ACCOUNT_DIR . '/class-astra-header-account-component-loader.php';

			// Include front end files.
			if ( ! is_admin() ) {
				require_once ASTRA_HEADER_ACCOUNT_DIR . '/dynamic-css/dynamic.css.php';
			}
			// @codingStandardsIgnoreEnd WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
		}
	}

	/**
	 *  Kicking this off by creating an object.
	 */
	new Astra_Header_Account_Component();

}
