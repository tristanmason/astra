<?php
/**
 * Template part for displaying the Mobile Header
 *
 * @package Astra Builder
 */

?>



<div id="ast-mobile-header" class="site-mobile-header-wrap">
	<div class="site-header-inner-wrap">
		<div class="site-header-upper-wrap">
			<div class="site-header-upper-inner-wrap"<?php
			?>>
				<?php
				/**
				 * Astra Top Header
				 *
				 */
				do_action( 'astra_mobile_above_header' );
				/**
				 * Astra Main Header
				 *
				 */
				do_action( 'astra_mobile_primary_header' );
				?>
			</div>
		</div>
		<?php
		/**
		 * Astra Mobile Bottom Header
		 *
		 */
		do_action( 'astra_mobile_below_header' );
		?>
	</div>
</div>
