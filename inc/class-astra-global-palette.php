<?php
/**
 * Astra Global color palette
 *
 * @package     Astra
 * @subpackage  Class
 * @author      Astra
 * @link        https://wpastra.com/
 * @since       x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Global palette class
 */
class Astra_Global_Palette {

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {
		add_action( 'after_setup_theme', array( $this, 'support_editor_color_palette' ) );
		$this->includes();
	}

	/**
	 * Get CSS variable prefix used for styling.
	 *
	 * @since x.x.x
	 * @return string variable prefix
	 */
	public static function get_css_variable_prefix() {
		return '--ast-global-color-';
	}

	/**
	 * Include required files.
	 *
	 * @since x.x.x
	 */
	public function includes() {
		require_once ASTRA_THEME_DIR . 'inc/dynamic-css/global-color-palette.php';// PHPCS:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
	}

	/**
	 * Generate palette CSS required to display on front end.
	 *
	 * @since x.x.x
	 * @return array palette style array.
	 */
	public static function generate_global_palette_style() {
		$palette_data = astra_get_option( 'global-color-palette' );

		$palette_style = array();

		if ( isset( $palette_data['palette'] ) ) {
			foreach ( $palette_data['palette'] as $key => $color ) {
				$palette_key                   = self::get_css_variable_prefix() . $key;
				$palette_style[ $palette_key ] = $color;
			}
		}

		return $palette_style;
	}

	/**
	 * Modify color palette from Gutenberg.
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function support_editor_color_palette() {
		// Disable Custom Colors.
		add_theme_support( 'disable-custom-colors' );

		$global_palette = astra_get_option( 'global-color-palette' );
		$editor_palette = $this->format_global_palette( $global_palette );

		// Editor Color Palette.
		add_theme_support( 'editor-color-palette', $editor_palette );
	}

	/**
	 * Format color palette data required to pass for Gutenberg palette.
	 *
	 * @since x.x.x
	 * @param array $global_palette global palette data.
	 * @return bool
	 */
	public function format_global_palette( $global_palette ) {

		$editor_palette    = array();
		$extra_color_index = 1;
		$color_index       = 0;
		foreach ( $global_palette['palette'] as $key => $color ) {

			if ( isset( $global_palette['labels'][ $color_index ] ) ) {
				$label = $global_palette['labels'][ $color_index ];
			} else {
				$label = __( 'Extra Color', 'astra' ) . $extra_color_index;
				$extra_color_index++;
			}

			$editor_palette[] = array(
				'name'  => $label,
				'slug'  => self::get_css_variable_prefix() . $key,
				'color' => 'var(' . self::get_css_variable_prefix() . $key . ')',
			);
			$color_index++;
		}

		return $editor_palette;
	}
}

new Astra_Global_Palette();
