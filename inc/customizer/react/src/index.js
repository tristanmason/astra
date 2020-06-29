/* global wp */
import { BaseControl } from './base/control.js';
import { TextControl } from './text/control.js';
import { HeadingControl } from './heading/control.js';
import { HiddenControl } from './hidden/control.js';
import { DescriptionControl } from './description/control.js';
import { DividerControl } from './divider/control.js';

wp.customize.controlConstructor['astra_text_control'] = TextControl;
wp.customize.controlConstructor['ast-heading'] = HeadingControl;
wp.customize.controlConstructor['ast-hidden'] = HiddenControl;
wp.customize.controlConstructor['ast-description'] = DescriptionControl;
wp.customize.controlConstructor['ast-divider'] = DividerControl;

window.addEventListener( 'load', () => {
    console.log('Testing Console.');
} );
