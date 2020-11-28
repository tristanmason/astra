import ColorPaletteComponent from './color-palette-component';

export const colorPaletteControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(
			<ColorPaletteComponent control={control} customizer={ wp.customize }/>,
			control.container[0]
		);
	}
} );