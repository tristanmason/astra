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

if ( ! class_exists( 'Astra_Customizer_Config_Base' ) ) {
	return;
}

/**
 * Register Builder Customizer Configurations.
 *
 * @since x.x.x
 */
class Astra_Customizer_Mobile_Trigger_Configs extends Astra_Customizer_Config_Base {


	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_section = 'section-header-mobile-trigger';

		$_configs = array(

			/*
			* Header Builder section
			*/
			array(
				'name'     => 'section-header-mobile-trigger',
				'type'     => 'section',
				'priority' => 70,
				'title'    => __( 'Trigger', 'astra-builder' ),
				'panel'    => 'panel-header-builder-group',
			),

			/**
			 * Option: Header Builder Tabs
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[' . $_section . '-tabs]',
				'section'     => $_section,
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 0,
				'description' => '',

			),

			/**
			 * Option: Header Html Editor.
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[header-trigger-icon]',
				'type'        => 'control',
				'control'     => 'ast-icon-set',
				'transport'   => 'postMessage',
				'partial'     => array(
					'selector'        => '.ast-button-wrap',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_mobile_trigger' ),
				),
				'section'     => $_section,
				'title'       => __( 'Icons', 'astra-builder' ),
				'priority'    => 10,
				'default'     => astra_get_option( 'header-trigger-icon' ),
				'input_attrs' => array(
					'layout'     => array(
						'menu'  => array(
							'icon' => 'menu',
						),
						'menu2' => array(
							'icon' => 'menu2',
						),
						'menu3' => array(
							'icon' => 'menu3',
						),
					),
					'responsive' => false,
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			/**
			 * Option: Icon Size
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[mobile-header-toggle-icon-size]',
				'default'     => astra_get_option( 'mobile-header-toggle-icon-size' ),
				'type'        => 'control',
				'control'     => 'ast-slider',
				'section'     => $_section,
				'title'       => __( 'Icon Size', 'astra-builder' ),
				'priority'    => 20,
				'suffix'      => '',
				'transport'   => 'postMessage',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 100,
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			/**
			 * Option: Mobile Menu Label
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[mobile-header-menu-label]',
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'        => '.ast-button-wrap',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_mobile_trigger' ),
				),
				'default'   => astra_get_option( 'mobile-header-menu-label' ),
				'section'   => $_section,
				'priority'  => 20,
				'title'     => __( 'Menu Label', 'astra-builder' ),
				'type'      => 'control',
				'control'   => 'text',
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			/**
			 * Option: Toggle Button Style
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-style]',
				'default'  => astra_get_option( 'mobile-header-toggle-btn-style' ),
				'section'  => $_section,
				'title'    => __( 'Toggle Button Style', 'astra-builder' ),
				'type'     => 'control',
				'control'  => 'select',
				'priority' => 30,
				'choices'  => array(
					'fill'    => __( 'Fill', 'astra-builder' ),
					'outline' => __( 'Outline', 'astra-builder' ),
					'minimal' => __( 'Minimal', 'astra-builder' ),
				),
				'context'  => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			/**
			 * Option: Toggle Button Color
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-color]',
				'default'   => astra_get_option( 'mobile-header-toggle-btn-color' ),
				'type'      => 'control',
				'control'   => 'ast-color',
				'title'     => __( 'Color', 'astra-builder' ),
				'section'   => $_section,
				'transport' => 'postMessage',
				'priority'  => 50,
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Option: Toggle Button Bg Color
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-bg-color]',
				'default'   => astra_get_option( 'mobile-header-toggle-btn-bg-color' ),
				'type'      => 'control',
				'control'   => 'ast-color',
				'title'     => __( 'Background Color', 'astra-builder' ),
				'section'   => $_section,
				'transport' => 'postMessage',
				'priority'  => 50,
				'required'  => array(
					ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-style]',
					'==',
					'fill',
				),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Option: Toggle Button Border Size
			 */
			array(
				'name'           => ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-border-size]',
				'default'        => astra_get_option( 'mobile-header-toggle-btn-border-size' ),
				'type'           => 'control',
				'section'        => $_section,
				'control'        => 'ast-border',
				'transport'      => 'postMessage',
				'linked_choices' => true,
				'priority'       => 60,
				'title'          => __( 'Border Width', 'astra-builder' ),
				'choices'        => array(
					'top'    => __( 'Top', 'astra-builder' ),
					'right'  => __( 'Right', 'astra-builder' ),
					'bottom' => __( 'Bottom', 'astra-builder' ),
					'left'   => __( 'Left', 'astra-builder' ),
				),
				'required'       => array(
					ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-style]',
					'==',
					'outline',
				),
				'context'        => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Option: Toggle Button Border Color
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[mobile-header-toggle-border-color]',
				'default'   => astra_get_option( 'mobile-header-toggle-border-color' ),
				'type'      => 'control',
				'control'   => 'ast-color',
				'title'     => __( 'Border Color', 'astra-builder' ),
				'section'   => $_section,
				'transport' => 'postMessage',
				'priority'  => 65,
				'required'  => array(
					ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-style]',
					'==',
					'outline',
				),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			/**
			 * Option: Border Radius
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[mobile-header-toggle-border-radius]',
				'default'     => astra_get_option( 'mobile-header-toggle-border-radius' ),
				'type'        => 'control',
				'control'     => 'ast-slider',
				'section'     => $_section,
				'title'       => __( 'Border Radius', 'astra-builder' ),
				'priority'    => 70,
				'suffix'      => '',
				'transport'   => 'postMessage',
				'required'    => array(
					ASTRA_THEME_SETTINGS . '[mobile-header-toggle-btn-style]',
					'!=',
					'minimal',
				),
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 100,
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			// Option Group: Trigger Typography.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[mobile-header-label-typography]',
				'default'   => astra_get_option( 'mobile-header-label-typography' ),
				'type'      => 'control',
				'control'   => 'ast-settings-group',
				'title'     => __( 'Typography', 'astra-builder' ),
				'section'   => $_section,
				'transport' => 'postMessage',
				'priority'  => 70,
				'required'  => array(
					ASTRA_THEME_SETTINGS . '[mobile-header-menu-label]',
					'!=',
					'',
				),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			// Option: Trigger Font Family.
			array(
				'name'      => 'mobile-header-label-font-family',
				'default'   => astra_get_option( 'mobile-header-label-font-family' ),
				'parent'    => ASTRA_THEME_SETTINGS . '[mobile-header-label-typography]',
				'type'      => 'sub-control',
				'section'   => $_section,
				'transport' => 'postMessage',
				'control'   => 'ast-font',
				'font_type' => 'ast-font-family',
				'title'     => __( 'Family', 'astra-builder' ),
				'priority'  => 22,
				'connect'   => 'mobile-header-label-font-weight',
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			// Option: Trigger Font Weight.
			array(
				'name'              => 'mobile-header-label-font-weight',
				'default'           => astra_get_option( 'mobile-header-label-font-weight' ),
				'parent'            => ASTRA_THEME_SETTINGS . '[mobile-header-label-typography]',
				'section'           => $_section,
				'type'              => 'sub-control',
				'control'           => 'ast-font',
				'transport'         => 'postMessage',
				'font_type'         => 'ast-font-weight',
				'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_font_weight' ),
				'title'             => __( 'Weight', 'astra-builder' ),
				'priority'          => 24,
				'connect'           => 'mobile-header-label-font-family',
				'context'           => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			// Option: Trigger Text Transform.
			array(
				'name'      => 'mobile-header-label-text-transform',
				'default'   => astra_get_option( 'mobile-header-label-text-transform' ),
				'parent'    => ASTRA_THEME_SETTINGS . '[mobile-header-label-typography]',
				'section'   => $_section,
				'type'      => 'sub-control',
				'control'   => 'ast-select',
				'transport' => 'postMessage',
				'title'     => __( 'Text Transform', 'astra-builder' ),
				'priority'  => 25,
				'choices'   => array(
					''           => __( 'Inherit', 'astra-builder' ),
					'none'       => __( 'None', 'astra-builder' ),
					'capitalize' => __( 'Capitalize', 'astra-builder' ),
					'uppercase'  => __( 'Uppercase', 'astra-builder' ),
					'lowercase'  => __( 'Lowercase', 'astra-builder' ),
				),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			// Option: Trigger Font Size.
			array(
				'name'        => 'mobile-header-label-font-size',
				'default'     => astra_get_option( 'mobile-header-label-font-size' ),
				'parent'      => ASTRA_THEME_SETTINGS . '[mobile-header-label-typography]',
				'section'     => $_section,
				'type'        => 'sub-control',
				'priority'    => 23,
				'title'       => __( 'Size', 'astra-builder' ),
				'control'     => 'ast-slider',
				'transport'   => 'postMessage',
				'input_attrs' => array(
					'min' => 0,
				),
				'units'       => array(
					'px' => 'px',
					'em' => 'em',
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			// Option: Trigger Line Height.
			array(
				'name'              => 'mobile-header-label-line-height',
				'parent'            => ASTRA_THEME_SETTINGS . '[mobile-header-label-typography]',
				'section'           => $_section,
				'type'              => 'sub-control',
				'priority'          => 26,
				'title'             => __( 'Line Height', 'astra-builder' ),
				'transport'         => 'postMessage',
				'default'           => '',
				'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_number_n_blank' ),
				'control'           => 'ast-slider',
				'suffix'            => '',
				'input_attrs'       => array(
					'min'  => 1,
					'step' => 0.01,
					'max'  => 10,
				),
				'context'           => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),
		);

		$_configs = array_merge( $_configs, Astra_Builder_Base_Configuration::prepare_margin_tab( $_section ) );

		return array_merge( $configurations, $_configs );
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Customizer_Mobile_Trigger_Configs();

