<?php
/**
 * Off Canvas Loader.
 *
 * @package     astra-builder
 * @author      Brainstorm Force
 * @copyright   Copyright (c) 2020, Brainstorm Force
 * @link        https://www.brainstormforce.com
 * @since       x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Astra_Off_Canvas_Loader
 *
 * Loads config files.
 *
 * @since x.x.x
 */
class Astra_Off_Canvas_Loader {

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {

		add_action( 'customize_register', array( $this, 'customize_register' ), 2 );
		add_action( 'customize_preview_init', array( $this, 'preview_scripts' ), 110 );
	}

	/**
	 * Load above row options configs.
	 *
	 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
	 *
	 * @since x.x.x
	 */
	public function customize_register( $wp_customize ) {

		/**
		 * Register Sections & Options.
		 */
		require_once ASTRA_OFF_CANVAS_DIR . '/class-astra-customizer-off-canvas-configs.php';
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
		wp_enqueue_script( 'astra-off-canvas-customizer-preview-js', ASTRA_OFF_CANVAS_URI . '/assets/js/customizer-preview.js', array( 'customize-preview', 'astra-customizer-preview-js' ), ASTRA_THEME_VERSION, true );
	}
}

/**
*  Kicking this off by creating the object of the class.
*/
new Astra_Off_Canvas_Loader();
