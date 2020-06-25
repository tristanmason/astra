/* global wp */
import { BaseControl } from './base/control.js';
import { TextControl } from './text/control.js';
import { HeadingControl } from './heading/control.js';

wp.customize.controlConstructor['astra_text_control'] = TextControl;
wp.customize.controlConstructor['ast-heading'] = HeadingControl;

window.addEventListener( 'load', () => {
    console.log('Testing Console.');
} );
