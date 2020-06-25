/* global wp */
import { BaseControl } from './base/control.js';
import { TextControl } from './text/control.js';

wp.customize.controlConstructor.astra_text_control = TextControl;

window.addEventListener( 'load', () => {
    console.log('EMINEM WORK');
} );
