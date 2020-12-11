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
class Astra_Header_Account_Component_Configs extends Astra_Customizer_Config_Base {

	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_section = 'section-header-account';
		$defaults = Astra_Theme_Options::defaults();

		$account_choices = array(
			'default' => __( 'Default', 'astra' ),
		);

		if ( class_exists( 'LifterLMS' ) ) {
			$account_choices['lifterlms'] = __( 'LifterLMS', 'astra' );
		}

		if ( class_exists( 'WooCommerce' ) ) {
			$account_choices['woocommerce'] = __( 'Woo Commerce', 'astra' );
		}

		if ( class_exists( 'SFWD_LMS' ) ) {
			$account_choices['learndash'] = __( 'Learndash', 'astra' );
		}

		if ( class_exists( 'Easy_Digital_Downloads' ) ) {
			$account_choices['edd'] = __( 'EDD', 'astra' );
		}

		$_configs = array(

			/*
			* Header Builder section
			*/
			array(
				'name'     => $_section,
				'type'     => 'section',
				'priority' => 80,
				'title'    => __( 'Account', 'astra' ),
				'panel'    => 'panel-header-builder-group',
			),

			/**
			 * Option: Header Builder Tabs
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[header-account-tabs]',
				'section'     => $_section,
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 0,
				'description' => '',
			),

			/**
			 * Option: Select Account
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-type]',
				'default'   => 'default',
				'type'      => 'control',
				'control'   => 'select',
				'section'   => $_section,
				'title'     => __( 'Select Account', 'astra' ),
				'choices'   => $account_choices,
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
			),

			/**
			 * Option: Log In view
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-login-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Logged In Options', 'astra' ),
				'settings' => array(),
			),

			/**
			 * Option: Style
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-login-style]',
				'default'   => 'icon',
				'type'      => 'control',
				'control'   => 'select',
				'section'   => $_section,
				'title'     => __( 'Profile Type', 'astra' ),
				'choices'   => array(
					'icon'   => __( 'Icon', 'astra' ),
					'avatar' => __( 'Avatar', 'astra' ),
				),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
			),

			/**
			 * Option: Profile Link type
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
				'default'   => 'link',
				'type'      => 'control',
				'control'   => 'select',
				'section'   => $_section,
				'title'     => __( 'Profile Action', 'astra' ),
				'choices'   => array(
					'link' => __( 'Link', 'astra' ),
					'menu'    => __( 'Menu', 'astra' ),
				),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
			),

			/**
			 * Option: Profile Link type
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-link-type]',
				'default'   => 'default',
				'type'      => 'control',
				'control'   => 'select',
				'section'   => $_section,
				'title'     => __( 'Link Type', 'astra' ),
				'choices'   => array(
					'default' => __( 'Default', 'astra' ),
					'custom'  => __( 'Custom', 'astra' ),
				),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
				'context'        => array(
					Astra_Builder_Helper::$general_tab_config,
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-type]',
						'operator' => '!=',
						'value'    => 'default',
					),
				),
			),


			/**
			* Option: Account Log In Link
			*/
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-login-link]',
				'default'   => astra_get_option( 'header-account-login-link' ),
				'type'      => 'control',
				'control'   => 'ast-link',
				'section'   => $_section,
				'title'     => __( 'Enter URL', 'astra' ),
				'transport' => 'postMessage',
				'context'  => array(
					'relation' => 'AND',
					Astra_Builder_Helper::$general_tab_config,
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '==',
						'value'    => 'link',
					),
					array(
						'relation' => 'OR',
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[header-account-type]',
							'operator' => '==',
							'value'    => 'default',
						),
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[header-account-link-type]',
							'operator' => '==',
							'value'    => 'custom',
						),
					),

				),
				'partial'   => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
			),

			/**
			* Option: Theme Menu create link
			*/
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-create-menu-link]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'ast-customizer-link',
				'section'   => $_section,
				'link_type' => 'section',
				'linked'    => 'menu_locations',
				'link_text' => __( 'Configure Menu from Here.', 'astra' ),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '==',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$general_tab_config,
				),
			),

			/**
			 * Option: Log Out view
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-logout-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Logged Out Options', 'astra' ),
				'priority' => 200,
				'settings' => array(),
			),

			/**
			 * Option: Style
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-logout-style]',
				'default'   => 'none',
				'type'      => 'control',
				'control'   => 'select',
				'section'   => $_section,
				'title'     => __( 'Profile Type', 'astra' ),
				'choices'   => array(
					'none' => __( 'None', 'astra' ),
					'text' => __( 'Text', 'astra' ),
					'icon' => __( 'Icon', 'astra' ),
				),
				'transport' => 'postMessage',
			),

			/**
			* Option: Logged Out Text
			*/
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-logged-out-text]',
				'default'   => __( 'Log In', 'astra' ),
				'type'      => 'control',
				'control'   => 'text',
				'section'   => $_section,
				'priority'  => 20,
				'title'     => __( 'Text', 'astra' ),
				'transport' => 'postMessage',
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-logout-style]',
						'operator' => '===',
						'value'    => 'text',
					),
					Astra_Builder_Helper::$general_tab_config,
				),
			),

			/**
			 * Option: Click action type
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-logout-action]',
				'default'   => 'link',
				'type'      => 'control',
				'control'   => 'select',
				'section'   => $_section,
				'title'     => __( 'Click Action', 'astra' ),
				'choices'   => array(
					'link' => __( 'Link', 'astra' ),
					'login' => __( 'Login Form', 'astra' ),
				),
				'transport' => 'postMessage',
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-logout-style]',
						'operator' => '!=',
						'value'    => 'none',
					),
					Astra_Builder_Helper::$general_tab_config,
				),
			),

			/**
			* Option: Account Log Out Link
			*/
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-logout-link]',
				'default'   => astra_get_option( 'header-account-logout-link' ),
				'type'      => 'control',
				'control'   => 'ast-link',
				'section'   => $_section,
				'title'     => __( 'Link', 'astra' ),
				'transport' => 'postMessage',
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-logout-style]',
						'operator' => '!=',
						'value'    => 'none',
					),
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-logout-action]',
						'operator' => '==',
						'value'    => 'link',
					),
					Astra_Builder_Helper::$general_tab_config,
				),
			),

			/**
			 * Option: Log Out view
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-image-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Avatar', 'astra' ),
				'priority' => 1,
				'settings' => array(),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-login-style]',
						'operator' => '===',
						'value'    => 'avatar',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			/**
			 * Option: Image Width
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[header-account-image-width]',
				'section'     => $_section,
				'priority'    => 2,
				'transport'   => 'postMessage',
				'default'     => '40',
				'title'       => __( 'Image Width', 'astra' ),
				'type'        => 'control',
				'control'     => 'ast-responsive-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 100,
				),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-login-style]',
						'operator' => '===',
						'value'    => 'avatar',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			/**
			 * Option: Log Out view
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-icon-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Icon', 'astra' ),
				'priority' => 3,
				'settings' => array(),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-login-style]',
						'operator' => '===',
						'value'    => 'icon',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			/**
			 * Option: account Size
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[header-account-icon-size]',
				'section'     => $_section,
				'priority'    => 4,
				'transport'   => 'postMessage',
				'default'     => $defaults['header-search-icon-space'],
				'title'       => __( 'Icon Size', 'astra' ),
				'type'        => 'control',
				'control'     => 'ast-responsive-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 50,
				),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-login-style]',
						'operator' => '===',
						'value'    => 'icon',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			/**
			 * Option: account Color.
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-icon-color]',
				'default'   => '',
				'type'      => 'control',
				'section'   => $_section,
				'priority'  => 5,
				'transport' => 'postMessage',
				'control'   => 'ast-color',
				'title'     => __( 'Icon Color', 'astra' ),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-login-style]',
						'operator' => '===',
						'value'    => 'icon',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			), 
			/**
			 * Option: Primary Header Button Colors Divider
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-menu-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Menu', 'astra' ),
				'settings' => array(),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			// Option Group: Menu Color.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-colors]',
				'type'      => 'control',
				'control'   => 'ast-settings-group',
				'title'     => __( 'Colors', 'astra' ),
				'section'   => $_section,
				'transport' => 'postMessage',
				'priority'  => 90,
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			// Option: Menu Color.
			array(
				'name'       => 'header-account-menu-color-responsive',
				'default'    => '',
				'parent'     => ASTRA_THEME_SETTINGS . '[header-account-menu-colors]',
				'type'       => 'sub-control',
				'control'    => 'ast-responsive-color',
				'transport'  => 'postMessage',
				'tab'        => __( 'Normal', 'astra' ),
				'section'    => $_section,
				'title'      => __( 'Link / Text Color', 'astra' ),
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 7,
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			// Option: Background Color.
			array(
				'name'       => 'header-account-menu-bg-obj-responsive',
				'default'    => astra_get_option( 'header-account-menu-bg-obj-responsive' ),
				'parent'     => ASTRA_THEME_SETTINGS . '[header-account-menu-colors]',
				'type'       => 'sub-control',
				'control'    => 'ast-responsive-color',
				'transport'  => 'postMessage',
				'section'    => $_section,
				'title'      => __( 'Background Color', 'astra' ),
				'tab'        => __( 'Normal', 'astra' ),
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 8,
				'context'    => Astra_Builder_Helper::$general_tab,
			),



			// Option: Menu Hover Color.
			array(
				'name'       => 'header-account-menu-h-color-responsive',
				'default'    => '',
				'parent'     => ASTRA_THEME_SETTINGS . '[header-account-menu-colors]',
				'tab'        => __( 'Hover', 'astra' ),
				'type'       => 'sub-control',
				'control'    => 'ast-responsive-color',
				'transport'  => 'postMessage',
				'title'      => __( 'Link Color', 'astra' ),
				'section'    => $_section,
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 19,
				'context'    => Astra_Builder_Helper::$general_tab,
			),

			// Option: Menu Hover Background Color.
			array(
				'name'       => 'header-account-menu-h-bg-color-responsive',
				'default'    => astra_get_option( 'header-account-menu-h-bg-color-responsive' ),
				'parent'     => ASTRA_THEME_SETTINGS . '[header-account-menu-colors]',
				'type'       => 'sub-control',
				'title'      => __( 'Background Color', 'astra' ),
				'section'    => $_section,
				'control'    => 'ast-responsive-color',
				'transport'  => 'postMessage',
				'tab'        => __( 'Hover', 'astra' ),
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 21,
				'context'    => Astra_Builder_Helper::$general_tab,
			),

			// Option: Active Menu Color.
			array(
				'name'       => 'header-account-menu-a-color-responsive',
				'default'    => astra_get_option( 'header-account-menu-a-color-responsive' ),
				'parent'     => ASTRA_THEME_SETTINGS . '[header-account-menu-colors]',
				'type'       => 'sub-control',
				'section'    => $_section,
				'control'    => 'ast-responsive-color',
				'transport'  => 'postMessage',
				'tab'        => __( 'Active', 'astra' ),
				'title'      => __( 'Link Color', 'astra' ),
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 31,
				'context'    => Astra_Builder_Helper::$general_tab,
			),

			// Option: Active Menu Background Color.
			array(
				'name'       => 'header-account-menu-a-bg-color-responsive',
				'default'    => astra_get_option( 'header-account-menu-a-bg-color-responsive' ),
				'parent'     => ASTRA_THEME_SETTINGS . '[header-account-menu-colors]',
				'type'       => 'sub-control',
				'control'    => 'ast-responsive-color',
				'transport'  => 'postMessage',
				'section'    => $_section,
				'title'      => __( 'Background Color', 'astra' ),
				'tab'        => __( 'Active', 'astra' ),
				'responsive' => true,
				'rgba'       => true,
				'priority'   => 33,
				'context'    => Astra_Builder_Helper::$general_tab,
			),

			// Option Group: Menu Typography.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-header-menu-typography]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'ast-settings-group',
				'title'     => __( 'Typography', 'astra' ),
				'section'   => $_section,
				'transport' => 'postMessage',
				'priority'  => 91,
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			// Option: Menu Font Family.
			array(
				'name'      => 'header-account-menu-font-family',
				'default'   => '',
				'parent'    => ASTRA_THEME_SETTINGS . '[header-account-menu-header-menu-typography]',
				'type'      => 'sub-control',
				'section'   => $_section,
				'transport' => 'postMessage',
				'control'   => 'ast-font',
				'font_type' => 'ast-font-family',
				'title'     => __( 'Family', 'astra' ),
				'priority'  => 22,
				'connect'   => 'header-account-menu-font-weight',
				'context'   => Astra_Builder_Helper::$general_tab,
			),

			// Option: Menu Font Weight.
			array(
				'name'              => 'header-account-menu-font-weight',
				'default'           => '',
				'parent'            => ASTRA_THEME_SETTINGS . '[header-account-menu-header-menu-typography]',
				'section'           => $_section,
				'type'              => 'sub-control',
				'control'           => 'ast-font',
				'transport'         => 'postMessage',
				'font_type'         => 'ast-font-weight',
				'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_font_weight' ),
				'title'             => __( 'Weight', 'astra' ),
				'priority'          => 24,
				'connect'           => 'header-account-menu-font-family',
				'context'           => Astra_Builder_Helper::$general_tab,
			),

			// Option: Menu Text Transform.
			array(
				'name'      => 'header-account-menu-text-transform',
				'default'   => '',
				'parent'    => ASTRA_THEME_SETTINGS . '[header-account-menu-header-menu-typography]',
				'section'   => $_section,
				'type'      => 'sub-control',
				'control'   => 'ast-select',
				'transport' => 'postMessage',
				'title'     => __( 'Text Transform', 'astra' ),
				'priority'  => 25,
				'choices'   => array(
					''           => __( 'Inherit', 'astra' ),
					'none'       => __( 'None', 'astra' ),
					'capitalize' => __( 'Capitalize', 'astra' ),
					'uppercase'  => __( 'Uppercase', 'astra' ),
					'lowercase'  => __( 'Lowercase', 'astra' ),
				),
				'context'   => Astra_Builder_Helper::$general_tab,
			),

			// Option: Menu Font Size.
			array(
				'name'        => 'header-account-menu-font-size',
				'default'     => '',
				'parent'      => ASTRA_THEME_SETTINGS . '[header-account-menu-header-menu-typography]',
				'section'     => $_section,
				'type'        => 'sub-control',
				'priority'    => 23,
				'title'       => __( 'Size', 'astra' ),
				'control'     => 'ast-responsive',
				'transport'   => 'postMessage',
				'input_attrs' => array(
					'min' => 0,
				),
				'units'       => array(
					'px' => 'px',
					'em' => 'em',
				),
				'context'     => Astra_Builder_Helper::$general_tab,
			),

			// Option: Menu Line Height.
			array(
				'name'              => 'header-account-menu-line-height',
				'parent'            => ASTRA_THEME_SETTINGS . '[header-account-menu-header-menu-typography]',
				'section'           => $_section,
				'type'              => 'sub-control',
				'priority'          => 26,
				'title'             => __( 'Line Height', 'astra' ),
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
				'context'           => Astra_Builder_Helper::$general_tab,
			),

			// Option: Submenu Divider Checkbox.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-item-border]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'checkbox',
				'section'   => $_section,
				'priority'  => 99,
				'title'     => __( 'Item Divider', 'astra' ),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
				'transport' => 'postMessage',
			),

			// Option: Submenu item Border Color.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-item-b-color]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'ast-color',
				'transport' => 'postMessage',
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-menu-item-border]',
						'operator' => '==',
						'value'    => true,
					),
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
				'title'     => __( 'Divider Color', 'astra' ),
				'section'   => $_section,
				'priority'  => 100,
			),

			// Option: Sub-Menu Border.
			array(
				'name'           => ASTRA_THEME_SETTINGS . '[header-account-menu-container-border]',
				'default'        => '',
				'type'           => 'control',
				'control'        => 'ast-border',
				'transport'      => 'postMessage',
				'section'        => $_section,
				'linked_choices' => true,
				'priority'       => 101,
				'title'          => __( 'Container Border', 'astra' ),
				'choices'        => array(
					'top'    => __( 'Top', 'astra' ),
					'right'  => __( 'Right', 'astra' ),
					'bottom' => __( 'Bottom', 'astra' ),
					'left'   => __( 'Left', 'astra' ),
				),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			// Option: Submenu Container Border Color.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-container-b-color]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'ast-color',
				'transport' => 'postMessage',
				'default'   => '',
				'title'     => __( 'Border Color', 'astra' ),
				'section'   => $_section,
				'priority'  => 102,
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			/**
			 * Option: menu Container Animation
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-container-animation]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'select',
				'section'   => $_section,
				'priority'  => 105,
				'title'     => __( 'Container Animation', 'astra' ),
				'choices'   => array(
					''           => __( 'Default', 'astra' ),
					'slide-down' => __( 'Slide Down', 'astra' ),
					'slide-up'   => __( 'Slide Up', 'astra' ),
					'fade'       => __( 'Fade', 'astra' ),
				),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'        => '.ast-header-account-wrap',
					'render_callback' => array( Astra_Builder_Header::get_instance(), 'header_account' ),
				),
			),


			/**
			 * Option: Margin heading
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-margin-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Spacing', 'astra' ),
				'priority' => 200,
				'settings' => array(),
				'context'  => Astra_Builder_Helper::$design_tab,
			),

			// Option - Menu Space.
			array(
				'name'           => ASTRA_THEME_SETTINGS . '[header-account-menu-spacing]',
				'default'        => '',
				'type'           => 'control',
				'control'        => 'ast-responsive-spacing',
				'transport'      => 'postMessage',
				'section'        => $_section,
				'priority'       => 210,
				'title'          => __( 'Menu Space', 'astra' ),
				'linked_choices' => true,
				'unit_choices'   => array( 'px', 'em', '%' ),
				'choices'        => array(
					'top'    => __( 'Top', 'astra' ),
					'right'  => __( 'Right', 'astra' ),
					'bottom' => __( 'Bottom', 'astra' ),
					'left'   => __( 'Left', 'astra' ),
				),
				'context'  => array(
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[header-account-action-type]',
						'operator' => '===',
						'value'    => 'menu',
					),
					Astra_Builder_Helper::$design_tab_config,
				),
			),

			/**
			 * Option: Margin Space
			 */
			array(
				'name'           => ASTRA_THEME_SETTINGS . '[header-account-margin]',
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

		return array_merge( $configurations, $_configs );
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Header_Account_Component_Configs();

