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
		let color_value;

		if ( typeof color === 'string' || color instanceof String ) {
			color_value = color;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			color_value = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			color_value = color.hex;
		}

		// value[key] = color_value;
		
        this.updateValues( color_value );
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
				<label>
					<input type="radio" value="Male" name="gender" />
					 <div className="ast-color-picker-palette-1" >
						<AstraColorPickerControl
							color={ ( undefined !== this.state.value && this.state.value ? this.state.value :  '' ) }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, 'color1' ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
						/>
					</div>
					<div className="ast-color-picker-palette-2" >
						<AstraColorPickerControl
							color={ '#ffffff' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, 'color2' ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
						/>
					</div>
					<div className="ast-color-picker-palette-3" >
						<AstraColorPickerControl
							color={ '#dd3333' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, 'color3' ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
						/>
					</div>
					<div className="ast-color-picker-palette-4" >
						<AstraColorPickerControl
							color={ '#1e73be' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, 'color4' ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
						/>
					</div>
					<div className="ast-color-picker-palette-5" >
						<AstraColorPickerControl
							color={ '#8224e3' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, 'color5' ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
						/>
					</div> 
				</label>
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
	updateValues( value ) {

		console.log(value);
		
		this.setState( { value: value } );
		this.props.control.setting.set( value );
	}
}

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ColorPaletteComponent;
