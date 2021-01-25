<?php
/**
 * Template part for displaying header row.
 *
 * @package Astra Builder
 */

?>
<div id="ast-desktop-header">
	<?php
		astra_main_header_bar_top();

		/**
		 * Astra Top Header
		 */
		do_action( 'astra_above_header' );

		/**
		 * Astra Main Header
		 */
		do_action( 'astra_primary_header' );

		/**
		 * Astra Bottom Header
		 */
		do_action( 'astra_below_header' );

		astra_main_header_bar_bottom();
	?>
<?php
if ( 'dropdown' === astra_get_option( 'mobile-header-type' ) || is_customize_preview() ) {
	$content_alignment = astra_get_option( 'header-offcanvas-content-alignment', 'flex-start' );
	$alignment_class   = 'content-align-' . $content_alignment . ' ';
	?>
	<div class="ast-desktop-header-content <?php echo esc_attr( $alignment_class ); ?>">
		<?php do_action( 'astra_desktop_header_content', 'popup', 'content' ); ?>
	</div>
<?php } ?>
</div> <!-- Main Header Bar Wrap -->
<?php
/**
 * Astra Mobile Header
 */
do_action( 'astra_mobile_header' );
?>
