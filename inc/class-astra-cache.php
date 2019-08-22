<?php
/**
 * Astra Helper.
 *
 * @package Astra
 */

/**
 * Class Astra_Cache.
 */
class Astra_Cache {

	/**
	 * Member Variable
	 *
	 * @var array instance
	 */
	private static $dynamic_css_file_path = array();

	/**
	 * Member Variable
	 *
	 * @var string instance
	 */
	private static $dynamic_css_data;

	/**
	 * Asset slug for filename.
	 *
	 * @since x.x.x
	 * @var string
	 */
	private $asset_slug = '';

	/**
	 * Check if we are on a single or archive query page.
	 *
	 * @since x.x.x
	 * @var string
	 */
	private $asset_query_var = '';

	/**
	 * Asset Type - archive/post
	 *
	 * @since x.x.x
	 * @var string
	 */
	private $asset_type = '';

	/**
	 * Uploads directory.
	 *
	 * @since x.x.x
	 * @var array
	 */
	private $uploads_dir = array();

	/**
	 *  Constructor
	 */
	public function __construct() {
		add_action( 'wp', array( $this, 'init_cache' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'add_to_dynamic_css_file' ), 1 );
		add_action( 'wp_enqueue_scripts', array( $this, 'theme_enqueue_styles' ), 1 );

		add_action( 'astra_post_meta_updated', array( $this, 'refresh_post_meta_data' ), 10, 1 );
		add_action( 'astra_advanced_headers_save_after', array( $this, 'astra_refresh_assets' ) );

		// Refresh assets.
		add_action( 'customize_save_after', array( $this, 'astra_refresh_assets' ) );

		// Triggers on click on refresh/ recheck button.
		add_action( 'wp_ajax_astra_refresh_assets_files', array( $this, 'astra_ajax_refresh_assets' ) );
	}

	/**
	 * Setup class variables.
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function init_cache() {
		$this->asset_type      = $this->asset_type();
		$this->asset_query_var = $this->asset_query_var();
		$this->asset_slug      = $this->asset_slug();
		$this->uploads_dir     = astra_filesystem()->get_uploads_dir( 'astra' );

		// Create uploads directory.
		$status = astra_filesystem()->maybe_create_uploads_dir( $this->uploads_dir['path'] );
		astra_filesystem()->update_filesystem_access_status( $status );
	}

	/**
	 * Get Current query type. single|archive.
	 *
	 * @since x.x.x
	 * @return String
	 */
	private function asset_query_var() {
		if ( 'post' === $this->asset_type || 'home' === $this->asset_type || 'frontpage' === $this->asset_type ) {
			$slug = 'single';
		} else {
			$slug = 'archive';
		}

		return $slug;
	}

	/**
	 * Get current asset slug.
	 *
	 * @since x.x.x
	 * @return String
	 */
	private function asset_slug() {
		if ( 'home' === $this->asset_type || 'frontpage' === $this->asset_type ) {
			return $this->asset_type;
		} else {
			return $this->asset_type . '-' . get_queried_object_id();
		}
	}

	/**
	 * Get the archive title.
	 *
	 * @since  x.x.x
	 * @return $title Returns the archive title.
	 */
	private function asset_type() {
		$title = 'post';

		if ( is_category() ) {
			$title = 'category';
		} elseif ( is_tag() ) {
			$title = 'tag';
		} elseif ( is_author() ) {
			$title = 'author';
		} elseif ( is_year() ) {
			$title = 'year';
		} elseif ( is_month() ) {
			$title = 'month';
		} elseif ( is_day() ) {
			$title = 'day';
		} elseif ( is_tax( 'post_format' ) ) {
			if ( is_tax( 'post_format', 'post-format-aside' ) ) {
				$title = 'asides';
			} elseif ( is_tax( 'post_format', 'post-format-gallery' ) ) {
				$title = 'galleries';
			} elseif ( is_tax( 'post_format', 'post-format-image' ) ) {
				$title = 'images';
			} elseif ( is_tax( 'post_format', 'post-format-video' ) ) {
				$title = 'videos';
			} elseif ( is_tax( 'post_format', 'post-format-quote' ) ) {
				$title = 'quotes';
			} elseif ( is_tax( 'post_format', 'post-format-link' ) ) {
				$title = 'links';
			} elseif ( is_tax( 'post_format', 'post-format-status' ) ) {
				$title = 'statuses';
			} elseif ( is_tax( 'post_format', 'post-format-audio' ) ) {
				$title = 'audio';
			} elseif ( is_tax( 'post_format', 'post-format-chat' ) ) {
				$title = 'chats';
			}
		} elseif ( is_post_type_archive() ) {
			$title = 'archives';
		} elseif ( is_tax() ) {
			$tax   = get_taxonomy( get_queried_object()->taxonomy );
			$title = sanitize_key( $tax->name );
		}

		if ( is_home() ) {
			$title = 'home';
		}

		if ( is_front_page() ) {
			$title = 'frontpage';
		}

		return $title;
	}

	/**
	 * Create an array of all the files that needs to be merged in dynamic CSS file.
	 *
	 * @since x.x.x
	 * @param array $file file path.
	 * @return void
	 */
	public static function add_dynamic_theme_css( $file ) {
		self::$dynamic_css_file_path = array_merge( self::$dynamic_css_file_path, $file );
	}

	/**
	 * Append CSS style to the theme dynamic css.
	 *
	 * @since x.x.x
	 * @param array $file file path.
	 * @return void
	 */
	public function add_to_dynamic_css_file( $file ) {

		foreach ( self::$dynamic_css_file_path as $key => $value ) {
			// Get file contents.
			$get_contents = astra_filesystem()->get_contents( $value );
			if ( $get_contents ) {
				self::$dynamic_css_data .= $get_contents;
			}
		}
	}

	/**
	 * Refresh Assets, called through ajax
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function astra_ajax_refresh_assets() {

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_die();
		}

		check_ajax_referer( 'astra-assets-refresh', 'nonce' );

		astra_filesystem()->reset_filesystem_access_status();

		$this->delete_cache_files();
	}

	/**
	 * Refresh Assets
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function astra_refresh_assets() {

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_die();
		}

		astra_filesystem()->reset_filesystem_access_status();

		$this->delete_cache_files();
	}

	/**
	 * Deletes cache files
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function delete_cache_files() {
		$uploads_dir_path = $this->uploads_dir['path'];

		array_map( 'unlink', glob( $uploads_dir_path . '/astra-theme-dynamic-css*.*' ) );
		array_map( 'unlink', glob( $uploads_dir_path . '/astra-addon-dynamic-css*.*' ) );
	}

	/**
	 * Remove post meta that check if CSS file need to be regenerated.
	 *
	 * @param int $post_id Gets the post id.
	 * @since x.x.x
	 * @return void
	 */
	public function refresh_post_meta_data( $post_id ) {
		delete_post_meta( $post_id, 'astra_theme_style_timestamp_css' );
	}

	/**
	 * Fetch theme CSS data to be added in the dynamic CSS file.
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function theme_enqueue_styles() {

		$theme_css_data  = apply_filters( 'astra_dynamic_theme_css', '' );
		$theme_css_data .= self::$dynamic_css_data;

		// Return if there is no data to add in the css file.
		if ( empty( $theme_css_data ) ) {
			return;
		}

		// Call enqueue styles function.
		$this->enqueue_styles( $theme_css_data, 'theme' );
	}

	/**
	 * Enqueue CSS files.
	 *
	 * @param  string $style_data   Gets the CSS data.
	 * @param  string $type         Gets the type theme/addon.
	 * @since  x.x.x
	 * @return void
	 */
	public function enqueue_styles( $style_data, $type ) {
		// Gets the file path.
		$assets_info = $this->get_asset_info( $style_data, $type );

		// Gets the timestamp.
		$post_timestamp = $this->get_post_timestamp( $type, $assets_info );

		// Check if we need to show the dynamic CSS inline.
		$load_inline_css = apply_filters( 'astra_load_dynamic_css_inline', false );

		// Check if we need to create a new file or override the current file.
		if ( ! empty( $style_data ) && $post_timestamp['create_new_file'] ) {
			$this->file_write( $style_data, $post_timestamp['timestamp'], $type, $assets_info );
		}

		// Add inline CSS if there is no write access or user has returned true using the `astra_load_dynamic_css_inline` filter.
		if ( ! astra_filesystem()->can_access_filesystem() || $load_inline_css ) {
			wp_add_inline_style( 'astra-' . $type . '-css', $style_data );
		} else {
			wp_enqueue_style( 'astra-' . $type . '-dynamic', $this->uploads_dir['url'] . 'astra-' . $type . '-dynamic-css-' . $this->asset_slug . '.css', array(), $post_timestamp['timestamp'] );
		}
	}

	/**
	 * Returns the current Post Meta/ Option Timestamp.
	 *
	 * @since  x.x.x
	 * @param  string $type         Gets the type theme/addon.
	 * @param  string $assets_info  Gets the assets path info.
	 * @return array $timestamp_data.
	 */
	public function get_post_timestamp( $type, $assets_info ) {
		// Check if current page is a post/ archive page. false states that the current page is a post.
		if ( 'single' === $this->asset_query_var ) {
			$post_timestamp = get_post_meta( get_the_ID(), 'astra_' . $type . '_style_timestamp_css', true );
		} else {
			$post_timestamp = get_option( 'astra_' . $type . '_get_dynamic_css' );
		}

		$timestamp_data = $this->maybe_get_new_timestamp( $post_timestamp, $assets_info );

		return $timestamp_data;
	}

	/**
	 * Gets the current timestamp.
	 *
	 * @since x.x.x
	 * @return string $timestamp Timestamp.
	 */
	private function get_current_timestamp() {
		$date      = new DateTime();
		$timestamp = $date->getTimestamp();

		return $timestamp;
	}

	/**
	 * Returns the current Post Meta/ Option Timestamp or creates a new timestamp.
	 *
	 * @since  x.x.x
	 * @param  string $post_timestamp Timestamp of the post meta/ option.
	 * @param  string $assets_info  Gets the assets path info.
	 * @return array $data.
	 */
	public function maybe_get_new_timestamp( $post_timestamp, $assets_info ) {

		// Creates a new timestamp if the file does not exists or the timestamp is empty.
		// If post_timestamp is empty that means it is an new post or the post is updated and a new file needs to be created.
		// If a file does not exists then we need to create a new file.
		if ( '' == $post_timestamp || ! file_exists( $assets_info['path'] ) ) {
			$timestamp = $this->get_current_timestamp();

			$data = array(
				'create_new_file' => true,
				'timestamp'       => $timestamp,
			);
		} else {
			$timestamp = $post_timestamp;
			$data      = array(
				'create_new_file' => false,
				'timestamp'       => $timestamp,
			);
		}

		return $data;
	}

	/**
	 * Returns an array of paths for the CSS assets
	 * of the current post.
	 *
	 * @param  var    $data         Gets the CSS for the current Page.
	 * @param  string $type         Gets the type theme/addon.
	 * @since x.x.x
	 * @return array
	 */
	public function get_asset_info( $data, $type ) {
		$css_suffix = 'astra-' . $type . '-dynamic-css';
		$css_suffix = 'astra-' . $type . '-dynamic-css';
		$info       = array();
		if ( ! empty( $data ) ) {
			$info['path']    = $this->uploads_dir['path'] . $css_suffix . '-' . $this->asset_slug . '.css';
			$info['css_url'] = $this->uploads_dir['url'] . $css_suffix . '-' . $this->asset_slug . '.css';
		}

		return $info;
	}

	/**
	 * Updates the Post Meta/ Option Timestamp.
	 *
	 * @param  string $type         Gets the type theme/addon.
	 * @param  string $timestamp    Gets the current timestamp.
	 * @since  x.x.x
	 * @return void
	 */
	public function update_timestamp( $type, $timestamp ) {
		// Check if current page is a post/ archive page. false states that the current page is a post.
		if ( 'single' === $this->asset_query_var ) {
			// Update the post meta.
			update_post_meta( get_the_ID(), 'astra_' . $type . '_style_timestamp_css', $timestamp );
		} else {
			// Update the option.
			update_option( 'astra_' . $type . '_get_dynamic_css', $timestamp );
		}
	}

	/**
	 * Creates CSS files.
	 *
	 * @param  string $style_data   Gets the CSS for the current Page.
	 * @param  string $timestamp    Gets the current timestamp.
	 * @param  string $type         Gets the type theme/addon.
	 * @param  string $assets_info  Gets the assets path info.
	 * @since  x.x.x
	 */
	public function file_write( $style_data, $timestamp, $type, $assets_info ) {
		// Create a new file.
		astra_filesystem()->put_contents( $assets_info['path'], $style_data );

		// This function will update the Post/ Option timestamp.
		$this->update_timestamp( $type, $timestamp );
	}
}

new Astra_Cache();
