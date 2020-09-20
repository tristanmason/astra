<?php
/**
 * Astra Builder Loader.
 *
 * @package astra-builder
 */

if ( ! class_exists( 'Astra_Builder_Header' ) ) {

	/**
	 * Class Astra_Builder_Header.
	 */
	final class Astra_Builder_Header {

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance = null;


		/**
		 *  Initiator
		 */
		public static function get_instance() {

			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor
		 */
		public function __construct() {

			if ( Astra_Builder_Helper::is_header_footer_builder() ) {
				$this->remove_existing_actions();

				add_action( 'astra_header', array( $this, 'header_builder_markup' ) );

				add_action( 'body_class', array( $this, 'add_body_class' ) );

				// Header Desktop Builder.
				add_action( 'astra_masthead', array( $this, 'desktop_header' ) );

				add_action( 'astra_above_header', array( $this, 'above_header' ) );
				add_action( 'astra_primary_header', array( $this, 'primary_header' ) );
				add_action( 'astra_below_header', array( $this, 'below_header' ) );

				add_action( 'astra_render_header_column', array( $this, 'render_column' ), 10, 2 );

				// Mobile Builder.
				add_action( 'astra_mobile_header', array( $this, 'mobile_header' ) );

				add_action( 'astra_mobile_above_header', array( $this, 'mobile_above_header' ) );
				add_action( 'astra_mobile_primary_header', array( $this, 'mobile_primary_header' ) );
				add_action( 'astra_mobile_below_header', array( $this, 'mobile_below_header' ) );

				add_action( 'astra_render_mobile_header_column', array( $this, 'render_mobile_column' ), 10, 2 );

				// Load Off-Canvas Markup on Footer.
				add_action( 'wp_footer', array( $this, 'mobile_popup' ) );

				add_action( 'astra_mobile_header_content', array( $this, 'render_mobile_column' ), 10, 2 );

				add_action( 'astra_render_mobile_popup', array( $this, 'render_mobile_column' ), 10, 2 );

				// Core Components.
				add_action( 'astra_header_button_1', array( $this, 'button_1' ) );
				add_action( 'astra_header_button_2', array( $this, 'button_2' ) );
				add_action( 'astra_header_menu_1', array( $this, 'menu_1' ) );
				add_action( 'astra_header_menu_2', array( $this, 'menu_2' ) );
				add_action( 'astra_mobile_site_identity', array( $this, 'site_identity' ) );
				add_action( 'astra_header_search', array( $this, 'header_search' ) );
				add_action( 'astra_header_html_1', array( $this, 'header_html_1' ) );
				add_action( 'astra_header_html_2', array( $this, 'header_html_2' ) );
				add_action( 'astra_header_html_3', array( $this, 'header_html_3' ) );
				add_action( 'astra_header_html_4', array( $this, 'header_html_4' ) );
				add_action( 'astra_header_social', array( $this, 'header_social' ) );

				add_action( 'astra_header_mobile_trigger', array( $this, 'header_mobile_trigger' ) );

				add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
			}

			add_action( 'astra_site_identity', array( $this, 'site_identity' ) );
		}

		/**
		 * Inherit Header base layout.
		 */
		public function header_builder_markup() {
			do_action( 'astra_header_markup_before' );
			?>

			<header
				<?php
				echo astra_attr(
					'header',
					array(
						'id'    => 'masthead',
						'class' => join( ' ', astra_get_header_classes() ),
					)
				);
				?>
			>

				<?php astra_masthead_top(); ?>

				<?php astra_masthead(); ?>

				<?php astra_masthead_bottom(); ?>

				<?php $this->astra_render_sticky_header(); ?>

			</header><!-- #masthead -->

			<?php
			do_action( 'astra_header_markup_after' );
		}

		/**
		 * Render Astra Sticky Header Markup.
		 */
		public function astra_render_sticky_header() {

			if ( apply_filters( 'astra_fixed_header_markup_enabled', true ) ) {
				$main_stick = astra_get_option( 'header-main-stick' );

				$above_stick       = astra_get_option( 'header-above-stick' );
				$below_stick       = astra_get_option( 'header-below-stick' );
				$inherit_desk_logo = astra_get_option( 'different-sticky-logo', false );

				$sticky_header_meta         = astra_get_option_meta( 'stick-header-meta' );
				$sticky_primary_header_meta = astra_get_option_meta( 'header-main-stick-meta' );
				$sticky_above_header_meta   = astra_get_option_meta( 'header-above-stick-meta' );
				$sticky_below_header_meta   = astra_get_option_meta( 'header-below-stick-meta' );

				if ( ! (
					( '1' == $main_stick || ( 'enabled' == $sticky_header_meta && 'on' == $sticky_primary_header_meta ) ) ||
					( '1' == $above_stick || ( 'enabled' == $sticky_header_meta && 'on' == $sticky_above_header_meta ) ) ||
					( '1' == $below_stick || ( 'enabled' == $sticky_header_meta && 'on' == $sticky_below_header_meta ) )
				) ) {
					return;
				}

				$sticky_header_style   = astra_get_option( 'sticky-header-style' );
				$sticky_hide_on_scroll = astra_get_option( 'sticky-hide-on-scroll' );
				if ( 'none' == $sticky_header_style && ! $sticky_hide_on_scroll ) {
					return;
				}

				$header_logo = astra_get_option( 'sticky-header-logo' );

				if ( '1' == $inherit_desk_logo && '' != $header_logo ) {
					add_filter( 'astra_has_custom_logo', '__return_true' );
					add_filter( 'astra_disable_site_identity', '__return_true' );
					add_filter( 'astra_main_header_retina', '__return_false' );
					add_filter( 'astra_replace_logo_width', '__return_false' );
					add_filter( 'get_custom_logo', array( $this, 'sticky_custom_logo' ), 10, 2 );
				}

				?>

				<header id="ast-fixed-header" <?php astra_header_classes(); ?> style="visibility: hidden;" data-type="fixed-header">

					<?php astra_masthead_top(); ?>

					<?php astra_masthead(); ?>

					<?php astra_masthead_bottom(); ?>

				</header><!-- #astra-fixed-header -->

				<?php

				if ( '1' == $inherit_desk_logo && '' != $header_logo ) {
					remove_filter( 'astra_has_custom_logo', '__return_true' );
					remove_filter( 'astra_disable_site_identity', '__return_true' );
					remove_filter( 'astra_main_header_retina', '__return_false' );
					remove_filter( 'astra_replace_logo_width', '__return_false' );
					remove_filter( 'get_custom_logo', array( $this, 'sticky_custom_logo' ), 10 );
				}
			}

		}

		/**
		 * Remove existing Header to load Header Builder.
		 *
		 * @since x.x.x
		 * @return void
		 */
		public function remove_existing_actions() {
			remove_action( 'astra_masthead', 'astra_masthead_primary_template' );
			remove_action( 'astra_header', 'astra_header_markup' );

			if ( method_exists( 'Astra_Ext_Header_Sections_Markup', 'get_instance' ) ) {
				remove_action( 'astra_masthead', array( Astra_Ext_Header_Sections_Markup::get_instance(), 'above_header_html_markup_loader' ), 9 );
				remove_action( 'astra_masthead', array( Astra_Ext_Header_Sections_Markup::get_instance(), 'below_header_html_markup_loader' ), 11 );
			}

			if ( method_exists( 'Astra_Ext_Sticky_Header_Markup', 'get_instance' ) ) {
				remove_action( 'astra_header', array( Astra_Ext_Sticky_Header_Markup::get_instance(), 'fixed_header_markup' ), 11 );
			}

			remove_action( 'astra_masthead_content', 'astra_primary_navigation_markup', 10 );

			remove_filter( 'wp_page_menu_args', 'astra_masthead_custom_page_menu_items', 10, 2 );
			remove_filter( 'wp_nav_menu_items', 'astra_masthead_custom_nav_menu_items' );
		}

		/**
		 * Header Mobile trigger
		 */
		public function header_mobile_trigger() {

			Astra_Builder_UI_Controller::render_mobile_trigger();
		}

		/**
		 * Call to Social Icon HTML renderer.
		 */
		public function header_social() {
			Astra_Builder_UI_Controller::render_social_icon();
		}

		/**
		 * Add header styles.
		 */
		public function enqueue_styles() {

			wp_enqueue_style(
				'astra-header',
				ASTRA_THEME_URI . 'inc/assets/css/ast-builder-frontend.css',
				array(),
				ASTRA_THEME_VERSION
			);
		}

		/**
		 * Render HTML 1.
		 */
		public function header_html_1() {
			Astra_Builder_UI_Controller::render_html_markup( 'header-html-1' );
		}

		/**
		 * Render HTML 2.
		 */
		public function header_html_2() {
			Astra_Builder_UI_Controller::render_html_markup( 'header-html-2' );
		}

		/**
		 * Render HTML 3.
		 */
		public function header_html_3() {
			Astra_Builder_UI_Controller::render_html_markup( 'header-html-3' );
		}

		/**
		 * Render HTML 4.
		 */
		public function header_html_4() {
			Astra_Builder_UI_Controller::render_html_markup( 'header-html-4' );
		}

		/**
		 * Render Search icon.
		 */
		public function header_search() {
			echo astra_get_search(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		/**
		 * Render site logo.
		 */
		public function site_identity() {
			Astra_Builder_UI_Controller::render_site_identity();
		}

		/**
		 * Render Button 1.
		 */
		public function button_1() {
			Astra_Header_Button_Component::button_markup( 1 );
		}

		/**
		 * Render Button 2.
		 */
		public function button_2() {
			Astra_Header_Button_Component::button_markup( 2 );
		}

		/**
		 * Render Menu 1.
		 */
		public function menu_1() {
			Astra_Header_Menu_Component::menu_markup( 1 );
		}

		/**
		 * Render Menu 2.
		 */
		public function menu_2() {
			Astra_Header_Menu_Component::menu_markup( 2 );
		}

		/**
		 * Call component header UI.
		 *
		 * @param string $row row.
		 * @param string $column column.
		 */
		public function render_column( $row, $column ) {

			Astra_Builder_Helper::render_builder_markup( $row, $column, 'desktop', 'header' );
		}

		/**
		 * Render desktop header layout.
		 */
		public function desktop_header() {

			get_template_part( 'template-parts/header/builder/desktop-builder-layout' );

		}

		/**
		 *  Call above header UI.
		 */
		public function above_header() {


			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/header/builder/header',
					'row',
					array(
						'row' => 'above',
					)
				);
			} else {

				set_query_var( 'row', 'above' );
				get_template_part( 'template-parts/header/builder/header', 'row' );
			}



		}

		/**
		 *  Call primary header UI.
		 */
		public function primary_header() {

			$display_header = get_post_meta( get_the_ID(), 'ast-main-header-display', true );

			$display_header = apply_filters( 'ast_main_header_display', $display_header );

			if ( 'disabled' !== $display_header ) {

				if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

					get_template_part(
						'template-parts/header/builder/header',
						'row',
						array(
							'row' => 'primary',
						)
					);
				} else {

					set_query_var( 'row', 'primary' );
					get_template_part( 'template-parts/header/builder/header', 'row' );
				}
			}
		}

		/**
		 *  Call below header UI.
		 */
		public function below_header() {

			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/header/builder/header',
					'row',
					array(
						'row' => 'below',
					)
				);
			} else {

				set_query_var( 'row', 'below' );
				get_template_part( 'template-parts/header/builder/header', 'row' );
			}

		}

		/**
		 * Call mobile component header UI.
		 *
		 * @param string $row row.
		 * @param string $column column.
		 */
		public function render_mobile_column( $row, $column ) {
			Astra_Builder_Helper::render_builder_markup( $row, $column, 'mobile', 'header' );
		}

		/**
		 * Render Mobile header layout.
		 */
		public function mobile_header() {

			get_template_part( 'template-parts/header/builder/mobile-builder-layout' );

		}

		/**
		 *  Call Mobile above header UI.
		 */
		public function mobile_above_header() {

			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/header/builder/mobile-header',
					'row',
					array(
						'row' => 'above',
					)
				);
			} else {

				set_query_var( 'row', 'above' );
				get_template_part( 'template-parts/header/builder/mobile-header', 'row' );
			}

		}

		/**
		 *  Call Mobile primary header UI.
		 */
		public function mobile_primary_header() {

			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/header/builder/mobile-header',
					'row',
					array(
						'row' => 'primary',
					)
				);
			} else {

				set_query_var( 'row', 'primary' );
				get_template_part( 'template-parts/header/builder/mobile-header', 'row' );
			}

		}


		/**
		 *  Call Mobile below header UI.
		 */
		public function mobile_below_header() {

			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/header/builder/mobile-header',
					'row',
					array(
						'row' => 'below',
					)
				);
			} else {

				set_query_var( 'row', 'below' );
				get_template_part( 'template-parts/header/builder/mobile-header', 'row' );
			}

		}
		/**
		 *  Call Mobile Popup UI.
		 */
		public function mobile_popup() {

			Astra_Builder_Helper::render_mobile_popup_markup();
		}

		/**
		 * Defines all constants
		 *
		 * @since 1.0.0
		 */
		public function define_constants() {

		}

		/**
		 * Add Body Classes
		 *
		 * @param array $classes Body Class Array.
		 * @return array
		 */
		public function add_body_class( $classes ) {

			$classes[] = 'astra-hfb-header';

			return $classes;
		}

	}

	/**
	 *  Prepare if class 'Astra_Builder_Header' exist.
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Astra_Builder_Header::get_instance();
}
