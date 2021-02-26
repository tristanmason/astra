<?php
/**
 * Astra Generate Markup Class.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2021, Astra
 * @link        https://wpastra.com/
 * @since       Astra x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Astra_Attr
 */
class Astra_Markup {

	/**
	 * Initialuze the Class.
	 *
	 * @since x.x.x
	 */
	public function __construct() {

		if ( ! Astra_Builder_Helper::apply_flex_based_css() ) {
			// Add filters here.
			add_filter( 'astra_markup_comment-count-wrapper_open', array( $this, 'comment_count_wrapper_open' ) );
			add_filter( 'astra_markup_comment-count-wrapper_close', array( $this, 'comment_count_wrapper_close' ) );
			add_filter( 'astra_markup_ast-comment-data-wrap_open', array( $this, 'ast_comment_data_wrap_open' ) );
			add_filter( 'astra_markup_ast-comment-data-wrap_close', array( $this, 'ast_comment_data_wrap_close' ) );
			add_filter( 'astra_markup_ast-comment-meta-wrap_open', array( $this, 'ast_comment_meta_wrap_open' ) );
			add_filter( 'astra_markup_ast-comment-meta-wrap_close', array( $this, 'ast_comment_meta_wrap_close' ) );                                
			add_filter( 'astra_attr_ast-comment-time_output', array( $this, 'ast_comment_time_attr' ) );
			add_filter( 'astra_attr_ast-comment-cite-wrap_output', array( $this, 'ast_comment_cite_wrap_attr' ) );
			add_filter( 'astra_attr_comment-form-grid-class_output', array( $this, 'comment_form_grid_class' ) );
		}
		add_filter( 'astra_attr_ast-grid-lg-12_output', array( $this, 'ast_grid_lg_12' ) );
		add_filter( 'astra_attr_ast-grid-common-col_output', array( $this, 'ast_grid_common_css' ) );
		add_filter( 'astra_attr_ast-grid-col-6_output', array( $this, 'ast_grid_col_6' ) );
		add_filter( 'astra_attr_ast-layout-4-grid_output', array( $this, 'ast_layout_4_grid' ) );       
	}

	/**
	 * We have removed grid css and make common css for grid style.
	 *
	 * @since x.x.x
	 * @return string.
	 */
	public function ast_grid_common_css() {
		return Astra_Builder_Helper::apply_flex_based_css() ? 'ast-grid-common-col' : 'ast-col-md-12'; 
	}

	/**
	 * Removed grid layout classes and make common class for same style.
	 *
	 * @since x.x.x
	 * @return string.
	 */
	public function ast_grid_col_6() {
		return Astra_Builder_Helper::apply_flex_based_css() ? 'ast-grid-common-col ast-width-50' : 'ast-col-md-6 ast-col-xs-12'; 
	}

	/** 
	 * Comment form grid classes.
	 *
	 * @since x.x.x 
	 * @return string.
	 */
	public function comment_form_grid_class() {
		return 'ast-col-xs-12 ast-col-sm-12 ast-col-md-4 ast-col-lg-4';
	}

	/** 
	 * Removed grid layout classes and make common class for same style
	 *
	 * @since x.x.x
	 * @return string.
	 */
	public function ast_grid_lg_12() {
		return Astra_Builder_Helper::apply_flex_based_css() ? 'ast-grid-common-col' : 'ast-col-lg-12'; 
	}

	/** 
	 * Layout-4 grid css backward comaptibility.
	 *
	 * @return string.
	 */
	public function ast_layout_4_grid() {
		return Astra_Builder_Helper::apply_flex_based_css() ? 'ast-grid-common-col as-width-sm-25 as-width-md-25' : 'ast-col-lg-3 ast-col-md-3 ast-col-sm-12 ast-col-xs-12'; 
	}
	
	/** 
	 * Comment count wrapper opening div.
	 *
	 * @param array $args markup arguments.
	 * @since x.x.x
	 * @return array.
	 */
	public function comment_count_wrapper_open( $args ) {
		$args['open']  = '<div %s>';
		$args['attrs'] = array( 'class' => 'comments-count-wrapper' );           
		return $args;
	}

	/** 
	 * Comment count wrapper closing div.
	 *
	 * @param array $args markup arguments.
	 * @since x.x.x
	 * @return array.
	 */
	public function comment_count_wrapper_close( $args ) {
		$args['close'] = '</div>';
		return $args;
	}

	/** 
	 * Comment data wrapper opening div.
	 *
	 * @param array $args markup arguments.
	 * @since x.x.x
	 * @return array.
	 */
	public function ast_comment_data_wrap_open( $args ) {
		$args['open']  = '<div %s>';
		$args['attrs'] = array( 'class' => 'ast-comment-data-wrap' );           
		return $args;
	}

	/** 
	 * Comment data wrapper closing div.
	 *
	 * @param array $args markup arguments.
	 * @since x.x.x
	 * @return array.
	 */
	public function ast_comment_data_wrap_close( $args ) {
		$args['close'] = '</div>';
		return $args;
	}

	/** 
	 * Comment meta wrapper opening div.
	 *
	 * @param array $args markup arguments.
	 * @since x.x.x
	 * @return array.
	 */
	public function ast_comment_meta_wrap_open( $args ) {
		$args['open']  = '<div %s>';
		$args['attrs'] = array( 'class' => 'ast-comment-meta-wrap' );           
		return $args;
	}

	/** 
	 * Comment meta wrapper closing div.
	 *
	 * @param array $args markup arguments.
	 * @since x.x.x
	 * @return array.
	 */
	public function ast_comment_meta_wrap_close( $args ) {
		$args['close'] = '</div>';
		return $args;
	}

	/** 
	 * Comment time div attributes.
	 * @since x.x.x
	 * @return string.
	 */
	public function ast_comment_time_attr() {
		return 'class = "ast-comment-time ast-col-lg-12" ';
	}

	/** 
	 * Comment cite wrapper div attributes.
	 *
	 * @since x.x.x
	 * @return string.
	 */
	public function ast_comment_cite_wrap_attr() {
		return 'class = "ast-comment-cite-wrap ast-col-lg-12" ';
	}
}

/**
 * Kicking this off by calling 'get_instance()' method
 */
new Astra_Markup();
