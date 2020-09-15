import SwitchComponent from './switch-component.js';

export const SwitchControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(
				<SwitchComponent control={control}/>,
				control.container[0]
		);
	}
} );
