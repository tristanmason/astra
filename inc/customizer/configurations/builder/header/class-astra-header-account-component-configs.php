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
			'default'          => __( 'Default', 'astra' ),
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
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-type]',
				'default'  => 'default',
				'type'     => 'control',
				'control'  => 'select',
				'section'  => $_section,
				'title'    => __( 'Select Account', 'astra' ),
				'choices'  => $account_choices,
				'transport'   => 'postMessage',
				'partial'     => array(
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
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-login-style]',
				'default'  => 'icon',
				'type'     => 'control',
				'control'  => 'select',
				'section'  => $_section,
				'title'    => __( 'Profile Type', 'astra' ),
				'choices'  => array(
					'icon'          => __( 'Icon', 'astra' ),
					'avatar'       	=> __( 'Avatar', 'astra' ),
				),
				'transport'   => 'postMessage',
				'partial'     => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
			),

			/**
			 * Option: Profile Link type
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-link-type]',
				'default'  => 'default',
				'type'     => 'control',
				'control'  => 'select',
				'section'  => $_section,
				'title'    => __( 'Profile Action', 'astra' ),
				'choices'  => array(
					'default'       => __( 'Default Link', 'astra' ),
					'custom'       	=> __( 'Custom Link', 'astra' ),
					'menu'       	=> __( 'Navigation Menu', 'astra' ),
				),
				'transport'   => 'postMessage',
				'partial'     => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
				'required'  => array( ASTRA_THEME_SETTINGS . '[header-account-type]', '!=', 'default' ),
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
				'title'     => __( 'Link', 'astra' ),
				'transport' => 'postMessage',
				'required'  => array(
					'conditions' => array(
						array( ASTRA_THEME_SETTINGS . '[header-account-link-type]', '==', 'custom' ),
						array( ASTRA_THEME_SETTINGS . '[header-account-type]', '==', 'default' ),
					),
					'operator'   => 'OR',
				),
				'partial'     => array(
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
				'required'  => array( ASTRA_THEME_SETTINGS . '[header-account-link-type]', '==', 'menu' ),
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
				'context'  => Astra_Builder_Helper::$general_tab,
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
				'title'     => __( 'Container Animation', 'astra' ),
				'choices'   => array(
					''           => __( 'Default', 'astra' ),
					'slide-down' => __( 'Slide Down', 'astra' ),
					'slide-up'   => __( 'Slide Up', 'astra' ),
					'fade'       => __( 'Fade', 'astra' ),
				),
				'context'   => Astra_Builder_Helper::$general_tab,
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'        => '#ast-hf-menu-' . $index,
					'render_callback' => array( Astra_Builder_Header::get_instance(), 'menu_' . $index ),
				),
			),

			// Option: Submenu Divider Checkbox.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-item-border]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'checkbox',
				'section'   => $_section,
				'priority'  => 35,
				'title'     => __( 'Item Divider', 'astra' ),
				'context'   => Astra_Builder_Helper::$general_tab,
				'transport' => 'postMessage',
			),

			// Option: Submenu item Border Color.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-item-b-color]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'ast-color',
				'transport' => 'postMessage',
				'required'  => array(
					ASTRA_THEME_SETTINGS . '[header-account-submenu-item-border]',
					'==',
					true,
				),
				'title'     => __( 'Divider Color', 'astra' ),
				'section'   => $_section,
				'priority'  => 40,
				'context'   => Astra_Builder_Helper::$general_tab,
			),

			// Option: Menu Stack on Mobile Checkbox.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-account-menu-stack-on-mobile]',
				'default'   => '',
				'type'      => 'control',
				'control'   => 'checkbox',
				'section'   => $_section,
				'priority'  => 41,
				'title'     => __( 'Stack on Mobile', 'astra' ),
				'context'   => Astra_Builder_Helper::$general_tab,
				'transport' => 'postMessage',
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
				'name'     => ASTRA_THEME_SETTINGS . '[header-account-logout-style]',
				'default'  => 'text',
				'type'     => 'control',
				'control'  => 'select',
				'section'  => $_section,
				'title'    => __( 'Profile Type', 'astra' ),
				'choices'  => array(
					'none'          => __( 'None', 'astra' ),
					'text'       	=> __( 'Text', 'astra' ),
					'icon'       	=> __( 'Icon', 'astra' ),
				),
				'transport'   => 'postMessage',
				'partial'     => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
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
				'partial'     => array(
					'selector'        => '.ast-header-account',
					'render_callback' => array( 'Astra_Builder_UI_Controller', 'render_account' ),
				),
				'required'  => array( ASTRA_THEME_SETTINGS . '[header-account-logout-style]', '==', 'text' ),
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
				'required'  => array( ASTRA_THEME_SETTINGS . '[header-account-logout-style]', '!=', 'none' ),
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
				'context'     => Astra_Builder_Helper::$design_tab,
				'required'  => array( ASTRA_THEME_SETTINGS . '[header-account-login-style]', '==', 'avatar' ),
			),

			/**
			 * Option: Image Width
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[header-account-image-width]',
				'section'     => $_section,
				'priority'    => 2,
				'transport'   => 'postMessage',
				'default'     => '',
				'title'       => __( 'Image Width', 'astra' ),
				'type'        => 'control',
				'control'     => 'ast-responsive-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 200,
				),
				'context'     => Astra_Builder_Helper::$design_tab,
				'required'  => array( ASTRA_THEME_SETTINGS . '[header-account-login-style]', '==', 'avatar' ),
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
				'context'     => Astra_Builder_Helper::$design_tab,
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
				'context'     => Astra_Builder_Helper::$design_tab,
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
				'context'   => Astra_Builder_Helper::$design_tab,
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

