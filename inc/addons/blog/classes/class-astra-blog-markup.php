<?php
/**
 * Blog Pro Markup
 *
 * @since x.x.x
 * @package Astra
 */

if ( ! class_exists( 'Astra_Blog_Markup' ) ) {

	/**
	 * Blog Pro Markup Initial Setup
	 *
	 * @since x.x.x
	 */
	class Astra_Blog_Markup {

		/**
		 * Member Variable
		 *
		 * @var object instance
		 */
		private static $instance;

		/**
		 * Initiator
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 *  Constructor
		 */
		public function __construct() {

			add_filter( 'post_class', array( $this, 'astra_post_class_blog_grid' ) );
			add_filter( 'astra_primary_class', array( $this, 'astra_primary_class_blog_grid' ) );
			add_action( 'init', array( $this, 'init_action' ) );
		}

		/**
		 * Add Blog Grid Class
		 *
		 * @since x.x.x
		 * @param array $classes Body Class Array.
		 * @return array
		 */
		public function astra_primary_class_blog_grid( $classes ) {

			// Apply grid class to archive page.
			if ( ( is_home() ) || is_archive() || is_search() ) {

				$blog_grid   = astra_get_option( 'blog-grid' );
				$blog_layout = astra_get_option( 'blog-layout' );
				if ( 'blog-layout-1' == $blog_layout ) {
					$classes[] = 'ast-grid-' . esc_attr( $blog_grid );
				}
				$classes = apply_filters( 'astra_primary_class_blog_grid', $classes );
			}
			return $classes;
		}

		/**
		 * Add Post Class Blog Grid
		 *
		 * @since x.x.x
		 * @param array $classes Body Class Array.
		 * @return array
		 */
		public function astra_post_class_blog_grid( $classes ) {

			if ( is_archive() || is_home() || is_search() ) {

				global $wp_query;

				$blog_grid            = astra_get_option( 'blog-grid' );
				$blog_space_bet_posts = astra_get_option( 'blog-space-bet-posts' );
				$blog_layout          = astra_get_option( 'blog-layout' );
				
				if ( 'blog-layout-1' == $blog_layout ) {
					$classes[] = Astra_Builder_Helper::apply_flex_based_css() ? 'ast-width-md-' . ( 12 / $blog_grid ) : 'ast-col-md-' . ( 12 / $blog_grid );
				}

				if ( true === Astra_Builder_Helper::$is_header_footer_builder_active ) {
					$classes[] = 'ast-archive-post';
				}
				
				if ( $blog_space_bet_posts ) {
					$classes[] = 'ast-separate-posts';
				}
			} 

			return $classes;
		}

		/**
		 * Init action.
		 *
		 * @since x.x.x
		 * @return void
		 */
		public function init_action() {

			if ( 'excerpt' === astra_get_option( 'blog-post-content' ) ) {
				// Excerpt Filter.
				add_filter( 'excerpt_length', array( $this, 'custom_excerpt_length' ) );
				add_filter( 'astra_post_read_more', array( $this, 'read_more_text' ) );
			}
		}

		/**
		 * Excerpt count.
		 *
		 * @since x.x.x
		 * @param int $length default count of words.
		 * @return int count of words
		 */
		public function custom_excerpt_length( $length ) {

			$excerpt_length = astra_get_option( 'blog-excerpt-count' );

			if ( '' != $excerpt_length ) {
				$length = $excerpt_length;
			}

			return $length;
		}

		/**
		 * Read more text.
		 *
		 * @since x.x.x
		 * @param string $text default read more text.
		 * @return string read more text
		 */
		public function read_more_text( $text ) {

			$read_more = astra_get_option( 'blog-read-more-text' );

			if ( '' != $read_more ) {
				$text = $read_more;
			}

			return $text;
		}

	}

}

/**
 * Kicking this off by calling 'get_instance()' method
 */
Astra_Blog_Markup::get_instance();
