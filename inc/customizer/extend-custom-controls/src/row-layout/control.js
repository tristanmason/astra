import RowLayoutComponent from './row-layout-component';

export const RowLayoutControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(
				<RowLayoutComponent control={control} customizer={ wp.customize }/>,
				control.container[0]
		);
	},
	ready: function() {

		let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

		jQuery( '.customize-control-ast-row-layout .ahfb-responsive-control-bar .components-button.' + device ).trigger( 'click' );

		jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

			var device = jQuery(this).attr('data-device');

			jQuery( '.customize-control-ast-row-layout .ahfb-responsive-control-bar .components-button.' + device ).trigger( 'click' );
		});
	},
} );
