<?php
/**
 * Astra Social Component Dynamic CSS.
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

/**
 * Register Builder Dynamic CSS.
 *
 * @since x.x.x
 */
class Astra_Social_Component_Dynamic_CSS {

	/**
	 * Dynamic CSS
	 *
	 * @param string $builder_type Builder Type.
	 * @param  string $dynamic_css          Astra Dynamic CSS.
	 * @param  string $dynamic_css_filtered Astra Dynamic CSS Filters.
	 * @return String Generated dynamic CSS for Heading Colors.
	 *
	 * @since x.x.x
	 */
	public static function astra_social_dynamic_css( $builder_type = 'header', $dynamic_css, $dynamic_css_filtered = '' ) {

		if ( ! Astra_Builder_Helper::is_component_loaded( $builder_type, 'social' ) ) {
			return $dynamic_css;
		}

		$selector = '.ast-builder-layout-element .ast-' . $builder_type . '-social-wrap';
		$_section = 'section-' . $builder_type . '-social-icons';

		$icon_spacing    = astra_get_option( $builder_type . '-social-icons-icon-space' );
		$icon_bg_spacing = astra_get_option( $builder_type . '-social-icons-icon-bg-space' );
		$icon_size       = astra_get_option( $builder_type . '-social-icons-icon-size' );
		$icon_radius     = astra_get_option( $builder_type . '-social-icons-icon-radius' );

		$icon_spacing    = ( isset( $icon_spacing ) && ! empty( $icon_spacing ) ) ? $icon_spacing / 2 : '';
		$icon_size       = ( isset( $icon_size ) && ! empty( $icon_size ) ) ? $icon_size : '';
		$icon_radius     = ( isset( $icon_radius ) && ! empty( $icon_radius ) ) ? $icon_radius : '';
		$icon_bg_spacing = ( isset( $icon_bg_spacing ) && ! empty( $icon_bg_spacing ) ) ? $icon_bg_spacing : '';

		// Normal Responsive Colors.
		$social_icons_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-icons-color' ), 'desktop' );
		$social_icons_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-color' ), 'tablet' );
		$social_icons_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-color' ), 'mobile' );

		// Hover Responsive Colors.
		$social_icons_h_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-icons-h-color' ), 'desktop' );
		$social_icons_h_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-h-color' ), 'tablet' );
		$social_icons_h_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-h-color' ), 'mobile' );

		// Normal Responsive Bg Colors.
		$social_icons_bg_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-icons-bg-color' ), 'desktop' );
		$social_icons_bg_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-bg-color' ), 'tablet' );
		$social_icons_bg_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-bg-color' ), 'mobile' );

		// Hover Responsive Bg Colors.
		$social_icons_h_bg_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-icons-bg-h-color' ), 'desktop' );
		$social_icons_h_bg_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-bg-h-color' ), 'tablet' );
		$social_icons_h_bg_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-icons-bg-h-color' ), 'mobile' );

		$margin = astra_get_option( $_section . '-margin' );

		/**
		 * Social Icon CSS.
		 */
		$css_output_desktop = array(

			$selector . ' .ast-builder-social-element' => array(
				// Colors.
				'color'         => $social_icons_color_desktop,
				'background'    => $social_icons_bg_color_desktop,

				// Icon Spacing.
				'margin-left'   => astra_get_css_value( $icon_spacing, 'px' ),
				'margin-right'  => astra_get_css_value( $icon_spacing, 'px' ),

				// Icon Background Space.
				'padding'       => astra_get_css_value( $icon_bg_spacing, 'px' ),

				// Icon Radius.
				'border-radius' => astra_get_css_value( $icon_radius, 'px' ),
			),
			$selector . ' .ast-builder-social-element:hover' => array(

				'color'      => $social_icons_h_color_desktop,
				'background' => $social_icons_h_bg_color_desktop,
			),
			$selector . ' .ast-builder-social-element:hover svg' => array(

				'fill' => $social_icons_h_color_desktop,
			),
			$selector . ' .ast-builder-social-element .ahfb-svg-icon' => array(

				// Icon Size.
				'width'  => astra_get_css_value( $icon_size, 'px' ),
				'height' => astra_get_css_value( $icon_size, 'px' ),
			),
			$selector . ' .ast-social-icon-image-wrap' => array(

				// Icon Background Space.
				'margin' => astra_get_css_value( $icon_bg_spacing, 'px' ),
			),
			$selector                                  => array(
				// Margin CSS.
				'margin-top'    => astra_responsive_spacing( $margin, 'top', 'desktop' ),
				'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'desktop' ),
				'margin-left'   => astra_responsive_spacing( $margin, 'left', 'desktop' ),
				'margin-right'  => astra_responsive_spacing( $margin, 'right', 'desktop' ),
			),
		);

		/**
		 * Social_icons CSS.
		 */
		$css_output_tablet = array(

			/**
			 * Social_icons Colors.
			 */
			$selector . ' .ast-builder-social-element' => array(
				// Colors.
				'color'      => $social_icons_color_tablet,
				'background' => $social_icons_bg_color_tablet,
			),
			// Hover Options.
			$selector . ' .ast-builder-social-element:hover' => array(
				'color'      => $social_icons_h_color_tablet,
				'background' => $social_icons_h_bg_color_tablet,
			),
			$selector . ' .ast-builder-social-element:hover svg' => array(

				'fill' => $social_icons_h_color_tablet,
			),
			$selector                                  => array(
				// Margin CSS.
				'margin-top'    => astra_responsive_spacing( $margin, 'top', 'tablet' ),
				'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'tablet' ),
				'margin-left'   => astra_responsive_spacing( $margin, 'left', 'tablet' ),
				'margin-right'  => astra_responsive_spacing( $margin, 'right', 'tablet' ),
			),
		);

		/**
		 * Social_icons CSS.
		 */
		$css_output_mobile = array(

			/**
			 * Social_icons Colors.
			 */
			$selector . ' .ast-builder-social-element' => array(
				// Colors.
				'color'      => $social_icons_color_mobile,
				'background' => $social_icons_bg_color_mobile,
			),
			// Hover Options.
			$selector . ' .ast-builder-social-element:hover' => array(
				'color'      => $social_icons_h_color_mobile,
				'background' => $social_icons_h_bg_color_mobile,
			),
			$selector . ' .ast-builder-social-element:hover svg' => array(

				'fill' => $social_icons_h_color_mobile,
			),
			$selector                                  => array(
				// Margin CSS.
				'margin-top'    => astra_responsive_spacing( $margin, 'top', 'mobile' ),
				'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'mobile' ),
				'margin-left'   => astra_responsive_spacing( $margin, 'left', 'mobile' ),
				'margin-right'  => astra_responsive_spacing( $margin, 'right', 'mobile' ),
			),
		);

		/* Parse CSS from array() */
		$css_output  = astra_parse_css( $css_output_desktop );
		$css_output .= astra_parse_css( $css_output_tablet, '', astra_get_tablet_breakpoint() );
		$css_output .= astra_parse_css( $css_output_mobile, '', astra_get_mobile_breakpoint() );

		$css_output .= Astra_Builder_Base_Dynamic_CSS::prepare_advanced_typography_css( $_section, $selector );

		$dynamic_css .= $css_output;

		return $dynamic_css;
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Social_Component_Dynamic_CSS();
