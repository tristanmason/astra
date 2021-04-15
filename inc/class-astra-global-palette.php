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
	 * Get CSS variable prefix used for styling.
	 *
	 * @since x.x.x
	 * @return string variable prefix
	 */
	public static function get_css_variable_prefix() {
		return '--ast-global-color-';
	}

	/**
	 * Generate palette CSS required to display on front end.
	 *
	 * @since x.x.x
	 * @return array palette style array.
	 */
	public static function generate_global_palette_style() {
		$palette_data  = astra_get_option( 'global-color-palette' );
		$palette_style = array();

		if ( isset( $palette_data['palette'] ) ) {
			foreach ( $palette_data['palette'] as $key => $color ) {
				$palette_key                   = self::get_css_variable_prefix() . $key;
				$palette_style[ $palette_key ] = $color;
			}
		}

		return $palette_style;
	}
}

new Astra_Global_Palette();
