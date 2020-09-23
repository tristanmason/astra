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
		 *  Check if migrated to new HFB.
		 *
		 * @var int
		 */
		public static $is_new_hfb_activated;

		/**
		 * Footer Row layout
		 *
		 * @var array
		 */
		public static $footer_row_layouts;

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
			self::$num_of_footer_columns = apply_filters( 'astra_footer_column_count', 6 );
			self::$footer_row_layouts    = apply_filters(
				'astra_footer_row_layout',
				array(
					'desktop'    => array(
						'6' => array(
							'6-equal' => array(
								'icon' => 'sixcol',
							),
						),
						'5' => array(
							'5-equal' => array(
								'icon' => 'fivecol',
							),
						),
						'4' => array(
							'4-equal'  => array(
								'icon' => 'fourcol',
							),
							'4-lheavy' => array(
								'icon' => 'lfourforty',
							),
							'4-rheavy' => array(
								'icon' => 'rfourforty',
							),
						),
						'3' => array(
							'3-equal'  => array(
								'icon' => 'threecol',
							),
							'3-lheavy' => array(
								'icon' => 'lefthalf',
							),
							'3-rheavy' => array(
								'icon' => 'righthalf',
							),
							'3-cheavy' => array(
								'icon' => 'centerhalf',
							),
							'3-cwide'  => array(
								'icon' => 'widecenter',
							),
						),
						'2' => array(
							'2-equal'  => array(
								'icon' => 'twocol',
							),
							'2-lheavy' => array(
								'icon' => 'twoleftgolden',
							),
							'2-rheavy' => array(
								'icon' => 'tworightgolden',
							),
						),
						'1' => array(
							'full' => array(
								'icon' => 'row',
							),
						),
					),
					'tablet'     => array(
						'6' => array(
							'6-equal' => array(
								'tooltip' => __( 'Equal Width Columns', 'astra' ),
								'icon'    => 'sixcol',
							),
							'full'    => array(
								'tooltip' => __( 'Collapse to Rows', 'astra' ),
								'icon'    => 'collapserowsix',
							),
						),
						'5' => array(
							'5-equal' => array(
								'tooltip' => __( 'Equal Width Columns', 'astra' ),
								'icon'    => 'fivecol',
							),
							'full'    => array(
								'tooltip' => __( 'Collapse to Rows', 'astra' ),
								'icon'    => 'collapserowfive',
							),
						),
						'4' => array(
							'4-equal' => array(
								'tooltip' => __( 'Equal Width Columns', 'astra' ),
								'icon'    => 'fourcol',
							),
							'2-equal' => array(
								'tooltip' => __( 'Two Column Grid', 'astra' ),
								'icon'    => 'grid',
							),
							'full'    => array(
								'tooltip' => __( 'Collapse to Rows', 'astra' ),
								'icon'    => 'collapserowfour',
							),
						),
						'3' => array(
							'3-equal'    => array(
								'tooltip' => __( 'Equal Width Columns', 'astra' ),
								'icon'    => 'threecol',
							),
							'3-lheavy'   => array(
								'tooltip' => __( 'Left Heavy 50/25/25', 'astra' ),
								'icon'    => 'lefthalf',
							),
							'3-rheavy'   => array(
								'tooltip' => __( 'Right Heavy 25/25/50', 'astra' ),
								'icon'    => 'righthalf',
							),
							'3-cheavy'   => array(
								'tooltip' => __( 'Center Heavy 25/50/25', 'astra' ),
								'icon'    => 'centerhalf',
							),
							'3-cwide'    => array(
								'tooltip' => __( 'Wide Center 20/60/20', 'astra' ),
								'icon'    => 'widecenter',
							),
							'3-firstrow' => array(
								'tooltip' => __( 'First Row, Next Columns 100 - 50/50', 'astra' ),
								'icon'    => 'firstrow',
							),
							'3-lastrow'  => array(
								'tooltip' => __( 'Last Row, Previous Columns 50/50 - 100', 'astra' ),
								'icon'    => 'lastrow',
							),
							'full'       => array(
								'tooltip' => __( 'Collapse to Rows', 'astra' ),
								'icon'    => 'collapserowthree',
							),
						),
						'2' => array(
							'2-equal'  => array(
								'tooltip' => __( 'Equal Width Columns', 'astra' ),
								'icon'    => 'twocol',
							),
							'2-lheavy' => array(
								'tooltip' => __( 'Left Heavy 66/33', 'astra' ),
								'icon'    => 'twoleftgolden',
							),
							'2-rheavy' => array(
								'tooltip' => __( 'Right Heavy 33/66', 'astra' ),
								'icon'    => 'tworightgolden',
							),
							'full'     => array(
								'tooltip' => __( 'Collapse to Rows', 'astra' ),
								'icon'    => 'collapserow',
							),
						),
						'1' => array(
							'full' => array(
								'tooltip' => __( 'Single Row', 'astra' ),
								'icon'    => 'row',
							),
						),
					),
					'mobile'     => array(
						'6' => array(
							'6-equal' => array(
								'tooltip' => __( 'Equal Width Columns', 'astra' ),
								'icon'    => 'sixcol',
							),
							'full'    => array(
								'tooltip' => __( 'Collapse to Rows', 'astra' ),
								'icon'    => 'collapserowsix',
							),
						),
						'5' => array(
							'5-equal' => array(
								'tooltip' => __( 'Equal Width Columns', 'astra' ),
								'icon'    => 'fivecol',
							),
							'full'    => array(
								'tooltip' => __( 'Collapse to Rows', 'astra' ),
								'icon'    => 'collapserowfive',
							),
						),
						'4' => array(
							'4-equal' => array(
								'icon' => 'fourcol',
							),
							'2-equal' => array(
								'icon' => 'grid',
							),
							'full'    => array(
								'icon' => 'collapserowfour',
							),
						),
						'3' => array(
							'3-equal'    => array(
								'icon' => 'threecol',
							),
							'3-lheavy'   => array(
								'icon' => 'lefthalf',
							),
							'3-rheavy'   => array(
								'icon' => 'righthalf',
							),
							'3-cheavy'   => array(
								'icon' => 'centerhalf',
							),
							'3-cwide'    => array(
								'icon' => 'widecenter',
							),
							'3-firstrow' => array(
								'icon' => 'firstrow',
							),
							'3-lastrow'  => array(
								'icon' => 'lastrow',
							),
							'full'       => array(
								'icon' => 'collapserowthree',
							),
						),
						'2' => array(
							'2-equal'  => array(
								'icon' => 'twocol',
							),
							'2-lheavy' => array(
								'icon' => 'twoleftgolden',
							),
							'2-rheavy' => array(
								'icon' => 'tworightgolden',
							),
							'full'     => array(
								'icon' => 'collapserow',
							),
						),
						'1' => array(
							'full' => array(
								'icon' => 'row',
							),
						),
					),
					'responsive' => true,
				) 
			);


			self::$is_new_hfb_activated = self::is_header_footer_builder();

		}


		/**
		 * For existing users, do not load the wide/full width image CSS by default.
		 *
		 * @since x.x.x
		 * @return boolean false if it is an existing user , true if not.
		 */
		public static function is_header_footer_builder() {
			$astra_settings                             = get_option( ASTRA_THEME_SETTINGS );
			$astra_settings['is-header-footer-builder'] = isset( $astra_settings['is-header-footer-builder'] ) ? $astra_settings['is-header-footer-builder'] : true;
			return apply_filters( 'astra_is_header_footer_builder', $astra_settings['is-header-footer-builder'] );
		}

	}
	/**
	*  Prepare if class 'Astra_Builder_Loader' exist.
	*  Kicking this off by calling 'get_instance()' method
	*/
	Astra_Constants::get_instance();
endif;
