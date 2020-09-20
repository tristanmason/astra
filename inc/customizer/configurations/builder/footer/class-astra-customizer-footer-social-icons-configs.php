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
 * Social Icons Customizer Configurations.
 *
 * @since x.x.x
 */
class Astra_Customizer_Footer_Social_Icons_Configs extends Astra_Customizer_Config_Base {

	/**
	 * Social Icons Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$configurations = Astra_Social_Icon_Component_Configs::register_configuration( 'footer', 'Astra_Builder_Footer', $configurations );

		$configs = array(

			/**
			 * Option: Alignment
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[footer-social-alignment]',
				'default'   => astra_get_option( 'footer-social-alignment' ),
				'type'      => 'control',
				'control'   => 'ast-responsive-select',
				'section'   => 'section-footer-social-icons',
				'priority'  => 6,
				'title'     => __( 'Alignment', 'astra' ),
				'choices'   => array(
					'left'   => __( 'Left', 'astra' ),
					'center' => __( 'Center', 'astra' ),
					'right'  => __( 'Right', 'astra' ),
				),
				'context'   => Astra_Constants::$general_tab,
				'transport' => 'postMessage',
			),
		);

		$configurations = array_merge( $configurations, $configs );

		return $configurations;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Customizer_Footer_Social_Icons_Configs();

