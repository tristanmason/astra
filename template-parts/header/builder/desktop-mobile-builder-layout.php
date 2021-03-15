<?php
/**
 * Template part for displaying header row.
 *
 * @package Astra Builder
 */

$mobile_header_type = astra_get_option( 'mobile-header-type' );

if ( 'full-width' === $mobile_header_type ) {

	$mobile_header_type = 'off-canvas';
}

?>
<div id="ast-desktop-header" class="ast-desktop-mobile-common-layout ast-mobile-header-wrap" data-type="<?php echo esc_attr( $mobile_header_type ); ?>">
	<?php
		astra_main_header_bar_top();

		/**
		 * Astra Top Header
		 */
		do_action( 'astra_above_header' );

		
		/**
		 * Astra Main Header Desktop
		 */
		do_action( 'astra_primary_header' );

		/**
		 * Astra Bottom Header
		 */
		do_action( 'astra_below_header' );

		astra_main_header_bar_bottom();

if ( 'dropdown' === astra_get_option( 'mobile-header-type' ) || is_customize_preview() ) {
$content_alignment = astra_get_option( 'header-offcanvas-content-alignment', 'flex-start' );
$alignment_class   = 'content-align-' . $content_alignment . ' ';
?>
<div class="ast-mobile-header-content <?php echo esc_attr( $alignment_class ); ?>">
	<div class="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-hb-menu-1">
		<?php do_action( 'astra_header_menu_1' ); ?>
	</div>
</div>
<?php } ?>
</div>
</div> <!-- Main Header Bar Wrap -->

