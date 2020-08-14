import ResponsiveBackground from './responsive-background.js';
import { getResponsiveBgJs } from '../common/responsive-helper';

export const responsiveBackgroundControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveBackground control={ control } />, control.container[0] );
	},
	ready: function() {
		getResponsiveBgJs( this )
	},
} );