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
				$demo = 1; // to avoid phpcs empty if error, we be remove this in other PR.
				add_filter( 'astra_markup_comment_count_wrapper_open', array( $this, 'comment_count_wrapper_open' ) );
				add_filter( 'astra_markup_comment_count_wrapper_close', array( $this, 'comment_count_wrapper_close' ) );
				
			}
		}

		/** 
		 * Comment count wrapper opening div.
		 *
		 * @param array $args markup arguments.
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
		 * @return array.
		 */
		public function comment_count_wrapper_close( $args ) {
			$args['close'] = '</div>';
			return $args;
		}

	}

	

endif;

/**
 * Kicking this off by calling 'get_instance()' method
 */
new Astra_Markup();
