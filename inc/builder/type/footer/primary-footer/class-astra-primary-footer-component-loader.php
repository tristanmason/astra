<?php
/**
 * Primary Footer Styling Loader for Astra theme.
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
 * Primary Footer Initialization
 *
 * @since x.x.x
 */
class Astra_Primary_Footer_Component_Loader {

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
		wp_enqueue_script( 'astra-footer-primary-footer-customizer-preview-js', ASTRA_BUILDER_FOOTER_PRIMARY_FOOTER_URI . '/assets/js/customizer-preview.js', array( 'customize-preview', 'astra-customizer-preview-js' ), ASTRA_THEME_VERSION, true );

		// Localize variables for Footer JS.
		wp_localize_script(
			'astra-heading-primary-customizer-preview-js',
			'AstraBuilderPrimaryFooterData',
			array(
				'footer_content_width' => astra_get_option( 'site-content-width' ),
			)
		);
	}
}

/**
*  Kicking this off by creating the object of the class.
*/
new Astra_Primary_Footer_Component_Loader();
