<?php
/**
 * Astra Builder UI Controller.
 *
 * @package astra-builder
 */

if ( ! class_exists( 'Astra_Builder_UI_Controller' ) ) {

	/**
	 * Class Astra_Builder_UI_Controller.
	 */
	final class Astra_Builder_UI_Controller {

		/**
		 * Prepare Social Icon HTML.
		 *
		 * @param string $builder_type the type of the builder.
		 */
		public static function render_social_icon( $builder_type = 'header' ) {
			$items      = astra_get_option( $builder_type . '-social-icons' );
			$items      = isset( $items['items'] ) ? $items['items'] : array();
			$show_label = astra_get_option( $builder_type . '-social-label-toggle' );
			$color_type = astra_get_option( $builder_type . '-social-color-type' );

			echo '<div class="ast-' . esc_attr( $builder_type ) . '-social-wrap">';

			if ( is_customize_preview() ) {
				self::render_customizer_edit_button();
			}

			echo '<div class="' . esc_attr( $builder_type ) . '-social-inner-wrap element-social-inner-wrap social-show-label-' . ( $show_label ? 'true' : 'false' ) . ' ast-social-color-type-' . esc_attr( $color_type ) . ' ast-social-element-style-filled">';
			if ( is_array( $items ) && ! empty( $items ) ) {
				foreach ( $items as $item ) {
					if ( $item['enabled'] ) {

						$link = $item['url'];

						switch ( $item['id'] ) {

							case 'phone':
								$link = 'tel:' . $item['url'];
								break;

							case 'email':
								$link = 'mailto:' . $item['url'];
								break;

							case 'whatsapp':
								$link = 'https://api.whatsapp.com/send?phone=' . $item['url'];
								break;
						}

						echo '<a href="' . esc_url( $link ) . '"' . esc_attr( $show_label ? ' aria-label=' . $item['label'] . '' : '' ) . ' ' . ( 'phone' === $item['id'] || 'email' === $item['id'] ? '' : 'target="_blank" rel="noopener noreferrer" ' ) . 'class="ast-builder-social-element ' . esc_attr( $item['id'] ) . ' ' . esc_attr( $builder_type ) . '-social-item">';

							$astra_icon_controller = new Astra_Builder_Icon_Controller();
							$astra_icon_controller->render_icon( $item['icon'], false );

						if ( $show_label ) {
							echo '<span class="social-item-label">' . esc_html( $item['label'] ) . '</span>';
						}

						echo '</a>';
					}
				}
			}
			echo '</div>';
			echo '</div>';
		}

		/**
		 * Prepare HTML Markup.
		 *
		 * @param string $index Key of the HTML Control.
		 */
		public static function render_html_markup( $index = 'header-html-1' ) {

			$content = astra_get_option( $index );
			if ( $content || is_customize_preview() ) {
				$link_style = '';
				echo '<div class="ast-header-html inner-link-style-' . esc_attr( $link_style ) . '">';
				if ( is_customize_preview() ) {
					self::render_customizer_edit_button();
				}
				echo '<div class="ast-builder-html-element">';
				echo do_shortcode( wpautop( $content ) );
				echo '</div>';
				echo '</div>';
			}

		}
		/**
		 * Prepare Edit icon inside customizer.
		 */
		public static function render_customizer_edit_button() {
			?>
			<div class="customize-partial-edit-shortcut" data-id="ahfb">
				<button aria-label="<?php esc_attr_e( 'Click to edit this element.', 'astra' ); ?>"
						title="<?php esc_attr_e( 'Click to edit this element.', 'astra' ); ?>"
						class="customize-partial-edit-shortcut-button item-customizer-focus">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M13.89 3.39l2.71 2.72c.46.46.42 1.24.03 1.64l-8.01 8.02-5.56 1.16 1.16-5.58s7.6-7.63 7.99-8.03c.39-.39 1.22-.39 1.68.07zm-2.73 2.79l-5.59 5.61 1.11 1.11 5.54-5.65zm-2.97 8.23l5.58-5.6-1.07-1.08-5.59 5.6z"></path>
					</svg>
				</button>
			</div>
			<?php
		}

		/**
		 * Prepare Special Edit navigatory trigger for Builder Grid Rows in customizer.
		 *
		 * @param string $type Header / Footer row type.
		 * @param string $row_position Above / Primary / Below.
		 *
		 * @since x.x.x
		 */
		public static function render_grid_row_customizer_edit_button( $type, $row_position ) {

			switch ( $row_position ) {
				case 'primary':
					/* translators: %s: icon term */
					$row_label = sprintf( __( 'Primary %s', 'astra' ), $type );
					break;
				case 'above':
					/* translators: %s: icon term */
					$row_label = sprintf( __( 'Above %s', 'astra' ), $type );
					break;
				case 'below':
					/* translators: %s: icon term */
					$row_label = sprintf( __( 'Below %s', 'astra' ), $type );
					break;
				default:
					$row_label = $type;
					break;
			}

			?>
			<div class="customize-partial-edit-shortcut row-editor-shortcut" data-id="ahfb">
				<button aria-label="<?php esc_attr_e( 'Click to edit this element.', 'astra' ); ?>"	title="<?php esc_attr_e( 'Click to edit this Row.', 'astra' ); ?>" class="item-customizer-focus">
					<span class="ahfb-customizer-row-shortcut"> <?php echo esc_attr( $row_label ); ?> </span>
				</button>
			</div>
			<?php
		}

		/**
		 * Render Trigger Markup.
		 *
		 * @since x.x.x
		 */
		public static function render_mobile_trigger() {

			$icon             = astra_get_option( 'header-trigger-icon' );
			$mobile_label     = astra_get_option( 'mobile-header-menu-label' );
			$toggle_btn_style = astra_get_option( 'mobile-header-toggle-btn-style' );

			?>
			<div class="ast-button-wrap">
				<button type="button" class="menu-toggle main-header-menu-toggle ast-mobile-menu-trigger-<?php echo esc_attr( $toggle_btn_style ); ?>" aria-controls="primary-menu" aria-expanded="false">
					<span class="screen-reader-text">Main Menu</span>
					<span class="mobile-menu-toggle-icon"> 
						<?php
							echo self::get_icon( $icon ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo self::get_icon( 'close' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						?>
					</span>
					<?php
					if ( isset( $mobile_label ) && ! empty( $mobile_label ) ) {
						?>

						<span class="mobile-menu-wrap">
							<span class="mobile-menu"><?php echo esc_html( $mobile_label ); ?></span>
						</span>
						<?php
					}
					?>
				</button>
			</div>
			<?php
		}

		/**
		 * Gives Icon SVG.
		 *
		 * @param string $icon Icon Name.
		 */
		public static function get_icon( $icon ) {

			$output = '';

			switch ( $icon ) {

				case 'menu':
					$output .= '<svg class="ast-mobile-svg ast-menu-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path d="M3 13h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 19h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
					</svg>';
					break;
				case 'menu2':
					$output .= '<svg class="ast-mobile-svg ast-menu2-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="28" viewBox="0 0 24 28">
						<path d="M24 21v2c0 0.547-0.453 1-1 1h-22c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h22c0.547 0 1 0.453 1 1zM24 13v2c0 0.547-0.453 1-1 1h-22c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h22c0.547 0 1 0.453 1 1zM24 5v2c0 0.547-0.453 1-1 1h-22c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h22c0.547 0 1 0.453 1 1z"></path>
					</svg>';
					break;
				case 'menu3':
					$output .= '<svg class="ast-mobile-svg ast-menu3-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
						<path d="M6 3c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM6 8c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM6 13c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2z"></path>
					</svg>';
					break;
				case 'close':
					$output .= '<svg class="ast-mobile-svg ast-close-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>
					</svg>';
					break;
			}

			return $output;
		}
		/**
		 * Button text.
		 */
		public static function header_section_button_text() {
			$custom_button_text = astra_get_option( 'header-button-text' );
			$html               = '<div class="ast-button"> ' . $custom_button_text . ' </div>';
			return do_shortcode( $html );
		}

		/**
		 * SIte Identity.
		 */
		public static function render_site_identity() {
			?>

			<div class="site-branding">
				<?php
				if ( is_customize_preview() ) {
					self::render_customizer_edit_button();
				}
				?>

				<div
					<?php
					echo astra_attr(
						'site-identity',
						array(
							'class' => 'ast-site-identity',
						)
					);
					?>
				>
					<?php astra_logo(); ?>
				</div>
			</div>

			<!-- .site-branding -->
			<?php
		}

	}
}
