<?php
/**
 * Template part for header component.
 *
 * @package Astra Builder
 */

if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {
	$comp_type = wp_parse_args( $args, array( 'type' => '' ) );
	$comp_type = $comp_type['type'];
} else {
	$comp_type = get_query_var( 'type' );
}


switch ( $comp_type ) {

	case 'logo':
		?>
		<div class="ast-builder-layout-element site-header-focus-item" data-section="title_tagline">
			<?php do_action( 'astra_site_identity' ); ?>
		</div>
		<?php
		break;

	case 'button-1':
		?>
		<div class="ast-builder-layout-element site-header-focus-item ast-header-button-1" data-section="section-hb-button-1">
			<?php do_action( 'astra_header_button_1' ); ?>
		</div>
		<?php
		break;

	case 'button-2':
		?>
		<div class="ast-builder-layout-element site-header-focus-item ast-header-button-2" data-section="section-hb-button-2">
			<?php do_action( 'astra_header_button_2' ); ?>
		</div>
		<?php
		break;

	case 'menu-1':
		?>
		<div class="ast-builder-menu-1 ast-builder-menu ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-hb-menu-1">
			<?php do_action( 'astra_header_menu_1' ); ?>
		</div>
		<?php
		break;

	case 'menu-2':
		?>
		<div class="ast-builder-menu-2 ast-builder-menu ast-builder-menu-2-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-hb-menu-2">
			<?php do_action( 'astra_header_menu_2' ); ?>
		</div>
		<?php
		break;

	case 'html-1':
		?>
		<div class="ast-builder-layout-element site-header-focus-item ast-header-html-1" data-section="section-hb-html-1">
			<?php do_action( 'astra_header_html_1' ); ?>
		</div>
		<?php
		break;

	case 'html-2':
		?>
			<div class="ast-builder-layout-element site-header-focus-item ast-header-html-2" data-section="section-hb-html-2">
				<?php do_action( 'astra_header_html_2' ); ?>
			</div>
			<?php
		break;

	case 'html-3':
		?>
			<div class="ast-builder-layout-element site-header-focus-item ast-header-html-3" data-section="section-hb-html-3">
				<?php do_action( 'astra_header_html_3' ); ?>
			</div>
			<?php
		break;

	case 'html-4':
		?>
			<div class="ast-builder-layout-element site-header-focus-item ast-header-html-4" data-section="section-hb-html-4">
				<?php do_action( 'astra_header_html_4' ); ?>
			</div>
			<?php
		break;

	case 'search':
		?>
		<div class="ast-builder-layout-element site-header-focus-item ast-header-search" data-section="section-header-search">
			<?php do_action( 'astra_header_search' ); ?>
		</div>
		<?php
		break;

	case 'social':
		?>
		<div class="ast-builder-layout-element site-header-focus-item" data-section="section-header-social-icons">
			<?php do_action( 'astra_header_social' ); ?>
		</div>
		<?php
		break;

	case 'mobile-trigger':
		?>
		<div class="ast-builder-layout-element site-header-focus-item" data-section="section-header-mobile-trigger">
			<?php do_action( 'astra_header_mobile_trigger' ); ?>
		</div>
		<?php
		break;

	case 'mobile-logo':
		?>
		<div class="ast-builder-layout-element site-header-focus-item" data-section="title_tagline">
			<?php do_action( 'astra_mobile_site_identity' ); ?>
		</div>
		<?php
		break;

	case 'mobile-button':
		?>
		<div class="ast-builder-layout-element site-header-focus-item ast-header-button-3" data-section="astra_customizer_mobile_header_button">
			<?php do_action( 'astra_mobile_header_button' ); ?>
		</div>
		<?php
		break;

	case 'mobile-html':
		?>
		<div class="ast-builder-layout-element site-header-focus-item ast-header-html-4" data-section="astra_customizer_mobile_header_html">
			<?php do_action( 'astra_header_html_4' ); ?>
		</div>
		<?php
		break;

	case 'mobile-social':
		?>
		<div class="ast-builder-layout-element site-header-focus-item" data-section="astra_customizer_mobile_header_social">
			<?php do_action( 'astra_header_social' ); ?>
		</div>
		<?php
		break;

	case 'widget-1':
		?>
		<aside class="header-widget-area widget-area site-header-focus-item" data-section="sidebar-widgets-header-widget-1">
			<?php
			if ( is_customize_preview() ) {
				Astra_Builder_UI_Controller::render_customizer_edit_button();
			}
			?>
			<div class="header-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'header-widget-1' );
				?>
			</div>
		</aside>
		<?php
		break;

	case 'widget-2':
		?>
		<aside class="header-widget-area widget-area site-header-focus-item" data-section="sidebar-widgets-header-widget-1">
			<div class="header-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'header-widget-2' );
				?>
			</div>
		</aside>
		<?php
		break;

	case 'widget-3':
		?>
		<aside class="header-widget-area widget-area site-header-focus-item" data-section="sidebar-widgets-header-widget-1">
			<div class="header-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'header-widget-3' );
				?>
			</div>
		</aside>
		<?php
		break;

	case 'widget-4':
		?>
		<aside class="header-widget-area widget-area site-header-focus-item" data-section="sidebar-widgets-header-widget-1">
			<div class="header-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'header-widget-4' );
				?>
			</div>
		</aside>
		<?php
		break;

	default:
		break;

}
?>
