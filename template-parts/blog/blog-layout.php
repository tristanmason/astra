<?php
/**
 * Template for Blog
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       Astra 1.0.0
 */

?>
<div <?php astra_blog_layout_class( 'blog-layout-1' ); ?>>
<<<<<<< HEAD
	<div class="post-content <?php echo astra_attr( 'ast-grid-common-col' ); ?>">
=======
	<div class="post-content <?php echo astra_attr( 'ast-grid-common-col' ); ?>" >
>>>>>>> f39289ae16a620b7eb93effef46f9d69c2dfa2ab
		<?php astra_blog_post_thumbnail_and_title_order(); ?>
		<div class="entry-content clear" 
		<?php
				echo astra_attr(
					'article-entry-content-blog-layout',
					array(
						'class' => '',
					)
				);
				?>
		>
			<?php 
				astra_entry_content_before();
				astra_the_excerpt();
				astra_entry_content_after();
				
				wp_link_pages(
					array(
						'before'      => '<div class="page-links">' . esc_html( astra_default_strings( 'string-blog-page-links-before', false ) ),
						'after'       => '</div>',
						'link_before' => '<span class="page-link">',
						'link_after'  => '</span>',
					)
				);
				?>
		</div><!-- .entry-content .clear -->
	</div><!-- .post-content -->
</div> <!-- .blog-layout-1 -->
