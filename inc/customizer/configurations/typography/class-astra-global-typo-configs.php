<?php
/**
 * Styling Options for Astra Theme.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       Astra 1.0.15
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Customizer Sanitizes Initial setup
 */
class Astra_Global_Typo_Configs extends Astra_Customizer_Config_Base {

	/**
	 * Register Body Typography Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since 1.4.3
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_configs = array(

			/**
			 * Option: Font Family
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[font-presets]',
				'type'        => 'control',
				'control'     => 'ast-font-presets',
				'default'     => get_option( 'ast-font-presets', 'rufine' ),
				'options'     => array(
					'rufine' => array(
						'preview'            => ASTRA_THEME_URI . 'inc/assets/images/font-svg/font-rufina-sourcesanspro.svg',
						"body-font-family"   => "'Source Sans Pro', sans-serif",
						"body-font-variant"  => "400",
						"body-font-weight"   => "400",
						"font-size-body"     => array(
							"desktop"      => 17,
							"tablet"       => "",
							"mobile"       => "",
							"desktop-unit" => "px",
							"tablet-unit"  => "px",
							"mobile-unit"  => "px"
						),
						"body-line-height"      => 1.7,
						"headings-font-family"  => "'Rufina', serif",
						"headings-font-weight"  => "700",
						"headings-line-height"  => "",
						"headings-font-variant" => "700",
					),
					'sriracha' => array(
						'preview'            => ASTRA_THEME_URI . 'inc/assets/images/font-svg/font-sriracha-opensans.svg',
						"body-font-family"   => "'Open Sans', sans-serif",
						"body-font-variant"  => "400",
						"body-font-weight"   => "400",
						"font-size-body"     => array(
							"desktop"      => 16,
							"tablet"       => "",
							"mobile"       => "",
							"desktop-unit" => "px",
							"tablet-unit"  => "px",
							"mobile-unit"  => "px"
						),
						"body-line-height"      => 1.7,
						"headings-font-family"  => "'Sriracha', handwriting",
						"headings-font-weight"  => "700",
						"headings-line-height"  => "",
						"headings-font-variant" => "700",
					),
					'lato' => array(
						"preview"           => ASTRA_THEME_URI . 'inc/assets/images/font-svg/font-dmseriftext-lato.svg',
						"body-font-family"  => "'Lato', sans-serif",
						"body-font-variant" => "400",
						"body-font-weight"  => "400",
						"font-size-body"=> array(
							"desktop"      => 16,
							"tablet"       => "",
							"mobile"       => "",
							"desktop-unit" => "px",
							"tablet-unit"  => "px",
							"mobile-unit"  => "px"
						),
						"body-line-height"      => 1.8,
						"headings-font-family"  => "'DM Serif Text', serif",
						"headings-font-weight"  => "400",
						"headings-line-height"  => "",
						"headings-font-variant" => "400",
					)
				),
				'section'     => 'section-global-typo',
				'transport'   => 'postMessage',
				'priority'    => 5,
				'title'       => __( 'Font Presets', 'astra' ),
			),

		);

		return array_merge( $configurations, $_configs );
	}
}

new Astra_Global_Typo_Configs();
