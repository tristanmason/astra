import PropTypes from 'prop-types';

import {Fragment} from '@wordpress/element';

import AstraColorPickerControl from '../common/astra-color-picker-control';

const ColorPaletteComponent = props => {

	const {		
		label,
		description
	} = props.control.params;

	
	let labelHtml = null;
	let descriptionHtml = null;

	

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}
	console.log(props);

	const handleChangeComplete = ( color ) => {
		let value;
		console.log(color);
		
		if (typeof color === 'string' || color instanceof String) {
			value = color;
		} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
			value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}
		console.log(value);

		// updateValues(value);
	};

	var palettehtml = (
		<Fragment>
			<div className="ast-color-picker-palette-1" >
				<AstraColorPickerControl
					color={ '#ffffff' }
					onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, 'color2' ) }
					backgroundType = { 'color' }
					allowGradient={ false }
					allowImage={ false }					
				/>
			</div>
			<div className="ast-color-picker-palette-2" >
				<AstraColorPickerControl 
					color={"red"}
					onChangeComplete={(color, backgroundType) => handleChangeComplete(color)}
					backgroundType={'color'}
					allowGradient={false}
					allowImage={false}					
				/>
			</div>
			<div className="ast-color-picker-palette-3" >
				<AstraColorPickerControl 
					color={"red"}
					onChangeComplete={(color, backgroundType) => handleChangeComplete(color)}
					backgroundType={'color'}
					allowGradient={false}
					allowImage={false}					
				/>
			</div>
			<div className="ast-color-picker-palette-4" >
				<AstraColorPickerControl 
					color={"red"}
					onChangeComplete={(color, backgroundType) => handleChangeComplete(color)}
					backgroundType={'color'}
					allowGradient={false}
					allowImage={false}
				/>
			</div>
			<div className="ast-color-picker-palette-5" >
				<AstraColorPickerControl 
					color={"red"}
					onChangeComplete={(color, backgroundType) => handleChangeComplete(color)}
					backgroundType={'color'}
					allowGradient={false}
					allowImage={false}
				/>
			</div>
		</Fragment>
	)
	return <Fragment>
		
		<label className="customizer-text">
			{ labelHtml }
		</label>
		<div>
			{ palettehtml }
		</div>
		<label>
			{ descriptionHtml }	
		</label>
	</Fragment>;
};

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ColorPaletteComponent );
