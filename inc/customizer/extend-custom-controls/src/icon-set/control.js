import IconSetComponent from './icon-set-component';

export const IconSetControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(
				<IconSetComponent control={control}/>,
				control.container[0]
		);
	}
} );
