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
class Astra_Customizer_Header_Widget_Configs extends Astra_Customizer_Config_Base {



	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_configs = array();

		for ( $index = 1; $index <= Astra_Constants::$num_of_footer_widgets; $index++ ) {
			$_configs[] = array(
				'name'     => 'sidebar-widgets-header-widget-' . $index,
				'type'     => 'section',
				'priority' => 5,
				'title'    => __( 'Widget ', 'astra' ) . $index,
				'panel'    => 'panel-header-builder-group',
			);
		}

		return array_merge( $configurations, $_configs );
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Customizer_Header_Widget_Configs();

