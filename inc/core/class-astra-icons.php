<?php
/**
 * Icons for Astra theme.
 *
 * @package     Astra
 * @author      Brainstorm Force
 * @copyright   Copyright (c) 2020, Brainstorm Force
 * @link        https://www.brainstormforce.com
 * @since       Astra x.x.x
 */

/**
 * Icons Initial Setup
 *
 * @since x.x.x
 */
class Astra_Icons {
	/**
	 * Constructor function that initializes required actions and hooks
	 */
	public function __construct() {
		// Remove astra.woff and other format of Astra font files when SVG is enabled.
		if ( self::is_svg_icons() ) {
			add_filter( 'astra_enable_default_fonts', '__return_false' );
		}
	}

	/**
	 * Check if we need to load icons as SVG or fonts.
	 * Returns true if SVG false if font.
	 *
	 * @since x.x.x
	 *
	 * @return boolean should be svg or font.
	 */
	public static function is_svg_icons() {
		$astra_settings                               = get_option( ASTRA_THEME_SETTINGS );
		$astra_settings['can-update-astra-icons-svg'] = ( isset( $astra_settings['can-update-astra-icons-svg'] ) && false === $astra_settings['can-update-astra-icons-svg'] ) ? false : true;
		return apply_filters( 'astra_is_svg_icons', $astra_settings['can-update-astra-icons-svg'] );
	}

	/**
	 * Get SVG icons.
	 * Returns the SVG icon you want to display.
	 *
	 * @since x.x.x
	 *
	 * @param string  $icon Key for the SVG you want to load.
	 * @param boolean $is_echo whether to echo the output or return.
	 * @param boolean $replace load close markup for SVG.
	 *
	 * @return string SVG for passed key.
	 */
	public static function get_icons( $icon, $is_echo = false, $replace = false ) {

		if ( true === self::is_svg_icons() ) {
			$output = '';

			if ( 'menu-bars' === $icon ) {
				$output = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="20px" height="20px" viewBox="57 41.229 26 18.806" enable-background="new 57 41.229 26 18.806" xml:space="preserve">
                <path d="M82.5,41.724h-25v3.448h25V41.724z M57.5,48.907h25v3.448h-25V48.907z M82.5,56.092h-25v3.448h25V56.092z"/>
                </svg>';
			}

			if ( 'close' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px">
                                <path d="M71.029 71.029c9.373-9.372 24.569-9.372 33.942 0L256 222.059l151.029-151.03c9.373-9.372 24.569-9.372 33.942 0 9.372 9.373 9.372 24.569 0 33.942L289.941 256l151.03 151.029c9.372 9.373 9.372 24.569 0 33.942-9.373 9.372-24.569 9.372-33.942 0L256 289.941l-151.029 151.03c-9.373 9.372-24.569 9.372-33.942 0-9.372-9.373-9.372-24.569 0-33.942L222.059 256 71.029 104.971c-9.372-9.373-9.372-24.569 0-33.942z" />
                            </svg>';
			}

			if ( 'search' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M208 48c-88.366 0-160 71.634-160 160s71.634 160 160 160 160-71.634 160-160S296.366 48 208 48zM0 208C0 93.125 93.125 0 208 0s208 93.125 208 208c0 48.741-16.765 93.566-44.843 129.024l133.826 134.018c9.366 9.379 9.355 24.575-.025 33.941-9.379 9.366-24.575 9.355-33.941-.025L337.238 370.987C301.747 399.167 256.839 416 208 416 93.125 416 0 322.875 0 208z"/>
                            </svg>';
			}

			if ( 'categories' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em">
                                <path d="M0 112c0-26.51 21.49-48 48-48h110.014a48 48 0 0 1 43.592 27.907l12.349 26.791A16 16 0 0 0 228.486 128H464c26.51 0 48 21.49 48 48v224c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112z" fill-rule="nonzero"/>
                            </svg>';
			}

			if ( 'tags' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em">
                                <path d="M20 39.5c-8.836 0-16 7.163-16 16v176c0 4.243 1.686 8.313 4.687 11.314l224 224c6.248 6.248 16.378 6.248 22.626 0l176-176c6.244-6.244 6.25-16.364.013-22.615l-223.5-224A15.999 15.999 0 0 0 196.5 39.5H20zm56 96c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24z"/>
                                <path d="M259.515 43.015c4.686-4.687 12.284-4.687 16.97 0l228 228c4.686 4.686 4.686 12.284 0 16.97l-180 180c-4.686 4.687-12.284 4.687-16.97 0-4.686-4.686-4.686-12.284 0-16.97L479.029 279.5 259.515 59.985c-4.686-4.686-4.686-12.284 0-16.97z" fill-rule="nonzero"/>
                            </svg>';
			}

			if ( 'comments' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em">
                                <path d="M132.838 329.973a435.298 435.298 0 0 0 16.769-9.004c13.363-7.574 26.587-16.142 37.419-25.507 7.544.597 15.27.925 23.098.925 54.905 0 105.634-15.311 143.285-41.28 23.728-16.365 43.115-37.692 54.155-62.645 54.739 22.205 91.498 63.272 91.498 110.286 0 42.186-29.558 79.498-75.09 102.828 23.46 49.216 75.09 101.709 75.09 101.709s-115.837-38.35-154.424-78.46c-9.956 1.12-20.297 1.758-30.793 1.758-88.727 0-162.927-43.071-181.007-100.61z" fill-rule="nonzero"/>
                                <path d="M383.371 132.502c0 70.603-82.961 127.787-185.216 127.787-10.496 0-20.837-.639-30.793-1.757-38.587 40.093-154.424 78.429-154.424 78.429s51.63-52.472 75.09-101.67c-45.532-23.321-75.09-60.619-75.09-102.79C12.938 61.9 95.9 4.716 198.155 4.716 300.41 4.715 383.37 61.9 383.37 132.502z" fill-rule="nonzero" />
                            </svg>';
			}

			if ( 'arrow' === $icon ) {
				$output = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z"/>
                </svg>';
			}

			if ( 'cart' === $icon ) {
				$output = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="20px" height="20px" viewBox="826 837.5 140 121" enable-background="new 826 837.5 140 121" xml:space="preserve">
				<path d="M878.77,943.611c0,2.75-1.005,5.131-3.015,7.141c-2.009,2.01-4.389,3.014-7.139,3.014c-2.75,0-5.13-1.004-7.139-3.014  c-2.01-2.01-3.015-4.391-3.015-7.141c0-2.749,1.005-5.129,3.015-7.138c2.009-2.011,4.389-3.016,7.139-3.016  c2.75,0,5.13,1.005,7.139,3.016C877.765,938.482,878.77,940.862,878.77,943.611z M949.846,943.611c0,2.75-1.005,5.131-3.015,7.141  s-4.39,3.014-7.141,3.014c-2.748,0-5.129-1.004-7.138-3.014c-2.01-2.01-3.015-4.391-3.015-7.141c0-2.749,1.005-5.129,3.015-7.138  c2.009-2.011,4.39-3.016,7.138-3.016c2.751,0,5.131,1.005,7.141,3.016C948.841,938.482,949.846,940.862,949.846,943.611z   M960,857.306v40.615c0,1.27-0.438,2.393-1.311,3.371s-1.943,1.548-3.212,1.705l-82.815,9.678c0.687,3.174,1.031,5.024,1.031,5.554  c0,0.846-0.635,2.539-1.904,5.076h72.979c1.375,0,2.564,0.503,3.569,1.508c1.006,1.005,1.508,2.194,1.508,3.569  c0,1.376-0.502,2.564-1.508,3.569c-1.005,1.005-2.194,1.507-3.569,1.507H863.54c-1.375,0-2.565-0.502-3.57-1.507  s-1.507-2.193-1.507-3.569c0-0.581,0.212-1.415,0.634-2.498c0.424-1.085,0.847-2.036,1.27-2.855c0.423-0.82,0.992-1.878,1.706-3.174  s1.124-2.076,1.23-2.34l-14.041-65.285h-16.183c-1.375,0-2.564-0.502-3.569-1.507c-1.005-1.005-1.508-2.195-1.508-3.57  c0-1.375,0.502-2.565,1.508-3.57c1.004-1.004,2.194-1.507,3.569-1.507h20.308c0.846,0,1.6,0.172,2.261,0.516  s1.177,0.754,1.547,1.229c0.37,0.476,0.714,1.124,1.032,1.944c0.316,0.819,0.528,1.507,0.634,2.062  c0.106,0.556,0.252,1.336,0.437,2.34c0.185,1.005,0.304,1.692,0.357,2.063h95.271c1.375,0,2.563,0.502,3.57,1.507  C959.497,854.741,960,855.931,960,857.306z"/>
				</svg>';
			}

			if ( $replace ) {
				$output .= '<svg xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="18px" height="18px" viewBox="-63 -63 140 140" enable-background="new -63 -63 140 140" xml:space="preserve">
                <path id="Shape" d="M75.133-47.507L61.502-61.133L7-6.625l-54.507-54.507l-13.625,13.625L-6.625,7l-54.507,54.503l13.625,13.63     L7,20.631l54.502,54.502l13.631-13.63L20.63,7L75.133-47.507z"/></svg>';
			}
		} else {
			$output = '';

			if ( 'menu-bars' === $icon ) {
				$menu_icon = apply_filters( 'astra_main_menu_toggle_icon', 'menu-toggle-icon' );
				$output    = '<span class="' . esc_attr( $menu_icon ) . '"></span>';
			}

			if ( 'categories' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em">
                                <path d="M0 112c0-26.51 21.49-48 48-48h110.014a48 48 0 0 1 43.592 27.907l12.349 26.791A16 16 0 0 0 228.486 128H464c26.51 0 48 21.49 48 48v224c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112z" fill-rule="nonzero"/>
                            </svg>';
			}

			if ( 'tags' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em">
                                <path d="M20 39.5c-8.836 0-16 7.163-16 16v176c0 4.243 1.686 8.313 4.687 11.314l224 224c6.248 6.248 16.378 6.248 22.626 0l176-176c6.244-6.244 6.25-16.364.013-22.615l-223.5-224A15.999 15.999 0 0 0 196.5 39.5H20zm56 96c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24z"/>
                                <path d="M259.515 43.015c4.686-4.687 12.284-4.687 16.97 0l228 228c4.686 4.686 4.686 12.284 0 16.97l-180 180c-4.686 4.687-12.284 4.687-16.97 0-4.686-4.686-4.686-12.284 0-16.97L479.029 279.5 259.515 59.985c-4.686-4.686-4.686-12.284 0-16.97z" fill-rule="nonzero"/>
                            </svg>';
			}

			if ( 'comments' === $icon ) {
				$output = '<svg viewBox="0 0 512 512" aria-hidden="true" role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em">
                                <path d="M132.838 329.973a435.298 435.298 0 0 0 16.769-9.004c13.363-7.574 26.587-16.142 37.419-25.507 7.544.597 15.27.925 23.098.925 54.905 0 105.634-15.311 143.285-41.28 23.728-16.365 43.115-37.692 54.155-62.645 54.739 22.205 91.498 63.272 91.498 110.286 0 42.186-29.558 79.498-75.09 102.828 23.46 49.216 75.09 101.709 75.09 101.709s-115.837-38.35-154.424-78.46c-9.956 1.12-20.297 1.758-30.793 1.758-88.727 0-162.927-43.071-181.007-100.61z" fill-rule="nonzero"/>
                                <path d="M383.371 132.502c0 70.603-82.961 127.787-185.216 127.787-10.496 0-20.837-.639-30.793-1.757-38.587 40.093-154.424 78.429-154.424 78.429s51.63-52.472 75.09-101.67c-45.532-23.321-75.09-60.619-75.09-102.79C12.938 61.9 95.9 4.716 198.155 4.716 300.41 4.715 383.37 61.9 383.37 132.502z" fill-rule="nonzero" />
                            </svg>';
			}
		}

		$output = apply_filters( 'astra_svg_icon_element', $output, $icon );

		$classes = array(
			'ast-icon',
			'icon-' . $icon,
		);

		$output = sprintf(
			'<span class="%1$s">%2$s</span>',
			implode( ' ', $classes ),
			$output
		);

		if ( ! $is_echo ) {
			return apply_filters( 'astra_svg_icon', $output, $icon );
		}

		echo apply_filters( 'astra_icons', $output, $icon ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
new Astra_Icons();
