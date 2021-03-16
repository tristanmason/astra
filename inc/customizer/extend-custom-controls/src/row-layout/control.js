import RowLayoutComponent from './row-layout-component';
import {astraGetResponsiveRowLayoutJs} from '../common/responsive-helper';

export const RowLayoutControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device');
		ReactDOM.render(
				<RowLayoutComponent control={control} customizer={ wp.customize } device={device}/>,
				control.container[0]
		);
	},
	ready: function() {
		astraGetResponsiveRowLayoutJs( this );
	},
} );
