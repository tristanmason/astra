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
class Astra_Footer_Widget_Component_Configs extends Astra_Customizer_Config_Base {



	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$html_config = array();

		for ( $index = 1; $index <= Astra_Constants::$num_of_footer_widgets; $index++ ) {

			$_section = 'sidebar-widgets-footer-widget-' . $index;

			$_configs = array(

				/**
				 * Option: Builder Tabs
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[' . $_section . '-tabs]',
					'section'     => $_section,
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => -1,
					'description' => '',

				),
				array(
					'name'     => 'sidebar-widgets-footer-widget-' . $index,
					'type'     => 'section',
					'priority' => 5,
					'title'    => __( 'Widget ', 'astra' ) . $index,
					'panel'    => 'panel-footer-builder-group',
				),

				/**
				 * Option: Column Alignment
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-widget-alignment-' . $index . ']',
					'default'   => astra_get_option( 'footer-widget-alignment-' . $index ),
					'type'      => 'control',
					'control'   => 'ast-responsive-select',
					'section'   => $_section,
					'priority'  => 5,
					'title'     => __( 'Alignment', 'astra' ),
					'choices'   => array(
						'left'   => __( 'Left', 'astra' ),
						'center' => __( 'Center', 'astra' ),
						'right'  => __( 'Right', 'astra' ),
					),
					'transport' => 'postMessage',
					'context'   => Astra_Constants::$general_tab,
				),

				// Option: Above Footer - Widget Color.
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[footer-widget-heading-' . $index . ']',
					'section'  => $_section,
					'type'     => 'control',
					'control'  => 'ast-heading',
					'priority' => 5,
					'title'    => __( 'Widget Colors', 'astra' ),
					'context'  => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Above Footer - Widget Title Color.
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-widget-' . $index . '-title-color]',
					'default'   => astra_get_option( 'footer-widget-' . $index . '-title-color' ),
					'type'      => 'control',
					'section'   => $_section,
					'priority'  => 6,
					'transport' => 'postMessage',
					'control'   => 'ast-color',
					'title'     => __( 'Title Color', 'astra' ),
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Above Footer - Widget Color.
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-widget-' . $index . '-color]',
					'default'   => astra_get_option( 'footer-widget-' . $index . '-color' ),
					'type'      => 'control',
					'section'   => $_section,
					'priority'  => 7,
					'transport' => 'postMessage',
					'control'   => 'ast-color',
					'title'     => __( 'Content Color', 'astra' ),
					'context'   => Astra_Constants::$design_tab,
				),

				/**
				 * Option: Above Footer - Widget Title Color.
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[footer-widget-' . $index . '-link-color]',
					'default'   => astra_get_option( 'footer-widget-' . $index . '-link-color' ),
					'type'      => 'control',
					'section'   => $_section,
					'priority'  => 8,
					'transport' => 'postMessage',
					'control'   => 'ast-color',
					'title'     => __( 'Link Color', 'astra' ),
					'context'   => Astra_Constants::$design_tab,
				),
			);

			$html_config[] = $_configs;
		}

		$html_config = call_user_func_array( 'array_merge', $html_config + array( array() ) );

		$configurations = array_merge( $configurations, $html_config );

		return $configurations;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Footer_Widget_Component_Configs();

