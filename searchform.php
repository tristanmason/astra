<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <label>
        <span class="screen-reader-text">Search for:</span>
        <input type="search" class="search-field" placeholder="Search …" value="" name="s">
        <button class="search-submit">
			<span hidden><?php echo __('Search', 'blocksy') ?></span>
			<i><?php Astra_Icons::get_icons('search', true); ?></i>
		</button>
    </label>
    <input type="submit" class="search-submit" value="Search">
</form>