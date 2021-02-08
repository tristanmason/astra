import ResponsiveImage from './responsive-image.js';
import {astraGetResponsiveImageJs} from '../common/responsive-helper';

export const responsiveImageControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveImage control={ control } />, control.container[0] );
	},
	ready: function() {
		astraGetResponsiveImageJs( this );
	},
} );
