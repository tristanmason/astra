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
	class Astra_Customizer_Footer_Menu_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Builder Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since x.x.x
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$defaults              = Astra_Theme_Options::defaults();
			$is_astra_addon_active = defined( 'ASTRA_EXT_VER' );

			$_section = 'section-footer-menu';

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
					'title'    => __( 'Footer Menu', 'astra-builder' ),
					'panel'    => 'panel-footer-builder-group',
					'priority' => 50,
				),

				/**
				* Option: Theme Menu create link
				*/
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-create-menu-link]',
					'default'   => astra_get_option( 'footer-create-menu-link' ),
					'type'      => 'control',
					'control'   => 'ast-customizer-link',
					'section'   => $_section,
					'priority'  => 10,
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

				// Option: Footer Menu Layout.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-menu-layout]',
					'default'   => astra_get_option( 'footer-menu-layout' ),
					'section'   => $_section,
					'priority'  => 20,
					'title'     => __( 'Layout', 'astra-builder' ),
					'type'      => 'control',
					'control'   => 'select',
					'transport' => 'postMessage',
					'required'  => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
					'choices'   => array(
						'horizontal' => __( 'Inline', 'astra-builder' ),
						'vertical'   => __( 'Stack', 'astra-builder' ),
					),
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
				),

				/**
				 * Option: Alignment
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-menu-alignment]',
					'default'   => astra_get_option( 'footer-menu-alignment' ),
					'type'      => 'control',
					'control'   => 'ast-responsive-select',
					'section'   => $_section,
					'priority'  => 21,
					'title'     => __( 'Alignment', 'astra-builder' ),
					'choices'   => array(
						'left'     => __( 'Left', 'astra-builder' ),
						'center'   => __( 'Center', 'astra-builder' ),
						'flex-end' => __( 'Right', 'astra-builder' ),
					),
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
					'transport' => 'postMessage',
				),
			);

			if ( $is_astra_addon_active ) {
				/**
				 * Option: Pro Menu Configs.
				 */
				$_addon_dependent_configs = array(
					// Option Group: Menu Color.
					array(
						'name'      => ASTRA_THEME_SETTINGS . '[footer-menu-colors]',
						'type'      => 'control',
						'control'   => 'ast-settings-group',
						'required'  => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
						'title'     => __( 'Menu Color', 'astra-builder' ),
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
						'name'       => 'footer-menu-color-responsive',
						'default'    => astra_get_option( 'footer-menu-color-responsive' ),
						'parent'     => ASTRA_THEME_SETTINGS . '[footer-menu-colors]',
						'type'       => 'sub-control',
						'control'    => 'ast-responsive-color',
						'transport'  => 'postMessage',
						'tab'        => __( 'Normal', 'astra-builder' ),
						'required'   => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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
						'name'       => 'footer-menu-bg-obj-responsive',
						'default'    => $defaults['footer-menu-bg-obj-responsive'],
						'parent'     => ASTRA_THEME_SETTINGS . '[footer-menu-colors]',
						'type'       => 'sub-control',
						'control'    => 'ast-responsive-background',
						'section'    => $_section,
						'required'   => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
						'transport'  => 'postMessage',
						'tab'        => __( 'Normal', 'astra-builder' ),
						'data_attrs' => array( 'name' => 'footer-menu-bg-obj-responsive' ),
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
						'name'       => 'footer-menu-h-color-responsive',
						'default'    => astra_get_option( 'footer-menu-h-color-responsive' ),
						'parent'     => ASTRA_THEME_SETTINGS . '[footer-menu-colors]',
						'tab'        => __( 'Hover', 'astra-builder' ),
						'type'       => 'sub-control',
						'control'    => 'ast-responsive-color',
						'required'   => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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
						'name'       => 'footer-menu-h-bg-color-responsive',
						'default'    => astra_get_option( 'footer-menu-h-bg-color-responsive' ),
						'parent'     => ASTRA_THEME_SETTINGS . '[footer-menu-colors]',
						'type'       => 'sub-control',
						'title'      => __( 'Background Color', 'astra-builder' ),
						'section'    => $_section,
						'control'    => 'ast-responsive-color',
						'required'   => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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
						'name'       => 'footer-menu-a-color-responsive',
						'default'    => astra_get_option( 'footer-menu-a-color-responsive' ),
						'parent'     => ASTRA_THEME_SETTINGS . '[footer-menu-colors]',
						'type'       => 'sub-control',
						'section'    => $_section,
						'control'    => 'ast-responsive-color',
						'required'   => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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
						'name'       => 'footer-menu-a-bg-color-responsive',
						'default'    => astra_get_option( 'footer-menu-a-bg-color-responsive' ),
						'parent'     => ASTRA_THEME_SETTINGS . '[footer-menu-colors]',
						'type'       => 'sub-control',
						'control'    => 'ast-responsive-color',
						'transport'  => 'postMessage',
						'required'   => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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

					// Option: Typography Heading.
					array(
						'name'     => ASTRA_THEME_SETTINGS . '[footer-menu-header-typography-styling-divider]',
						'type'     => 'control',
						'control'  => 'ast-heading',
						'required' => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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
						'name'      => ASTRA_THEME_SETTINGS . '[footer-menu-header-menu-typography]',
						'default'   => astra_get_option( 'footer-menu-header-menu-typography' ),
						'type'      => 'control',
						'control'   => 'ast-settings-group',
						'title'     => __( 'Menu', 'astra-builder' ),
						'section'   => $_section,
						'required'  => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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
						'name'      => 'footer-menu-font-family',
						'default'   => astra_get_option( 'footer-menu-font-family' ),
						'parent'    => ASTRA_THEME_SETTINGS . '[footer-menu-header-menu-typography]',
						'type'      => 'sub-control',
						'section'   => $_section,
						'transport' => 'postMessage',
						'control'   => 'ast-font',
						'font_type' => 'ast-font-family',
						'title'     => __( 'Family', 'astra-builder' ),
						'priority'  => 22,
						'connect'   => 'footer-menu-font-weight',
						'context'   => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),

					// Option: Menu Font Weight.
					array(
						'name'              => 'footer-menu-font-weight',
						'default'           => astra_get_option( 'footer-menu-font-weight' ),
						'parent'            => ASTRA_THEME_SETTINGS . '[footer-menu-header-menu-typography]',
						'section'           => $_section,
						'type'              => 'sub-control',
						'control'           => 'ast-font',
						'transport'         => 'postMessage',
						'font_type'         => 'ast-font-weight',
						'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_font_weight' ),
						'title'             => __( 'Weight', 'astra-builder' ),
						'priority'          => 24,
						'connect'           => 'footer-menu-font-family',
						'context'           => array(
							array(
								'setting' => 'ast_selected_tab',
								'value'   => 'general',
							),
						),
					),

					// Option: Menu Text Transform.
					array(
						'name'      => 'footer-menu-text-transform',
						'default'   => astra_get_option( 'footer-menu-text-transform' ),
						'parent'    => ASTRA_THEME_SETTINGS . '[footer-menu-header-menu-typography]',
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
						'name'        => 'footer-menu-font-size',
						'default'     => astra_get_option( 'footer-menu-font-size' ),
						'parent'      => ASTRA_THEME_SETTINGS . '[footer-menu-header-menu-typography]',
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
						'name'              => 'footer-menu-line-height',
						'parent'            => ASTRA_THEME_SETTINGS . '[footer-menu-header-menu-typography]',
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

					// Option: Spacing Heading.
					array(
						'name'     => ASTRA_THEME_SETTINGS . '[footer-menu-menu-spacing-divider]',
						'section'  => $_section,
						'type'     => 'control',
						'control'  => 'ast-heading',
						'title'    => __( 'Spacing', 'astra-builder' ),
						'required' => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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
						'name'           => ASTRA_THEME_SETTINGS . '[footer-menu-menu-spacing]',
						'default'        => astra_get_option( 'footer-menu-menu-spacing' ),
						'type'           => 'control',
						'control'        => 'ast-responsive-spacing',
						'transport'      => 'postMessage',
						'section'        => $_section,
						'required'       => array( ASTRA_THEME_SETTINGS . '[footer-menu-slug]', '!=', '' ),
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

					/**
					 * Option: Margin heading
					 */
					array(
						'name'     => ASTRA_THEME_SETTINGS . '[' . $section_id . '-margin-heading]',
						'type'     => 'control',
						'control'  => 'ast-heading',
						'section'  => $section_id,
						'title'    => __( 'Margin', 'astra-builder' ),
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
					 * Option: Margin Space
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

				$_configs = array_merge( $_configs, $_addon_dependent_configs );
			}

			return array_merge( $configurations, $_configs );
		}
	}

	/**
	 * Kicking this off by creating 'new' object of this class.
	 */
	new Astra_Customizer_Footer_Menu_Configs();
}
