<?php
/**
 * [Header] options for astra theme.
 *
 * @package     Astra Header Footer Builder
 * @author      Brainstorm Force
 * @copyright   Copyright (c) 2020, Brainstorm Force
 * @link        https://www.brainstormforce.com
 * @since       x.x.x
 */

// Block direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( class_exists( 'Astra_Customizer_Config_Base' ) ) {

	/**
	 * Register below header Configurations.
	 */
	class Astra_Header_Button_Component_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register HTML 1 control for Header/Footer Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since x.x.x
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$html_config = array();
			for ( $index = 1; $index <= Astra_Constants::$num_of_header_button; $index++ ) {

				$_section = 'section-hb-button-' . $index;
				$_prefix  = 'button' . $index;

				/**
				 * These options are related to Header Section - Button.
				 * Prefix hs represents - Header Section.
				 */
				$_configs = array(

					/*
					 * Header Builder section - Button Component Configs.
					 */
					array(
						'name'     => $_section,
						'type'     => 'section',
						'priority' => 50,
						/* translators: %s Index */
						'title'    => sprintf( __( 'Button %s', 'astra-builder' ), $index ),
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
					* Option: Button Text
					*/
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-text' ),
						'type'      => 'control',
						'control'   => 'text',
						'section'   => $_section,
						'priority'  => 20,
						'title'     => __( 'Text', 'astra-builder' ),
						'transport' => 'postMessage',
						'partial'   => array(
							'selector'            => '.ast-header-button-' . $index,
							'container_inclusive' => false,
							'render_callback'     => array( 'Astra_Builder_Header', 'button_' . $index ),
						),
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),

					/**
					* Option: Button Link
					*/
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-link-option]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-link-option' ),
						'type'      => 'control',
						'control'   => 'ast-link',
						'section'   => $_section,
						'priority'  => 30,
						'title'     => __( 'Link', 'astra-builder' ),
						'transport' => 'postMessage',
						'partial'   => array(
							'selector'            => '.ast-header-button-' . $index,
							'container_inclusive' => false,
							'render_callback'     => array( 'Astra_Builder_Header', 'button_' . $index ),
						),
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),

					/**
					 * Group: Primary Header Button Colors Group
					 */
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-color-group]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-color-group' ),
						'type'      => 'control',
						'control'   => 'ast-settings-group',
						'title'     => __( 'Colors', 'astra-builder' ),
						'section'   => $_section,
						'transport' => 'postMessage',
						'priority'  => 70,
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'design',
							),
						),
					),

					/**
					* Option: Button Text Color
					*/
					array(
						'name'       => 'header-' . $_prefix . '-text-color',
						'transport'  => 'postMessage',
						'default'    => astra_get_option( 'header-' . $_prefix . '-text-color' ),
						'type'       => 'sub-control',
						'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-color-group]',
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
						'title'      => __( 'Text Color', 'astra-builder' ),
					),

					/**
					* Option: Button Text Hover Color
					*/
					array(
						'name'       => 'header-' . $_prefix . '-text-h-color',
						'default'    => astra_get_option( 'header-' . $_prefix . '-text-h-color' ),
						'transport'  => 'postMessage',
						'type'       => 'sub-control',
						'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-color-group]',
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
						'title'      => __( 'Text Color', 'astra-builder' ),
					),

					/**
					* Option: Button Background Color
					*/
					array(
						'name'       => 'header-' . $_prefix . '-back-color',
						'default'    => astra_get_option( 'header-' . $_prefix . '-back-color' ),
						'transport'  => 'postMessage',
						'type'       => 'sub-control',
						'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-color-group]',
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
					* Option: Button Button Hover Color
					*/
					array(
						'name'       => 'header-' . $_prefix . '-back-h-color',
						'default'    => astra_get_option( 'header-' . $_prefix . '-back-h-color' ),
						'transport'  => 'postMessage',
						'type'       => 'sub-control',
						'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-color-group]',
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

					/**
					 * Group: Primary Header Button Border Group
					 */
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-border-group]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-border-group' ),
						'type'      => 'control',
						'control'   => 'ast-settings-group',
						'title'     => __( 'Border', 'astra-builder' ),
						'section'   => $_section,
						'transport' => 'postMessage',
						'priority'  => 80,
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'design',
							),
						),
					),

					/**
					* Option: Button Border Size
					*/
					array(
						'name'           => 'header-' . $_prefix . '-border-size',
						'default'        => astra_get_option( 'header-' . $_prefix . '-border-size' ),
						'parent'         => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-border-group]',
						'type'           => 'sub-control',
						'section'        => $_section,
						'control'        => 'ast-border',
						'transport'      => 'postMessage',
						'linked_choices' => true,
						'priority'       => 10,
						'title'          => __( 'Width', 'astra-builder' ),
						'context'        => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'choices'        => array(
							'top'    => __( 'Top', 'astra-builder' ),
							'right'  => __( 'Right', 'astra-builder' ),
							'bottom' => __( 'Bottom', 'astra-builder' ),
							'left'   => __( 'Left', 'astra-builder' ),
						),
					),

					/**
					* Option: Button Border Color
					*/
					array(
						'name'       => 'header-' . $_prefix . '-border-color',
						'default'    => astra_get_option( 'header-' . $_prefix . '-border-color' ),
						'transport'  => 'postMessage',
						'type'       => 'sub-control',
						'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-border-group]',
						'section'    => $_section,
						'control'    => 'ast-responsive-color',
						'responsive' => true,
						'rgba'       => true,
						'priority'   => 12,
						'context'    => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'title'      => __( 'Color', 'astra-builder' ),
					),

					/**
					* Option: Button Border Hover Color
					*/
					array(
						'name'       => 'header-' . $_prefix . '-border-h-color',
						'default'    => astra_get_option( 'header-' . $_prefix . '-border-h-color' ),
						'transport'  => 'postMessage',
						'type'       => 'sub-control',
						'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-border-group]',
						'section'    => $_section,
						'control'    => 'ast-responsive-color',
						'responsive' => true,
						'rgba'       => true,
						'priority'   => 14,
						'context'    => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'title'      => __( 'Hover Color', 'astra-builder' ),
					),

					/**
					* Option: Button Border Radius
					*/
					array(
						'name'        => 'header-' . $_prefix . '-border-radius',
						'default'     => astra_get_option( 'header-' . $_prefix . '-border-radius' ),
						'type'        => 'sub-control',
						'parent'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-border-group]',
						'section'     => $_section,
						'control'     => 'ast-slider',
						'transport'   => 'postMessage',
						'priority'    => 16,
						'context'     => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'title'       => __( 'Border Radius', 'astra-builder' ),
						'input_attrs' => array(
							'min'  => 0,
							'step' => 1,
							'max'  => 100,
						),
					),

					/**
					 * Option: Primary Header Button Typography
					 */
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-text-typography' ),
						'type'      => 'control',
						'control'   => 'ast-settings-group',
						'title'     => __( 'Typography', 'astra-builder' ),
						'section'   => $_section,
						'transport' => 'postMessage',
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'design',
							),
						),
						'priority'  => 90,
					),

					/**
					 * Option: Primary Header Button Font Family
					 */
					array(
						'name'      => 'header-' . $_prefix . '-font-family',
						'default'   => astra_get_option( 'header-' . $_prefix . '-font-family' ),
						'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'type'      => 'sub-control',
						'section'   => $_section,
						'control'   => 'ast-font',
						'font_type' => 'ast-font-family',
						'title'     => __( 'Family', 'astra-builder' ),
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'connect'   => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-font-weight]',
						'priority'  => 1,
					),

					/**
					 * Option: Primary Header Button Font Size
					 */
					array(
						'name'        => 'header-' . $_prefix . '-font-size',
						'default'     => astra_get_option( 'header-' . $_prefix . '-font-size' ),
						'parent'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'transport'   => 'postMessage',
						'title'       => __( 'Size', 'astra-builder' ),
						'type'        => 'sub-control',
						'section'     => $_section,
						'control'     => 'ast-responsive',
						'input_attrs' => array(
							'min' => 0,
						),
						'context'     => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'units'       => array(
							'px' => 'px',
							'em' => 'em',
						),
					),

					/**
					 * Option: Primary Header Button Font Weight
					 */
					array(
						'name'              => 'header-' . $_prefix . '-font-weight',
						'default'           => astra_get_option( 'header-' . $_prefix . '-font-weight' ),
						'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'type'              => 'sub-control',
						'section'           => $_section,
						'control'           => 'ast-font',
						'font_type'         => 'ast-font-weight',
						'title'             => __( 'Weight', 'astra-builder' ),
						'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_font_weight' ),
						'connect'           => 'header-' . $_prefix . '-font-family',
						'priority'          => 2,
						'context'           => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),

					/**
					 * Option: Primary Header Button Text Transform
					 */
					array(
						'name'      => 'header-' . $_prefix . '-text-transform',
						'default'   => astra_get_option( 'header-' . $_prefix . '-text-transform' ),
						'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'transport' => 'postMessage',
						'title'     => __( 'Text Transform', 'astra-builder' ),
						'type'      => 'sub-control',
						'section'   => $_section,
						'control'   => 'ast-select',
						'priority'  => 3,
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'choices'   => array(
							''           => __( 'Inherit', 'astra-builder' ),
							'none'       => __( 'None', 'astra-builder' ),
							'capitalize' => __( 'Capitalize', 'astra-builder' ),
							'uppercase'  => __( 'Uppercase', 'astra-builder' ),
							'lowercase'  => __( 'Lowercase', 'astra-builder' ),
						),
					),

					/**
					 * Option: Primary Header Button Line Height
					 */
					array(
						'name'              => 'header-' . $_prefix . '-line-height',
						'default'           => astra_get_option( 'header-' . $_prefix . '-line-height' ),
						'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'control'           => 'ast-slider',
						'transport'         => 'postMessage',
						'type'              => 'sub-control',
						'section'           => $_section,
						'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_number_n_blank' ),
						'title'             => __( 'Line Height', 'astra-builder' ),
						'suffix'            => '',
						'context'           => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'priority'          => 4,
						'input_attrs'       => array(
							'min'  => 1,
							'step' => 0.01,
							'max'  => 5,
						),
					),

					/**
					 * Option: Primary Header Button Letter Spacing
					 */
					array(
						'name'              => 'header-' . $_prefix . '-letter-spacing',
						'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_number_n_blank' ),
						'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'control'           => 'ast-slider',
						'transport'         => 'postMessage',
						'type'              => 'sub-control',
						'default'           => '',
						'section'           => $_section,
						'title'             => __( 'Letter Spacing', 'astra-builder' ),
						'suffix'            => '',
						'priority'          => 5,
						'context'           => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'input_attrs'       => array(
							'min'  => 1,
							'step' => 1,
							'max'  => 100,
						),
					),
				);

				$html_config[] = Astra_Builder_Base_Configuration::prepare_advanced_tab( $_section );

				$html_config[] = $_configs;
			}

			$html_config    = call_user_func_array( 'array_merge', $html_config + array( array() ) );
			$configurations = array_merge( $configurations, $html_config );

			return $configurations;
		}
	}

	new Astra_Header_Button_Component_Configs();
}
