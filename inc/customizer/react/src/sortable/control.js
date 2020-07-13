import SortableComponent from './sortable.js';

export const sortableControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <SortableComponent control={ control } />, control.container[0] );
	}
} );