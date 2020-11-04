import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import AstraColorPickerControl from '../common/astra-color-picker-control';

class ColorPaletteComponent extends Component {

    constructor( props ) {

		super( props );

		let value = this.props.control.setting.get();

		this.defaultValue = this.props.control.params.default;

		this.state = {
			value: value,
		};
	}

	handleChangeComplete( color, key ) {
		let value;

		if ( typeof color === 'string' || color instanceof String ) {
			value = color;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			value = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}
        this.updateValues( value, key );
    }

    render() {

		let labelHtml = null;
		let inputHtml = null;

		const {
			label
		} = this.props.control.params

		if ( label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>
		}

		inputHtml = (
			<>
				<div className="ast-color-picker-palette">
					<div className="ast-color-picker-palette-1" >
						<AstraColorPickerControl
							color={ '#000000' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, key ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
							style={ {right: "16%" } }
						/>
					</div>
					<div className="ast-color-picker-palette-2" >
						<AstraColorPickerControl
							color={ '#000000' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, key ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
							style={ {right: "16%" } }
						/>
					</div>
					<div className="ast-color-picker-palette-3" >
						<AstraColorPickerControl
							color={ '#000000' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, key ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
							style={ {right: "16%" } }
						/>
					</div>
					<div className="ast-color-picker-palette-4" >
						<AstraColorPickerControl
							color={ '#000000' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, key ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
							style={ {right: "16%" } }
						/>
					</div>
					<div className="ast-color-picker-palette-5" >
						<AstraColorPickerControl
							color={ '#000000' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, key ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
							style={ {right: "16%" } }
						/>
					</div>
				</div>
			</>
		)
		return (
			<>
				<label>
					{ labelHtml }
				</label>
				<div>
					{ inputHtml }
				</div>
			</>
		);
    }
}

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ColorPaletteComponent;
