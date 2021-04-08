<?php
/**
 * Styling Options for Astra Theme.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       1.4.3
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Astra_Body_Colors_Configs' ) ) {

	/**
	 * Register Body Color Customizer Configurations.
	 */
	class Astra_Body_Colors_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Body Color Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since 1.4.3
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$_section = ( defined( 'ASTRA_EXT_VER' ) && Astra_Ext_Extension::is_active( 'colors-and-background' ) ) ? 'section-colors-body' : 'section-colors-background';

			$_configs = array(

				array(
					'name'      => ASTRA_THEME_SETTINGS . '[selected-color-palette]',
					'type'      => 'control',
					'control'   => 'ast-hidden',
					'section'   => $_section,
					'priority'  => 5,
					'default'   => astra_get_option( 'selected-color-palette' ),
					'settings'  => array(),
					'transport' => 'postMessage',
				),

				array(
					'name'      => 'astra-global-color-palette',
					'type'      => 'control',
					'control'   => 'ast-color-palette',
					'section'   => $_section,
					'priority'  => 5,
					'title'     => __( 'Global Palette', 'astra' ),
					'default'   => get_option(
						'astra-global-color-palette',
						array(
							'currentPalette' => 'palette-1',
							'isVisible'      => false,
							'labels'         => array(
								__( 'Text Color', 'astra' ),
								__( 'Theme color', 'astra' ),
								__( 'Link color', 'astra' ),
								__( 'Link Hover Color', 'astra' ),
								__( 'Heading Color (H1 - H6)', 'astra' ),
							),
							'palettes'       => array(
								'palette-1' => array(
									'#7e6c6c',
									'#f87575',
									'#ffa9a3',
									'#b9e6ff',
									'#5c95ff',
									'#F3F4F7',
									'#F9F9FB',
									'#FFFFFF',
									'#7B8794',
								),
								'palette-2' => array(
									'#562c2c',
									'#f2542d',
									'#f5dfbb',
									'#0e9594',
									'#127475',
									'#F3F4F7',
									'#F9F9FB',
									'#FFFFFF',
									'#7B8794',
								),
								'palette-3' => array(
									'#0d1b2a',
									'#1b263b',
									'#415a77',
									'#778da9',
									'#e0e1dd',
									'#F3F4F7',
									'#F9F9FB',
									'#FFFFFF',
									'#7B8794',
								),
							),
						)
					),
					'transport' => 'postMessage',
				),

				/**
				 * Option: Text Color
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[text-color]',
					'default'  => astra_get_option( 'text-color', '#3a3a3a' ),
					'type'     => 'control',
					'control'  => 'ast-color',
					'section'  => $_section,
					'priority' => 5,
					'title'    => __( 'Text Color', 'astra' ),
				),

				/**
				 * Option: Theme Color
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[theme-color]',
					'type'     => 'control',
					'control'  => 'ast-color',
					'section'  => $_section,
					'default'  => astra_get_option( 'theme-color', '#0274be' ),
					'priority' => 5,
					'title'    => __( 'Theme Color', 'astra' ),
				),

				/**
				 * Option: Link Color
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[link-color]',
					'section'  => $_section,
					'type'     => 'control',
					'control'  => 'ast-color',
					'default'  => astra_get_option( 'link-color', '#0274be' ),
					'priority' => 5,
					'title'    => __( 'Link Color', 'astra' ),
				),

				/**
				 * Option: Link Hover Color
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[link-h-color]',
					'section'  => $_section,
					'default'  => astra_get_option( 'link-h-color', '#3a3a3a' ),
					'type'     => 'control',
					'control'  => 'ast-color',
					'priority' => 15,
					'title'    => __( 'Link Hover Color', 'astra' ),
				),
			);

			$configurations = array_merge( $configurations, $_configs );

			return $configurations;
		}
	}
}

new Astra_Body_Colors_Configs();
