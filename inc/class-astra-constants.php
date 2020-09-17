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
		 *  No. Of. Footer Columns.
		 *
		 * @var int
		 */
		public static $num_of_footer_columns;

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
			self::$num_of_header_button  = apply_filters( 'astra_header_button_component_count', 1 );
			self::$num_of_header_html    = apply_filters( 'astra_header_html_component_count', 2 );
			self::$num_of_header_menu    = apply_filters( 'astra_header_menu_component_count', 2 );
			self::$num_of_header_widgets = apply_filters( 'astra_header_widget_component_count', 0 );
			self::$num_of_footer_html    = apply_filters( 'astra_footer_html_component_count', 2 );
			self::$num_of_footer_widgets = apply_filters( 'astra_footer_widget_component_count', 4 );
			self::$num_of_footer_columns = apply_filters( 'astra_footer_column_count', 4 );
		}
	}
	/**
	*  Prepare if class 'Astra_Builder_Loader' exist.
	*  Kicking this off by calling 'get_instance()' method
	*/
	Astra_Constants::get_instance();
endif;
