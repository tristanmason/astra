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
	class Astra_Customizer_Site_Identity_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Builder Site Identity Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since x.x.x
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$_section = 'title_tagline';

			$_configs = array(

				/*
				 * Update the Site Identity section inside Layout -> Header
				 *
				 * @since x.x.x
				 */
				array(
					'name'     => 'title_tagline',
					'type'     => 'section',
					'priority' => 100,
					'title'    => __( 'Logo', 'astra' ),
					'panel'    => 'panel-header-builder-group',
				),

				/**
				 * Option: Header Site Title.
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[site-title-typography]',
					'default'   => astra_get_option( 'site-title-typography' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Title', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 16,
					'required'  => array(
						ASTRA_THEME_SETTINGS . '[display-site-title]',
						'==',
						true,
					),
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Options: Site Tagline.
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[site-tagline-typography]',
					'default'   => astra_get_option( 'site-tagline-typography' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Tagline', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 20,
					'required'  => array(
						ASTRA_THEME_SETTINGS . '[display-site-tagline]',
						'==',
						true,
					),
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[ast-site-logo-divider]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'title'    => __( 'Site Icon', 'astra' ),
					'section'  => 'title_tagline',
					'priority' => 15,
					'settings' => array(),
					'context'  => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Display Title
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[display-site-title]',
					'type'      => 'control',
					'control'   => 'checkbox',
					'default'   => astra_get_option( 'display-site-title' ),
					'section'   => 'title_tagline',
					'title'     => __( 'Display Site Title', 'astra' ),
					'priority'  => 7,
					'transport' => 'postMessage',
					'partial'   => array(
						'selector'            => '.site-branding',
						'container_inclusive' => true,
						'render_callback'     => array( Astra_Builder_Header::get_instance(), 'site_identity' ),
					),
					'context'   => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Logo inline title.
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[logo-title-inline]',
					'default'   => astra_get_option( 'logo-title-inline' ),
					'type'      => 'control',
					'required'  => array(
						'conditions' => array(
							array( ASTRA_THEME_SETTINGS . '[display-site-title]', '==', true ),
							array( ASTRA_THEME_SETTINGS . '[display-site-tagline]', '==', true ),
						),
						'operator'   => 'OR',
					),
					'control'   => 'checkbox',
					'section'   => 'title_tagline',
					'title'     => __( 'Inline Logo & Site Title', 'astra' ),
					'priority'  => 7,
					'transport' => 'postMessage',
					'partial'   => array(
						'selector'            => '.site-branding',
						'container_inclusive' => false,
						'render_callback'     => array( Astra_Builder_Header::get_instance(), 'site_identity' ),
					),
					'context'   => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Different retina logo
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[different-retina-logo]',
					'type'      => 'control',
					'control'   => 'checkbox',
					'section'   => 'title_tagline',
					'title'     => __( 'Different Logo For Retina Devices?', 'astra' ),
					'default'   => false,
					'priority'  => 5,
					'transport' => 'postMessage',
					'partial'   => array(
						'selector'            => '.site-branding',
						'container_inclusive' => false,
						'render_callback'     => array( Astra_Builder_Header::get_instance(), 'site_identity' ),
					),
					'context'   => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Retina logo selector
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[ast-header-retina-logo]',
					'default'        => astra_get_option( 'ast-header-retina-logo' ),
					'type'           => 'control',
					'control'        => 'image',
					'section'        => 'title_tagline',
					'required'       => array( ASTRA_THEME_SETTINGS . '[different-retina-logo]', '!=', 0 ),
					'priority'       => 5,
					'title'          => __( 'Retina Logo', 'astra' ),
					'library_filter' => array( 'gif', 'jpg', 'jpeg', 'png', 'ico' ),
					'transport'      => 'postMessage',
					'partial'        => array(
						'selector'            => '.site-branding',
						'container_inclusive' => false,
						'render_callback'     => array( Astra_Builder_Header::get_instance(), 'site_identity' ),
					),
					'context'        => Astra_Constants::$general_tab,
				),

				/**
				 * Option: Inherit Desktop logo
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[different-mobile-logo]',
					'type'     => 'control',
					'control'  => 'checkbox',
					'default'  => false,
					'section'  => 'title_tagline',
					'title'    => __( 'Different Logo For Mobile Devices?', 'astra' ),
					'priority' => 5,
					'context'  => array(
						array(
							'setting'  => 'ast_selected_device',
							'operator' => 'in',
							'value'    => array( 'tablet', 'mobile' ),
						),
					),
				),

				/**
				 * Option: Mobile header logo
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[mobile-header-logo]',
					'default'        => astra_get_option( 'mobile-header-logo' ),
					'type'           => 'control',
					'control'        => 'image',
					'required'       => array( ASTRA_THEME_SETTINGS . '[different-mobile-logo]', '==', '1' ),
					'section'        => 'title_tagline',
					'priority'       => 5,
					'title'          => __( 'Mobile Logo (optional)', 'astra' ),
					'library_filter' => array( 'gif', 'jpg', 'jpeg', 'png', 'ico' ),
					'context'        => array(
						array(
							'setting'  => 'ast_selected_device',
							'operator' => 'in',
							'value'    => array( 'tablet', 'mobile' ),
						),
					),
				),

				/**
				 * Option: Header Builder Tabs
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[builder-header-site-identity-tabs]',
					'section'     => $_section,
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => 0,
					'description' => '',
				),

				/**
				 * Option: Design Typography Heading.
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[header-logo-typography-heading]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => 'title_tagline',
					'title'    => __( 'Typography', 'astra' ),
					'priority' => 15,
					'settings' => array(),
					'context'  => Astra_Constants::$design_tab,
					'required' => array(
						'conditions' => array(
							array( ASTRA_THEME_SETTINGS . '[display-site-title]', '==', true ),
							array( ASTRA_THEME_SETTINGS . '[display-site-tagline]', '==', true ),
						),
						'operator'   => 'OR',
					),
				),

				array(
					'name'      => ASTRA_THEME_SETTINGS . '[site-identity-title-color-group]',
					'default'   => astra_get_option( 'site-identity-title-color-group' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Title Color', 'astra' ),
					'section'   => 'title_tagline',
					'transport' => 'postMessage',
					'priority'  => 8,
					'required'  => array(
						ASTRA_THEME_SETTINGS . '[display-site-title]',
						'==',
						true,
					),
					'context'   => Astra_Constants::$design_tab,
				),

				// Option: Site Title Color.
				array(
					'name'      => 'header-color-site-title',
					'parent'    => ASTRA_THEME_SETTINGS . '[site-identity-title-color-group]',
					'section'   => 'title_tagline',
					'type'      => 'sub-control',
					'control'   => 'ast-color',
					'default'   => astra_get_option( 'header-color-site-title' ),
					'transport' => 'postMessage',
					'title'     => __( 'Text Color', 'astra' ),
					'tab'       => __( 'Normal', 'astra' ),
					'context'   => Astra_Constants::$design_tab,
				),

				// Option: Site Title Hover Color.
				array(
					'name'      => 'header-color-h-site-title',
					'parent'    => ASTRA_THEME_SETTINGS . '[site-identity-title-color-group]',
					'section'   => 'title_tagline',
					'type'      => 'sub-control',
					'control'   => 'ast-color',
					'transport' => 'postMessage',
					'default'   => astra_get_option( 'header-color-h-site-title' ),
					'title'     => __( 'Hover Color', 'astra' ),
					'tab'       => __( 'Hover', 'astra' ),
					'context'   => Astra_Constants::$design_tab,
				),

				// Option: Site Tagline Color.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-color-site-tagline]',
					'type'      => 'control',
					'control'   => 'ast-color',
					'transport' => 'postMessage',
					'priority' => 9,
					'default'   => astra_get_option( 'header-color-site-tagline' ),
					'title'     => __( 'Tagline Color', 'astra' ),
					'section'   => 'title_tagline',
					'required'  => array(
						ASTRA_THEME_SETTINGS . '[display-site-tagline]',
						'==',
						true,
					),
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Margin heading
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[' . $_section . '-margin-heading]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Margin', 'astra' ),
					'priority' => 200,
					'settings' => array(),
					'context'  => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Margin Space
				 */
				array(
					'name'           => ASTRA_THEME_SETTINGS . '[' . $_section . '-margin]',
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
					'context'        => Astra_Constants::$design_tab,
				),
			);

			$wp_customize->remove_control( 'astra-settings[divider-section-site-identity-logo]' );

			return array_merge( $configurations, $_configs );
		}
	}

	/**
	 * Kicking this off by creating object of this class.
	 */
	new Astra_Customizer_Site_Identity_Configs();
}
