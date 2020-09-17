<?php
/**
 * Button Styling Loader for Astra theme.
 *
 * @package     Astra
 * @author      Brainstorm Force
 * @copyright   Copyright (c) 2020, Brainstorm Force
 * @link        https://www.brainstormforce.com
 * @since       Astra x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Customizer Initialization
 *
 * @since x.x.x
 */
class Astra_Header_Button_Component_Loader {

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {
		add_action( 'customize_preview_init', array( $this, 'preview_scripts' ), 110 );
		// Load Google fonts.
		add_action( 'astra_get_fonts', array( $this, 'add_fonts' ), 1 );
	}

	/**
	 * Enqueue google fonts.
	 *
	 * @since x.x.x
	 */
	public function add_fonts() {

		for ( $index = 1; $index <= Astra_Constants::$num_of_header_button; $index++ ) {

			$_prefix = 'button' . $index;

			$theme_btn_font_family = astra_get_option( 'header-' . $_prefix . '-font-family' );
			$theme_btn_font_weight = astra_get_option( 'header-' . $_prefix . '-font-weight' );
			Astra_Fonts::add_font( $theme_btn_font_family, $theme_btn_font_weight );
		}
	}

	/**
	 * Customizer Preview
	 *
	 * @since x.x.x
	 */
	public function preview_scripts() {
		/**
		 * Load unminified if SCRIPT_DEBUG is true.
		 */
		/* Directory and Extension */
		$dir_name    = ( SCRIPT_DEBUG ) ? 'unminified' : 'minified';
		$file_prefix = ( SCRIPT_DEBUG ) ? '' : '.min';
		wp_enqueue_script( 'astra-heading-button-customizer-preview-js', ASTRA_HEADER_BUTTON_URI . '/assets/js/customizer-preview.js', array( 'customize-preview', 'astra-customizer-preview-js' ), ASTRA_THEME_VERSION, true );

		// Localize variables for Button JS.
		wp_localize_script(
			'astra-heading-button-customizer-preview-js',
			'AstraBuilderButtonData',
			array(
				'header_button_count' => Astra_Constants::$num_of_header_button,
			)
		);
	}
}

/**
*  Kicking this off by creating the object of the class.
*/
new Astra_Header_Button_Component_Loader();
