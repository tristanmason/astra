import { BaseControl } from './base/control';
import { headingControl } from './heading/control';
import { hiddenControl } from './hidden/control';
import { descriptionControl } from './description/control';
import { sliderControl } from './slider/control';
import { responsiveSpacingControl }  from './responsive-spacing/control';

wp.customize.controlConstructor['ast-heading'] = headingControl;
wp.customize.controlConstructor['ast-hidden'] = hiddenControl;
wp.customize.controlConstructor['ast-description'] = descriptionControl;
wp.customize.controlConstructor['ast-slider'] = sliderControl;
wp.customize.controlConstructor['ast-responsive-spacing'] = responsiveSpacingControl;

window.addEventListener( 'load', () => {
    console.log('Testing Console.');
} );
