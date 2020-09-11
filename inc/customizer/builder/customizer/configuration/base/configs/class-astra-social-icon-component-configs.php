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
class Astra_Social_Icon_Component_Configs {

	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param string $builder_type Builder Type.
	 * @param string $class_name Class Name.
	 * @param Array  $configurations Configurations.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public static function register_configuration( $builder_type = 'header', $class_name = 'Astra_Builder_Header', $configurations ) {

		$_section = 'section-' . $builder_type . '-social-icons';

		$_configs = array(

			/*
			* Builder section
			*/
			array(
				'name'     => $_section,
				'type'     => 'section',
				'priority' => 90,
				'title'    => __( 'Social Icons', 'astra-builder' ),
				'panel'    => 'panel-' . $builder_type . '-builder-group',
			),

			/**
			 * Option: Builder Tabs
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[builder-' . $builder_type . '-social-icon-tabs]',
				'section'     => $_section,
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 0,
				'description' => '',
			),

			/**
			 * Option: Social Icons.
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-icons]',
				'section'   => $_section,
				'type'      => 'control',
				'control'   => 'ast-social-icons',
				'title'     => __( 'Social Icons', 'astra-builder' ),
				'transport' => 'postMessage',
				'priority'  => 1,
				'default'   => astra_get_option( $builder_type . '-social-icons' ),
				'partial'   => array(
					'selector'            => '.ast-' . $builder_type . '-social-wrap',
					'container_inclusive' => true,
					'render_callback'     => array( $class_name, $builder_type . '_social' ),
				),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			// Show label Toggle.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-label-toggle]',
				'default'   => astra_get_option( $builder_type . '-social-label-toggle' ),
				'type'      => 'control',
				'control'   => 'checkbox',
				'section'   => $_section,
				'priority'  => 2,
				'title'     => __( 'Show Label', 'astra-builder' ),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'            => '.ast-' . $builder_type . '-social-wrap',
					'container_inclusive' => true,
					'render_callback'     => array( $class_name, $builder_type . '_social' ),
				),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			/**
			 * Option: Social Icon Spacing
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-icons-icon-space]',
				'section'     => $_section,
				'priority'    => 2,
				'transport'   => 'postMessage',
				'default'     => astra_get_option( $builder_type . '-social-icons-icon-space' ),
				'title'       => __( 'Icon Spacing', 'astra-builder' ),
				'type'        => 'control',
				'control'     => 'ast-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 50,
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Option: Social Icon Background Spacing.
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-icons-icon-bg-space]',
				'section'     => $_section,
				'priority'    => 2,
				'transport'   => 'postMessage',
				'default'     => astra_get_option( $builder_type . '-social-icons-icon-bg-space' ),
				'title'       => __( 'Icon Background Spacing', 'astra-builder' ),
				'type'        => 'control',
				'control'     => 'ast-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 50,
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Option: Social Icon Size
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-icons-icon-size]',
				'section'     => $_section,
				'priority'    => 3,
				'transport'   => 'postMessage',
				'default'     => astra_get_option( $builder_type . '-social-icons-icon-size' ),
				'title'       => __( 'Icon Size', 'astra-builder' ),
				'type'        => 'control',
				'control'     => 'ast-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 50,
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Option: Social Icon Radius
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-icons-icon-radius]',
				'section'     => $_section,
				'priority'    => 4,
				'transport'   => 'postMessage',
				'default'     => astra_get_option( $builder_type . '-social-icons-icon-radius' ),
				'title'       => __( 'Icon Radius (In px)', 'astra-builder' ),
				'type'        => 'control',
				'control'     => 'ast-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 50,
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			array(
				'name'     => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Colors & Typography', 'astra-builder' ),
				'priority' => 7,
				'settings' => array(),
				'context'  => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			array(
				'name'      => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-type]',
				'default'   => astra_get_option( $builder_type . '-social-color-type' ),
				'section'   => $_section,
				'type'      => 'control',
				'control'   => 'select',
				'title'     => __( 'Color Type', 'astra-builder' ),
				'priority'  => 7,
				'choices'   => array(
					'custom'   => __( 'Custom', 'astra-builder' ),
					'official' => __( 'Official', 'astra-builder' ),
				),
				'transport' => 'postMessage',
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Group: Primary Social Colors Group
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-group]',
				'default'   => astra_get_option( $builder_type . '-social-color-group' ),
				'type'      => 'control',
				'control'   => 'ast-settings-group',
				'title'     => __( 'Colors', 'astra-builder' ),
				'section'   => $_section,
				'transport' => 'postMessage',
				'required'  => array( ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-type]', '===', 'custom' ),
				'priority'  => 7,
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			* Option: Social Text Color
			*/
			array(
				'name'       => $builder_type . '-social-icons-color',
				'transport'  => 'postMessage',
				'default'    => astra_get_option( $builder_type . '-social-icons-color' ),
				'type'       => 'sub-control',
				'parent'     => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-group]',
				'section'    => $_section,
				'tab'        => __( 'Normal', 'astra-builder' ),
				'control'    => 'ast-responsive-color',
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 10,
				'context'    => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
				'title'      => __( 'Color', 'astra-builder' ),
			),

			/**
			* Option: Social Text Hover Color
			*/
			array(
				'name'       => $builder_type . '-social-icons-h-color',
				'default'    => astra_get_option( $builder_type . '-social-icons-h-color' ),
				'transport'  => 'postMessage',
				'type'       => 'sub-control',
				'parent'     => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-group]',
				'section'    => $_section,
				'tab'        => __( 'Hover', 'astra-builder' ),
				'control'    => 'ast-responsive-color',
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 10,
				'context'    => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
				'title'      => __( 'Color', 'astra-builder' ),
			),

			/**
			* Option: Social Background Color
			*/
			array(
				'name'       => $builder_type . '-social-icons-bg-color',
				'default'    => astra_get_option( $builder_type . '-social-icons-bg-color' ),
				'transport'  => 'postMessage',
				'type'       => 'sub-control',
				'parent'     => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-group]',
				'section'    => $_section,
				'tab'        => __( 'Normal', 'astra-builder' ),
				'control'    => 'ast-responsive-color',
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 10,
				'context'    => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
				'title'      => __( 'Background Color', 'astra-builder' ),
			),

			/**
			* Option: Social Background Hover Color
			*/
			array(
				'name'       => $builder_type . '-social-icons-bg-h-color',
				'default'    => astra_get_option( $builder_type . '-social-icons-bg-h-color' ),
				'transport'  => 'postMessage',
				'type'       => 'sub-control',
				'parent'     => ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-color-group]',
				'section'    => $_section,
				'tab'        => __( 'Hover', 'astra-builder' ),
				'control'    => 'ast-responsive-color',
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 10,
				'context'    => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
				'title'      => __( 'Background Color', 'astra-builder' ),
			),

		);

		$html_config[] = Astra_Builder_Base_Configuration::prepare_advanced_tab( $_section );

		$html_config[] = Astra_Builder_Base_Configuration::prepare_typography_options( $_section, array( ASTRA_THEME_SETTINGS . '[' . $builder_type . '-social-label-toggle]', '===', true ) );

		$html_config[] = $_configs;

		$html_config = call_user_func_array( 'array_merge', $html_config + array( array() ) );

		$configurations = array_merge( $configurations, $html_config );

		return $configurations;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Social_Icon_Component_Configs();
