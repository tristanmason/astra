<?php
/**
 * Astra Builder Helper.
 *
 * @package astra-builder
 */

if ( ! class_exists( 'Astra_Builder_Helper' ) ) {

	/**
	 * Class Astra_Builder_Helper.
	 */
	final class Astra_Builder_Helper {

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance = null;

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		public static $loaded_grid = null;

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
		 *  Check if Migrated to new Astra Builder.
		 */
		public static function is_new_user() {
			return astra_get_option( 'header-footer-builder-notice', true );
		}

		/**
		 * Adds a check to see if the side columns should run.
		 *
		 * @param string $row the name of the row.
		 */
		public static function has_mobile_side_columns( $row = 'primary' ) {

			$mobile_sides = false;
			$elements     = astra_get_option( 'header-mobile-items' );
			if ( isset( $elements ) && isset( $elements[ $row ] ) ) {
				if ( ( isset( $elements[ $row ][ $row . '_left' ] ) && is_array( $elements[ $row ][ $row . '_left' ] ) &&
						! empty( $elements[ $row ][ $row . '_left' ] ) ) || ( isset( $elements[ $row ][ $row . '_left_center' ] ) &&
						is_array( $elements[ $row ][ $row . '_left_center' ] ) &&
						! empty( $elements[ $row ][ $row . '_left_center' ] ) ) || ( isset( $elements[ $row ][ $row . '_right_center' ] ) &&
						is_array( $elements[ $row ][ $row . '_right_center' ] ) && ! empty( $elements[ $row ][ $row . '_right_center' ] ) ) ||
					( isset( $elements[ $row ][ $row . '_right' ] ) && is_array( $elements[ $row ][ $row . '_right' ] ) &&
						! empty( $elements[ $row ][ $row . '_right' ] ) ) ) {
					$mobile_sides = true;
				}
			}

			return $mobile_sides;
		}


		/**
		 * Adds a check to see if the center column should run.
		 *
		 * @param string $row the name of the row.
		 */
		public static function has_mobile_center_column( $row = 'primary' ) {

			$mobile_center = false;
			$elements      = astra_get_option( 'header-mobile-items' );
			if ( isset( $elements ) && isset( $elements[ $row ] ) && isset( $elements[ $row ][ $row . '_center' ] ) &&
				is_array( $elements[ $row ][ $row . '_center' ] ) && ! empty( $elements[ $row ][ $row . '_center' ] ) ) {
				$mobile_center = true;
			}

			return $mobile_center;
		}

		/**
		 * Adds support to render header columns.
		 *
		 * @param string $row the name of the row.
		 * @param string $column the name of the column.
		 * @param string $header the name of the header.
		 * @param string $builder the name of the builder.
		 */
		public static function render_builder_markup( $row = 'primary', $column = 'left', $header = 'desktop', $builder = 'header' ) {
			$elements = astra_get_option( $builder . '-' . $header . '-items' );
			if ( isset( $elements ) && isset( $elements[ $row ] ) && isset( $elements[ $row ][ $row . '_' . $column ] ) && is_array( $elements[ $row ][ $row . '_' . $column ] ) && ! empty( $elements[ $row ][ $row . '_' . $column ] ) ) {
				foreach ( $elements[ $row ][ $row . '_' . $column ] as $key => $item ) {


					if ( astra_wp_version_compare( '5.4.99', '>=' ) ) {

						get_template_part(
							'template-parts/' . $builder . '/builder/components',
							'',
							array(
								'type' => $item,
							)
						);
					} else {

						set_query_var( 'type', $item );
						get_template_part( 'template-parts/' . $builder . '/builder/components' );
					}
				}
			}
		}
		/**
		 * Adds support to render Mobile Popup Markup.
		 */
		public static function render_mobile_popup_markup() {

			$off_canvas_layout = astra_get_option( 'off-canvas-layout' );
			$off_canvas_slide  = astra_get_option( 'off-canvas-slide' );
			$side_class        = '';

			if ( $off_canvas_layout ) {

				if ( 'side-panel' === $off_canvas_layout ) {

					if ( $off_canvas_slide ) {

						if ( 'left' === $off_canvas_slide ) {

							$side_class = 'ast-mobile-popup-left';
						} else {

							$side_class = 'ast-mobile-popup-right';
						}
					}
				} else {
					$side_class = 'ast-mobile-popup-full-width';
				}
			}
			?>

			<div id="ast-mobile-popup" class="ast-mobile-popup-drawer <?php echo esc_attr( $side_class ); ?>">
				<div class="ast-mobile-popup-overlay"></div>
					<div class="ast-mobile-popup-inner">
						<div class="ast-mobile-popup-header">
							<button id="menu-toggle-close" class="menu-toggle-close" aria-label="Close menu">
								<span class="ast-svg-iconset">
									<svg class="ast-svg-icon ast-close-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
									<title>Toggle Menu Close</title>
									<path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
								</span>
							</button>
						</div>
						<div class="ast-mobile-popup-content">
							<?php
								/**
								 * Astra Off-Canvas
								 */
								do_action( 'astra_render_mobile_popup', 'popup', 'content' );
							?>
						</div>
					</div>
			</div>

			<?php
		}

		/**
		 * Check if Center column element exists.
		 *
		 * @param string $row the name of the row.
		 * @param string $builder_type the type of the builder.
		 * @param string $device Device.
		 */
		public static function has_center_column( $row = 'main', $builder_type = 'header', $device = 'desktop' ) {

			$center   = false;
			$elements = astra_get_option( $builder_type . '-' . $device . '-items' );
			if ( isset( $elements ) && isset( $elements[ $row ] ) &&
				isset( $elements[ $row ][ $row . '_center' ] ) && is_array( $elements[ $row ][ $row . '_center' ] ) &&
				! empty( $elements[ $row ][ $row . '_center' ] ) ) {
				$center = true;
			}

			return $center;
		}

		/**
		 * Check if Side column element exists.
		 *
		 * @param string $row row.
		 * @param string $builder_type the type of the builder.
		 * @param string $device Device.
		 * @return bool
		 */
		public static function has_side_columns( $row = 'primary', $builder_type = 'header', $device = 'desktop' ) {

			$sides    = false;
			$elements = astra_get_option( $builder_type . '-' . $device . '-items' );
			if ( isset( $elements ) && isset( $elements[ $row ] ) ) {
				if ( (
					isset( $elements[ $row ][ $row . '_left' ] ) &&
					is_array( $elements[ $row ][ $row . '_left' ] ) && ! empty( $elements[ $row ][ $row . '_left' ] ) ) ||
					( isset( $elements[ $row ][ $row . '_left_center' ] ) &&
						is_array( $elements[ $row ][ $row . '_left_center' ] ) && ! empty( $elements[ $row ][ $row . '_left_center' ] ) ) ||
					( isset( $elements[ $row ][ $row . '_right_center' ] ) &&
						is_array( $elements[ $row ][ $row . '_right_center' ] ) && ! empty( $elements[ $row ][ $row . '_right_center' ] ) ) ||
					( isset( $elements[ $row ][ $row . '_right' ] ) &&
						is_array( $elements[ $row ][ $row . '_right' ] ) && ! empty( $elements[ $row ][ $row . '_right' ] ) ) ) {
					$sides = true;
				}
			}
			return $sides;
		}

		/**
		 * Check if Zone is empty.
		 *
		 * @param string $row row.
		 * @param string $builder_type the type of the builder.
		 * @param string $zone Zone.
		 * @return bool
		 */
		public static function is_zone_empty( $row = 'primary', $builder_type = 'header', $zone ) {
			$sides    = true;
			$elements = astra_get_option( $builder_type . '-desktop-items' );
			if ( isset( $elements ) && isset( $elements[ $row ] ) ) {

				if ( isset( $elements[ $row ][ $row . '_' . $zone ] ) &&
				is_array( $elements[ $row ][ $row . '_' . $zone ] ) && ! empty( $elements[ $row ][ $row . '_' . $zone ] ) ) {

					$sides = false;
				}
			}
			return $sides;
		}

		/**
		 * Check if Footer Zone is empty.
		 *
		 * @param string $row row.
		 * @return bool
		 */
		public static function is_footer_row_empty( $row = 'primary' ) {
			$sides    = false;
			$elements = astra_get_option( 'footer-desktop-items' );

			if ( isset( $elements ) && isset( $elements[ $row ] ) ) {
				for ( $i = 1; $i <= 5; $i++ ) {
					if (
						isset( $elements[ $row ][ $row . '_' . $i ] ) &&
						is_array( $elements[ $row ][ $row . '_' . $i ] ) &&
						! empty( $elements[ $row ][ $row . '_' . $i ] )
					) {
						$sides = true;
						break;
					}
				}
			}
			return $sides;
		}

		/**
		 * Check if row is empty.
		 *
		 * @param string $row row.
		 * @param string $builder_type the type of the builder.
		 * @param string $device Device.
		 * @return bool
		 */
		public static function is_row_empty( $row = 'primary', $builder_type = 'header', $device = 'desktop' ) {
			if ( false === self::has_center_column( $row, $builder_type, $device ) && false === self::has_side_columns( $row, $builder_type, $device ) ) {
				return false;
			}
			return true;
		}

		/**
		 * Check if component placed on the builder.
		 *
		 * @param string  $builder_type builder type.
		 * @param integer $component_id component id.
		 * @return bool
		 */
		public static function is_component_loaded( $builder_type = 'header', $component_id ) {

			$loaded_components = array();

			if ( is_null( self::$loaded_grid ) ) {

				$grids[] = astra_get_option( 'header-desktop-items', array() );
				$grids[] = astra_get_option( 'header-mobile-items', array() );
				$grids[] = astra_get_option( 'footer-desktop-items', array() );

				if ( ! empty( $grids ) ) {

					foreach ( $grids as $row_gird => $row_grids ) {

						if ( ! empty( $row_grids ) ) {

							foreach ( $row_grids as $row => $grid ) {

								if ( ! in_array( $row, array( 'below', 'above', 'primary', 'popup' ) ) ) {
									continue;
								}

								if ( ! is_array( $grid ) ) {
									continue;
								}

								$result              = array_values( $grid );
								$loaded_component    = call_user_func_array( 'array_merge', $result );
								$loaded_components[] = is_array( $loaded_component ) ? $loaded_component : array();
							}
						}
					}
				}

				if ( ! empty( $loaded_components ) ) {
					$loaded_components = array_values( $loaded_components );
					$loaded_components = call_user_func_array( 'array_merge', $loaded_components );
				}

				self::$loaded_grid = $loaded_components;
			}

			$loaded_components = self::$loaded_grid;

			return in_array( $component_id, $loaded_components, true ) || is_customize_preview();
		}
	}

	/**
	 *  Prepare if class 'Astra_Builder_Helper' exist.
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Astra_Builder_Helper::get_instance();
}
