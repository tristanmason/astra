import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import AstraColorPickerControl from '../common/astra-color-picker-control';
import { Dashicon, Button, ColorIndicator, TabPanel, __experimentalGradientPicker, ColorPicker, SelectControl, ColorPalette } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

class ColorWrap extends Component {

	constructor( props ) {

		super( ...arguments );
		this.onChangeComplete = this.onChangeComplete.bind( this );
	}

	render() {

		return (
			<AstraColorPickerControl
				color={undefined !== this.props.color && this.props.color ? this.props.color : ''}
				onChangeComplete={(color, backgroundType) => this.onChangeComplete(color)}
				backgroundType={'color'}
				allowGradient={false}
				allowImage={false}
			/>
		);
	}


	onChangeComplete( color ) {
		this.props.handleChangeComplete( color, 'color' );
		console.log('INSIDE COLOR');
		// let newColor;
		// if ( color.rgb && color.rgb.a && 1 !== color.rgb.a ) {
		// 	newColor = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		// } else {
		// 	newColor = color.hex;
		// }
		// this.setState( { backgroundType: 'color' } );
		// console.log('Astra Color Picker');
		// this.props.onChangeComplete( color, 'color' );
	}
}

ColorWrap.propTypes = {
	color: PropTypes.string,
	usePalette: PropTypes.bool,
	palette: PropTypes.string,
	presetColors: PropTypes.object,
	handleChangeComplete: PropTypes.func,
	onPaletteChangeComplete: PropTypes.func,
	customizer: PropTypes.object
};

export default ColorWrap;
