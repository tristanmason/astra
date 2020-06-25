<?php
/**
 * Customizer Control: divider
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       2.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A text control with validation for CSS units.
 */
class Astra_Control_Hidden extends WP_Customize_Control {

	/**
	 * The control type.
	 *
	 * @access public
	 * @since  2.0.0
	 * @var string
	 */
	public $type = 'ast-hidden';


	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @see WP_Customize_Control::to_json()
	 * @since  2.0.0
	 */
	public function to_json() {
		parent::to_json();
		$this->json['default'] = $this->setting->default;
		if ( isset( $this->default ) ) {
			$this->json['default'] = $this->default;
		}
		$this->json['value'] = $this->value();
	}
}
