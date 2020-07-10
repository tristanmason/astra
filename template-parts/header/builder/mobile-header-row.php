<?php
/**
 * Template part for displaying a row of the mobile header
 *
 * @package Astra Builder
 */

$row           = get_query_var( 'mobile_row' );
?>
<div class="site-<?php echo esc_attr( $row ); ?>-header-wrap site-header-focus-item site-header-row-layout-default site-header-row-tablet-layout-default site-header-row-mobile-layout-default">
	<div class="site-header-row-container-inner">
		<div class="site-container">
			<div class="site-<?php echo esc_attr( $row ); ?>-header-inner-wrap site-header-row <?php echo ( Astra_Builder_Helper::has_mobile_side_columns( $row ) ? 'site-header-row-has-sides' : 'site-header-row-only-center-column' ); ?> <?php echo ( Astra_Builder_Helper::has_mobile_center_column( $row ) ? 'site-header-row-center-column' : 'site-header-row-no-center' ); ?>">
				<?php if ( Astra_Builder_Helper::has_mobile_side_columns( $row ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-left site-header-section site-header-section-left">
						<?php
						/**
						 * Astra Render Header Column
						 *
						 */
						do_action( 'astra_render_mobile_header_column', $row, 'left' );

						if ( Astra_Builder_Helper::has_mobile_center_column( $row ) ) {
							/**
							 * Astra Render Header Column
							 *
							 */
							do_action( 'astra_render_mobile_header_column', $row, 'left_center' );
						}
						?>
					</div>
				<?php } ?>
				<?php if ( Astra_Builder_Helper::has_mobile_center_column( $row ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-center site-header-section site-header-section-center">
						<?php
						/**
						 * Astra Render Header Column
						 */
						do_action( 'astra_render_mobile_header_column', $row, 'center' );
						?>
					</div>
				<?php } ?>
				<?php if ( Astra_Builder_Helper::has_mobile_side_columns( $row ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-right site-header-section site-header-section-right">
						<?php
						if ( Astra_Builder_Helper::has_mobile_center_column( $row ) ) {
							/**
							 * Astra Render Header Column
							 *
							 */
							do_action( 'astra_render_mobile_header_column', $row, 'right_center' );
						}
						/**
						 * Astra Render Header Column
						 *
						 */
						do_action( 'astra_render_mobile_header_column', $row, 'right' );
						?>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>
