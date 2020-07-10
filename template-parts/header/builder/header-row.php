<?php
/**
 * Template part for displaying the a row of the header
 *
 * @package Astra Builder
 */

$row = get_query_var( 'row' );


?>
<div class="site-<?php echo esc_attr( $row ); ?>-header-wrap site-header-row-container site-header-focus-item" data-section="ast_header_<?php echo esc_attr( $row ); ?>">
	<div class="site-header-row-container-inner">
		<?php if ( is_customize_preview() ) { ?>
			<div class="customize-partial-edit-shortcut astra-custom-partial-edit-shortcut">
				<button aria-label="<?php esc_attr_e( 'Click to edit this element.', '' ); ?>" title="<?php esc_attr_e( 'Click to edit this element.', 'astra' ); ?>" class="customize-partial-edit-shortcut-button item-customizer-focus"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.89 3.39l2.71 2.72c.46.46.42 1.24.03 1.64l-8.01 8.02-5.56 1.16 1.16-5.58s7.6-7.63 7.99-8.03c.39-.39 1.22-.39 1.68.07zm-2.73 2.79l-5.59 5.61 1.11 1.11 5.54-5.65zm-2.97 8.23l5.58-5.6-1.07-1.08-5.59 5.6z"></path></svg></button>
			</div>
		<?php } ?>
		<div class="site-container">
			<div class="site-<?php echo esc_attr( $row ); ?>-header-inner-wrap site-header-row
			<?php echo ( Astra_Builder_helper::has_side_columns( $row ) ? 'site-header-row-has-sides' : 'site-header-row-only-center-column' ); ?>
			<?php echo ( Astra_Builder_helper::has_center_column( $row ) ? 'site-header-row-center-column' : 'site-header-row-no-center' ); ?>">
				<?php if ( Astra_Builder_helper::has_side_columns( $row ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-left site-header-section site-header-section-left">
						<?php
						/**
						 * Astra Render Header Column
						 *
						 */
						do_action( 'astra_render_header_column', $row, 'left' );

						if ( Astra_Builder_helper::has_center_column( $row ) ) {
							?>
							<div class="site-header-<?php echo esc_attr( $row ); ?>-section-left-center site-header-section site-header-section-left-center">
								<?php
								/**
								 * Astra Render Header Column
								 *
								 */
								do_action( 'astra_render_header_column', $row, 'left_center' );
								?>
							</div>
							<?php
						}
						?>
					</div>
				<?php } ?>
				<?php if ( Astra_Builder_helper::has_center_column( $row ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-center site-header-section site-header-section-center">
						<?php
						/**
						 * Astra Render Header Column
						 *
						 */
						do_action( 'astra_render_header_column', $row, 'center' );
						?>
					</div>
				<?php } ?>
				<?php if ( Astra_Builder_helper::has_side_columns( $row ) ) { ?>
					<div class="site-header-<?php echo esc_attr( $row ); ?>-section-right site-header-section site-header-section-right">
						<?php
						if ( Astra_Builder_helper::has_center_column( $row ) ) {
							?>
							<div class="site-header-<?php echo esc_attr( $row ); ?>-section-right-center site-header-section site-header-section-right-center">
								<?php
								/**
								 * Astra Render Header Column
								 *
								 */
								do_action( 'astra_render_header_column', $row, 'right_center' );
								?>
							</div>
							<?php
						}
						/**
						 * Astra Render Header Column
						 *
						 */
						do_action( 'astra_render_header_column', $row, 'right' );
						?>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>
