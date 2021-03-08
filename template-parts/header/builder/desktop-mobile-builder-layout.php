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
<div id="ast-desktop-header" class="ast-mobile-header-wrap" data-type="<?php echo esc_attr( $mobile_header_type ); ?>">
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
</div> <!-- Main Header Bar Wrap -->

