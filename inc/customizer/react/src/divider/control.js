import DividerComponent from './divider-component.js';

export const DividerControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <DividerComponent control={ control } />, control.container[0] );
	}
} );