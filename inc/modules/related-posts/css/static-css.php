<?php
/**
 * Related Posts Functions
 *
 * @package Astra
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Load static Related Posts CSS.
 *
 * @since x.x.x
 *
 * @return string static css for Related Posts section.
 */
function related_posts_static_css() {

	$related_posts_static_css = '
	.ast-related-posts-title-section {
		border-top: 1px solid #eeeeee;
	}
	.ast-related-posts-title {
		margin: 20px 0;
	}
	.ast-related-post-title {
		word-break: break-word;
	}
	.ast-separate-container .ast-related-posts-title {
		margin: 0 0 20px 0;
	}
	.ast-page-builder-template .ast-related-posts-title-section, .ast-page-builder-template .ast-single-related-posts-container {
		padding: 0 20px;
	}
	.ast-page-builder-template .ast-related-post .entry-header, .ast-related-post-content .entry-header, .ast-related-post-content .entry-meta {
		margin: 1em auto 1em auto;
		padding: 0;
	}
	.ast-related-posts-wrapper {
		display: grid;
		grid-column-gap: 25px;
		grid-row-gap: 25px;
	}
	.ast-single-related-posts-container {
		margin: 2em 0;
	}
	.ast-related-posts-wrapper .ast-related-post, .ast-related-post-featured-section {
		padding: 0;
		margin: 0;
		width: 100%;
		position: relative;
	}
	.ast-related-posts-inner-section {
		height: 100%;
	}
	.post-has-thumb + .entry-header, .post-has-thumb + .entry-content {
		margin-top: 1em;
	}
	.ast-related-post-content .entry-meta {
		margin-top: 0.5em;
	}
	.ast-related-posts-inner-section .post-thumb-img-content {
		margin: 0;
		position: relative;
	}
	.ast-separate-container .ast-single-related-posts-container {
		padding: 5.34em 6.67em;
	}
	.ast-separate-container .ast-related-posts-title-section, .ast-page-builder-template .ast-single-related-posts-container {
		border-top: 0;
		margin-top: 0;
	}
	@media (max-width: 1200px) {
		.ast-separate-container .ast-single-related-posts-container {
			padding: 3.34em 2.4em;
		}
	}';

	return $related_posts_static_css;
}
