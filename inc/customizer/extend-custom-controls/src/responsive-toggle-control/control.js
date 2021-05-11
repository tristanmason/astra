import AstResponsiveToggleControl from './responsive-toggle-control-component';
import {astraGetResponsiveToggleControlJs, siteTitleTaglineDependentControl} from '../common/responsive-helper';

export const responsiveToggleControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render( <AstResponsiveToggleControl control={ control } />, control.container[0] );
	},
	ready: function() {
		astraGetResponsiveToggleControlJs( this );
		siteTitleTaglineDependentControl( this );
	}
} );