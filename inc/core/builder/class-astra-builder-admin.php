<?php
/**
 * Astra Builder Admin Loader.
 *
 * @package astra-builder
 */

if ( ! class_exists( 'Astra_Builder_Admin' ) ) {

	/**
	 * Class Astra_Builder_Admin.
	 */
	final class Astra_Builder_Admin {

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance = null;

		/**
		 *  Initiator
		 */
		public static function get_instance() {

			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor
		 */
		public function __construct() {

			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
			add_action( 'wp_ajax_ast-migrate-to-builder', array( $this, 'migrate_to_builder' ) );
			add_action( 'astra_welcome_page_content', array( $this, 'migrate_to_builder_box' ), 1 );
		}

		/**
		 * Migrate to New Header Builder
		 *
		 * @since x.x.x
		 * @return void
		 */
		public function migrate_to_builder_box() {
			if ( Astra_Builder_Helper::is_new_user() ) {
				add_filter( 'astra_quick_settings', array( $this, 'update_customizer_header_footer_link' ) );
				return;
			}

			$status = astra_get_option( 'is-header-footer-builder', false );

			$label = ( false !== $status ) ? __( 'Use Old Header/Footer', 'astra' ) : __( 'Use New Header/Footer Builder', 'astra' );

			?>
			<div class="postbox">
				<h2 class="hndle ast-normal-cusror ast-addon-heading ast-flex"><span><?php esc_html_e( 'Astra Header/Footer Builder', 'astra' ); ?></span>
				</h2>
				<div class="inside">
					<div>
						<p><?php esc_html_e( 'Astra Header/Footer Builder is a new and powerful way to design header and footer for your website. With this, you can give a creative look to your header/footer with less effort.', 'astra' ); ?></p>
						<p><?php esc_html_e( 'Activating this feature will add advanced options to Astra customizer where you can create awesome new designs.', 'astra' ); ?></p>
						<p><?php esc_html_e( 'Note: The header/footer builder will replace the existing header/footer settings in the customizer. This might make your header/footer look a bit different. You can configure header/footer builder settings from customizer to give it a nice look. You can always come back here and switch to your old header/footer.', 'astra' ); ?></p>
						<div class="ast-actions-wrap" style="justify-content: space-between;display: flex;align-items: center;" >
							<a href="<?php echo esc_url( admin_url( '/customize.php' ) ); ?>" class="ast-go-to-customizer"><?php esc_html_e( 'Go to Customzier', 'astra' ); ?></a>
							<div class="ast-actions" style="display: inline-flex;">
								<button href="#" class="button button-primary ast-builder-migrate" style="margin-right:10px;" data-value="<?php echo ( $status ) ? 0 : 1; ?>"><?php echo esc_html( $label ); ?></button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<?php
			if ( $status ) {
				add_filter( 'astra_quick_settings', array( $this, 'update_customizer_header_footer_link' ) );
			}
		}

		/**
		 * Update Customizer Header Footer quick links from options page.
		 *
		 * @since x.x.x
		 * @param array $args default Header Footer quick links.
		 * @return array updated Header Footer quick links.
		 */
		public function update_customizer_header_footer_link( $args ) {
			if ( isset( $args['header']['quick_url'] ) ) {
				$args['header']['quick_url'] = admin_url( 'customize.php?autofocus[panel]=panel-header-builder-group' );
			}
			if ( isset( $args['footer']['quick_url'] ) ) {
				$args['footer']['quick_url'] = admin_url( 'customize.php?autofocus[panel]=panel-footer-builder-group' );
			}
			return $args;
		}

		/**
		 * Migrate to New Header Builder
		 */
		public function migrate_to_builder() {

			check_ajax_referer( 'astra-builder-module-nonce', 'nonce' );

			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( __( 'You don\'t have the access', 'astra' ) );
			}

			$migrate = isset( $_POST['value'] ) ? sanitize_key( $_POST['value'] ) : '';
			$migrate = ( $migrate ) ? true : false;
			astra_update_option( 'is-header-footer-builder', $migrate );
			wp_send_json_success();
		}

		/**
		 * Admin Scripts Callback
		 */
		public function enqueue_admin_scripts() {

			// Scripts.
			wp_enqueue_script( 'astra-builder-admin-settings', ASTRA_THEME_URI . 'inc/assets/js/admin-settings.js', array( 'jquery' ), ASTRA_THEME_VERSION, false );

			$options = array(
				'ajax_nonce'         => wp_create_nonce( 'astra-builder-module-nonce' ),
				'ajaxurl'            => admin_url( 'admin-ajax.php' ),
				'old_header_footer'  => __( 'Use Old Header/Footer', 'astra' ),
				'migrate_to_builder' => __( 'Use New Header/Footer Builder', 'astra' ),
			);

			wp_localize_script( 'astra-builder-admin-settings', 'astraBuilderModules', $options );
		}

		/**
		 * Get Deprecated Options.
		 *
		 * @since x.x.x
		 *
		 * @return array $options
		 */
		public function get_deprecated_options() {

			$above_header       = $this->get_above_header_options();
			$below_header       = $this->get_below_header_options();
			$primary_header     = $this->get_primary_header_options();
			$sticky_header      = $this->get_sticky_header_options();
			$transparent_header = $this->get_transparent_header_options();
			$mobile_header      = $this->get_mobile_header_options();

			return array_merge(
				$above_header,
				$below_header,
				$primary_header,
				$sticky_header,
				$transparent_header,
				$mobile_header
			);
		}

		/**
		 * Get Deprecated Options for Above Header.
		 *
		 * @since x.x.x
		 */
		public function get_above_header_options() {

			return array(
				// Above Header - Nav Menu Colors.
				'above-header-megamenu-colors',
				'above-header-megamenu-heading-color',
				'above-header-megamenu-heading-h-color',

				// Above Header Configs.
				'above-header-layout',
				'above-header-layout-section-1-divider',
				'above-header-section-1',
				'above-header-section-1-html',
				'above-header-layout-section-2-divider',
				'above-header-section-2',
				'above-header-section-2-html',
				'section-ast-above-header-border',
				'above-header-height',
				'above-header-divider',
				'above-header-divider-color',
				'above-header-typography-menu-styling-heading',
				'above-header-typography-menu-styling',
				'above-header-typography-submenu-styling',
				'above-header-content-typography-styling',
				'above-header-colors-and-background',
				'above-header-background-styling',
				'above-header-menu-colors',
				'above-header-submenu-colors',
				'above-header-content-section-styling',
				'above-header-submenu-border-divider',
				'above-header-submenu-container-animation',
				'above-header-submenu-border',
				'above-header-submenu-border-color',
				'above-header-submenu-item-border',
				'above-header-submenu-item-b-color',
				'above-header-mobile-menu-divider',
				'above-header-on-mobile',
				'above-header-merge-menu',
				'above-header-swap-mobile',
				'above-header-menu-align',
				'above-header-menu-label',

				// Above Header Color BG Configs.
				'above-header-bg-obj-responsive',
				'above-header-menu-color-responsive',
				'above-header-menu-bg-obj-responsive',
				'above-header-submenu-text-color-responsive',
				'above-header-submenu-bg-color-responsive',
				'above-header-menu-h-color-responsive',
				'above-header-menu-h-bg-color-responsive',
				'above-header-submenu-hover-color-responsive',
				'above-header-submenu-bg-hover-color-responsive',
				'above-header-menu-active-color-responsive',
				'above-header-menu-active-bg-color-responsive',
				'above-header-submenu-active-color-responsive',
				'above-header-submenu-active-bg-color-responsive',
				'above-header-text-color-responsive',
				'above-header-link-color-responsive',
				'above-header-link-h-color-responsive',

				// Above Header Typography Configs.
				'above-header-font-family',
				'above-header-font-size',
				'above-header-font-weight',
				'above-header-text-transform',
				'font-family-above-header-dropdown-menu',
				'font-size-above-header-dropdown-menu',
				'font-weight-above-header-dropdown-menu',
				'text-transform-above-header-dropdown-menu',
				'font-family-above-header-content',
				'font-size-above-header-content',
				'font-weight-above-header-content',
				'text-transform-above-header-content',
			);
		}

		/**
		 * Get Deprecated Options for Below Header.
		 *
		 * @since x.x.x
		 */
		public function get_below_header_options() {
			return array(
				'below-header-bg-obj-responsive',
				'below-header-menu-text-color-responsive',
				'below-header-menu-bg-obj-responsive',
				'below-header-menu-text-hover-color-responsive',
				'below-header-menu-bg-hover-color-responsive',
				'below-header-current-menu-text-color-responsive',
				'below-header-current-menu-bg-color-responsive',
				'below-header-color-bg-dropdown-menu-divider',
				'below-header-submenu-text-color-responsive',
				'below-header-submenu-bg-color-responsive',
				'below-header-submenu-hover-color-responsive',
				'below-header-submenu-bg-hover-color-responsive',
				'below-header-submenu-active-color-responsive',
				'below-header-submenu-active-bg-color-responsive',
				'below-header-text-color-responsive',
				'below-header-link-color-responsive',
				'below-header-link-hover-color-responsive',
				'below-header-layout',
				'below-header-layout-section-1-divider',
				'below-header-section-1',
				'below-header-section-1-html',
				'below-header-layout-section-2-divider',
				'below-header-section-2',
				'below-header-section-2-html',
				'below-header-layout-options-separator-divider',
				'below-header-height',
				'below-header-separator',
				'below-header-bottom-border-color',
				'below-header-submenu-border-divider',
				'below-header-submenu-container-animation',
				'below-header-submenu-border',
				'below-header-submenu-border-color',
				'below-header-submenu-item-border',
				'below-header-submenu-item-b-color',
				'below-header-submenu-container-animation',
				'below-header-mobile-typography-divider',
				'below-header-menu-typography-styling',
				'below-header-submenu-typography-styling',
				'below-header-content-typography-styling',
				'below-header-mobile-colors-divider',
				'below-header-background-group',
				'below-header-menus-group',
				'below-header-submenus-group',
				'below-header-content-group',
				'below-header-mobile-menu-divider',
				'below-header-on-mobile',
				'below-header-merge-menu',
				'below-header-swap-mobile',
				'below-header-menu-align',
				'below-header-menu-label',
				'font-family-below-header-primary-menu',
				'font-size-below-header-primary-menu',
				'font-weight-below-header-primary-menu',
				'text-transform-below-header-primary-menu',
				'font-family-below-header-dropdown-menu',
				'font-size-below-header-dropdown-menu',
				'font-weight-below-header-dropdown-menu',
				'text-transform-below-header-dropdown-menu',
				'font-family-below-header-content',
				'font-size-below-header-content',
				'font-weight-below-header-content',
				'text-transform-below-header-content',
			);
		}

		/**
		 * Get Deprecated Options for Primary Header.
		 *
		 * @since x.x.x
		 */
		public function get_primary_header_options() {
			return array();
		}

		/**
		 * Get Deprecated Options for Sticky Header.
		 *
		 * @since x.x.x
		 */
		public function get_sticky_header_options() {
			return array();
		}

		/**
		 * Get Deprecated Options for Transparent Header.
		 *
		 * @since x.x.x
		 */
		public function get_transparent_header_options() {
			return array();
		}

		/**
		 * Get Deprecated Options for Mobile Header.
		 *
		 * @since x.x.x
		 */
		public function get_mobile_header_options() {
			return array(
				// Above Mobile Header.
				'mobile-above-header-menu-style',
				'flyout-mobile-above-header-menu-alignment',
				'mobile-above-header-toggle-btn-style',
				'mobile-above-header-toggle-btn-style-color',
				'mobile-above-header-toggle-btn-border-radius',
				'mobile-above-header-menu-all-border',
				'mobile-above-header-menu-b-color',

				// Below Mobile Header.
				'mobile-below-header-menu-style',
				'flyout-mobile-below-header-menu-alignment',
				'mobile-below-header-toggle-btn-style',
				'mobile-below-header-toggle-btn-style-color',
				'mobile-below-header-toggle-btn-border-radius',
				'mobile-below-header-menu-all-border',
				'mobile-below-header-menu-b-color',

				// Primary Mobile Header.
				'mobile-header-menu-b-color',
				'mobile-header-menu-all-border',
				'flyout-mobile-menu-alignment',
				'mobile-menu-style',
			);
		}

	}

	/**
	 *  Prepare if class 'Astra_Builder_Admin' exist.
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Astra_Builder_Admin::get_instance();
}
