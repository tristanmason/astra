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

if ( class_exists( 'Astra_Customizer_Config_Base' ) ) {

	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @since x.x.x
	 */
	class Astra_Header_Menu_Component_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Builder Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since x.x.x
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$html_config           = array();
			$is_astra_addon_active = defined( 'ASTRA_EXT_VER' );

			for ( $index = 1; $index <= Astra_Builder_Loader::$num_of_header_menu; $index++ ) {

				$_section        = 'section-hb-menu-' . $index;
				$_prefix         = 'menu' . $index;
				$edit_menu_title = ( 1 === $index ) ? __( 'Primary Menu', 'astra-builder' ) : __( 'Secondary Menu', 'astra-builder' );

				$_configs = array(

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

					// Section: Primary Header.
					array(
						'name'     => $_section,
						'type'     => 'section',
						'title'    => $edit_menu_title,
						'panel'    => 'panel-header-builder-group',
						'priority' => 40,
					),

					/**
					* Option: Theme Menu create link
					*/
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-create-menu-link]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-create-menu-link' ),
						'type'      => 'control',
						'control'   => 'ast-customizer-link',
						'section'   => $_section,
						'priority'  => 30,
						'link_type' => 'section',
						'linked'    => 'menu_locations',
						'link_text' => __( 'Configure Menu from Here.', 'astra-builder' ),
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),

					/**
					 * Option: Primary Header Button Colors Divider
					 */
					array(
						'name'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-divider]',
						'type'     => 'control',
						'control'  => 'ast-heading',
						'section'  => $_section,
						'title'    => __( 'Submenu', 'astra-builder' ),
						'settings' => array(),
						'priority' => 30,
						'context'  => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),

					/**
					 * Option: Submenu Container Animation
					 */
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-container-animation]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-submenu-container-animation' ),
						'type'      => 'control',
						'control'   => 'select',
						'section'   => $_section,
						'priority'  => 30,
						'title'     => __( 'Container Animation', 'astra-builder' ),
						'choices'   => array(
							''           => __( 'Default', 'astra-builder' ),
							'slide-down' => __( 'Slide Down', 'astra-builder' ),
							'slide-up'   => __( 'Slide Up', 'astra-builder' ),
							'fade'       => __( 'Fade', 'astra-builder' ),
						),
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'transport' => 'postMessage',
						'partial'   => array(
							'selector'        => '#ast-hf-menu-' . $index,
							'render_callback' => array( Astra_Builder_Header::get_instance(), 'menu_' . $index ),
						),
					),

					// Option: Sub-Menu Border.
					array(
						'name'           => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-border]',
						'default'        => astra_get_option( 'header-' . $_prefix . '-submenu-border' ),
						'type'           => 'control',
						'control'        => 'ast-border',
						'transport'      => 'postMessage',
						'section'        => $_section,
						'linked_choices' => true,
						'priority'       => 15,
						'title'          => __( 'Container Border', 'astra-builder' ),
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

					// Option: Submenu Container Border Color.
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-b-color]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-submenu-b-color' ),
						'type'      => 'control',
						'control'   => 'ast-color',
						'transport' => 'postMessage',
						'default'   => '',
						'title'     => __( 'Border Color', 'astra-builder' ),
						'section'   => $_section,
						'priority'  => 20,
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'design',
							),
						),
					),

					// Option: Submenu Divider Checkbox.
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-item-border]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-submenu-item-border' ),
						'type'      => 'control',
						'control'   => 'checkbox',
						'section'   => $_section,
						'priority'  => 35,
						'title'     => __( 'Item Divider', 'astra-builder' ),
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
						'transport' => 'postMessage',
					),

					// Option: Submenu item Border Color.
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-item-b-color]',
						'default'   => astra_get_option( 'header-' . $_prefix . '-submenu-item-b-color' ),
						'type'      => 'control',
						'control'   => 'ast-color',
						'transport' => 'postMessage',
						'required'  => array(
							ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-item-border]',
							'==',
							true,
						),
						'title'     => __( 'Divider Color', 'astra-builder' ),
						'section'   => $_section,
						'priority'  => 40,
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),
				);

				if ( $is_astra_addon_active ) {
					/**
					 * Option: Pro Menu Configs.
					 */
					$_addon_dependent_configs = array(
						// Option: Menu Color Divider.
						array(
							'name'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors-divider]',
							'section'  => $_section,
							'type'     => 'control',
							'control'  => 'ast-heading',
							'title'    => __( 'Colors', 'astra-builder' ),
							'priority' => 80,
							'settings' => array(),
							'context'  => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option Group: Menu Color.
						array(
							'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors]',
							'type'      => 'control',
							'control'   => 'ast-settings-group',
							'title'     => __( 'Menu', 'astra-builder' ),
							'section'   => $_section,
							'transport' => 'postMessage',
							'priority'  => 90,
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option: Menu Color.
						array(
							'name'       => 'header-' . $_prefix . '-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'tab'        => __( 'Normal', 'astra-builder' ),
							'section'    => $_section,
							'title'      => __( 'Link / Text Color', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 7,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Menu Background image, color.
						array(
							'name'       => 'header-' . $_prefix . '-bg-obj-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-bg-obj-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-background',
							'section'    => $_section,
							'transport'  => 'postMessage',
							'tab'        => __( 'Normal', 'astra-builder' ),
							'data_attrs' => array( 'name' => 'header-' . $_prefix . '-bg-obj-responsive' ),
							'label'      => __( 'Background', 'astra-builder' ),
							'priority'   => 9,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Menu Hover Color.
						array(
							'name'       => 'header-' . $_prefix . '-h-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-h-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors]',
							'tab'        => __( 'Hover', 'astra-builder' ),
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'title'      => __( 'Link Color', 'astra-builder' ),
							'section'    => $_section,
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 19,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Menu Hover Background Color.
						array(
							'name'       => 'header-' . $_prefix . '-h-bg-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-h-bg-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors]',
							'type'       => 'sub-control',
							'title'      => __( 'Background Color', 'astra-builder' ),
							'section'    => $_section,
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'tab'        => __( 'Hover', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 21,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Active Menu Color.
						array(
							'name'       => 'header-' . $_prefix . '-a-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-a-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors]',
							'type'       => 'sub-control',
							'section'    => $_section,
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'tab'        => __( 'Active', 'astra-builder' ),
							'title'      => __( 'Link Color', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 31,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Active Menu Background Color.
						array(
							'name'       => 'header-' . $_prefix . '-a-bg-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-a-bg-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'section'    => $_section,
							'title'      => __( 'Background Color', 'astra-builder' ),
							'tab'        => __( 'Active', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 33,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option Group: Sub Menu Colors.
						array(
							'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-colors]',
							'type'      => 'control',
							'control'   => 'ast-settings-group',
							'title'     => __( 'Submenu', 'astra-builder' ),
							'section'   => $_section,
							'priority'  => 100,
							'transport' => 'postMessage',
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option: Submenu Color.
						array(
							'name'       => 'header-' . $_prefix . '-submenu-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-submenu-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'title'      => __( 'Link / Text Color', 'astra-builder' ),
							'section'    => $_section,
							'transport'  => 'postMessage',
							'tab'        => __( 'Normal', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 13,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Submenu Background Color.
						array(
							'name'       => 'header-' . $_prefix . '-submenu-bg-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-submenu-bg-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-colors]',
							'type'       => 'sub-control',
							'title'      => __( 'Background Color', 'astra-builder' ),
							'section'    => $_section,
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'tab'        => __( 'Normal', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 15,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Submenu Hover Color.
						array(
							'name'       => 'header-' . $_prefix . '-submenu-h-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-submenu-h-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'tab'        => __( 'Hover', 'astra-builder' ),
							'section'    => $_section,
							'transport'  => 'postMessage',
							'title'      => __( 'Link Color', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 25,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Submenu Hover Background Color.
						array(
							'name'       => 'header-' . $_prefix . '-submenu-h-bg-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-submenu-h-bg-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'section'    => $_section,
							'tab'        => __( 'Hover', 'astra-builder' ),
							'title'      => __( 'Background Color', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 27,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Active Submenu Color.
						array(
							'name'       => 'header-' . $_prefix . '-submenu-a-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-submenu-a-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'section'    => $_section,
							'tab'        => __( 'Active', 'astra-builder' ),
							'title'      => __( 'Link Color', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 37,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Active Submenu Background Color.
						array(
							'name'       => 'header-' . $_prefix . '-submenu-a-bg-color-responsive',
							'default'    => astra_get_option( 'header-' . $_prefix . '-submenu-a-bg-color-responsive' ),
							'parent'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-colors]',
							'type'       => 'sub-control',
							'control'    => 'ast-responsive-color',
							'transport'  => 'postMessage',
							'section'    => $_section,
							'tab'        => __( 'Active', 'astra-builder' ),
							'title'      => __( 'Background Color', 'astra-builder' ),
							'responsive' => true,
							'rgba'       => true,
							'priority'   => 39,
							'context'    => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option Group: Primary Mega Menu Colors.
						array(
							'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-color-group]',
							'type'      => 'control',
							'transport' => 'postMessage',
							'control'   => 'ast-settings-group',
							'title'     => __( 'Mega Menu Column Heading', 'astra-builder' ),
							'section'   => $_section,
							'priority'  => 100,
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option: Megamenu Heading Color.
						array(
							'name'      => 'header-' . $_prefix . '-header-megamenu-heading-color',
							'default'   => astra_get_option( 'header-' . $_prefix . '-header-megamenu-heading-color' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-color-group]',
							'type'      => 'sub-control',
							'control'   => 'ast-color',
							'section'   => $_section,
							'transport' => 'postMessage',
							'title'     => __( 'Color', 'astra-builder' ),
							'tab'       => __( 'Normal', 'astra-builder' ),
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Megamenu Heading Hover Color.
						array(
							'name'      => 'header-' . $_prefix . '-header-megamenu-heading-h-color',
							'default'   => astra_get_option( 'header-' . $_prefix . '-header-megamenu-heading-h-color' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-color-group]',
							'type'      => 'sub-control',
							'control'   => 'ast-color',
							'section'   => $_section,
							'transport' => 'postMessage',
							'title'     => __( 'Color', 'astra-builder' ),
							'tab'       => __( 'Hover', 'astra-builder' ),
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Typography Heading.
						array(
							'name'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-typography-styling-divider]',
							'type'     => 'control',
							'control'  => 'ast-heading',
							'section'  => $_section,
							'title'    => __( 'Typography', 'astra-builder' ),
							'priority' => 110,
							'settings' => array(),
							'context'  => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option Group: Menu Typography.
						array(
							'name'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-menu-typography]',
							'default'   => astra_get_option( 'header-' . $_prefix . '-header-menu-typography' ),
							'type'      => 'control',
							'control'   => 'ast-settings-group',
							'title'     => __( 'Menu', 'astra-builder' ),
							'section'   => $_section,
							'transport' => 'postMessage',
							'priority'  => 120,
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option: Menu Font Family.
						array(
							'name'      => 'header-' . $_prefix . '-font-family',
							'default'   => astra_get_option( 'header-' . $_prefix . '-font-family' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-menu-typography]',
							'type'      => 'sub-control',
							'section'   => $_section,
							'transport' => 'postMessage',
							'control'   => 'ast-font',
							'font_type' => 'ast-font-family',
							'title'     => __( 'Family', 'astra-builder' ),
							'priority'  => 22,
							'connect'   => 'header-' . $_prefix . '-font-weight',
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Menu Font Weight.
						array(
							'name'              => 'header-' . $_prefix . '-font-weight',
							'default'           => astra_get_option( 'header-' . $_prefix . '-font-weight' ),
							'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-menu-typography]',
							'section'           => $_section,
							'type'              => 'sub-control',
							'control'           => 'ast-font',
							'transport'         => 'postMessage',
							'font_type'         => 'ast-font-weight',
							'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_font_weight' ),
							'title'             => __( 'Weight', 'astra-builder' ),
							'priority'          => 24,
							'connect'           => 'header-' . $_prefix . '-font-family',
							'context'           => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Menu Text Transform.
						array(
							'name'      => 'header-' . $_prefix . '-text-transform',
							'default'   => astra_get_option( 'header-' . $_prefix . '-text-transform' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-menu-typography]',
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
									'value'   => 'general',
								),
							),
						),

						// Option: Menu Font Size.
						array(
							'name'        => 'header-' . $_prefix . '-font-size',
							'default'     => astra_get_option( 'header-' . $_prefix . '-font-size' ),
							'parent'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-menu-typography]',
							'section'     => $_section,
							'type'        => 'sub-control',
							'priority'    => 23,
							'title'       => __( 'Size', 'astra-builder' ),
							'control'     => 'ast-responsive',
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
									'value'   => 'general',
								),
							),
						),

						// Option: Menu Line Height.
						array(
							'name'              => 'header-' . $_prefix . '-line-height',
							'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-menu-typography]',
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
									'value'   => 'general',
								),
							),
						),

						// Option Group: Primary SubMenu Typography.
						array(
							'name'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-sub-menu-typography]',
							'type'     => 'control',
							'control'  => 'ast-settings-group',
							'title'    => __( 'Submenu', 'astra-builder' ),
							'section'  => $_section,
							'priority' => 130,
							'context'  => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option: Primary Submenu Font Family.
						array(
							'name'      => 'header-font-family-' . $_prefix . '-sub-menu',
							'default'   => astra_get_option( 'header-font-family-' . $_prefix . '-sub-menu' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-sub-menu-typography]',
							'type'      => 'sub-control',
							'section'   => $_section,
							'control'   => 'ast-font',
							'transport' => 'postMessage',
							'font_type' => 'ast-font-family',
							'title'     => __( 'Family', 'astra-builder' ),
							'priority'  => 28,
							'connect'   => 'header-font-weight-' . $_prefix . '-sub-menu',
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Primary Submenu Font Weight.
						array(
							'name'              => 'header-font-weight-' . $_prefix . '-sub-menu',
							'default'           => astra_get_option( 'header-font-weight-' . $_prefix . '-sub-menu' ),
							'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-sub-menu-typography]',
							'type'              => 'sub-control',
							'section'           => $_section,
							'control'           => 'ast-font',
							'transport'         => 'postMessage',
							'font_type'         => 'ast-font-weight',
							'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_font_weight' ),
							'title'             => __( 'Weight', 'astra-builder' ),
							'priority'          => 30,
							'connect'           => 'header-font-family-' . $_prefix . '-sub-menu',
							'context'           => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Primary Submenu Text Transform.
						array(
							'name'      => 'header-text-transform-' . $_prefix . '-sub-menu',
							'default'   => astra_get_option( 'header-text-transform-' . $_prefix . '-sub-menu' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-sub-menu-typography]',
							'section'   => $_section,
							'type'      => 'sub-control',
							'title'     => __( 'Text Transform', 'astra-builder' ),
							'transport' => 'postMessage',
							'priority'  => 31,
							'control'   => 'ast-select',
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
									'value'   => 'general',
								),
							),
						),

						// Option: Primary Submenu Font Size.
						array(
							'name'        => 'header-font-size-' . $_prefix . '-sub-menu',
							'default'     => astra_get_option( 'header-font-size-' . $_prefix . '-sub-menu' ),
							'parent'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-sub-menu-typography]',
							'section'     => $_section,
							'title'       => __( 'Size', 'astra-builder' ),
							'type'        => 'sub-control',
							'control'     => 'ast-responsive',
							'transport'   => 'postMessage',
							'priority'    => 29,
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
									'value'   => 'general',
								),
							),
						),

						// Option: Primary Submenu Line Height.
						array(
							'name'              => 'header-line-height-' . $_prefix . '-sub-menu',
							'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-sub-menu-typography]',
							'section'           => $_section,
							'type'              => 'sub-control',
							'priority'          => 32,
							'title'             => __( 'Line Height', 'astra-builder' ),
							'transport'         => 'postMessage',
							'default'           => '',
							'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_number_n_blank' ),
							'control'           => 'ast-slider',
							'suffix'            => '',
							'input_attrs'       => array(
								'min'  => 1,
								'step' => 0.01,
								'max'  => 5,
							),
							'context'           => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option Group: Primary Mega Menu col Typography.
						array(
							'name'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-typography]',
							'type'     => 'control',
							'control'  => 'ast-settings-group',
							'title'    => __( 'Mega Menu Column Heading', 'astra-builder' ),
							'section'  => $_section,
							'priority' => 130,
							'context'  => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option: Primary Megamenu Header Menu Font Family.
						array(
							'name'      => 'header-' . $_prefix . '-header-megamenu-heading-font-family',
							'default'   => astra_get_option( 'header-' . $_prefix . '-header-megamenu-heading-font-family' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-typography]',
							'transport' => 'postMessage',
							'type'      => 'sub-control',
							'section'   => $_section,
							'control'   => 'ast-font',
							'font_type' => 'ast-font-family',
							'title'     => __( 'Family', 'astra-builder' ),
							'connect'   => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-megamenu-heading-font-weight]',
							'priority'  => 45,
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Primary Megamenu Header Menu Font Size.
						array(
							'name'        => 'header-' . $_prefix . '-header-megamenu-heading-font-size',
							'default'     => astra_get_option( 'header-' . $_prefix . '-header-megamenu-heading-font-size' ),
							'parent'      => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-typography]',
							'transport'   => 'postMessage',
							'title'       => __( 'Size', 'astra-builder' ),
							'type'        => 'sub-control',
							'section'     => $_section,
							'responsive'  => false,
							'control'     => 'ast-responsive',
							'input_attrs' => array(
								'min' => 0,
							),
							'units'       => array(
								'px' => 'px',
								'em' => 'em',
							),
							'priority'    => 45,
							'context'     => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Primary Megamenu Header Menu Font Weight.
						array(
							'name'              => 'header-' . $_prefix . '-header-megamenu-heading-font-weight',
							'default'           => astra_get_option( 'header-' . $_prefix . '-header-megamenu-heading-font-weight' ),
							'parent'            => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-typography]',
							'type'              => 'sub-control',
							'section'           => $_section,
							'control'           => 'ast-font',
							'font_type'         => 'ast-font-weight',
							'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_font_weight' ),
							'title'             => __( 'Weight', 'astra-builder' ),
							'connect'           => 'header-' . $_prefix . '-header-megamenu-heading-font-family',
							'priority'          => 45,
							'transport'         => 'postMessage',
							'context'           => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Primary Megamenu Header Menu Text Transform.
						array(
							'name'      => 'header-' . $_prefix . '-header-megamenu-heading-text-transform',
							'default'   => astra_get_option( 'header-' . $_prefix . '-header-megamenu-heading-text-transform' ),
							'parent'    => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-mega-menu-col-typography]',
							'type'      => 'sub-control',
							'section'   => $_section,
							'control'   => 'ast-select',
							'title'     => __( 'Text Transform', 'astra-builder' ),
							'transport' => 'postMessage',
							'choices'   => array(
								''           => __( 'Inherit', 'astra-builder' ),
								'none'       => __( 'None', 'astra-builder' ),
								'capitalize' => __( 'Capitalize', 'astra-builder' ),
								'uppercase'  => __( 'Uppercase', 'astra-builder' ),
								'lowercase'  => __( 'Lowercase', 'astra-builder' ),
							),
							'priority'  => 45,
							'context'   => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'general',
								),
							),
						),

						// Option: Spacing Heading.
						array(
							'name'     => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-menu-spacing-divider]',
							'section'  => $_section,
							'type'     => 'control',
							'control'  => 'ast-heading',
							'title'    => __( 'Spacing', 'astra-builder' ),
							'priority' => 140,
							'settings' => array(),
							'context'  => array(
								array(
									'setting' => 'ast_selected_tab',
									'value'   => 'design',
								),
							),
						),

						// Option - Menu Space.
						array(
							'name'           => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-menu-spacing]',
							'default'        => astra_get_option( 'header-' . $_prefix . '-menu-spacing' ),
							'type'           => 'control',
							'control'        => 'ast-responsive-spacing',
							'transport'      => 'postMessage',
							'section'        => $_section,
							'priority'       => 150,
							'title'          => __( 'Menu Space', 'astra-builder' ),
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

						// Option - Primary Sub Menu Space.
						array(
							'name'           => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-submenu-spacing]',
							'default'        => astra_get_option( 'header-' . $_prefix . '-submenu-spacing' ),
							'type'           => 'control',
							'transport'      => 'postMessage',
							'control'        => 'ast-responsive-spacing',
							'section'        => $_section,
							'priority'       => 160,
							'title'          => __( 'Submenu Space', 'astra-builder' ),
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

						// Option - Megamenu Heading Space.
						array(
							'name'           => ASTRA_THEME_SETTINGS . '[header-' . $_prefix . '-header-megamenu-heading-space]',
							'default'        => astra_get_option( 'header-' . $_prefix . '-header-megamenu-heading-space' ),
							'type'           => 'control',
							'transport'      => 'postMessage',
							'control'        => 'ast-responsive-spacing',
							'priority'       => 170,
							'title'          => __( 'Megamenu Heading Space', 'astra-builder' ),
							'linked_choices' => true,
							'unit_choices'   => array( 'px', 'em', '%' ),
							'section'        => $_section,
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

					$_configs = array_merge( $_configs, $_addon_dependent_configs );
				}

				$html_config[] = Astra_Builder_Base_Configuration::prepare_margin_tab( $_section );
				$html_config[] = $_configs;
			}

			$html_config    = call_user_func_array( 'array_merge', $html_config + array( array() ) );
			$configurations = array_merge( $configurations, $html_config );

			return $configurations;
		}
	}

	/**
	 * Kicking this off by creating object of this class.
	 */
	new Astra_Header_Menu_Component_Configs();
}
