<?php
/**
 * Bottom Footer Options for Astra Theme.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       Astra 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Astra_Blog_Single_Layout_Configs' ) ) {

	/**
	 * Register Blog Single Layout Configurations.
	 */
	class Astra_Blog_Single_Layout_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Blog Single Layout Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since 1.4.3
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$_configs = array(

				/**
				 * Option: Single Post Content Width
				 */
				array(
					'name'       => ASTRA_THEME_SETTINGS . '[blog-single-width]',
					'type'       => 'control',
					'control'    => 'ast-selector',
					'section'    => 'section-blog-single',
					'default'    => astra_get_option( 'blog-single-width' ),
					'priority'   => 5,
					'title'      => __( 'Content Width', 'astra' ),
					'choices'    => array(
						'default' => __( 'Default', 'astra' ),
						'custom'  => __( 'Custom', 'astra' ),
					),
					'transport'  => 'postMessage',
					'responsive' => false,
					'renderAs'   => 'text',
				),

				/**
				 * Option: Enter Width
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[blog-single-max-width]',
					'type'        => 'control',
					'control'     => 'ast-slider',
					'section'     => 'section-blog-single',
					'transport'   => 'postMessage',
					'default'     => astra_get_option( 'blog-single-max-width' ),
					'context'     => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[blog-single-width]',
							'operator' => '===',
							'value'    => 'custom',
						),
					),
					'priority'    => 5,
					'title'       => __( 'Custom Width', 'astra' ),
					'suffix'      => 'px',
					'input_attrs' => array(
						'min'  => 768,
						'step' => 1,
						'max'  => 1920,
					),
					'divider'     => array( 'ast_class' => 'ast-bottom-divider' ),
				),


				/**
				 * Option: Display Post Structure
				 */
				array(
					'name'              => ASTRA_THEME_SETTINGS . '[blog-single-post-structure]',
					'type'              => 'control',
					'control'           => 'ast-sortable',
					'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_multi_choices' ),
					'section'           => 'section-blog-single',
					'default'           => astra_get_option( 'blog-single-post-structure' ),
					'priority'          => 5,
					'title'             => __( 'Structure', 'astra' ),
					'choices'           => array(
						'single-image'      => __( 'Featured Image', 'astra' ),
						'single-title-meta' => __( 'Title & Blog Meta', 'astra' ),
					),
				),

				/**
				 * Option: Related Posts setting.
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
					'default'  => astra_get_option( 'enable-related-posts' ),
					'type'     => 'control',
					'control'  => 'ast-toggle-control',
					'title'    => __( 'Enable Related Posts', 'astra' ),
					'section'  => 'section-blog-single',
					'priority' => 9,
				),

				/**
				 * Option: Related Posts Query
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[related-posts-section-heading]',
					'section'  => 'section-blog-single',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'title'    => __( 'Related Posts', 'astra' ),
					'context'  => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'priority' => 11,
				),

				/**
				 * Option: Related Posts Structure
				 */
				array(
					'name'              => ASTRA_THEME_SETTINGS . '[related-posts-structure]',
					'type'              => 'control',
					'control'           => 'ast-sortable',
					'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_multi_choices' ),
					'section'           => 'section-blog-single',
					'default'           => astra_get_option( 'related-posts-structure' ),
					'priority'          => 12,
					'context'           => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'             => __( 'Posts Structure', 'astra' ),
					'choices'           => array(
						'featured-image' => __( 'Featured Image', 'astra' ),
						'title-meta'     => __( 'Title & Post Meta', 'astra' ),
					),
					'divider'     => array( 'ast_class' => 'ast-top-divider' ),
				),

				array(
					'name'              => ASTRA_THEME_SETTINGS . '[related-posts-meta-structure]',
					'type'              => 'control',
					'control'           => 'ast-sortable',
					'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_multi_choices' ),
					'default'           => astra_get_option( 'related-posts-meta-structure' ),
					'context'           => array(
						Astra_Builder_Helper::$general_tab_config,
						'relation' => 'AND',
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[related-posts-structure]',
							'operator' => 'contains',
							'value'    => 'title-meta',
						),
					),
					'section'           => 'section-blog-single',
					'priority'          => 12,
					'title'             => __( 'Meta', 'astra' ),
					'choices'           => array(
						'comments' => __( 'Comments', 'astra' ),
						'category' => __( 'Category', 'astra' ),
						'author'   => __( 'Author', 'astra' ),
						'date'     => __( 'Publish Date', 'astra' ),
						'tag'      => __( 'Tag', 'astra' ),
					),
				),

				/**
				 * Option: Enable excerpt for Related Posts.
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[enable-related-posts-excerpt]',
					'default'  => astra_get_option( 'enable-related-posts-excerpt' ),
					'type'     => 'control',
					'control'  => 'ast-toggle-control',
					'title'    => __( 'Enable Post Excerpt', 'astra' ),
					'section'  => 'section-blog-single',
					'priority' => 12,
					'context'           => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
				),

				/**
				 * Option: Excerpt word count for Related Posts
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[related-posts-excerpt-count]',
					'default'     => astra_get_option( 'related-posts-excerpt-count' ),
					'type'        => 'control',
					'control'     => 'ast-slider',
					'context'     => array(
						Astra_Builder_Helper::$general_tab_config,
						'relation' => 'AND',
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts-excerpt]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'section'     => 'section-blog-single',
					'title'       => __( 'Excerpt Word Count', 'astra' ),
					'priority'    => 12,
					'input_attrs' => array(
						'min'  => 0,
						'step' => 1,
						'max'  => 60,
					),
				),

				/**
				 * Option: No. of Related Posts
				 */
				array(
					'name'        => ASTRA_THEME_SETTINGS . '[related-posts-total-count]',
					'default'     => astra_get_option( 'related-posts-total-count' ),
					'type'        => 'control',
					'control'     => 'ast-slider',
					'context'     => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'section'     => 'section-blog-single',
					'title'       => __( 'Total Number of Related Posts', 'astra' ),
					'priority'    => 11,
					'input_attrs' => array(
						'min'  => -1,
						'step' => 1,
						'max'  => 20,
					),
					'divider'     => array( 'ast_class' => 'ast-bottom-divider' ),
				),

				/**
				 * Option: Related Posts Columns
				 */
				array(
					'name'       => ASTRA_THEME_SETTINGS . '[related-posts-grid]',
					'type'       => 'control',
					'control'    => 'ast-selector',
					'section'    => 'section-blog-single',
					'default'    => astra_get_option( 'related-posts-grid' ),
					'priority'   => 11,
					'context'    => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'      => __( 'Grid Column Layout', 'astra' ),
					'choices'    => array(
						'1' => __( '1', 'astra' ),
						'2' => __( '2', 'astra' ),
						'3' => __( '3', 'astra' ),
						'4' => __( '4', 'astra' ),
					),
					'responsive' => false,
					'renderAs'   => 'text',
					'divider'    => array( 'ast_class' => 'ast-bottom-divider' ),
				),

				/**
				 * Option: Related Posts Query group setting
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[related-posts-query-group]',
					'default'   => astra_get_option( 'related-posts-query-group' ),
					'type'      => 'control',
					'transport' => 'postMessage',
					'control'   => 'ast-settings-group',
					'context'   => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'     => __( 'Posts Query', 'astra' ),
					'section'   => 'section-blog-single',
					'priority'  => 11,
				),

				/**
				 * Option: Related Posts based on.
				 */
				array(
					'name'       => 'related-posts-based-on',
					'default'    => astra_get_option( 'related-posts-based-on' ),
					'type'       => 'sub-control',
					'transport'  => 'postMessage',
					'parent'     => ASTRA_THEME_SETTINGS . '[related-posts-query-group]',
					'section'    => 'section-blog-single',
					'priority'   => 1,
					'control'    => 'ast-selector',
					'title'      => __( 'Related Posts by', 'astra' ),
					'choices'    => array(
						'categories' => __( 'Categories', 'astra' ),
						'tags'       => __( 'Tags', 'astra' ),
					),
					'responsive' => false,
					'renderAs'   => 'text',
				),

				/**
				 * Option: Display Post Structure
				 */
				array(
					'name'      => 'related-posts-order-by',
					'default'   => astra_get_option( 'related-posts-order-by' ),
					'parent'    => ASTRA_THEME_SETTINGS . '[related-posts-query-group]',
					'section'   => 'section-blog-single',
					'type'      => 'sub-control',
					'priority'  => 2,
					'transport' => 'postMessage',
					'title'     => __( 'Order by', 'astra' ),
					'control'   => 'ast-select',
					'choices'   => array(
						'date'          => __( 'Date', 'astra' ),
						'title'         => __( 'Title', 'astra' ),
						'post-order'    => __( 'Post Order', 'astra' ),
						'random'        => __( 'Random', 'astra' ),
						'comment-count' => __( 'Comment Counts', 'astra' ),
					),
				),

				/**
				 * Option: Display Post Structure
				 */
				array(
					'name'       => 'related-posts-order',
					'parent'     => ASTRA_THEME_SETTINGS . '[related-posts-query-group]',
					'section'    => 'section-blog-single',
					'type'       => 'sub-control',
					'transport'  => 'postMessage',
					'title'      => __( 'Order', 'astra' ),
					'default'    => astra_get_option( 'related-posts-order' ),
					'control'    => 'ast-selector',
					'priority'   => 3,
					'choices'    => array(
						'asc'  => __( 'Ascending', 'astra' ),
						'desc' => __( 'Descending', 'astra' ),
					),
					'responsive' => false,
					'renderAs'   => 'text',
				),

				/**
				 * Option: Related Posts colors setting group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[related-posts-colors-group]',
					'default'   => astra_get_option( 'related-posts-colors-group' ),
					'type'      => 'control',
					'transport' => 'postMessage',
					'control'   => 'ast-settings-group',
					'context'   => array(
						true === Astra_Builder_Helper::$is_header_footer_builder_active ?
						Astra_Builder_Helper::$design_tab_config : Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'     => __( 'Content Colors', 'astra' ),
					'section'   => 'section-blog-single',
					'priority'  => 15,
				),

				/**
				 * Option: Related Posts title typography setting group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[related-posts-section-title-typography-group]',
					'type'      => 'control',
					'priority'  => 16,
					'control'   => 'ast-settings-group',
					'context'   => array(
						true === Astra_Builder_Helper::$is_header_footer_builder_active ?
						Astra_Builder_Helper::$design_tab_config : Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'     => __( 'Section Title Font', 'astra' ),
					'section'   => 'section-blog-single',
					'transport' => 'postMessage',
				),

				/**
				 * Option: Related Posts title typography setting group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[related-posts-title-typography-group]',
					'type'      => 'control',
					'priority'  => 17,
					'control'   => 'ast-settings-group',
					'context'   => array(
						true === Astra_Builder_Helper::$is_header_footer_builder_active ?
						Astra_Builder_Helper::$design_tab_config : Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'     => __( 'Post Title Font', 'astra' ),
					'section'   => 'section-blog-single',
					'transport' => 'postMessage',
				),

				/**
				 * Option: Related Posts meta typography setting group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[related-posts-meta-typography-group]',
					'type'      => 'control',
					'priority'  => 19,
					'control'   => 'ast-settings-group',
					'context'   => array(
						true === Astra_Builder_Helper::$is_header_footer_builder_active ?
						Astra_Builder_Helper::$design_tab_config : Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'     => __( 'Meta Font', 'astra' ),
					'section'   => 'section-blog-single',
					'transport' => 'postMessage',
				),

				/**
				 * Option: Related Posts content typography setting group
				 */
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[related-posts-content-typography-group]',
					'type'      => 'control',
					'priority'  => 21,
					'control'   => 'ast-settings-group',
					'context'   => array(
						true === Astra_Builder_Helper::$is_header_footer_builder_active ?
						Astra_Builder_Helper::$design_tab_config : Astra_Builder_Helper::$general_tab_config,
						'relation' => 'AND',
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts]',
							'operator' => '==',
							'value'    => true,
						),
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[enable-related-posts-excerpt]',
							'operator' => '==',
							'value'    => true,
						),
					),
					'title'     => __( 'Content Font', 'astra' ),
					'section'   => 'section-blog-single',
					'transport' => 'postMessage',
				),
			);

			if ( ! defined( 'ASTRA_EXT_VER' ) ) {
				$_configs[] = array(
					'name'              => ASTRA_THEME_SETTINGS . '[blog-single-meta]',
					'type'              => 'control',
					'control'           => 'ast-sortable',
					'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_multi_choices' ),
					'default'           => astra_get_option( 'blog-single-meta' ),
					'context'           => array(
						Astra_Builder_Helper::$general_tab_config,
						array(
							'setting'  => ASTRA_THEME_SETTINGS . '[blog-single-post-structure]',
							'operator' => 'contains',
							'value'    => 'single-title-meta',
						),
					),
					'section'           => 'section-blog-single',
					'priority'          => 5,
					'title'             => __( 'Meta', 'astra' ),
					'choices'           => array(
						'comments' => __( 'Comments', 'astra' ),
						'category' => __( 'Category', 'astra' ),
						'author'   => __( 'Author', 'astra' ),
						'date'     => __( 'Publish Date', 'astra' ),
						'tag'      => __( 'Tag', 'astra' ),
					),
				);
			}

			if ( true === Astra_Builder_Helper::$is_header_footer_builder_active ) {

				$_configs[] = array(
					'name'        => 'section-blog-single-ast-context-tabs',
					'section'     => 'section-blog-single',
					'type'        => 'control',
					'control'     => 'ast-builder-header-control',
					'priority'    => 0,
					'description' => '',
				);

			}

			$configurations = array_merge( $configurations, $_configs );

			return $configurations;

		}
	}
}


new Astra_Blog_Single_Layout_Configs();
