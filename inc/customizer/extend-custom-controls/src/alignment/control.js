import AlignmentComponent from './alignment-component.js';
import { astraGetAlignmentJs } from '../common/responsive-helper';

export const alignmentControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render( <AlignmentComponent control={ control } />, control.container[0] );
	},
	ready: function() {
		astraGetAlignmentJs( this );
	},
} );
