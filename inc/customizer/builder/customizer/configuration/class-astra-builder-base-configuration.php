<?php
/**
 * Astra Builder Base Configuration.
 *
 * @package astra-builder
 */

if ( ! class_exists( 'Astra_Builder_Base_Configuration' ) ) {

	/**
	 * Class Astra_Builder_Base_Configuration.
	 */
	final class Astra_Builder_Base_Configuration {

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

		}

		/**
		 * Prepare Advance header configuration.
		 *
		 * @param string $section_id section id.
		 * @return array
		 */
		public static function prepare_advanced_tab( $section_id ) {

			return array(

				/**
				 * Option: Blog Color Section heading
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[' . $section_id . '-margin-padding-heading]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $section_id,
					'title'    => __( 'Margin & Padding', 'astra-builder' ),
					'priority' => 200,
					'settings' => array(),
					'context'  => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),

				/**
				 * Option: Padded Layout Custom Width
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[' . $section_id . '-padding]',
					'default'        => '',
					'type'           => 'control',
					'transport'      => 'postMessage',
					'control'        => 'ast-responsive-spacing',
					'section'        => $section_id,
					'priority'       => 210,
					'title'          => __( 'Padding', 'astra-builder' ),
					'linked_choices' => true,
					'unit_choices'   => array( 'px', 'em', '%' ),
					'choices'        => array(
						'top'    => __( 'Top', 'astra-builder' ),
						'right'  => __( 'Right', 'astra-builder' ),
						'bottom' => __( 'Bottom', 'astra-builder' ),
						'left'   => __( 'Left', 'astra-builder' ),
					),
					'context'        => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),

				/**
				 * Option: Padded Layout Custom Width
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[' . $section_id . '-margin]',
					'default'        => '',
					'type'           => 'control',
					'transport'      => 'postMessage',
					'control'        => 'ast-responsive-spacing',
					'section'        => $section_id,
					'priority'       => 220,
					'title'          => __( 'Margin', 'astra-builder' ),
					'linked_choices' => true,
					'unit_choices'   => array( 'px', 'em', '%' ),
					'choices'        => array(
						'top'    => __( 'Top', 'astra-builder' ),
						'right'  => __( 'Right', 'astra-builder' ),
						'bottom' => __( 'Bottom', 'astra-builder' ),
						'left'   => __( 'Left', 'astra-builder' ),
					),
					'context'        => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),
			);
		}

		/**
		 * Prepare Advance Typography configuration.
		 *
		 * @param string $section_id section id.
		 * @param array  $required_condition Required Condition.
		 * @return array
		 */
		public static function prepare_typography_options( $section_id, $required_condition = array() ) {

			$parent = ASTRA_THEME_SETTINGS . '[' . $section_id . '-typography]';
			return array(

				array(
					'name'      => $parent,
					'default'   => astra_get_option( $section_id . '-typography' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Typography', 'astra-builder' ),
					'section'   => $section_id,
					'transport' => 'postMessage',
					'required'  => $required_condition,
					'priority'  => 16,
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),
				/**
				 * Option: Font Size
				 */
				array(
					'name'        => 'font-size-' . $section_id,
					'type'        => 'sub-control',
					'parent'      => $parent,
					'section'     => $section_id,
					'control'     => 'ast-responsive',
					'default'     => astra_get_option( 'font-size-' . $section_id ),
					'transport'   => 'postMessage',
					'priority'    => 15,
					'title'       => __( 'Size', 'astra-builder' ),
					'input_attrs' => array(
						'min' => 0,
					),
					'units'       => array(
						'px' => 'px',
						'em' => 'em',
					),
				),

				/**
				 * Option: Font Weight
				 */
				array(
					'name'      => 'font-weight-' . $section_id,
					'control'   => 'ast-font',
					'parent'    => $parent,
					'section'   => $section_id,
					'font_type' => 'ast-font-weight',
					'type'      => 'sub-control',
					'default'   => astra_get_option( 'font-weight-' . $section_id ),
					'title'     => __( 'Weight', 'astra-builder' ),
					'priority'  => 14,
					'connect'   => 'font-family-' . $section_id,
				),

				/**
				 * Option: Font Family
				 */
				array(
					'name'      => 'font-family-' . $section_id,
					'type'      => 'sub-control',
					'parent'    => $parent,
					'section'   => $section_id,
					'control'   => 'ast-font',
					'font_type' => 'ast-font-family',
					'default'   => astra_get_option( 'font-family-' . $section_id ),
					'title'     => __( 'Family', 'astra-builder' ),
					'priority'  => 13,
					'connect'   => 'font-weight-' . $section_id,
				),

				/**
				 * Option: Line Height.
				 */
				array(
					'name'              => 'line-height-' . $section_id,
					'type'              => 'sub-control',
					'parent'            => $parent,
					'section'           => $section_id,
					'default'           => astra_get_option( 'line-height-' . $section_id ),
					'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_number_n_blank' ),
					'title'             => __( 'Line Height', 'astra-builder' ),
					'transport'         => 'postMessage',
					'control'           => 'ast-slider',
					'priority'          => 16,
					'suffix'            => '',
					'input_attrs'       => array(
						'min'  => 1,
						'step' => 0.01,
						'max'  => 5,
					),
				),

				/**
				 * Option: Text Transform
				 */
				array(
					'name'      => 'text-transform-' . $section_id,
					'type'      => 'sub-control',
					'parent'    => $parent,
					'section'   => $section_id,
					'title'     => __( 'Text Transform', 'astra-builder' ),
					'transport' => 'postMessage',
					'default'   => astra_get_option( 'text-transform-' . $section_id ),
					'control'   => 'ast-select',
					'priority'  => 17,
					'choices'   => array(
						''           => __( 'Inherit', 'astra-builder' ),
						'none'       => __( 'None', 'astra-builder' ),
						'capitalize' => __( 'Capitalize', 'astra-builder' ),
						'uppercase'  => __( 'Uppercase', 'astra-builder' ),
						'lowercase'  => __( 'Lowercase', 'astra-builder' ),
					),
				),

			);
		}
	}

	/**
	 *  Prepare if class 'Astra_Builder_Base_Configuration' exist.
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Astra_Builder_Base_Configuration::get_instance();
}
