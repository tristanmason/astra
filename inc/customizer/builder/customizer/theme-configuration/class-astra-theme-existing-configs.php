<?php
/**
 * Removing Button Link control from the theme existing Header.
 *
 * @package astra-builder
 * @since x.x.x
 */

/**
 * Removed Button Link param.
 *
 * @since x.x.x
 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
 * @return $wp_customize
 */
function remove_theme_header_controls( $wp_customize ) {

	if ( ! defined( 'ASTRA_THEME_SETTINGS' ) ) {
		define( 'ASTRA_THEME_SETTINGS', 'astra-settings' );
	}

	$layout = array(
		array(
			'name'      => ASTRA_THEME_SETTINGS . '[header-main-rt-section-button-link-option]',
			'type'      => 'control',
			'transport' => 'postMessage',
			'control'   => 'ast-hidden',
			'section'   => 'section-colors-body',
			'priority'  => 25,
		),
	);

	$wp_customize = array_merge( $wp_customize, $layout );

	return $wp_customize;
}

add_filter( 'astra_customizer_configurations', 'remove_theme_header_controls', 99 );
