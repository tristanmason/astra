<?php
/**
 * Footer Navigation Menu Styling Loader for Astra theme.
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

/**
 * Footer Navigation Menu Initialization
 *
 * @since x.x.x
 */
class Astra_Footer_Menu_Component_Loader {

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {
		add_action( 'customize_preview_init', array( $this, 'preview_scripts' ), 110 );
		add_action( 'astra_get_fonts', array( $this, 'add_fonts' ), 1 );
	}

	/**
	 * Enqueue google fonts.
	 *
	 * @since x.x.x
	 */
	public function add_fonts() {

		$footer_menu_font_family = astra_get_option( 'footer-menu-font-family' );
		$footer_menu_font_weight = astra_get_option( 'footer-menu-font-weight' );
		Astra_Fonts::add_font( $footer_menu_font_family, $footer_menu_font_weight );
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
		wp_enqueue_script( 'astra-footer-menu-customizer-preview', ASTRA_BUILDER_FOOTER_MENU_URI . '/assets/js/customizer-preview.js', array( 'customize-preview', 'astra-customizer-preview-js' ), ASTRA_THEME_VERSION, true );

		// Localize variables for Astra Breakpoints JS.
		wp_localize_script(
			'astra-footer-menu-customizer-preview',
			'astraBuilderPreview',
			array(
				'tablet_break_point' => astra_get_tablet_breakpoint(),
				'mobile_break_point' => astra_get_mobile_breakpoint(),
			)
		);
	}
}

/**
*  Kicking this off by creating the object of the class.
*/
new Astra_Footer_Menu_Component_Loader();
