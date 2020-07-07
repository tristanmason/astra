import ResponsiveBackground from './responsive-background.js';

export const responsiveBackgroundControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveBackground control={ control } />, control.container[0] );
	}
} );