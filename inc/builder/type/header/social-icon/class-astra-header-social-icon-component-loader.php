<?php
/**
 * Social Icon Styling Loader for Astra theme.
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

/**
 * Customizer Initialization
 *
 * @since x.x.xs
 */
class Astra_Header_Social_Icon_Component_Loader {

	/**
	 * Constructor
	 *
	 * @since x.x.xs
	 */
	public function __construct() {
		add_action( 'customize_preview_init', array( $this, 'preview_scripts' ), 110 );
		// Load Google fonts.
		add_action( 'astra_get_fonts', array( $this, 'add_fonts' ), 1 );
	}

	/**
	 * Enqueue google fonts.
	 *
	 * @since x.x.xs
	 */
	public function add_fonts() {

		$social_header_font_family = astra_get_option( 'section-header-social-icons-font-family' );
		$social_header_font_weight = astra_get_option( 'section-header-social-icons-font-weight' );

		Astra_Fonts::add_font( $social_header_font_family, $social_header_font_weight );
	}

	/**
	 * Customizer Preview
	 *
	 * @since x.x.xs
	 */
	public function preview_scripts() {
		/**
		 * Load unminified if SCRIPT_DEBUG is true.
		 */
		/* Directory and Extension */
		$dir_name    = ( SCRIPT_DEBUG ) ? 'unminified' : 'minified';
		$file_prefix = ( SCRIPT_DEBUG ) ? '' : '.min';
		wp_enqueue_script( 'astra-heading-social-icon-customizer-preview-js', ASTRA_HEADER_SOCIAL_ICON_URI . '/assets/js/customizer-preview.js', array( 'customize-preview', 'astra-customizer-preview-js' ), ASTRA_THEME_VERSION, true );
	}
}

/**
*  Kicking this off by creating the object of the class.
*/
new Astra_Header_Social_Icon_Component_Loader();
