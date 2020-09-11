<?php
/**
 * Template part for displaying header row.
 *
 * @package Astra Builder
 */

?>

<div id="ast-desktop-header">
	<?php astra_main_header_bar_top(); ?>

	<div class="ast-above-header-wrap">
		<?php
		/**
		 * Astra Top Header
		 */
		do_action( 'astra_above_header' );
		?>
	</div>

	<div class="main-header-bar-wrap">
		<?php
		/**
		 * Astra Main Header
		 */
		do_action( 'astra_primary_header' );
		?>

	</div>

	<div class="ast-below-header-wrap">
		<?php
		/**
		 * Astra Bottom Header
		 */
		do_action( 'astra_below_header' );
		?>
	</div>

	<?php astra_main_header_bar_bottom(); ?>
</div> <!-- Main Header Bar Wrap -->
<?php
/**
 * Astra Mobile Header
 */
do_action( 'astra_mobile_header' );
?>
