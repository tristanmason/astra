import HiddenComponent from './hidden-component.js';

export const HiddenControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <HiddenComponent control={ control } />, control.container[0] );
	}
} );