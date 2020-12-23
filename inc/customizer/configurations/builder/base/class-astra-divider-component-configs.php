<?php
/**
 * Astra Theme Customizer Configuration Builder.
 *
 * @package     astra-builder
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       x.x.x
 */

// No direct access, please.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register Builder Customizer Configurations.
 *
 * @since x.x.x
 */
class Astra_Divider_Component_Configs {

	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array  $configurations Configurations.
	 * @param string $builder_type Builder Type.
	 * @param string $section Section.
	 *
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public static function register_configuration( $configurations, $builder_type = 'header', $section = 'section-hb-divider-' ) {

		$divider_config = array();

		if ( 'footer' === $builder_type ) {
			$class_obj         = Astra_Builder_Footer::get_instance();
			$number_of_divider = Astra_Builder_Helper::$num_of_footer_divider;
		} else {
			$class_obj         = Astra_Builder_Header::get_instance();
			$number_of_divider = Astra_Builder_Helper::$num_of_header_divider;
		}

		for ( $index = 1; $index <= Astra_Builder_Helper::$component_limit; $index++ ) {

			$_section = $section . $index;
			$_prefix  = 'divider' . $index;

			/**
			 * These options are related to Header Section - divider.
			 * Prefix hs represents - Header Section.
			 */
			$_configs = array(

				/**
				 * Option: Header Builder Tabs
				 */
				array(
					'name'        => $_section . '-ast-context-tabs',
					'section'     => $_section,
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => 0,
					'description' => '',

				),

				/*
				* Header Builder section - divider Component Configs.
				*/
				array(
					'name'        => $_section,
					'type'        => 'section',
					'priority'    => 50,
					/* translators: %s Index */
					'title'       => ( 1 === $number_of_divider ) ? __( 'Divider', 'astra' ) : sprintf( __( 'Divider %s', 'astra' ), $index ),
					'panel'       => 'panel-' . $builder_type . '-builder-group',
					'clone_index' => $index,
					'clone_type'  => $builder_type . '-divider',
				),

				/**
				 * Option: Position
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-divider-' . $index . '-layout]',
					'default'   => astra_get_option( $builder_type . '-divider-' . $index . '-layout' ),
					'type'      => 'control',
					'control'   => 'select',
					'section'   => $_section,
					'priority'  => 30,
					'title'     => __( 'Layout', 'astra' ),
					'choices'   => array(
						'horizontal' => __( 'Horizontal', 'astra' ),
						'vertical'   => __( 'Vertical', 'astra' ),
					),
					'transport' => 'postMessage',
					'partial'   => array(
						'selector'        => '.ast-' . $builder_type . '-divider-' . $index,
						'render_callback' => array( $class_obj, $builder_type . '_divider_' . $index ),
					),
				),

				// Vertical divider notice.
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-divider-' . $index . '-description]',
					'type'     => 'control',
					'control'  => 'ast-description',
					'section'  => $_section,
					'priority' => 30,
					'label'    => '',
					/* translators: %1$s builder type param */
					'help'     => sprintf( __( 'If the Divider don\'t seem to be visible please check if elements are added in the current %1$s row.', 'astra' ), $builder_type ),
					'context'  => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-divider-' . $index . '-layout]',
							'operator' => '==',
							'value'    => 'vertical',
						),
					),
				),

				/**
				 * Option:  Divider Style
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-divider-' . $index . '-style]',
					'default'   => astra_get_option( $builder_type . '-divider-' . $index . '-style' ),
					'type'      => 'control',
					'control'   => 'select',
					'section'   => $_section,
					'priority'  => 30,
					'title'     => __( 'Style', 'astra' ),
					'choices'   => array(
						'solid'  => __( 'Solid', 'astra' ),
						'dashed' => __( 'Dashed', 'astra' ),
						'dotted' => __( 'Dotted', 'astra' ),
						'double' => __( 'Double', 'astra' ),
					),
					'transport' => 'postMessage',
				),

				// Section: Above Footer Border.
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-divider-' . $index . '-thickness]',
					'section'     => $_section,
					'priority'    => 40,
					'transport'   => 'postMessage',
					'default'     => astra_get_option( $builder_type . '-divider-' . $index . '-thickness' ),
					'title'       => __( 'Thickness (px)', 'astra' ),
					'type'        => 'control',
					'control'     => 'ast-responsive-slider',
					'input_attrs' => array(
						'min'  => 0,
						'step' => 1,
						'max'  => 60,
					),
					'context'     => Astra_Builder_Helper::$design_tab,
				),

				// Section: Above Footer Border.
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-divider-' . $index . '-size]',
					'section'     => $_section,
					'priority'    => 40,
					'transport'   => 'postMessage',
					'default'     => astra_get_option( $builder_type . '-divider-' . $index . '-size' ),
					'title'       => __( 'Size (%)', 'astra' ),
					'type'        => 'control',
					'control'     => 'ast-responsive-slider',
					'input_attrs' => array(
						'min'  => 0,
						'step' => 1,
						'max'  => 100,
					),
					'context'     => Astra_Builder_Helper::$design_tab,
				),

				/**
				 * Option: divider Color.
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-divider-' . $index . '-color]',
					'default'   => '',
					'type'      => 'control',
					'section'   => $_section,
					'priority'  => 8,
					'transport' => 'postMessage',
					'control'   => 'ast-color',
					'title'     => __( 'Color', 'astra' ),
					'context'   => Astra_Builder_Helper::$design_tab,
				),

				/**
				 * Option: Margin heading
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[' . $_section . '-margin-heading]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Spacing', 'astra' ),
					'priority' => 200,
					'settings' => array(),
					'context'  => Astra_Builder_Helper::$design_tab,
				),

				/**
				 * Option: Margin Space
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[' . $_section . '-margin]',
					'default'        => '',
					'type'           => 'control',
					'transport'      => 'postMessage',
					'control'        => 'ast-responsive-spacing',
					'section'        => $_section,
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
					'context'        => Astra_Builder_Helper::$design_tab,
				),

			);

			if ( 'footer' === $builder_type ) {
				$_configs[] = array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-divider-' . $index . '-alignment]',
					'default'   => astra_get_option( 'footer-divider-' . $index . '-alignment' ),
					'type'      => 'control',
					'control'   => 'ast-responsive-select',
					'section'   => $_section,
					'priority'  => 35,
					'title'     => __( 'Alignment', 'astra' ),
					'choices'   => array(
						'flex-start' => __( 'Left', 'astra' ),
						'flex-end'   => __( 'Right', 'astra' ),
						'center'     => __( 'Center', 'astra' ),
					),
					'transport' => 'postMessage',
				);
			}

			$divider_config[] = Astra_Builder_Base_Configuration::prepare_visibility_tab( $_section, $builder_type );

			$divider_config[] = $_configs;
		}

		$divider_config = call_user_func_array( 'array_merge', $divider_config + array( array() ) );
		$configurations = array_merge( $configurations, $divider_config );

		return $configurations;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Divider_Component_Configs();
