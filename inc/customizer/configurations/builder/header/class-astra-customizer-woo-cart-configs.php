<?php
/**
 * Astra Theme Customizer Configuration Builder.
 *
 * @package     astra-builder
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       3.0.0
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
 * @since 3.0.0
 */
class Astra_Customizer_Woo_Cart_Configs extends Astra_Customizer_Config_Base {


	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since 3.0.0
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {
		$_section = ( Astra_Builder_Helper::$is_header_footer_builder_active ) ? 'section-header-woo-cart' : 'section-woo-general';

		$defaults = Astra_Theme_Options::defaults();

		$_configs = array(

			/**
			 * Option: Header cart total
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[woo-header-cart-total-display]',
				'default'   => astra_get_option( 'woo-header-cart-total-display' ),
				'type'      => 'control',
				'section'   => $_section,
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'            => '.ast-header-woo-cart',
					'container_inclusive' => false,
					'render_callback'     => array( 'Astra_Builder_Header', 'header_woo_cart' ),
				),
				'title'     => __( 'Display Cart Total', 'astra' ),
				'priority'  => 50,
				'control'   => 'checkbox',
				'context'   => Astra_Builder_Helper::$general_tab,
			),

			/**
			 * Option: Cart Title
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[woo-header-cart-title-display]',
				'default'   => astra_get_option( 'woo-header-cart-title-display' ),
				'type'      => 'control',
				'section'   => $_section,
				'title'     => __( 'Display Cart Title', 'astra' ),
				'priority'  => 55,
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'            => '.ast-header-woo-cart',
					'container_inclusive' => false,
					'render_callback'     => array( 'Astra_Builder_Header', 'header_woo_cart' ),
				),
				'control'   => 'checkbox',
				'context'   => Astra_Builder_Helper::$general_tab,
			),

			/**
			 * Option: Icon Style
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[woo-header-cart-icon-style]',
				'default'   => astra_get_option( 'woo-header-cart-icon-style' ),
				'type'      => 'control',
				'transport' => 'postMessage',
				'section'   => $_section,
				'title'     => __( 'Style', 'astra' ),
				'control'   => 'select',
				'priority'  => 45,
				'choices'   => array(
					'none'    => __( 'None', 'astra' ),
					'outline' => __( 'Outline', 'astra' ),
					'fill'    => __( 'Fill', 'astra' ),
				),
				'context'   => Astra_Builder_Helper::$design_tab,
			),

			/**
			 * Option: Icon color
			 */
			array(
				'name'              => ASTRA_THEME_SETTINGS . '[header-woo-cart-icon-color]',
				'default'           => astra_get_option( 'header-woo-cart-icon-color' ),
				'type'              => 'control',
				'control'           => 'ast-color',
				'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_alpha_color' ),
				'transport'         => 'postMessage',
				'title'             => __( 'Color', 'astra' ),
				'context'           => array(
					Astra_Builder_Helper::$design_tab_config,
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[woo-header-cart-icon-style]',
						'operator' => '!=',
						'value'    => 'none',
					),
				),
				'section'           => $_section,
				'priority'          => 45,
			),

			/**
			 * Option: Border Radius
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[woo-header-cart-icon-radius]',
				'default'     => astra_get_option( 'woo-header-cart-icon-radius' ),
				'type'        => 'control',
				'transport'   => 'postMessage',
				'section'     => $_section,
				'context'     => array(
					Astra_Builder_Helper::$design_tab_config,
					array(
						'setting'  => ASTRA_THEME_SETTINGS . '[woo-header-cart-icon-style]',
						'operator' => '!=',
						'value'    => 'none',
					),
				),
				'title'       => __( 'Border Radius', 'astra' ),
				'control'     => 'ast-slider',
				'priority'    => 47,
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 200,
				),
			),
		);

		$configurations = array_merge( $configurations, $_configs );

		if ( Astra_Builder_Helper::$is_header_footer_builder_active ) {
			$_configs = array(
				/**
				* Woo Cart section
				*/
				array(
					'name'     => $_section,
					'type'     => 'section',
					'priority' => 5,
					'title'    => __( 'WooCommerce Cart', 'astra' ),
					'panel'    => 'panel-header-builder-group',
				),

				/**
				 * Woo Cart Tabs
				 */
				array(
					'name'        => $_section . '-ast-context-tabs',
					'section'     => $_section,
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => 0,
					'description' => '',
				),

				/**
				 * Option: Divider
				 * Option: WOO cart tray Section divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[section-woo-cart-tray-divider]',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'section'  => $_section,
					'title'    => __( 'Cart Tray', 'astra' ),
					'priority' => 60,
					'settings' => array(),
					'context'  => Astra_Builder_Helper::$design_tab,
				),

				// Cart general colors.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-woo-cart-colors]',
					'default'   => astra_get_option( 'header-woo-cart-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'General', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 65,
					'context'   => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Link / Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-colors]',
					'section'    => $_section,
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-cart-text-color',
					'default'    => astra_get_option( 'header-woo-cart-text-color' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Link / Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-colors]',
					'section'    => $_section,
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-cart-link-color',
					'default'    => astra_get_option( 'header-woo-cart-link-color' ),
					'title'      => __( 'Link Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Background Color.
				array(
					'type'       => 'sub-control',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-colors]',
					'section'    => $_section,
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-cart-background-color',
					'default'    => astra_get_option( 'header-woo-cart-background-color' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Separator Color.
				array(
					'type'       => 'sub-control',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-colors]',
					'section'    => $_section,
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-cart-separator-color',
					'default'    => astra_get_option( 'header-woo-cart-separator-color' ),
					'title'      => __( 'Separator Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Link Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'tab'        => __( 'Hover', 'astra' ),
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-colors]',
					'section'    => $_section,
					'transport'  => 'postMessage',
					'name'       => 'header-woo-cart-link-hover-color',
					'default'    => astra_get_option( 'header-woo-cart-link-hover-color' ),
					'title'      => __( 'Link Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Cart Button colors.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-woo-cart-button-colors]',
					'default'   => astra_get_option( 'header-woo-cart-button-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'View Cart Button', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 70,
					'context'   => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Button Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-button-colors]',
					'section'    => $_section,
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-cart-btn-text-color',
					'default'    => astra_get_option( 'header-woo-cart-btn-text-color' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Button Background Color.
				array(
					'type'       => 'sub-control',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-button-colors]',
					'section'    => $_section,
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-cart-btn-background-color',
					'default'    => astra_get_option( 'header-woo-cart-btn-background-color' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Button Hover Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'tab'        => __( 'Hover', 'astra' ),
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-button-colors]',
					'section'    => $_section,
					'transport'  => 'postMessage',
					'name'       => 'header-woo-cart-btn-text-hover-color',
					'default'    => astra_get_option( 'header-woo-cart-btn-text-hover-color' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Cart Button Hover Background Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-cart-button-colors]',
					'section'    => $_section,
					'tab'        => __( 'Hover', 'astra' ),
					'name'       => 'header-woo-cart-btn-bg-hover-color',
					'default'    => astra_get_option( 'header-woo-cart-btn-bg-hover-color' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Checkout Button colors.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[header-woo-checkout-button-colors]',
					'default'   => astra_get_option( 'header-woo-checkout-button-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'title'     => __( 'Checkout Button', 'astra' ),
					'section'   => $_section,
					'transport' => 'postMessage',
					'priority'  => 75,
					'context'   => Astra_Builder_Helper::$design_tab,
				),

				// Option: Checkout Button Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-checkout-button-colors]',
					'section'    => $_section,
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-checkout-btn-text-color',
					'default'    => astra_get_option( 'header-woo-checkout-btn-text-color' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Checkout Button Background Color.
				array(
					'type'       => 'sub-control',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-checkout-button-colors]',
					'section'    => $_section,
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'header-woo-checkout-btn-background-color',
					'default'    => astra_get_option( 'header-woo-checkout-btn-background-color' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Checkout Button Hover Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'tab'        => __( 'Hover', 'astra' ),
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-checkout-button-colors]',
					'section'    => $_section,
					'transport'  => 'postMessage',
					'name'       => 'header-woo-checkout-btn-text-hover-color',
					'default'    => astra_get_option( 'header-woo-checkout-btn-text-hover-color' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
					'context'    => Astra_Builder_Helper::$design_tab,
				),

				// Option: Checkout Button Hover Background Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'parent'     => ASTRA_THEME_SETTINGS . '[header-woo-checkout-button-colors]',
					'section'    => $_section,
					'tab'        => __( 'Hover', 'astra' ),
					'name'       => 'header-woo-checkout-btn-bg-hover-color',
					'default'    => astra_get_option( 'header-woo-checkout-btn-bg-hover-color' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
					'context'    => Astra_Builder_Helper::$design_tab,
				),
			);

			$_configs = array_merge( $_configs, Astra_Builder_Base_Configuration::prepare_visibility_tab( $_section ) );

		} else {
			$_configs = array(
				/**
				 * Option: Divider
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[header-cart-icon-divider]',
					'section'  => $_section,
					'title'    => __( 'Header Cart Icon', 'astra' ),
					'type'     => 'control',
					'control'  => 'ast-heading',
					'priority' => 30,
					'settings' => array(),
					'context'  => Astra_Builder_Helper::$general_tab,
				),
			);
		}

		$configurations = array_merge( $configurations, $_configs );

		return $configurations;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Customizer_Woo_Cart_Configs();
