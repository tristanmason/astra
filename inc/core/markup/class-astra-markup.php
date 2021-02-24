<?php
/**
 * Astra Generate Markup Class.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       Astra 3.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'Astra_Markups' ) ) :

	/**
	 * Class Astra_Attr
	 */
	class Astra_Markup {

		/**
		 * Initialuze the Class.
		 *
		 * @since x.x.x
		 */
		public function __construct() {

			if ( ! Astra_Builder_Helper::apply_flex_based_css() ) {
				// Add filters here.
				add_filter( 'astra_markup_comment-count-wrapper_open', array( $this, 'comment_count_wrapper_open' ) );
				add_filter( 'astra_markup_comment-count-wrapper_close', array( $this, 'comment_count_wrapper_close' ) );
				add_filter( 'astra_markup_ast-comment-data-wrap_open', array( $this, 'ast_comment_data_wrap_open' ) );
				add_filter( 'astra_markup_ast-comment-data-wrap_close', array( $this, 'ast_comment_data_wrap_close' ) );
				add_filter( 'astra_markup_ast-comment-meta-wrap_open', array( $this, 'ast_comment_meta_wrap_open' ) );
				add_filter( 'astra_markup_ast-comment-meta-wrap_close', array( $this, 'ast_comment_meta_wrap_close' ) );                                
				add_filter( 'astra_attr_ast-comment-time_output', array( $this, 'ast_comment_time_attr' ) );
				add_filter( 'astra_attr_ast-comment-cite-wrap_output', array( $this, 'ast_comment_cite_wrap_attr' ) );
			}
			
		}

		/** 
		 * Comment count wrapper opening div.
		 *
		 * @param array $args markup arguments.
		 * @since x.x.x
		 * @return array.
		 */
		public function comment_count_wrapper_open( $args ) {
			$args['open']  = '<div %s>';
			$args['attrs'] = array( 'class' => 'comments-count-wrapper' );           
			return $args;
		}

		/** 
		 * Comment count wrapper closing div.
		 *
		 * @param array $args markup arguments.
		 * @since x.x.x
		 * @return array.
		 */
		public function comment_count_wrapper_close( $args ) {
			$args['close'] = '</div>';
			return $args;
		}

		/** 
		 * Comment data wrapper opening div.
		 *
		 * @param array $args markup arguments.
		 * @since x.x.x
		 * @return array.
		 */
		public function ast_comment_data_wrap_open( $args ) {
			$args['open']  = '<div %s>';
			$args['attrs'] = array( 'class' => 'ast-comment-data-wrap' );           
			return $args;
		}

		/** 
		 * Comment data wrapper closing div.
		 *
		 * @param array $args markup arguments.
		 * @since x.x.x
		 * @return array.
		 */
		public function ast_comment_data_wrap_close( $args ) {
			$args['close'] = '</div>';
			return $args;
		}

		/** 
		 * Comment meta wrapper opening div.
		 *
		 * @param array $args markup arguments.
		 * @since x.x.x
		 * @return array.
		 */
		public function ast_comment_meta_wrap_open( $args ) {
			$args['open']  = '<div %s>';
			$args['attrs'] = array( 'class' => 'ast-comment-meta-wrap' );           
			return $args;
		}

		/** 
		 * Comment meta wrapper closing div.
		 *
		 * @param array $args markup arguments.
		 * @since x.x.x
		 * @return array.
		 */
		public function ast_comment_meta_wrap_close( $args ) {
			$args['close'] = '</div>';
			return $args;
		}

		/** 
		 * Comment time div attributes.
		 *
		 * @since x.x.x
		 * @return string.
		 */
		public function ast_comment_time_attr() {
			return 'class = "ast-comment-time ast-col-lg-12" ';
		}

		/** 
		 * Comment cite wrapper div attributes.
		 *
		 * @since x.x.x
		 * @return string.
		 */
		public function ast_comment_cite_wrap_attr() {
			return 'class = "ast-comment-cite-wrap ast-col-lg-12" ';
		}
	}

endif;

/**
 * Kicking this off by calling 'get_instance()' method
 */
new Astra_Markup();
