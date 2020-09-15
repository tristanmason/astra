<?php
/**
 * Astra Builder Loader.
 *
 * @package astra-builder
 */

if ( ! class_exists( 'Astra_Builder_Footer' ) ) {

	/**
	 * Class Astra_Builder_Footer.
	 */
	final class Astra_Builder_Footer {

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

			$this->remove_existing_actions();

			// Footer Builder.
			add_action( 'astra_footer', array( $this, 'footer_markup' ), 10 );

			add_action( 'astra_above_footer', array( $this, 'above_footer' ), 10 );
			add_action( 'astra_primary_footer', array( $this, 'primary_footer' ), 10 );
			add_action( 'astra_below_footer', array( $this, 'below_footer' ), 10 );

			add_action( 'astra_render_footer_column', array( $this, 'render_column' ), 10, 2 );

			// Core Components.
			add_action( 'astra_footer_copyright', array( $this, 'footer_copyright' ), 10 );
			add_action( 'astra_footer_social', array( $this, 'footer_social' ), 10 );
			add_action( 'astra_footer_html_1', array( $this, 'footer_html_1' ) );
			add_action( 'astra_footer_html_2', array( $this, 'footer_html_2' ) );

			// Navigation menu.
			add_action( 'astra_footer_menu', array( $this, 'footer_menu' ) );
		}

		/**
		 * Remove existing Footer to load Header Builder.
		 *
		 * @since x.x.x
		 * @return void
		 */
		public function remove_existing_actions() {
			remove_action( 'astra_footer_content_top', 'astra_footer_content_top' );
			remove_action( 'astra_footer_content', 'astra_advanced_footer_markup', 1 );
			remove_action( 'astra_footer_content', 'astra_footer_small_footer_template', 5 );
			remove_action( 'astra_footer_content_bottom', 'astra_footer_content_bottom' );
			remove_action( 'astra_footer', 'astra_footer_markup' );
		}

		/**
		 * Astra Footer Markup.
		 */
		public function footer_markup() {

			$display_footer = get_post_meta( get_the_ID(), 'footer-sml-layout', true );

			$display_footer = apply_filters( 'ast_footer_bar_display', $display_footer );

			if ( 'disabled' !== $display_footer ) {

				get_template_part( 'template-parts/footer/builder/desktop-builder-layout' );
			}
		}

		/**
		 *  Call above footer UI.
		 */
		public function above_footer() {

			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/footer/builder/footer',
					'row',
					array(
						'row' => 'above',
					)
				);
			} else {

				set_query_var( 'row', 'above' );
				get_template_part( 'template-parts/footer/builder/footer', 'row' );
			}

		}

		/**
		 *  Call primary footer UI.
		 */
		public function primary_footer() {

			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/footer/builder/footer',
					'row',
					array(
						'row' => 'primary',
					)
				);
			} else {

				set_query_var( 'row', 'primary' );
				get_template_part( 'template-parts/footer/builder/footer', 'row' );
			}

		}

		/**
		 *  Call below footer UI.
		 */
		public function below_footer() {

			if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

				get_template_part(
					'template-parts/footer/builder/footer',
					'row',
					array(
						'row' => 'below',
					)
				);
			} else {

				set_query_var( 'row', 'below' );
				get_template_part( 'template-parts/footer/builder/footer', 'row' );
			}

		}

		/**
		 * Call component footer UI.
		 *
		 * @param string $row row.
		 * @param string $column column.
		 */
		public function render_column( $row, $column ) {

			Astra_Builder_Helper::render_builder_markup( $row, $column, 'desktop', 'footer' );
		}

		/**
		 * Render Footer Copyright Markup!
		 */
		public function footer_copyright() {

			$content = astra_get_option( 'footer-copyright-editor' );
			if ( $content || is_customize_preview() ) {
				echo '<div class="ast-footer-copyright">';
					echo '<div class="ast-footer-html-inner">';
						$content = str_replace( '[copyright]', '&copy;', $content );
						$content = str_replace( '[current_year]', gmdate( 'Y' ), $content );
						$content = str_replace( '[site_title]', get_bloginfo( 'name' ), $content );
						$content = str_replace( '[theme_author]', 'Powered by  <a href="https://www.wpastra.com/" rel="nofollow noopener" target="_blank">Astra WordPress Theme</a>', $content );
						echo do_shortcode( wpautop( $content ) );
					echo '</div>';
				echo '</div>';
			}

		}

		/**
		 * Render Footer Social Markup!
		 */
		public function footer_social() {
			Astra_Builder_UI_Controller::render_social_icon( 'footer' );
		}

		/**
		 * Render HTML 1.
		 */
		public function footer_html_1() {
			Astra_Builder_UI_Controller::render_html_markup( 'footer-html-1' );
		}

		/**
		 * Render HTML 2.
		 */
		public function footer_html_2() {
			Astra_Builder_UI_Controller::render_html_markup( 'footer-html-2' );
		}

		/**
		 * Render Menu.
		 */
		public function footer_menu() {
			Astra_Footer_Menu_Component::menu_markup();
		}
	}

	/**
	 *  Prepare if class 'Astra_Builder_Footer' exist.
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Astra_Builder_Footer::get_instance();
}
