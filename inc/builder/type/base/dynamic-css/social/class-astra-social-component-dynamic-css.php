<?php
/**
 * Astra Social Component Dynamic CSS.
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

/**
 * Register Builder Dynamic CSS.
 *
 * @since 3.0.0
 */
class Astra_Social_Component_Dynamic_CSS {

	/**
	 * Dynamic CSS
	 *
	 * @param string $builder_type Builder Type.
	 * @return String Generated dynamic CSS for Heading Colors.
	 *
	 * @since 3.0.0
	 */
	public static function astra_social_dynamic_css( $builder_type = 'header' ) {

		$generated_css   = '';
		$social_css_flag = false;

		$number_of_social_icons = ( 'header' === $builder_type ) ? Astra_Builder_Helper::$num_of_header_social_icons : Astra_Builder_Helper::$num_of_footer_social_icons;

		for ( $index = 1; $index <= $number_of_social_icons; $index++ ) {

			if ( ! Astra_Builder_Helper::is_component_loaded( $builder_type, 'social-icons-' . $index ) ) {
				continue;
			}
			$social_css_flag = true;
			$selector        = '.ast-' . $builder_type . '-social-' . $index . '-wrap';
			$_section        = ( 'header' === $builder_type ) ? 'section-hb-social-icons-' . $index : 'section-fb-social-icons-' . $index;

			$icon_spacing    = astra_get_option( $builder_type . '-social-' . $index . '-space' );
			$icon_bg_spacing = astra_get_option( $builder_type . '-social-' . $index . '-bg-space' );
			$icon_size       = astra_get_option( $builder_type . '-social-' . $index . '-size' );
			$icon_radius     = astra_get_option( $builder_type . '-social-' . $index . '-radius' );

			$icon_spacing_desktop = ( isset( $icon_spacing['desktop'] ) && ! empty( $icon_spacing['desktop'] ) ) ? $icon_spacing['desktop'] / 2 : '';
			$icon_spacing_tablet  = ( isset( $icon_spacing['tablet'] ) && ! empty( $icon_spacing['tablet'] ) ) ? $icon_spacing['tablet'] / 2 : '';
			$icon_spacing_mobile  = ( isset( $icon_spacing['mobile'] ) && ! empty( $icon_spacing['mobile'] ) ) ? $icon_spacing['mobile'] / 2 : '';

			$icon_size_desktop = ( isset( $icon_size['desktop'] ) && ! empty( $icon_size['desktop'] ) ) ? $icon_size['desktop'] : '';
			$icon_size_tablet  = ( isset( $icon_size['tablet'] ) && ! empty( $icon_size['tablet'] ) ) ? $icon_size['tablet'] : '';
			$icon_size_mobile  = ( isset( $icon_size['mobile'] ) && ! empty( $icon_size['mobile'] ) ) ? $icon_size['mobile'] : '';

			$icon_radius     = ( isset( $icon_radius ) && ! empty( $icon_radius ) ) ? $icon_radius : '';
			$icon_bg_spacing = ( isset( $icon_bg_spacing ) && ! empty( $icon_bg_spacing ) ) ? $icon_bg_spacing : '';

			// Normal Responsive Colors.
			$color_type                 = astra_get_option( $builder_type . '-social-' . $index . '-color-type' );
			$social_icons_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-color' ), 'desktop' );
			$social_icons_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-color' ), 'tablet' );
			$social_icons_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-color' ), 'mobile' );

			// Hover Responsive Colors.
			$social_icons_h_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-h-color' ), 'desktop' );
			$social_icons_h_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-h-color' ), 'tablet' );
			$social_icons_h_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-h-color' ), 'mobile' );

			// Normal Responsive Bg Colors.
			$social_icons_bg_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-bg-color' ), 'desktop' );
			$social_icons_bg_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-bg-color' ), 'tablet' );
			$social_icons_bg_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-bg-color' ), 'mobile' );

			// Hover Responsive Bg Colors.
			$social_icons_h_bg_color_desktop = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-bg-h-color' ), 'desktop' );
			$social_icons_h_bg_color_tablet  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-bg-h-color' ), 'tablet' );
			$social_icons_h_bg_color_mobile  = astra_get_prop( astra_get_option( $builder_type . '-social-' . $index . '-bg-h-color' ), 'mobile' );

			$margin = astra_get_option( $_section . '-margin' );

			/**
			 * Social Icon CSS.
			 */
			$css_output_desktop = array(

				$selector . ' .ast-builder-social-element' => array(
					// Icon Spacing.
					'margin-left'   => astra_get_css_value( $icon_spacing_desktop, 'px' ),
					'margin-right'  => astra_get_css_value( $icon_spacing_desktop, 'px' ),

					// Icon Background Space.
					'padding'       => astra_get_css_value( $icon_bg_spacing, 'px' ),

					// Icon Radius.
					'border-radius' => astra_get_css_value( $icon_radius, 'px' ),
				),
				$selector . ' .ast-builder-social-element svg' => array(

					// Icon Size.
					'width'  => astra_get_css_value( $icon_size_desktop, 'px' ),
					'height' => astra_get_css_value( $icon_size_desktop, 'px' ),
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

			if ( 'custom' === $color_type || is_customize_preview() ) {
				$css_output_desktop[ $selector . ' .ast-builder-social-element svg' ]['fill']                 = $social_icons_color_desktop;
				$css_output_desktop[ $selector . ' .ast-builder-social-element .social-item-label' ]['color'] = $social_icons_color_desktop;
				$css_output_desktop[ $selector . ' .ast-builder-social-element' ]['background']               = $social_icons_bg_color_desktop;

				$css_output_desktop[ $selector . ' .ast-builder-social-element:hover' ]                             = array(
					// Hover.
					'color'      => $social_icons_h_color_desktop,
					'background' => $social_icons_h_bg_color_desktop,
				);
				$css_output_desktop[ $selector . ' .ast-builder-social-element:hover .social-item-label' ]['color'] = $social_icons_h_color_desktop;
				$css_output_desktop[ $selector . ' .ast-builder-social-element:hover svg' ]                         = array(
					'fill' => $social_icons_h_color_desktop,
				);
			}

			/**
			 * Social_icons CSS.
			 */
			$css_output_tablet = array(
				$selector . ' .ast-builder-social-element svg' => array(

					// Icon Size.
					'width'  => astra_get_css_value( $icon_size_tablet, 'px' ),
					'height' => astra_get_css_value( $icon_size_tablet, 'px' ),
				),
				$selector . ' .ast-builder-social-element' => array(
					// Icon Spacing.
					'margin-left'  => astra_get_css_value( $icon_spacing_tablet, 'px' ),
					'margin-right' => astra_get_css_value( $icon_spacing_tablet, 'px' ),
				),
				$selector                                  => array(
					// Margin CSS.
					'margin-top'    => astra_responsive_spacing( $margin, 'top', 'tablet' ),
					'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'tablet' ),
					'margin-left'   => astra_responsive_spacing( $margin, 'left', 'tablet' ),
					'margin-right'  => astra_responsive_spacing( $margin, 'right', 'tablet' ),
				),
			);

			if ( 'custom' === $color_type || is_customize_preview() ) {
				$css_output_tablet[ $selector . ' .ast-builder-social-element svg' ]['fill']                 = $social_icons_color_tablet;
				$css_output_tablet[ $selector . ' .ast-builder-social-element .social-item-label' ]['color'] = $social_icons_color_tablet;

				$css_output_tablet[ $selector . ' .ast-builder-social-element' ]['background'] = $social_icons_bg_color_tablet;

				$css_output_tablet[ $selector . ' .ast-builder-social-element:hover' ]     = array(
					// Hover.
					'color'      => $social_icons_h_color_tablet,
					'background' => $social_icons_h_bg_color_tablet,
				);
				$css_output_tablet[ $selector . ' .ast-builder-social-element:hover svg' ] = array(
					'fill' => $social_icons_h_color_tablet,
				);
			}

			/**
			 * Social_icons CSS.
			 */
			$css_output_mobile = array(
				$selector . ' .ast-builder-social-element svg' => array(

					// Icon Size.
					'width'  => astra_get_css_value( $icon_size_mobile, 'px' ),
					'height' => astra_get_css_value( $icon_size_mobile, 'px' ),
				),
				$selector . ' .ast-builder-social-element' => array(
					// Icon Spacing.
					'margin-left'  => astra_get_css_value( $icon_spacing_mobile, 'px' ),
					'margin-right' => astra_get_css_value( $icon_spacing_mobile, 'px' ),
				),
				$selector                                  => array(
					// Margin CSS.
					'margin-top'    => astra_responsive_spacing( $margin, 'top', 'mobile' ),
					'margin-bottom' => astra_responsive_spacing( $margin, 'bottom', 'mobile' ),
					'margin-left'   => astra_responsive_spacing( $margin, 'left', 'mobile' ),
					'margin-right'  => astra_responsive_spacing( $margin, 'right', 'mobile' ),
				),
			);

			if ( 'custom' === $color_type || is_customize_preview() ) {
				$css_output_mobile[ $selector . ' .ast-builder-social-element svg' ]['fill']                 = $social_icons_color_mobile;
				$css_output_mobile[ $selector . ' .ast-builder-social-element .social-item-label' ]['color'] = $social_icons_color_mobile;

				$css_output_mobile[ $selector . ' .ast-builder-social-element' ]['background'] = $social_icons_bg_color_mobile;

				$css_output_mobile[ $selector . ' .ast-builder-social-element:hover' ]     = array(
					// Hover.
					'color'      => $social_icons_h_color_mobile,
					'background' => $social_icons_h_bg_color_mobile,
				);
				$css_output_mobile[ $selector . ' .ast-builder-social-element:hover svg' ] = array(
					'fill' => $social_icons_h_color_mobile,
				);
			}

			if ( 'footer' === $builder_type ) {

				// Footer Social Alignment CSS.
				$alignment = astra_get_option( 'footer-social-' . $index . '-alignment' );

				$desktop_alignment = ( isset( $alignment['desktop'] ) ) ? $alignment['desktop'] : '';
				$tablet_alignment  = ( isset( $alignment['tablet'] ) ) ? $alignment['tablet'] : '';
				$mobile_alignment  = ( isset( $alignment['mobile'] ) ) ? $alignment['mobile'] : '';

				$css_output_desktop[ '[data-section="section-fb-social-icons-' . $index . '"] .footer-social-inner-wrap' ] = array( 
					'text-align' => $desktop_alignment,
				);
				$css_output_tablet[ '[data-section="section-fb-social-icons-' . $index . '"] .footer-social-inner-wrap' ]  = array(
					'text-align' => $tablet_alignment,
				);
				$css_output_mobile[ '[data-section="section-fb-social-icons-' . $index . '"] .footer-social-inner-wrap' ]  = array(
					'text-align' => $mobile_alignment,
				);

			}

			/* Parse CSS from array() */
			$css_output  = astra_parse_css( $css_output_desktop );
			$css_output .= astra_parse_css( $css_output_tablet, '', astra_get_tablet_breakpoint() );
			$css_output .= astra_parse_css( $css_output_mobile, '', astra_get_mobile_breakpoint() );

			$css_output .= Astra_Builder_Base_Dynamic_CSS::prepare_advanced_typography_css( $_section, $selector );

			if ( 'header' === $builder_type ) {

				$visibility_selector = '.ast-builder-layout-element[data-section="section-hb-social-icons-' . $index . '"]';
				$css_output         .= Astra_Builder_Base_Dynamic_CSS::prepare_visibility_css( $_section, $visibility_selector );
			}

			$generated_css .= $css_output;
		}
		if ( $social_css_flag ) {
			$generated_css .= self::get_social_static_css();
		}

		return $generated_css;
	}

	/**
	 * Load Social default css.
	 * 
	 * @since 3.0.0
	 */
	public static function get_social_static_css() {
		return '
		/* Social Icons Official CSS */
		.header-social-inner-wrap.ast-social-color-type-official .ast-twitter,
		.header-social-inner-wrap.ast-social-color-type-official .ast-twitter .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-twitter,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-twitter .social-item-label {
		  background: transparent;
		  color: #7acdee;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-instagram,
		.header-social-inner-wrap.ast-social-color-type-official .ast-instagram .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-instagram,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-instagram .social-item-label {
		  background: transparent;
		  color: #292929;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-linkedin,
		.header-social-inner-wrap.ast-social-color-type-official .ast-linkedin .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-linkedin,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-linkedin .social-item-label {
		  background: transparent;
		  color: #1c86c6;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-facebook_group,
		.header-social-inner-wrap.ast-social-color-type-official .ast-facebook_group .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-facebook_group,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-facebook_group .social-item-label {
		  background: transparent;
		  color: #3D87FB;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-discord,
		.header-social-inner-wrap.ast-social-color-type-official .ast-discord .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-discord,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-discord .social-item-label {
		  background: transparent;
		  color: #7187D4;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-pinterest,
		.header-social-inner-wrap.ast-social-color-type-official .ast-pinterest .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-pinterest,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-pinterest .social-item-label {
		  background: transparent;
		  color: #ea575a;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-dribbble,
		.header-social-inner-wrap.ast-social-color-type-official .ast-dribbble .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-dribbble,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-dribbble .social-item-label {
		  background: transparent;
		  color: #d77ea6;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-behance,
		.header-social-inner-wrap.ast-social-color-type-official .ast-behance .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-behance,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-behance .social-item-label {
		  background: transparent;
		  color: #1B64F6;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-medium,
		.header-social-inner-wrap.ast-social-color-type-official .ast-medium .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-medium,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-medium .social-item-label {
		  background: transparent;
		  color: #292929;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-patreon,
		.header-social-inner-wrap.ast-social-color-type-official .ast-patreon .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-patreon,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-patreon .social-item-label {
		  background: transparent;
		  color: #e65c4b;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-vk,
		.header-social-inner-wrap.ast-social-color-type-official .ast-vk .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-vk,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-vk .social-item-label {
		  background: transparent;
		  color: #5382b6;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-reddit,
		.header-social-inner-wrap.ast-social-color-type-official .ast-reddit .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-reddit,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-reddit .social-item-label {
		  background: transparent;
		  color: #FC471E;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-youtube,
		.header-social-inner-wrap.ast-social-color-type-official .ast-youtube .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-youtube,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-youtube .social-item-label {
		  background: transparent;
		  color: #e96651;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-vimeo,
		.header-social-inner-wrap.ast-social-color-type-official .ast-vimeo .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-vimeo,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-vimeo .social-item-label {
		  background: transparent;
		  color: #8ecfde;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-rss,
		.header-social-inner-wrap.ast-social-color-type-official .ast-rss .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-rss,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-rss .social-item-label {
		  background: transparent;
		  color: #f09124;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-whatsapp,
		.header-social-inner-wrap.ast-social-color-type-official .ast-whatsapp .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-whatsapp,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-whatsapp .social-item-label {
		  background: transparent;
		  color: #5BBA67;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-viber,
		.header-social-inner-wrap.ast-social-color-type-official .ast-viber .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-viber,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-viber .social-item-label {
		  background: transparent;
		  color: #7F509E;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-telegram,
		.header-social-inner-wrap.ast-social-color-type-official .ast-telegram .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-telegram,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-telegram .social-item-label {
		  background: transparent;
		  color: #229CCE;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-xing,
		.header-social-inner-wrap.ast-social-color-type-official .ast-xing .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-xing,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-xing .social-item-label {
		  background: transparent;
		  color: #0A5C5D;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-weibo,
		.header-social-inner-wrap.ast-social-color-type-official .ast-weibo .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-weibo,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-weibo .social-item-label {
		  background: transparent;
		  color: #E41C34;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-tumblr,
		.header-social-inner-wrap.ast-social-color-type-official .ast-tumblr .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-tumblr,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-tumblr .social-item-label {
		  background: transparent;
		  color: #314255;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-qq,
		.header-social-inner-wrap.ast-social-color-type-official .ast-qq .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-qq,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-qq .social-item-label {
		  background: transparent;
		  color: #487FC8;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-wechat,
		.header-social-inner-wrap.ast-social-color-type-official .ast-wechat .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-wechat,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-wechat .social-item-label {
		  background: transparent;
		  color: #2DC121;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-phone,
		.header-social-inner-wrap.ast-social-color-type-official .ast-phone .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-phone,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-phone .social-item-label {
		  background: transparent;
		  color: inherit;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-strava,
		.header-social-inner-wrap.ast-social-color-type-official .ast-strava .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-strava,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-strava .social-item-label {
		  background: transparent;
		  color: #2DC121;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-email,
		.header-social-inner-wrap.ast-social-color-type-official .ast-email .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-email,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-email .social-item-label {
		  background: transparent;
		  color: #ea4335;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-github,
		.header-social-inner-wrap.ast-social-color-type-official .ast-github .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-github,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-github .social-item-label {
		  background: transparent;
		  color: #24292e;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-google_reviews,
		.header-social-inner-wrap.ast-social-color-type-official .ast-google_reviews .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-google_reviews,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-google_reviews .social-item-label {
		  background: transparent;
		  color: #dc4e41;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-wordpress,
		.header-social-inner-wrap.ast-social-color-type-official .ast-wordpress .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-wordpress,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-wordpress .social-item-label {
		  background: transparent;
		  color: #464646;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-yelp,
		.header-social-inner-wrap.ast-social-color-type-official .ast-yelp .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-yelp,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-yelp .social-item-label {
		  background: transparent;
		  color: #af0606;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-facebook,
		.header-social-inner-wrap.ast-social-color-type-official .ast-facebook .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-facebook,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-facebook .social-item-label {
		  color: #557dbc;
		  background: transparent;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-imdb,
		.header-social-inner-wrap.ast-social-color-type-official .ast-imdb .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-imdb,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-imdb .social-item-label {
		  color: #000000;
		  background: #F5C518;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-trip_advisor,
		.header-social-inner-wrap.ast-social-color-type-official .ast-trip_advisor .social-item-label,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-trip_advisor,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-trip_advisor .social-item-label {
		  color: #000000;
		  background: #00aa6c;
		}
		
		.header-social-inner-wrap.ast-social-color-type-official .ast-builder-social-element svg,
		.footer-social-inner-wrap.ast-social-color-type-official .ast-builder-social-element svg {
		  fill: currentColor;
		}';
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Social_Component_Dynamic_CSS();
