<?php
/**
 * Search Styling Loader for Astra theme.
 *
 * @package     astra-builder
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Customizer Initialization
 *
 * @since x.x.x
 */
class Astra_Header_Search_Component_Loader {

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'astra_main_header_bar_top', array( $this, 'header_cover_search' ) );
		add_action( 'astra_mobile_header_bar_top', array( $this, 'header_cover_search' ) );
		add_filter( 'astra_get_search', array( $this, 'get_search_markup' ), 10, 2 );
		add_action( 'astra_footer_after', array( $this, 'full_screen_search_markup' ) );
		add_action( 'customize_preview_init', array( $this, 'preview_scripts' ), 110 );
	}

	/**
	 * Enqueue Scripts
	 *
	 * @since x.x.x
	 */
	public function enqueue_scripts() {

		if ( Astra_Builder_Helper::is_component_loaded( 'header', 'search' ) ) {
			wp_enqueue_script(
				'astra-heading-search-js',
				ASTRA_HEADER_SEARCH_URI . '/assets/js/search.js',
				array(),
				ASTRA_THEME_VERSION,
				true
			);
		}
	}

	/**
	 * Header Cover Search
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function header_cover_search() {

		if ( 'header-cover' === astra_get_option( 'header-search-box-type' ) ) {
			self::get_search_form( 'header-cover', true );
		}
	}

	/**
	 * Fullscreen Search
	 *
	 * @since x.x.x
	 */
	public function full_screen_search_markup() {
		if ( 'full-screen' === astra_get_option( 'header-search-box-type' ) ) {
			self::get_search_form( 'full-screen', true );
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
		wp_enqueue_script( 'astra-heading-search-customizer-preview-js', ASTRA_HEADER_SEARCH_URI . '/assets/js/customizer-preview.js', array( 'customize-preview', 'astra-customizer-preview-js' ), ASTRA_THEME_VERSION, true );

		// Localize variables for Astra Breakpoints JS.
		wp_localize_script(
			'astra-heading-search-customizer-preview-js',
			'astraBuilderPreview',
			array(
				'tablet_break_point' => astra_get_tablet_breakpoint(),
				'mobile_break_point' => astra_get_mobile_breakpoint(),
			)
		);
	}

	/**
	 * Adding Wrapper for Search Form.
	 *
	 * @since x.x.x
	 *
	 * @param string $search_markup   Search Form Content.
	 * @param string $option    Search Form Options.
	 * @return Search HTML structure created.
	 */
	public static function get_search_markup( $search_markup, $option = '' ) {

		$search_box_style = astra_get_option( 'header-search-box-type', 'slide-search' );
		$search_box_style = apply_filters( 'astra_search_style_hs', $search_box_style );
		$elements         = astra_get_option( 'header-mobile-items' );
		$search_in_popup  = false;

		if ( is_array( $elements ) && is_array( $elements['popup']['popup_content'] ) && in_array( 'search', $elements['popup']['popup_content'], true ) ) {
			$search_in_popup = true;
		}

		if ( 'search-box' == $search_box_style || $search_in_popup ) {

			$search_markup = self::get_search_form( 'search-box' );
		} elseif ( ( 'header-cover' == $search_box_style || 'full-screen' == $search_box_style ) && ! $search_in_popup ) {

			$search_markup  = self::get_search_icon( $search_box_style );
			$search_markup .= '<div class="ast-search-menu-icon ' . $search_box_style . '">';
			$search_markup .= '</div>';
		}

		if ( is_customize_preview() ) {
			Astra_Builder_UI_Controller::render_customizer_edit_button();
		}

		return $search_markup;
	}

	/**
	 * Search icon markup
	 *
	 * @since x.x.x
	 * @param  string $style Search style.
	 * @return mixed        HTML Markup.
	 */
	public static function get_search_icon( $style ) {
		return '<div class="ast-search-icon"><a class="' . esc_attr( $style ) . ' astra-search-icon" aria-label="Search icon link" href="#"></a></div>';
	}

	/**
	 * Search Form
	 *
	 * @since x.x.x
	 * @param string  $style Search Form Style.
	 * @param boolean $echo Print or return.
	 * @return mixed
	 */
	public static function get_search_form( $style = 'slide-search', $echo = false ) {
		$search_html = '';

		ob_start();

		switch ( $style ) {
			case 'header-cover':
				self::get_header_cover();
				break;

			case 'full-screen':
				self::get_full_screen();
				break;

			case 'search-box':
				self::get_search_box();
				break;
		}

		$search_html = ob_get_clean();

		if ( $echo ) {
			echo $search_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			return $search_html;
		}
	}

	/**
	 * Search Form - Header Cover
	 *
	 * @since x.x.x
	 * @return mixed
	 */
	public static function get_header_cover() {

		?>
		<div class="ast-search-box header-cover" id="ast-search-form">
			<div class="ast-search-wrapper">
				<div class="ast-container">
					<form class="search-form" action="<?php echo esc_url( home_url() ); ?>/" method="get">
						<span class="search-text-wrap">
							<label for="s" class="screen-reader-text"><?php echo esc_html( astra_default_strings( 'string-header-cover-search-placeholder', false ) ); ?></label>
							<input name="s" class="search-field" type="text" autocomplete="off" value="" placeholder="<?php echo esc_attr( astra_default_strings( 'string-header-cover-search-placeholder', false ) ); ?>">
						</span>
						<span id="close" class="close"></span>
					</form>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Search Form - Header Cover
	 *
	 * @since x.x.x
	 * @return mixed
	 */
	public static function get_search_box() {

		?>
		<div class="ast-search-menu-icon ast-inline-search">
			<?php astra_get_search_form(); ?>
		</div>
		<?php
	}

	/**
	 * Search Form - Header Cover
	 *
	 * @since x.x.x
	 * @return mixed
	 */
	public static function get_full_screen() {

		?>
		<div class="ast-search-box full-screen" id="ast-seach-full-screen-form">
			<span id="close" class="close"></span>
			<div class="ast-search-wrapper">
				<div class="ast-container">
					<h3 class="large-search-text"><?php echo esc_html( astra_default_strings( 'string-full-width-search-message', false ) ); ?></h3>
					<form class="search-form" action="<?php echo esc_url( home_url() ); ?>/" method="get">
						<fieldset>
							<span class="text">
								<label for="s" class="screen-reader-text"><?php echo esc_html( astra_default_strings( 'string-full-width-search-placeholder', false ) ); ?></label>
								<input name="s" class="search-field" autocomplete="off" type="text" value="" placeholder="<?php echo esc_attr( astra_default_strings( 'string-full-width-search-placeholder', false ) ); ?>">
							</span>
							<button class="button search-submit"><i class="astra-search-icon"></i></button>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
		<?php
	}
}

/**
*  Kicking this off by creating the object of the class.
*/
new Astra_Header_Search_Component_Loader();
