import ColorGroupComponent from './color-group-component';

export const colorGroupControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render( <ColorGroupComponent control={ control } />, control.container[0] );
	},
} );
