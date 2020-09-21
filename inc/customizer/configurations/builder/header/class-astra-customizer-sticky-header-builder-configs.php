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
				 * Option: Sticky Header Above Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[divider-section-sticky-header-logo]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Logo', 'astra' ),
					'settings' => array(),
					'priority' => 15,
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

			);

			return array_merge( $configurations, $_configs );
		}
	}

	/**
	 * Kicking this off by creating object of this class.
	 */
	new Astra_Customizer_Sticky_Header_Builder_Configs();
}
