<?php
/**
 * Divider Styling Loader for Astra theme.
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
 * Customizer Initialization
 *
 * @since x.x.x
 */
class Astra_Header_Divider_Component_Loader {

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {
		add_action( 'customize_preview_init', array( $this, 'preview_scripts' ), 110 );
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
		wp_enqueue_script( 'astra-heading-divider-customizer-preview-js', ASTRA_HEADER_DIVIDER_URI . '/assets/js/customizer-preview.js', array( 'customize-preview', 'ahfb-base-customizer-preview' ), ASTRA_THEME_VERSION, true );

		// Localize variables for divider JS.
		wp_localize_script(
			'astra-heading-divider-customizer-preview-js',
			'AstraBuilderDividerData',
			array(
				'header_divider_count' => Astra_Builder_Helper::$component_limit,
			)
		);
	}
}

/**
*  Kicking this off by creating the object of the class.
*/
new Astra_Header_Divider_Component_Loader();
