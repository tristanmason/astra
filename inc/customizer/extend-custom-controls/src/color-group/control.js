import ColorComponent from './color-component.js';

export const ColorGroupControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(<ColorComponent control={ control } />, control.container[0] );
	}
} );
