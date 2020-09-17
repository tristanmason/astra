<?php
/**
 * Astra Theme Customizer Configuration Site Identity.
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
	 * Register Site Identity Customizer Configurations.
	 *
	 * @since x.x.x
	 */
	class Astra_Customizer_Sticky_Header_Builder_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Builder Site Identity Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since x.x.x
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$_section = 'section-sticky-header';
			$_configs = array(

				/*
				 * Update the Site Identity section inside Layout -> Header
				 *
				 * @since x.x.x
				 */
				array(
					'name'     => $_section,
					'type'     => 'section',
					'priority' => 100,
					'title'    => __( 'Sticky Header Builder', 'astra' ),
					'panel'    => 'panel-header-builder-group',
				),

				/**
				 * Option: Header Builder Tabs
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[builder-sticky-header-tabs]',
					'section'     => $_section,
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => 0,
					'description' => '',
				),

				/**
				 * Option: Stick Above Header
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-above-stick]',
					'default'   => astra_get_option( 'header-above-stick' ),
					'type'      => 'control',
					'section'   => $_section,
					'title'     => __( 'Stick Above Header', 'astra' ),
					'priority'  => 5,
					'control'   => 'checkbox',
					'transport' => 'postMessage',
					'required'  => array( 1, '==', 1 ), // ToDo: Remove this when Astra Addon option gets depricated.
					'context'   => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Stick Primary Header
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-main-stick]',
					'default'   => astra_get_option( 'header-main-stick' ),
					'type'      => 'control',
					'section'   => $_section,
					'title'     => __( 'Stick Primary Header', 'astra' ),
					'priority'  => 6,
					'control'   => 'checkbox',
					'transport' => 'postMessage',
					'context'   => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Stick Below Header
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-below-stick]',
					'default'   => astra_get_option( 'header-below-stick' ),
					'type'      => 'control',
					'section'   => $_section,
					'title'     => __( 'Stick Below Header', 'astra' ),
					'priority'  => 7,
					'control'   => 'checkbox',
					'required'  => array( 1, '==', 1 ), // ToDo: Remove this when Astra Addon option gets depricated.
					'transport' => 'postMessage',
					'context'   => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky Header Above Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-sticky-header-logo]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Logo', 'astra' ),
					'settings' => array(),
					'priority' => 8,
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Stick Different Logo Header
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[different-sticky-logo]',
					'default'  => astra_get_option( 'different-sticky-logo' ),
					'type'     => 'control',
					'section'  => $_section,
					'title'    => __( 'Different Logo for Sticky Header?', 'astra' ),
					'priority' => 15,
					'control'  => 'checkbox',
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky header logo selector
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[sticky-header-logo]',
					'default'        => astra_get_option( 'sticky-header-logo' ),
					'type'           => 'control',
					'control'        => 'image',
					'section'        => $_section,
					'priority'       => 15,
					'title'          => __( 'Sticky Logo', 'astra' ),
					'library_filter' => array( 'gif', 'jpg', 'jpeg', 'png', 'ico' ),
					'required'       => array( ASTRA_THEME_SETTINGS . '[different-sticky-logo]', '==', 1 ),
					'context'        => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky header logo width
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[sticky-header-logo-width]',
					'default'     => astra_get_option( 'sticky-header-logo-width' ),
					'type'        => 'control',
					'transport'   => 'postMessage',
					'control'     => 'ast-responsive-slider',
					'section'     => 'section-sticky-header',
					'priority'    => 25,
					'title'       => __( 'Sticky Logo Width', 'astra' ),
					'input_attrs' => array(
						'min'  => 50,
						'step' => 1,
						'max'  => 600,
					),
					'required'    => array(
						'conditions' => array(
							array( ASTRA_THEME_SETTINGS . '[different-sticky-logo]', '==', 1 ),
							array( ASTRA_THEME_SETTINGS . '[different-sticky-retina-logo]', '==', 1 ),
						),
						'operator'   => 'OR',
					),
					'context'     => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Different retina logo
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[different-sticky-retina-logo]',
					'default'  => false,
					'type'     => 'control',
					'section'  => $_section,
					'title'    => __( 'Different Logo for retina devices?', 'astra' ),
					'priority' => 20,
					'control'  => 'checkbox',
					'required' => array( ASTRA_THEME_SETTINGS . '[different-sticky-logo]', '==', 1 ),
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky header logo selector
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[sticky-header-retina-logo]',
					'default'        => astra_get_option( 'sticky-header-retina-logo' ),
					'type'           => 'control',
					'control'        => 'image',
					'section'        => $_section,
					'priority'       => 20,
					'title'          => __( 'Sticky Retina Logo', 'astra' ),
					'library_filter' => array( 'gif', 'jpg', 'jpeg', 'png', 'ico' ),
					'required'       => array( ASTRA_THEME_SETTINGS . '[different-sticky-retina-logo]', '==', 1 ),
					'context'        => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Shrink Primary Header
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[header-main-shrink]',
					'default'     => astra_get_option( 'header-main-shrink' ),
					'type'        => 'control',
					'section'     => $_section,
					'title'       => __( 'Enable Shrink Effect', 'astra' ),
					'priority'    => 35,
					'control'     => 'checkbox',
					'description' => __( 'It will shrink the sticky header height, logo, and menu size. Sticky header will display in a compact size.', 'astra' ),
					'context'     => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Hide on scroll
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[sticky-hide-on-scroll]',
					'default'  => astra_get_option( 'sticky-hide-on-scroll' ),
					'type'     => 'control',
					'section'  => $_section,
					'title'    => __( 'Hide When Scrolling Down', 'astra' ),
					'priority' => 35,
					'control'  => 'checkbox',
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky Header Above Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-sticky-header-animations]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Animations & Rules', 'astra' ),
					'settings' => array(),
					'priority' => 39,
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Enable disable mobile header
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[sticky-header-style]',
					'default'  => astra_get_option( 'sticky-header-style' ),
					'type'     => 'control',
					'control'  => 'select',
					'section'  => $_section,
					'priority' => 40,
					'title'    => __( 'Select Animation', 'astra' ),
					'choices'  => array(
						'none'  => __( 'None', 'astra' ),
						'slide' => __( 'Slide', 'astra' ),
						'fade'  => __( 'Fade', 'astra' ),
					),
					'required' => array( ASTRA_THEME_SETTINGS . '[sticky-hide-on-scroll]', '!=', 1 ),
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky Header Display On
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[sticky-header-on-devices]',
					'default'  => astra_get_option( 'sticky-header-on-devices' ),
					'type'     => 'control',
					'section'  => $_section,
					'priority' => 50,
					'title'    => __( 'Enable On', 'astra' ),
					'control'  => 'select',
					'choices'  => array(
						'desktop' => __( 'Desktop', 'astra' ),
						'mobile'  => __( 'Mobile', 'astra' ),
						'both'    => __( 'Desktop + Mobile', 'astra' ),
					),
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky Header Above Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-sticky-above-header]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Above Header Colors', 'astra' ),
					'settings' => array(),
					'priority' => 60,
					'context'  => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header Above Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-above-header-colors]',
					'default'   => astra_get_option( 'sticky-header-above-header-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Header', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 60,
					'context'   => Astra_Constants::$design_tab,
				),
				/**
				 * Option: Sticky Header Above Menu Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-above-menus-colors]',
					'default'   => astra_get_option( 'sticky-header-above-menus-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Menu', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 60,
					'context'   => Astra_Constants::$design_tab,
				),
				/**
				 * Option: Sticky Header Above Menu Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-above-submenus-colors]',
					'default'   => astra_get_option( 'sticky-header-above-submenus-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Submenu', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 65,
					'context'   => Astra_Constants::$design_tab,
				),
				/**
				 * Option: Sticky Header Above Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-above-outside-item-colors]',
					'default'   => astra_get_option( 'sticky-header-above-outside-item-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Content', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 75,
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header Above Menu Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-above-mega-menus-colors]',
					'default'   => astra_get_option( 'sticky-header-above-mega-menus-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Mega Menu Column Heading', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 70,
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header Primary Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-sticky-primary-header]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Primary Header Colors', 'astra' ),
					'settings' => array(),
					'priority' => 80,
					'context'  => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header primary Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-primary-header-colors]',
					'default'   => astra_get_option( 'sticky-header-primary-header-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Header', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 85,
					'context'   => Astra_Constants::$design_tab,
				),
				/**
				 * Option: Sticky Header primary Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-primary-menus-colors]',
					'default'   => astra_get_option( 'sticky-header-primary-menus-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Menu', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 90,
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header primary Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-primary-submenu-colors]',
					'default'   => astra_get_option( 'sticky-header-primary-submenu-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Submenu', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 95,
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header primary Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-primary-outside-item-colors]',
					'default'   => astra_get_option( 'sticky-header-primary-outside-item-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Outside Item', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 105,
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header primary Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-primary-megamenu-colors]',
					'default'   => astra_get_option( 'sticky-header-primary-megamenu-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Mega Menu Column Heading', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 100,
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header Below Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-sticky-below-header]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Below Header Colors', 'astra' ),
					'settings' => array(),
					'priority' => 110,

					'context'  => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header Below Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-below-header-colors]',
					'default'   => astra_get_option( 'sticky-header-below-header-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Header', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 115,

					'context'   => Astra_Constants::$design_tab,
				),
				/**
				 * Option: Sticky Header Below Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-below-menus-colors]',
					'default'   => astra_get_option( 'sticky-header-below-menus-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Menu', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 120,

					'context'   => Astra_Constants::$design_tab,
				),
				/**
				 * Option: Sticky Header Below Submenu Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-below-submenus-colors]',
					'default'   => astra_get_option( 'sticky-header-below-submenus-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Submenu', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 125,

					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header Header Content Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-below-header-content-colors]',
					'default'   => astra_get_option( 'sticky-header-below-header-content-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Content', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 135,
					'required'  => array(
						'conditions' => array(
							array(
								ASTRA_THEME_SETTINGS . '[below-header-section-1]',
								'==',
								array( 'search', 'widget', 'text-html', 'edd' ),
							),
							array(
								ASTRA_THEME_SETTINGS . '[below-header-section-2]',
								'==',
								array( 'search', 'widget', 'text-html', 'edd' ),
							),
						),
						'operator'   => 'OR',
					),
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Sticky Header Below Mega Menu Column Color Group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[sticky-header-below-mega-menus-colors]',
					'default'   => astra_get_option( 'sticky-header-below-mega-menus-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Mega Menu Column Heading', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 130,

					'context'   => Astra_Constants::$design_tab,
				),
			);

			return array_merge( $configurations, $_configs );
		}
	}

	/**
	 * Kicking this off by creating object of this class.
	 */
	new Astra_Customizer_Sticky_Header_Builder_Configs();
}
