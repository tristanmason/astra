<?php
/**
 * Astra Constants
 *
 * @package Astra
 * @since 1.2.7
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'Astra_Constants' ) ) :

	/**
	 * Astra_Constants
	 *
	 * @since 1.2.7
	 */
	class Astra_Constants {

		/**
		 * Config context general tab.
		 *
		 * @var string[][]
		 */
		public static $general_tab = array(
			array(
				'setting' => 'ast_selected_tab',
				'value'   => 'general',
			),
		);

		/**
		 * Config context design tab.
		 *
		 * @var string[][]
		 */
		public static $design_tab = array(
			array(
				'setting' => 'ast_selected_tab',
				'value'   => 'design',
			),
		);

		/**
		 * Config Mobile device context.
		 *
		 * @var string[][]
		 */
		public static $mobile_device = array(
			array(
				'setting'  => 'ast_selected_device',
				'operator' => 'in',
				'value'    => array( 'tablet', 'mobile' ),
			),
		);

		/**
		 *  No. Of. Footer Widgets.
		 *
		 * @var int
		 */
		public static $num_of_footer_widgets;

		/**
		 *  No. Of. Footer HTML.
		 *
		 * @var int
		 */
		public static $num_of_footer_html;

		/**
		 *  No. Of. Header Widgets.
		 *
		 * @var int
		 */
		public static $num_of_header_widgets;

		/**
		 *  No. Of. Header Menu.
		 *
		 * @var int
		 */
		public static $num_of_header_menu;

		/**
		 *  No. Of. Header Buttons.
		 *
		 * @var int
		 */
		public static $num_of_header_button;

		/**
		 *  No. Of. Header HTML.
		 *
		 * @var int
		 */
		public static $num_of_header_html;

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

			self::$num_of_header_button = apply_filters( 'astra_num_of_header_button', 1 );
			self::$num_of_header_html = apply_filters( 'astra_num_of_header_html', 2 );
			self::$num_of_header_menu = apply_filters( 'num_of_header_menu', 2 );
			self::$num_of_header_widgets = apply_filters( 'astra_num_of_header_widgets', 0 );
			self::$num_of_footer_html = apply_filters( 'astra_num_of_footer_html', 2 );
			self::$num_of_footer_widgets = apply_filters( 'astra_num_of_footer_widgets', 4 );
		}
	}
	/**
	*  Prepare if class 'Astra_Builder_Loader' exist.
	*  Kicking this off by calling 'get_instance()' method
	*/
	Astra_Constants::get_instance();
endif;
