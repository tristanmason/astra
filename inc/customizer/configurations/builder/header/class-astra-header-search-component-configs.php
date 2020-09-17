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
class Astra_Header_Search_Component_Configs extends Astra_Customizer_Config_Base {


	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_section              = 'section-header-search';
		$is_astra_addon_active = defined( 'ASTRA_EXT_VER' );
		$defaults              = Astra_Theme_Options::defaults();

		$_configs = array(

			/*
			* Header Builder section
			*/
			array(
				'name'     => $_section,
				'type'     => 'section',
				'priority' => 80,
				'title'    => __( 'Search', 'astra' ),
				'panel'    => 'panel-header-builder-group',
			),

			/**
			 * Option: Header Builder Tabs
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[hs-search-tabs]',
				'section'     => $_section,
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 0,
				'description' => '',
			),

			/**
			 * Option: Search Color.
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-search-icon-color]',
				'default'   => '',
				'type'      => 'control',
				'section'   => $_section,
				'priority'  => 8,
				'transport' => 'postMessage',
				'control'   => 'ast-color',
				'title'     => __( 'Icon Color', 'astra' ),
				'context'   => Astra_Constants::$design_tab,
			),

			/**
			 * Option: Search Size
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[header-search-icon-space]',
				'section'     => $_section,
				'priority'    => 2,
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
				'context'     => Astra_Constants::$general_tab,
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

		if ( $is_astra_addon_active ) {
			/**
			 * Option: Pro Search Bar Configs.
			 */
			$_addon_dependent_configs = array(
				// Option: Header Search Style.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-search-box-type]',
					'default'   => $defaults['header-search-box-type'],
					'section'   => $_section,
					'priority'  => 10,
					'title'     => __( 'Search Style', 'astra' ),
					'type'      => 'control',
					'control'   => 'select',
					'choices'   => array(
						'slide-search' => __( 'Slide Search', 'astra' ),
						'full-screen'  => __( 'Full Screen Search', 'astra' ),
						'header-cover' => __( 'Header Cover Search', 'astra' ),
						'search-box'   => __( 'Search Box', 'astra' ),
					),
					'context'   => Astra_Constants::$general_tab,
					'transport' => 'postMessage',
					'partial'   => array(
						'selector'            => '.ast-header-search',
						'container_inclusive' => false,
						'render_callback'     => array( 'Astra_Builder_Header', 'header_search' ),
					),
				),
			);

			$_configs = array_merge( $_configs, $_addon_dependent_configs );
		}

		return array_merge( $configurations, $_configs );
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Header_Search_Component_Configs();

