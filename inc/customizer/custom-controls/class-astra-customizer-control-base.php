<?php
/**
 * Astra Theme Customizer Configuration Base.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       Astra 1.4.3
 */

// No direct access, please.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Base Class for Registering Customizer Controls.
 *
 * @since 1.4.3
 */
if ( ! class_exists( 'Astra_Customizer_Control_Base' ) ) {

	/**
	 * Customizer Sanitizes Initial setup
	 */
	class Astra_Customizer_Control_Base {

		/**
		 * Registered Controls.
		 *
		 * @since 1.4.3
		 * @var Array
		 */
		private static $controls;

		/**
		 *  Constructor
		 */
		public function __construct() {

			add_action( 'customize_controls_enqueue_scripts', array( $this, 'enqueue_scripts' ), 8 );
		}

		/**
		 * Enqueue Admin Scripts
		 *
		 * @since 1.4.3
		 */
		public function enqueue_scripts() {

			$dir_name    = ( SCRIPT_DEBUG ) ? 'unminified' : 'minified';
			$file_prefix = ( SCRIPT_DEBUG ) ? '' : '.min';
			$file_rtl    = ( is_rtl() ) ? '-rtl' : '';
			$css_uri     = ASTRA_THEME_URI . 'inc/customizer/custom-controls/assets/css/' . $dir_name . '/';
			$js_uri      = ASTRA_THEME_URI . 'inc/customizer/custom-controls/assets/js/' . $dir_name . '/';

			if ( SCRIPT_DEBUG ) {

				$control_types_data = $this->get_controls_data();

				$astra_theme_customizer_control = array(
					'ast-background',
					'ast-border',
					'ast-color',
					'ast-customizer-link',
					'ast-description',
					'ast-divider',
					'ast-heading',
					'ast-hidden',
					'ast-link',
					'ast-radio-image',
					'ast-responsive',
					'ast-responsive-color',
					'ast-responsive-background',
					'ast-responsive-slider',
					'ast-responsive-spacing',
					'ast-select',
					'ast-settings-group',
					'ast-slider',
					'ast-sortable',
					'ast-font',
				);

				if ( ! empty( $astra_theme_customizer_control ) ) {

					foreach ( $astra_theme_customizer_control as $control ) {

						if ( array_key_exists( $control, $control_types_data ) ) {

							$control_data            = $control_types_data[ $control ];
							$control_data_css        = $control_data['css'];
							$control_data_js         = $control_data['js'];
							$control_data_dependency = $control_data['dependency'];

							if ( is_array( $control_data_css ) ) {
								foreach ( $control_data_css as $control_slug ) {
									$title     = ( isset( $control_data['title'] ) ) ? $control_data['title'] : $control_data_css;
									$style_uri = ASTRA_THEME_URI . 'inc/customizer/custom-controls/' . $title . '/';
									wp_enqueue_style( $control, $style_uri . $control_slug . $file_rtl . '.css', null, ASTRA_THEME_VERSION );
								}
							} elseif ( '' !== $control_data_css ) {
								$style_uri = ASTRA_THEME_URI . 'inc/customizer/custom-controls/assets/css/' . $dir_name . '/' . $control_data_css;
								wp_enqueue_style( $control, $style_uri . $file_rtl . '.css', null, ASTRA_THEME_VERSION );
							}

							if ( is_array( $control_data_js ) ) {
								foreach ( $control_data_js as $control_slug ) {
									$title      = ( isset( $control_data['title'] ) ) ? $control_data['title'] : $control_data_js;
									$script_uri = ASTRA_THEME_URI . 'inc/customizer/custom-controls/' . $title . '/';
									wp_enqueue_script( $control, $script_uri . $control_slug . '.js', $control_data_dependency, ASTRA_THEME_VERSION, true );
								}
							} elseif ( '' !== $control_data_js ) {

								$script_uri = ASTRA_THEME_URI . 'inc/customizer/custom-controls/' . $control_data_js . '/' . $control_data_js;
								wp_enqueue_script( $control, $script_uri . '.js', $control_data_dependency, ASTRA_THEME_VERSION, true );

								if ( 'ast-background' === $control || 'ast-responsive-background' === $control || 'ast-settings-group' === $control ) {
									wp_localize_script(
										$control,
										'astraCustomizerControlBackground',
										array(
											'placeholder'  => __( 'No file selected', 'astra' ),
											'lessSettings' => __( 'Less Settings', 'astra' ),
											'moreSettings' => __( 'More Settings', 'astra' ),
										)
									);
								}
							}
						}
					}
				}
			} else {

				wp_enqueue_style( 'custom-control-style' . $file_rtl, $css_uri . 'custom-controls' . $file_prefix . $file_rtl . '.css', null, ASTRA_THEME_VERSION );
				wp_enqueue_script( 'custom-control-script', $js_uri . 'custom-controls' . $file_prefix . '.js', array( 'jquery', 'customize-base', 'astra-color-alpha', 'jquery-ui-tabs', 'jquery-ui-sortable' ), ASTRA_THEME_VERSION, true );

				wp_localize_script(
					'custom-control-script',
					'astraCustomizerControlBackground',
					array(
						'placeholder'  => __( 'No file selected', 'astra' ),
						'lessSettings' => __( 'Less Settings', 'astra' ),
						'moreSettings' => __( 'More Settings', 'astra' ),
					)
				);
			}
		}

		/**
		 * Get customizer control assets data.
		 *
		 * @since x.x.x
		 * @return string
		 */
		public function get_controls_data() {

			$control = array(
				'ast-background'            => array(
					'css'        => 'background',
					'js'         => 'background',
					'dependency' => array(),
				),
				'ast-border'                => array(
					'css'        => 'border',
					'js'         => 'border',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-color'                 => array(
					'css'        => 'color',
					'js'         => 'color',
					'dependency' => array( 'astra-color-alpha' ),
				),
				'ast-customizer-link'       => array(
					'css'        => 'customizer-link',
					'js'         => 'customizer-link',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-description'           => array(
					'css'        => 'description',
					'js'         => '',
					'dependency' => array(),
				),
				'ast-divider'               => array(
					'css'        => 'divider',
					'js'         => '',
					'dependency' => array(),
				),
				'ast-heading'               => array(
					'css'        => 'heading',
					'js'         => '',
					'dependency' => array(),
				),
				'ast-link'                  => array(
					'css'        => 'link',
					'js'         => 'link',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-radio-image'           => array(
					'css'        => 'radio-image',
					'js'         => 'radio-image',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-responsive'            => array(
					'css'        => 'responsive',
					'js'         => 'responsive',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-responsive-color'      => array(
					'css'        => 'responsive-color',
					'js'         => 'responsive-color',
					'dependency' => array( 'astra-color-alpha' ),
				),
				'ast-responsive-background' => array(
					'css'        => 'responsive-background',
					'js'         => 'responsive-background',
					'dependency' => array( 'astra-color-alpha' ),
					'type'       => 'addon',
				),
				'ast-responsive-slider'     => array(
					'css'        => 'responsive-slider',
					'js'         => 'responsive-slider',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-responsive-spacing'    => array(
					'css'        => 'responsive-spacing',
					'js'         => 'responsive-spacing',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-settings-group'        => array(
					'css'        => 'settings-group',
					'js'         => 'settings-group',
					'dependency' => array( 'jquery', 'jquery-ui-tabs', 'customize-base' ),
				),
				'ast-slider'                => array(
					'css'        => 'slider',
					'js'         => 'slider',
					'dependency' => array( 'jquery', 'customize-base' ),
				),
				'ast-sortable'              => array(
					'css'        => 'sortable',
					'js'         => 'sortable',
					'dependency' => array( 'jquery', 'customize-base', 'jquery-ui-core', 'jquery-ui-sortable' ),
				),
				'ast-font'                  => array(
					'css'        => array( 'selectWoo', 'typography' ),
					'js'         => array( 'selectWoo', 'typography' ),
					'dependency' => array( 'jquery', 'customize-base' ),
					'title'      => 'typography',
					'slug'       => array(
						'css' => array(
							'selectWoo'  => 'astra-select-woo-style',
							'typography' => 'astra-typography-style',
						),
						'js'  => array(
							'selectWoo'  => 'astra-select-woo-script',
							'typography' => 'astra-typography',
						),
					),
				),
			);

			return $control;
		}

		/**
		 * Add Control to self::$controls and Register control to WordPress Customizer.
		 *
		 * @param String $name Slug for the control.
		 * @param Array  $atts Control Attributes.
		 * @return void
		 */
		public static function add_control( $name, $atts ) {
			global $wp_customize;
			self::$controls[ $name ] = $atts;

			if ( isset( $atts['callback'] ) ) {
				/**
				 * Register controls
				 */
				$wp_customize->register_control_type( $atts['callback'] );
			}
		}

		/**
		 * Returns control instance
		 *
		 * @param  string $control_type control type.
		 * @since 1.4.3
		 * @return string
		 */
		public static function get_control_instance( $control_type ) {
			$control_class = self::get_control( $control_type );

			if ( isset( $control_class['callback'] ) ) {
				return class_exists( $control_class['callback'] ) ? $control_class['callback'] : false;
			}

			return false;
		}

		/**
		 * Returns control and its attributes
		 *
		 * @param  string $control_type control type.
		 * @since 1.4.3
		 * @return array
		 */
		public static function get_control( $control_type ) {
			if ( isset( self::$controls[ $control_type ] ) ) {
				return self::$controls[ $control_type ];
			}

			return array();
		}

		/**
		 * Returns Santize callback for control
		 *
		 * @param  string $control control.
		 * @since 1.4.3
		 * @return string
		 */
		public static function get_sanitize_call( $control ) {

			if ( isset( self::$controls[ $control ]['sanitize_callback'] ) ) {
				return self::$controls[ $control ]['sanitize_callback'];
			}

			return false;
		}
	}
}

/**
 * Kicking this off by calling 'get_instance()' method
 */
new Astra_Customizer_Control_Base();
