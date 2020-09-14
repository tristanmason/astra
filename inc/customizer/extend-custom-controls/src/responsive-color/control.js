import ResponsiveColorComponent from './responsive-color-component';
import { astraGetResponsiveColorJs } from '../common/responsive-helper';

export const responsiveColorControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(
			<ResponsiveColorComponent control={control} customizer={ wp.customize }/>,
			control.container[0]
		);
	},
	ready: function() {
		astraGetResponsiveColorJs( this );
		let control = this;
		jQuery(document).mouseup(function(e){
			var container = jQuery(control.container);
			// If the target of the click isn't the container nor a descendant of the container.
			if (!container.is(e.target) && container.has(e.target).length === 0){
				container.find('.components-button.astra-color-icon-indicate.open').click();
			}
		});
	},

} );
