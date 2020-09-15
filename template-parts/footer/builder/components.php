<?php
/**
 * Template part for displaying the footer component.
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

	case 'copyright':
		?>
			<div class="ast-builder-layout-element site-footer-focus-item" data-section="section-footer-builder">
				<?php do_action( 'astra_footer_copyright' ); ?>
			</div>
		<?php
		break;

	case 'social':
		?>
			<div class="ast-builder-layout-element site-footer-focus-item" data-section="section-footer-social-icons">
				<?php do_action( 'astra_footer_social' ); ?>
			</div>
		<?php
		break;

	case 'widget-1':
		?>
		<aside class="footer-widget-area widget-area site-footer-focus-item" data-section="sidebar-widgets-footer-widget-1">
			<div class="footer-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'footer-widget-1' );
				?>
			</div>
		</aside>
		<?php
		break;

	case 'widget-2':
		?>
		<aside class="footer-widget-area widget-area site-footer-focus-item" data-section="sidebar-widgets-footer-widget-2">
			<div class="footer-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'footer-widget-2' );
				?>
			</div>
		</aside>
		<?php
		break;

	case 'widget-3':
		?>
		<aside class="footer-widget-area widget-area site-footer-focus-item" data-section="sidebar-widgets-footer-widget-3">
			<div class="footer-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'footer-widget-3' );
				?>
			</div>
		</aside>
		<?php
		break;

	case 'widget-4':
		?>
		<aside class="footer-widget-area widget-area site-footer-focus-item" data-section="sidebar-widgets-footer-widget-4">
			<div class="footer-widget-area-inner site-info-inner">
				<?php
				dynamic_sidebar( 'footer-widget-4' );
				?>
			</div>
		</aside>
		<?php
		break;

	case 'html-1':
		?>
		<div class="footer-widget-area widget-area site-footer-focus-item" data-section="section-fb-html-1">
			<?php do_action( 'astra_footer_html_1' ); ?>
		</div>
		<?php
		break;

	case 'html-2':
		?>
			<div class="footer-widget-area widget-area site-footer-focus-item" data-section="section-fb-html-2">
				<?php do_action( 'astra_footer_html_2' ); ?>
			</div>
			<?php
		break;

	case 'menu':
		?>
			<div class="footer-widget-area widget-area site-footer-focus-item" data-section="section-footer-menu">
				<?php do_action( 'astra_footer_menu' ); ?>
			</div>
			<?php
		break;

	default:
		break;

}
?>
