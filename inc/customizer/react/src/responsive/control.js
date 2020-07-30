import ResponsiveComponent from './responsive-component.js';
import { getResponsiveJs } from '../common/responsive-helper';

export const responsiveControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveComponent control={ control } />, control.container[0] );
	},
	ready: function() {

		getResponsiveJs( this );
	},
} );