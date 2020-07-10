<?php
/**
 * Template part for displaying the header branding/logo
 *
 * @package Astra Builder
 */

$type = get_query_var( 'type' );

switch( $type ) {

	case 'logo':
		?>
			<div class="site-header-item site-header-focus-item" data-section="title_tagline">
				<?php do_action( 'astra_site_branding' ); ?>
			</div>
		<?php
		break;
	case 'button':
		?>
		<div class="site-header-item site-header-focus-item" data-section="astra_customizer_header_button">
				<?php do_action( 'astra_header_button' ); ?>
			</div>
		<?php
		break;
	case 'html':
		?>
			<div class="site-header-item site-header-focus-item" data-section="astra_customizer_header_html">
					<?php do_action( 'astra_header_html' ); ?>
			</div>
		<?php
		break;
	case 'search':
		?>
			<div class="site-header-item site-header-focus-item" data-section="astra_customizer_header_search">
					<?php do_action( 'astra_header_search' ); ?>
			</div>
		<?php
		break;
	case 'social':
		?>
			<div class="site-header-item site-header-focus-item" data-section="section-header-social-icons">
					<?php do_action( 'astra_header_social' ); ?>
			</div>
		<?php
		break;
	case 'navigation':
		?>
		<div class="site-header-item site-header-focus-item site-header-item-main-navigation" data-section="astra_customizer_primary_navigation">
			<?php do_action( 'astra_header_primary_navigation' ); ?>
		</div>
		<?php
		break;
	case 'navigation-2':
		?>
		<div class="site-header-item site-header-focus-item site-header-item-main-navigation" data-section="astra_customizer_secondary_navigation">
			<?php do_action( 'astra_header_secondary_navigation' ); ?>
		</div>
		<?php
		break;
	case 'mobile-trigger':
		?>
		<div class="site-header-item site-header-focus-item" data-section="section-header-mobile-trigger">
			<?php do_action( 'astra_header_mobile_trigger' ); ?>
		</div>
		<?php
		break;

	case 'mobile-logo':
		?>
		<div class="site-header-item site-header-focus-item" data-section="title_tagline">
			<?php do_action( 'astra_mobile_site_branding' ); ?>
		</div>
		<?php
		break;
	case 'mobile-button':
		?>
		<div class="site-header-item site-header-focus-item" data-section="astra_customizer_mobile_header_button">
			<?php do_action( 'astra_mobile_header_button' ); ?>
		</div>
		<?php
		break;
	case 'mobile-html':
		?>
		<div class="site-header-item site-header-focus-item" data-section="astra_customizer_mobile_header_html">
			<?php do_action( 'astra_mobile_header_html' ); ?>
		</div>
		<?php
		break;
	case 'mobile-social':
		?>
		<div class="site-header-item site-header-focus-item" data-section="astra_customizer_mobile_header_social">
			<?php do_action( 'astra_mobile_header_social' ); ?>
		</div>
		<?php
		break;
	case 'mobile-navigation':
		?>
		<div class="site-header-item site-header-focus-item site-header-item-mobile-navigation" data-section="astra_customizer_mobile_navigation">
		<?php do_action( 'astra_mobile_header_primary_navigation' ); ?>
		</div>
		<?php
		break;

	default:
		break;

}
?>


