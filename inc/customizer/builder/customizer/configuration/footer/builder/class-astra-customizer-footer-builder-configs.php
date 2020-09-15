<?php
/**
 * Astra Theme Customizer Configuration Builder.
 *
 * @package     astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       x.x.x
 */

// No direct access, please.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Bail if Customizer config base class does not exist.
if ( ! class_exists( 'Astra_Customizer_Config_Base' ) ) {
	return;
}

/**
 * Register Builder Customizer Configurations.
 *
 * @since x.x.x
 */
class Astra_Customizer_Footer_Builder_Configs extends Astra_Customizer_Config_Base {

	/**
	 * Footer components.
	 *
	 * @var array
	 * @since x.x.x
	 */
	public static $footer_items = array(
		'social'    => array(
			'name'    => 'Social',
			'icon'    => 'share',
			'section' => 'section-footer-social-icons',
		),
		'copyright' => array(
			'name'    => 'Copyright',
			'icon'    => 'nametag',
			'section' => 'section-footer-copyright',
		),
		'widget-1'  => array(
			'name'    => 'Widget 1',
			'icon'    => 'wordpress',
			'section' => 'sidebar-widgets-footer-widget-1',
		),
		'widget-2'  => array(
			'name'    => 'Widget 2',
			'icon'    => 'wordpress',
			'section' => 'sidebar-widgets-footer-widget-2',
		),
		'widget-3'  => array(
			'name'    => 'Widget 3',
			'icon'    => 'wordpress',
			'section' => 'sidebar-widgets-footer-widget-3',
		),
		'widget-4'  => array(
			'name'    => 'Widget 4',
			'icon'    => 'wordpress',
			'section' => 'sidebar-widgets-footer-widget-4',
		),
		'html-1'    => array(
			'name'    => 'HTML 1',
			'icon'    => 'text',
			'section' => 'section-fb-html-1',
		),
		'html-2'    => array(
			'name'    => 'HTML 2',
			'icon'    => 'text',
			'section' => 'section-fb-html-2',
		),
		'menu'      => array(
			'name'    => 'Footer Menu',
			'icon'    => 'menu',
			'section' => 'section-footer-menu',
		),
	);

	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since x.x.x
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_configs = array(

			array(
				'name'     => 'panel-footer-builder-group',
				'type'     => 'panel',
				'priority' => 60,
				'title'    => __( 'Footer Builder', 'astra-builder', 'astra' ),
			),

			/**
			 * Option: Footer Layout
			 */
			array(
				'name'     => 'section-footer-builder-layout',
				'type'     => 'section',
				'priority' => 5,
				'title'    => __( 'Footer Layout', 'astra-builder', 'astra' ),
				'panel'    => 'panel-footer-builder-group',
			),

			/**
			 * Option: Header Builder Tabs
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[builder-footer-tabs]',
				'section'     => 'section-footer-builder-layout',
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 0,
				'description' => '',
			),

			/*
			* Header Builder section
			*/
			array(
				'name'     => 'section-footer-builder',
				'type'     => 'section',
				'priority' => 5,
				'title'    => __( 'Footer Builder', 'astra-builder', 'astra' ),
				'panel'    => 'panel-footer-builder-group',
				'context'  => array(
					array(
						'setting'  => 'ast_selected_tab',
						'operator' => 'in',
						'value'    => array( 'general', 'design' ),
					),
				),
			),

			/**
			 * Option: Header Builder
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[builder-footer]',
				'section'     => 'section-footer-builder',
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 10,
				'description' => '',
				'context'     => array(
					array(
						'setting'  => 'ast_selected_tab',
						'operator' => 'in',
						'value'    => array( 'general', 'design' ),
					),
				),
			),

			// Group Option: Global Footer Background styling.
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[footer-background-styling]',
				'type'      => 'control',
				'control'   => 'ast-settings-group',
				'title'     => __( 'Background', 'astra-builder', 'astra' ),
				'section'   => 'section-footer-builder-layout',
				'transport' => 'postMessage',
				'priority'  => 70,
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'design',
					),
				),
			),

			// Option: Global Footer Background styling.
			array(
				'name'      => 'footer-bg-obj-responsive',
				'parent'    => ASTRA_THEME_SETTINGS . '[footer-background-styling]',
				'type'      => 'sub-control',
				'section'   => 'section-footer-builder-layout',
				'control'   => 'ast-responsive-background',
				'transport' => 'postMessage',
				'default'   => $defaults['footer-bg-obj-responsive'],
				'label'     => __( 'Background', 'astra-builder', 'astra' ),
				'priority'  => 5,
				'context'   => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),

			/**
			 * Option: Footer Desktop Items.
			 */
			array(
				'name'            => ASTRA_THEME_SETTINGS . '[footer-desktop-items]',
				'section'         => 'section-footer-builder',
				'type'            => 'control',
				'control'         => 'ast-builder',
				'title'           => __( 'Footer Builder', 'astra-builder', 'astra' ),
				'priority'        => 10,
				'default'         => astra_get_option( 'footer-desktop-items' ),
				'choices'         => self::$footer_items,
				'transport'       => 'postMessage',
				'partial'         => array(
					'selector'            => '.ast-site-footer',
					'container_inclusive' => true,
					'render_callback'     => array( Astra_Builder_Footer::get_instance(), 'footer_markup' ),
				),
				'input_attrs'     => array(
					'group'   => ASTRA_THEME_SETTINGS . '[footer-desktop-items]',
					'rows'    => array(
						0 => 'above',
						1 => 'primary',
						2 => 'below',
					),
					'zones'   => array(
						'above'   => array(
							'above_1' => 'Top - Left',
							'above_2' => 'Top - Left Center',
							'above_3' => 'Top - Center',
							'above_4' => 'Top - Right Center',
							'above_5' => 'Top - Right',
						),
						'primary' => array(
							'primary_1' => 'Main - Left',
							'primary_2' => 'Main - Left Center',
							'primary_3' => 'Main - Center',
							'primary_4' => 'Main - Right Center',
							'primary_5' => 'Main - Right',
						),
						'below'   => array(
							'below_1' => 'Bottom - Left',
							'below_2' => 'Bottom - Left Center',
							'below_3' => 'Bottom - Center',
							'below_4' => 'Bottom - Right Center',
							'below_5' => 'Bottom - Right',
						),
					),
					'layouts' => array(
						'above'   => array(
							'column' => astra_get_option( 'hba-footer-column' ),
							'layout' => astra_get_option( 'hba-footer-layout' ),
						),
						'primary' => array(
							'column' => astra_get_option( 'hb-footer-column' ),
							'layout' => astra_get_option( 'hb-footer-layout' ),
						),
						'below'   => array(
							'column' => astra_get_option( 'hbb-footer-column' ),
							'layout' => astra_get_option( 'hbb-footer-layout' ),
						),
					),
					'status'  => array(
						'above'   => true,
						'primary' => true,
						'below'   => true,
					),
				),
				'active_callback' => '__return_true',
				'context'         => array(
					array(
						'setting'  => 'ast_selected_tab',
						'operator' => 'in',
						'value'    => array( 'general', 'design' ),
					),
				),
			),

			/**
			 * Footer Available draggable items.
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[footer-draggable-items]',
				'section'     => 'section-footer-builder-layout',
				'type'        => 'control',
				'control'     => 'ast-draggable-items',
				'input_attrs' => array(
					'group' => ASTRA_THEME_SETTINGS . '[footer-desktop-items]',
					'zones' => array( 'above', 'primary', 'below' ),
				),
				'context'     => array(
					array(
						'setting' => 'ast_selected_tab',
						'value'   => 'general',
					),
				),
			),
		);

		$_configs = array_merge( $_configs, Astra_Builder_Base_Configuration::prepare_advanced_tab( 'section-footer-builder-layout' ) );

		return array_merge( $configurations, $_configs );
	}
}

/**
 * Kicking this off by creating object of this class.
 */
if ( class_exists( 'Astra_Customizer_Config_Base' ) ) {
	new Astra_Customizer_Footer_Builder_Configs();
}
