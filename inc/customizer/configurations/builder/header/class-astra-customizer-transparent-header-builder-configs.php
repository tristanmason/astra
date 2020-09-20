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
	class Astra_Customizer_Transparent_Header_Builder_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Builder Site Identity Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since x.x.x
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$_section = 'section-transparent-header';
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
					'title'    => __( 'Transperant Header', 'astra' ),
					'panel'    => 'panel-header-builder-group',
				),

				/**
				 * Option: Header Builder Tabs
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[builder-transparent-header-tabs]',
					'section'     => $_section,
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => 0,
					'description' => '',
				),

				/**
				 * Option: Enable Transparent Header
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[transparent-header-enable]',
					'default'  => astra_get_option( 'transparent-header-enable' ),
					'type'     => 'control',
					'section'  => $_section,
					'title'    => __( 'Enable on Complete Website', 'astra' ),
					'priority' => 20,
					'control'  => 'checkbox',
					'context'  => Astra_Constants::$general_tab,
				),



				/**
				 * Option: Disable Transparent Header on Archive Pages
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[transparent-header-disable-archive]',
					'default'     => astra_get_option( 'transparent-header-disable-archive' ),
					'type'        => 'control',
					'section'     => 'section-transparent-header',
					'required'    => array( ASTRA_THEME_SETTINGS . '[transparent-header-enable]', '==', '1' ),
					'title'       => __( 'Disable on 404, Search & Archives?', 'astra' ),
					'description' => __( 'This setting is generally not recommended on special pages such as archive, search, 404, etc. If you would like to enable it, uncheck this option', 'astra' ),
					'priority'    => 25,
					'control'     => 'checkbox',
					'context'     => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Disable Transparent Header on Archive Pages
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[transparent-header-disable-index]',
					'default'     => astra_get_option( 'transparent-header-disable-index' ),
					'type'        => 'control',
					'section'     => 'section-transparent-header',
					'required'    => array( ASTRA_THEME_SETTINGS . '[transparent-header-enable]', '==', '1' ),
					'title'       => __( 'Disable on Blog page?', 'astra' ),
					'description' => __( 'Blog Page is when Latest Posts are selected to be displayed on a particular page.', 'astra' ),
					'priority'    => 25,
					'control'     => 'checkbox',
					'context'     => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Disable Transparent Header on Your latest posts index Page
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[transparent-header-disable-latest-posts-index]',
					'default'     => astra_get_option( 'transparent-header-disable-latest-posts-index' ),
					'type'        => 'control',
					'section'     => 'section-transparent-header',
					'required'    => array( ASTRA_THEME_SETTINGS . '[transparent-header-enable]', '==', '1' ),
					'title'       => __( 'Disable on Latest Posts Page?', 'astra' ),
					'description' => __( "Latest Posts page is your site's front page when the latest posts are displayed on the home page.", 'astra' ),
					'priority'    => 25,
					'control'     => 'checkbox',
					'context'     => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Disable Transparent Header on Pages
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[transparent-header-disable-page]',
					'default'  => astra_get_option( 'transparent-header-disable-page' ),
					'type'     => 'control',
					'section'  => 'section-transparent-header',
					'required' => array( ASTRA_THEME_SETTINGS . '[transparent-header-enable]', '==', '1' ),
					'title'    => __( 'Disable on Pages?', 'astra' ),
					'priority' => 25,
					'control'  => 'checkbox',
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Disable Transparent Header on Posts
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[transparent-header-disable-posts]',
					'default'  => astra_get_option( 'transparent-header-disable-posts' ),
					'type'     => 'control',
					'section'  => 'section-transparent-header',
					'required' => array( ASTRA_THEME_SETTINGS . '[transparent-header-enable]', '==', '1' ),
					'title'    => __( 'Disable on Posts?', 'astra' ),
					'priority' => 25,
					'control'  => 'checkbox',
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Transparent Header Styling
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-transparent-display]',
					'type'     => 'control',
					'control'  => 'ast-divider',
					'section'  => 'section-transparent-header',
					'priority' => 26,
					'settings' => array(),
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Sticky Header Display On
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[transparent-header-on-devices]',
					'default'  => astra_get_option( 'transparent-header-on-devices' ),
					'type'     => 'control',
					'section'  => 'section-transparent-header',
					'priority' => 27,
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
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-tranparent-header-logo]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Logo', 'astra' ),
					'settings' => array(),
					'priority' => 29,
					'context'  => Astra_Constants::$general_tab,
				),

				array(
					'name'     => ASTRA_THEME_SETTINGS . '[different-transparent-logo]',
					'default'  => astra_get_option( 'different-transparent-logo', false ),
					'type'     => 'control',
					'section'  => 'section-transparent-header',
					'title'    => __( 'Different Logo for Transparent Header?', 'astra' ),
					'priority' => 30,
					'control'  => 'checkbox',
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Transparent header logo selector
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[transparent-header-logo]',
					'default'        => astra_get_option( 'transparent-header-logo' ),
					'type'           => 'control',
					'control'        => 'image',
					'section'        => 'section-transparent-header',
					'required'       => array( ASTRA_THEME_SETTINGS . '[different-transparent-logo]', '==', true ),
					'priority'       => 31,
					'title'          => __( 'Logo', 'astra' ),
					'library_filter' => array( 'gif', 'jpg', 'jpeg', 'png', 'ico' ),
					'partial'        => array(
						'selector'            => '.ast-replace-site-logo-transparent .site-branding .site-logo-img',
						'container_inclusive' => false,
					),
					'context'        => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Different retina logo
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[different-transparent-retina-logo]',
					'default'  => false,
					'type'     => 'control',
					'section'  => 'section-transparent-header',
					'title'    => __( 'Different Logo For Retina Devices?', 'astra' ),
					'required' => array( ASTRA_THEME_SETTINGS . '[different-transparent-logo]', '==', true ),
					'priority' => 32,
					'control'  => 'checkbox',
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Transparent header logo selector
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[transparent-header-retina-logo]',
					'default'        => astra_get_option( 'transparent-header-retina-logo' ),
					'type'           => 'control',
					'control'        => 'image',
					'section'        => 'section-transparent-header',
					'required'       => array( ASTRA_THEME_SETTINGS . '[different-transparent-retina-logo]', '==', true ),
					'priority'       => 33,
					'title'          => __( 'Retina Logo', 'astra' ),
					'library_filter' => array( 'gif', 'jpg', 'jpeg', 'png', 'ico' ),
					'context'        => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Transparent header logo width
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[transparent-header-logo-width]',
					'default'     => astra_get_option( 'transparent-header-logo-width' ),
					'type'        => 'control',
					'transport'   => 'postMessage',
					'control'     => 'ast-responsive-slider',
					'section'     => 'section-transparent-header',
					'required'    => array( ASTRA_THEME_SETTINGS . '[different-transparent-logo]', '==', true ),
					'priority'    => 34,
					'title'       => __( 'Logo Width', 'astra' ),
					'input_attrs' => array(
						'min'  => 50,
						'step' => 1,
						'max'  => 600,
					),
					'context'     => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Bottom Border
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[transparent-header-main-sep]',
					'default'     => astra_get_option( 'transparent-header-main-sep' ),
					'type'        => 'control',
					'transport'   => 'postMessage',
					'control'     => 'ast-slider',
					'section'     => 'section-transparent-header',
					'priority'    => 40,
					'title'       => __( 'Bottom Border', 'astra' ),
					'input_attrs' => array(
						'min'  => 0,
						'step' => 1,
						'max'  => 600,
					),
					'context'     => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Bottom Border Color
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[transparent-header-main-sep-color]',
					'default'   => astra_get_option( 'transparent-header-main-sep-color' ),
					'type'      => 'control',
					'transport' => 'postMessage',
					'control'   => 'ast-color',
					'section'   => 'section-transparent-header',
					'priority'  => 41,
					'title'     => __( 'Bottom Border Color', 'astra' ),
					'context'   => Astra_Constants::$design_tab,
				),

				array(
					'name'      => ASTRA_THEME_SETTINGS . '[transparent-header-background-colors]',
					'default'   => astra_get_option( 'transparent-header-background-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Background Color', 'astra' ),
					'section'   => 'section-transparent-header',
					'transport' => 'postMessage',
					'priority'  => 35,
					'context'   => Astra_Constants::$design_tab,
				),

				array(
					'name'      => ASTRA_THEME_SETTINGS . '[transparent-header-colors]',
					'default'   => astra_get_option( 'transparent-header-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Site Title Color', 'astra' ),
					'section'   => 'section-transparent-header',
					'transport' => 'postMessage',
					'priority'  => 35,
					'context'   => Astra_Constants::$design_tab,
				),

				array(
					'name'      => ASTRA_THEME_SETTINGS . '[transparent-header-colors-menu]',
					'default'   => astra_get_option( 'transparent-header-colors-menu' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Menu Color', 'astra' ),
					'section'   => 'section-transparent-header',
					'transport' => 'postMessage',
					'priority'  => 35,
					'context'   => Astra_Constants::$design_tab,
				),

				array(
					'name'      => ASTRA_THEME_SETTINGS . '[transparent-header-colors-submenu]',
					'default'   => astra_get_option( 'transparent-header-colors-submenu' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Submenu Color', 'astra' ),
					'section'   => 'section-transparent-header',
					'transport' => 'postMessage',
					'priority'  => 35,
					'context'   => Astra_Constants::$design_tab,
				),

				array(
					'name'      => ASTRA_THEME_SETTINGS . '[transparent-header-colors-content]',
					'default'   => astra_get_option( 'transparent-header-colors-content' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Content Color', 'astra' ),
					'section'   => 'section-transparent-header',
					'transport' => 'postMessage',
					'priority'  => 35,
					'context'   => Astra_Constants::$design_tab,
				),
			);

			$wp_customize->remove_control( 'astra-settings[divider-section-transparent-styling]' );
			$wp_customize->remove_control( 'astra-settings[divider-section-transparent-border-styling]' );
			$wp_customize->remove_control( 'astra-settings[divider-sec-transparent-styling]' );
			return array_merge( $configurations, $_configs );
		}
	}

	/**
	 * Kicking this off by creating object of this class.
	 */
	new Astra_Customizer_Transparent_Header_Builder_Configs();
}
