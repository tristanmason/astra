<?php
/**
 * Footer Copyright Configuration Builder.
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
class Astra_Customizer_Copyright_Configs extends Astra_Customizer_Config_Base {


	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_section = 'section-footer-copyright';
		$_configs = array(

			/*
			* Footer Builder section
			*/
			array(
				'name'     => $_section,
				'type'     => 'section',
				'priority' => 5,
				'title'    => __( 'Copyright', 'astra-builder', 'astra' ),
				'panel'    => 'panel-footer-builder-group',
			),

			/**
			 * Option: Footer Builder Tabs
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[builder-footer-copyright-tabs]',
				'section'     => $_section,
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 0,
				'description' => '',
			),

			/**
			 * Option: Footer Copyright Html Editor.
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[footer-copyright-editor]',
				'type'        => 'control',
				'control'     => 'ast-html-editor',
				'section'     => $_section,
				'transport'   => 'postMessage',
				'priority'    => 4,
				'default'     => 'Copyright [copyright] [current_year] [site_title] | [theme_author]',
				'input_attrs' => array(
					'id'       => 'ast-footer-copyright',
					'toolbar1' => 'bold,italic,bullist,numlist,link,ast_placeholders',
				),
				'partial'     => array(
					'selector'            => '.ast-footer-copyright',
					'container_inclusive' => true,
					'render_callback'     => array( Astra_Builder_Footer::get_instance(), 'ast_footer_copyright' ),
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			/**
			 * Option: Column Alignment
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[footer-copyright-alignment]',
				'default'   => astra_get_option( 'footer-copyright-alignment' ),
				'type'      => 'control',
				'control'   => 'ast-responsive-select',
				'section'   => $_section,
				'priority'  => 6,
				'title'     => __( 'Alignment', 'astra-builder', 'astra' ),
				'choices'   => array(
					'left'   => __( 'Left', 'astra-builder', 'astra' ),
					'right'  => __( 'Right', 'astra-builder', 'astra' ),
					'center' => __( 'Center', 'astra-builder', 'astra' ),
				),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
				'transport' => 'postMessage',
			),

			/**
			 * Option: Social Icon Color.
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[footer-copyright-color]',
				'default'   => astra_get_option( 'footer-copyright-color' ),
				'type'      => 'control',
				'section'   => $_section,
				'priority'  => 8,
				'transport' => 'postMessage',
				'control'   => 'ast-color',
				'title'     => __( 'Color', 'astra-builder', 'astra' ),
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),
		);

		$_configs = array_merge( $_configs, Astra_Builder_Base_Configuration::prepare_margin_tab( $_section ) );
		$_configs = array_merge( $_configs, Astra_Builder_Base_Configuration::prepare_typography_options( $_section ) );
		return array_merge( $configurations, $_configs );
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Customizer_Copyright_Configs();

