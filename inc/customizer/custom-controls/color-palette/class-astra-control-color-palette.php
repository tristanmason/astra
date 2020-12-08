<?php
/**
 * Customizer Control: Color Palette.
 *
 * Creates a jQuery color palette control.
 *
 * @package     Astra
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Color control (alpha).
 */
class Astra_Control_Color_Palette extends WP_Customize_Control {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'ast-color-palette';

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $default = array();

	/**
	 * Additional arguments passed to JS.
	 *
	 * @var array
	 */
	public $input_attrs = array();

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @see WP_Customize_Control::to_json()
	 */
	public function to_json() {
		parent::to_json();
		$this->json['default']     = $this->default;
		$this->json['input_attrs'] = $this->input_attrs;
	}

	/**
	 * Render the control's content.
	 *
	 * @see WP_Customize_Control::render_content()
	 */
	protected function render_content() {}
}
