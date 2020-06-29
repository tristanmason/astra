import LinkComponent from './link-component.js';
export const LinkControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		
		let control = this;

	ReactDOM.render( <LinkComponent control={ control } />, control.container[0] );
	}
} );