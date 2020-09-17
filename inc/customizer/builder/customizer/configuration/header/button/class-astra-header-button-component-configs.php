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
						'title'    => ( 1 === Astra_Constants::$num_of_header_button ) ? __( 'Button', 'astra' ) : sprintf( __( 'Button %s', 'astra' ), $index ),
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
						'title'     => __( 'Text', 'astra' ),
						'transport' => 'postMessage',
						'partial'   => array(
							'selector'            => '.ast-header-button-' . $index,
							'container_inclusive' => false,
							'render_callback'     => array( 'Astra_Builder_Header', 'button_' . $index ),
						),
						'context'   => Astra_Constants::$general_tab,
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
						'title'     => __( 'Link', 'astra' ),
						'transport' => 'postMessage',
						'partial'   => array(
							'selector'            => '.ast-header-button-' . $index,
							'container_inclusive' => false,
							'render_callback'     => array( 'Astra_Builder_Header', 'button_' . $index ),
						),
						'context'   => Astra_Constants::$general_tab,
					),

					/**
					 * Group: Primary Header Button Colors Group
					 */
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-color-group]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-color-group' ),
						'type'      => 'control',
						'control'   => 'ast-settings-group',
						'title'     => __( 'Colors', 'astra' ),
						'section'   => $_section,
						'transport' => 'postMessage',
						'priority'  => 70,
						'context'   => Astra_Constants::$design_tab,
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
						'tab'        => __( 'Normal', 'astra' ),
						'control'    => 'ast-responsive-color',
						'responsive' => true,
						'rgba'       => true,
						'priority'   => 10,
						'context'    => Astra_Constants::$design_tab,
						'title'      => __( 'Text Color', 'astra' ),
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
						'tab'        => __( 'Hover', 'astra' ),
						'control'    => 'ast-responsive-color',
						'responsive' => true,
						'rgba'       => true,
						'priority'   => 10,
						'context'    => Astra_Constants::$design_tab,
						'title'      => __( 'Text Color', 'astra' ),
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
						'tab'        => __( 'Normal', 'astra' ),
						'control'    => 'ast-responsive-color',
						'responsive' => true,
						'rgba'       => true,
						'priority'   => 10,
						'context'    => Astra_Constants::$design_tab,
						'title'      => __( 'Background Color', 'astra' ),
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
						'tab'        => __( 'Hover', 'astra' ),
						'control'    => 'ast-responsive-color',
						'responsive' => true,
						'rgba'       => true,
						'priority'   => 10,
						'context'    => Astra_Constants::$design_tab,
						'title'      => __( 'Background Color', 'astra' ),
					),

					/**
					 * Group: Primary Header Button Border Group
					 */
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-border-group]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-border-group' ),
						'type'      => 'control',
						'control'   => 'ast-settings-group',
						'title'     => __( 'Border', 'astra' ),
						'section'   => $_section,
						'transport' => 'postMessage',
						'priority'  => 80,
						'context'   => Astra_Constants::$design_tab,
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
						'title'          => __( 'Width', 'astra' ),
						'context'        => Astra_Constants::$general_tab,
						'choices'        => array(
							'top'    => __( 'Top', 'astra' ),
							'right'  => __( 'Right', 'astra' ),
							'bottom' => __( 'Bottom', 'astra' ),
							'left'   => __( 'Left', 'astra' ),
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
						'context'    => Astra_Constants::$general_tab,
						'title'      => __( 'Color', 'astra' ),
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
						'context'    => Astra_Constants::$general_tab,
						'title'      => __( 'Hover Color', 'astra' ),
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
						'context'     => Astra_Constants::$general_tab,
						'title'       => __( 'Border Radius', 'astra' ),
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
						'title'     => __( 'Typography', 'astra' ),
						'section'   => $_section,
						'transport' => 'postMessage',
						'context'   => Astra_Constants::$design_tab,
						'priority'  => 90,
					),

					/**
					 * Option: Primary Header Button Font Size
					 */
					array(
						'name'        => 'header-' . $_prefix . '-font-size',
						'default'     => astra_get_option( 'header-' . $_prefix . '-font-size' ),
						'parent'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-text-typography]',
						'transport'   => 'postMessage',
						'title'       => __( 'Size', 'astra' ),
						'type'        => 'sub-control',
						'section'     => $_section,
						'control'     => 'ast-responsive',
						'input_attrs' => array(
							'min' => 0,
						),
						'context'     => Astra_Constants::$general_tab,
						'units'       => array(
							'px' => 'px',
							'em' => 'em',
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
