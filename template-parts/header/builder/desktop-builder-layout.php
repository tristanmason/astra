

<header id="masthead-builder" class="site-header">
	<div id="main-header" class="site-header-wrap">
		<div class="site-header-inner-wrap">
			<div class="site-header-upper-wrap"`>
				<div class="site-header-upper-inner-wrap">
					<?php
					/**
					 * Astra Top Header
					 *
					 */
					do_action( 'astra_above_header' );
					/**
					 * Astra Main Header
					 *
					 */
					do_action( 'astra_primary_header' );
					?>
				</div>
			</div>
			<?php
			/**
			 * Astra Bottom Header
			 *
			 */
			do_action( 'astra_below_header' );
			?>
		</div>
	</div>
	<?php
	/**
	 * Astra Mobile Header
	 *
	 */
	do_action( 'astra_mobile_header' );
	?>
</header>

