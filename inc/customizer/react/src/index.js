import { BaseControl } from './base/control';
import { headingControl } from './heading/control';
import { hiddenControl } from './hidden/control';
import { descriptionControl } from './description/control';
import { settingsGroupControl } from './settings-group/control';
import { borderControl } from './border/control';
import { customizerLinkControl } from './customizer-link/control';
import { responsiveControl } from './responsive/control';
import { responsiveSliderControl } from './responsive-slider/control';
import { sliderControl } from './slider/control';
import { radioImageControl } from './radio-image/control';
import { responsiveSpacingControl }  from './responsive-spacing/control';

wp.customize.controlConstructor['ast-heading'] = headingControl;
wp.customize.controlConstructor['ast-hidden'] = hiddenControl;
wp.customize.controlConstructor['ast-description'] = descriptionControl;
wp.customize.controlConstructor['ast-settings-group'] = settingsGroupControl;
wp.customize.controlConstructor['ast-border'] = borderControl;
wp.customize.controlConstructor['ast-customizer-link'] = customizerLinkControl;
wp.customize.controlConstructor['ast-responsive'] = responsiveControl;
wp.customize.controlConstructor['ast-responsive-slider'] = responsiveSliderControl;
wp.customize.controlConstructor['ast-slider'] = sliderControl;
wp.customize.controlConstructor['ast-radio-image'] = radioImageControl;
wp.customize.controlConstructor['ast-responsive-spacing'] = responsiveSpacingControl;

window.addEventListener( 'load', () => {
    console.log('Testing Console.');
} );
