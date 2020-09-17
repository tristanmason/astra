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
					'title'    => __( 'Margin & Padding', 'astra' ),
					'priority' => 200,
					'settings' => array(),
					'context'  => Astra_Constants::$design_tab,
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
					'title'          => __( 'Padding', 'astra' ),
					'linked_choices' => true,
					'unit_choices'   => array( 'px', 'em', '%' ),
					'choices'        => array(
						'top'    => __( 'Top', 'astra' ),
						'right'  => __( 'Right', 'astra' ),
						'bottom' => __( 'Bottom', 'astra' ),
						'left'   => __( 'Left', 'astra' ),
					),
					'context'        => Astra_Constants::$design_tab,
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
					'title'          => __( 'Margin', 'astra' ),
					'linked_choices' => true,
					'unit_choices'   => array( 'px', 'em', '%' ),
					'choices'        => array(
						'top'    => __( 'Top', 'astra' ),
						'right'  => __( 'Right', 'astra' ),
						'bottom' => __( 'Bottom', 'astra' ),
						'left'   => __( 'Left', 'astra' ),
					),
					'context'        => Astra_Constants::$design_tab,
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
					'title'     => __( 'Typography', 'astra' ),
					'section'   => $section_id,
					'transport' => 'postMessage',
					'required'  => $required_condition,
					'priority'  => 16,
					'context'   => Astra_Constants::$design_tab,
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
					'title'       => __( 'Size', 'astra' ),
					'input_attrs' => array(
						'min' => 0,
					),
					'units'       => array(
						'px' => 'px',
						'em' => 'em',
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
