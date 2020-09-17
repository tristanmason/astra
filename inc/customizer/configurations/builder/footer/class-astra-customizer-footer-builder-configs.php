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

		for ( $index = 1; $index <= Astra_Constants::$num_of_footer_html; $index++ ) {

			self::$footer_items[ 'html-' . $index ] = array(
				'name'    => 'HTML ' . $index,
				'icon'    => 'text',
				'section' => 'section-fb-html-' . $index,
			);
		}

		for ( $index = 1; $index <= Astra_Constants::$num_of_footer_widgets; $index++ ) {

			self::$footer_items[ 'widget-' . $index ] = array(
				'name'    => 'Widget ' . $index,
				'icon'    => 'wordpress',
				'section' => 'sidebar-widgets-footer-widget-' . $index,
			);
		}

		$_configs = array(

			array(
				'name'     => 'panel-footer-builder-group',
				'type'     => 'panel',
				'priority' => 60,
				'title'    => __( 'Footer Builder', 'astra' ),
			),

			/**
			 * Option: Footer Layout
			 */
			array(
				'name'     => 'section-footer-builder-layout',
				'type'     => 'section',
				'priority' => 5,
				'title'    => __( 'Footer Layout', 'astra' ),
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
				'title'    => __( 'Footer Builder', 'astra' ),
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
				'name'      => ASTRA_THEME_SETTINGS . '[footer-bg-obj-responsive]',
				'type'      => 'control',
				'control'   => 'ast-responsive-background',
				'default'   => astra_get_option( 'footer-bg-obj-responsive' ),
				'section'   => 'section-footer-builder-layout',
				'transport' => 'postMessage',
				'priority'  => 70,
				'title'     => __( 'Background', 'astra' ),
				'context'   => Astra_Constants::$design_tab,
			),

			/**
			 * Option: Footer Desktop Items.
			 */
			array(
				'name'            => ASTRA_THEME_SETTINGS . '[footer-desktop-items]',
				'section'         => 'section-footer-builder',
				'type'            => 'control',
				'control'         => 'ast-builder',
				'title'           => __( 'Footer Builder', 'astra' ),
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
					'rows'    => array( 'above', 'primary', 'below' ),
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
				'context'     => Astra_Constants::$general_tab,
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
