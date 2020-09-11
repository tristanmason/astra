<?php
/**
 * Template part for displaying a row of the mobile header
 *
 * @package Astra Builder
 */

$row = get_query_var( 'row' );

if ( Astra_Builder_helper::is_row_empty( $row, 'header', 'mobile' ) ) {
	?>
<div class="<?php echo esc_attr( 'ast-' . $row . '-header-bar ast-' . $row . '-header ' ); ?><?php echo 'primary' === $row ? 'main-header-bar ' : ''; ?>site-<?php echo esc_attr( $row ); ?>-header-wrap site-header-focus-item ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default">
	<div class="ast-builder-grid-row-container-inner">
		<div class="site-container">
			<div class="site-<?php echo esc_attr( $row ); ?>-header-inner-wrap ast-builder-grid-row <?php echo ( Astra_Builder_Helper::has_mobile_side_columns( $row, 'header', 'mobile' ) ? 'ast-builder-grid-row-has-sides' : 'ast-grid-center-col-layout-only' ); ?> <?php echo ( Astra_Builder_Helper::has_mobile_center_column( $row, 'header', 'mobile' ) ? 'ast-grid-center-col-layout' : 'ast-builder-grid-row-no-center' ); ?>">
				<?php if ( Astra_Builder_Helper::has_mobile_side_columns( $row, 'header', 'mobile' ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-left site-header-section site-header-section-left">
						<?php
						/**
						 * Astra Render Header Column
						 */
						do_action( 'astra_render_mobile_header_column', $row, 'left' );

						if ( Astra_Builder_Helper::has_mobile_center_column( $row, 'header', 'mobile' ) ) {
							/**
							 * Astra Render Header Column
							 */
							do_action( 'astra_render_mobile_header_column', $row, 'left_center' );
						}
						?>
					</div>
				<?php } ?>
				<?php if ( Astra_Builder_Helper::has_mobile_center_column( $row, 'header', 'mobile' ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-center site-header-section grid-section-center">
						<?php
						/**
						 * Astra Render Header Column
						 */
						do_action( 'astra_render_mobile_header_column', $row, 'center' );
						?>
					</div>
				<?php } ?>
				<?php if ( Astra_Builder_Helper::has_mobile_side_columns( $row, 'header', 'mobile' ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-right site-header-section ast-grid-right-section">
						<?php
						if ( Astra_Builder_Helper::has_mobile_center_column( $row, 'header', 'mobile' ) ) {
							/**
							 * Astra Render Header Column
							 */
							do_action( 'astra_render_mobile_header_column', $row, 'right_center' );
						}
						/**
						 * Astra Render Header Column
						 */
						do_action( 'astra_render_mobile_header_column', $row, 'right' );
						?>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>
	<?php
}
