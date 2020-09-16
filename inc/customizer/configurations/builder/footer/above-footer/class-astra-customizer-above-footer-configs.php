<?php
/**
 * Astra Theme Customizer Configuration Above footer.
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
	 * Register Above footer Customizer Configurations.
	 *
	 * @since x.x.x
	 */
	class Astra_Customizer_Above_Footer_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Builder Above Customizer Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since x.x.x
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$defaults = Astra_Theme_Options::defaults();

			$_section = 'section-above-footer-builder';

			$_configs = array(

				// Section: Above Footer.
				array(
					'name'     => $_section,
					'type'     => 'section',
					'title'    => __( 'Above Footer', 'astra' ),
					'panel'    => 'panel-footer-builder-group',
					'priority' => 30,
				),

				/**
				 * Option: Footer Builder Tabs
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[builder-footer-above-tabs]',
					'section'     => $_section,
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => 0,
					'description' => '',
				),

				// Section: Above Footer Layout Divider.
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[hba-footer-layout-options-separator-divider]',
					'section'  => $_section,
					'priority' => 20,
					'type'     => 'control',
					'control'  => 'ast-divider',
					'settings' => array(),
					'context'  => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
				),

				/**
				 * Option: Column count
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[hba-footer-column]',
					'default'   => astra_get_option( 'hba-footer-column' ),
					'type'      => 'control',
					'control'   => 'select',
					'section'   => $_section,
					'priority'  => 2,
					'title'     => __( 'Column', 'astra' ),
					'choices'   => array(
						'1' => __( '1', 'astra' ),
						'2' => __( '2', 'astra' ),
						'3' => __( '3', 'astra' ),
						'4' => __( '4', 'astra' ),
						'5' => __( '5', 'astra' ),
					),
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
					'transport' => 'postMessage',
					'partial'   => array(
						'selector'            => '.site-above-footer-wrap',
						'container_inclusive' => false,
						'render_callback'     => array( Astra_Builder_Footer::get_instance(), 'above_footer' ),
					),
				),

				/**
				 * Option: Row Layout
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[hba-footer-layout]',
					'section'     => $_section,
					'default'     => astra_get_option( 'hba-footer-layout' ),
					'priority'    => 3,
					'title'       => __( 'Layout', 'astra' ),
					'type'        => 'control',
					'control'     => 'ast-row-layout',
					'context'     => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
					'input_attrs' => array(
						'responsive' => true,
						'footer'     => 'primary',
					),
					'transport'   => 'postMessage',
				),

				/**
				 * Option: Layout Width
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[hba-footer-layout-width]',
					'default'   => astra_get_option( 'hba-footer-layout-width' ),
					'type'      => 'control',
					'control'   => 'select',
					'section'   => $_section,
					'priority'  => 25,
					'title'     => __( 'Width', 'astra' ),
					'choices'   => array(
						'full'    => __( 'Full Width', 'astra' ),
						'content' => __( 'Content Width', 'astra' ),
					),
					'suffix'    => '',
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
					'transport' => 'postMessage',
				),

				// Section: Above Footer Height.
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[hba-footer-height]',
					'section'     => $_section,
					'transport'   => 'postMessage',
					'default'     => astra_get_option( 'hba-footer-height' ),
					'priority'    => 30,
					'title'       => __( 'Height', 'astra' ),
					'type'        => 'control',
					'control'     => 'ast-slider',
					'input_attrs' => array(
						'min'  => 30,
						'step' => 1,
						'max'  => 600,
					),
					'context'     => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
				),

				/**
				 * Option: Vertical Alignment
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[hba-footer-vertical-alignment]',
					'default'   => astra_get_option( 'hba-footer-vertical-alignment' ),
					'type'      => 'control',
					'control'   => 'select',
					'section'   => $_section,
					'priority'  => 34,
					'title'     => __( 'Vertical Alignment', 'astra' ),
					'choices'   => array(
						'flex-start' => __( 'Top', 'astra' ),
						'center'     => __( 'Middle', 'astra' ),
						'flex-end'   => __( 'Bottom', 'astra' ),
					),
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
					'transport' => 'postMessage',
				),

				// Section: Above Footer Border.
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[hba-footer-separator]',
					'section'     => $_section,
					'priority'    => 40,
					'transport'   => 'postMessage',
					'default'     => astra_get_option( 'hba-footer-separator' ),
					'title'       => __( 'Bottom Border', 'astra' ),
					'type'        => 'control',
					'control'     => 'ast-slider',
					'input_attrs' => array(
						'min'  => 0,
						'step' => 1,
						'max'  => 600,
					),
					'context'     => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),

				// Section: Above Footer Border Color.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[hba-footer-bottom-border-color]',
					'transport' => 'postMessage',
					'default'   => astra_get_option( 'hba-footer-bottom-border-color' ),
					'required'  => array( ASTRA_THEME_SETTINGS . '[hba-footer-separator]', '>=', 1 ),
					'type'      => 'control',
					'control'   => 'ast-color',
					'section'   => $_section,
					'priority'  => 50,
					'title'     => __( 'Bottom Border Color', 'astra' ),
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),

				// Section: Above Footer Color & Backgroud Heading.
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[hba-footer-colors-heading]',
					'section'  => $_section,
					'type'     => 'control',
					'control'  => 'ast-heading',
					'priority' => 60,
					'title'    => __( 'Background Color & Image', 'astra' ),
					'context'  => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),

				// Group Option: Above Footer Background styling.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[hba-footer-background-styling]',
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Background', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 70,
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'design',
						),
					),
				),

				// Option: Above Footer Background styling.
				array(
					'name'      => 'hba-footer-bg-obj-responsive',
					'parent'    => ASTRA_THEME_SETTINGS . '[hba-footer-background-styling]',
					'type'      => 'sub-control',
					'section'   => $_section,
					'control'   => 'ast-responsive-background',
					'transport' => 'postMessage',
					'default'   => $defaults['hba-footer-bg-obj-responsive'],
					'label'     => __( 'Background', 'astra' ),
					'priority'  => 5,
					'context'   => array(
						array(
							'setting' => 'ast_selected_tab',
							'value'   => 'general',
						),
					),
				),
			);

			$_configs = array_merge( $_configs, Astra_Builder_Base_Configuration::prepare_advanced_tab( $_section ) );

			return array_merge( $configurations, $_configs );
		}
	}

	/**
	 * Kicking this off by creating object of this class.
	 */
	new Astra_Customizer_Above_Footer_Configs();
}
