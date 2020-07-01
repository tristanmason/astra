import SettingsGroupComponent from './settings-group-component';

export const settingsGroupControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <SettingsGroupComponent control={ control } />, control.container[0] );
	}
} );