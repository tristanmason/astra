import ResponsiveSliderComponent from './responsive-slider-component.js';
import { getResponsiveSliderJs } from '../common/responsive-helper';

export const responsiveSliderControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveSliderComponent control={ control } />, control.container[0] );
	},
	ready: function() {

		getResponsiveSliderJs( this );
	}
} );