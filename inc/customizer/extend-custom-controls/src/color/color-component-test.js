import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import ColorWrap from '../common/color';
import { Dashicon, Button, ColorIndicator, TabPanel, __experimentalGradientPicker, ColorPicker, SelectControl, ColorPalette } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

class ColorComponentNewOne extends Component {

	constructor( props ) {

		super( ...arguments );
		this.handleChangeComplete = this.handleChangeComplete.bind( this );
		this.state = {
			color: '#ffffff'
		}
	}

	render() {

		return (
			<ColorWrap
				color={undefined !== this.state.color && this.state.color ? this.state.color : ''}
				handleChangeComplete={(color, backgroundType) => this.handleChangeComplete(color)}
				backgroundType={'color'}
				allowGradient={false}
				allowImage={false}
			/>
		);
	}


	handleChangeComplete( color ) {
		console.log('COLOR COMPONENT CALLED');
		this.setState({color: color});
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

ColorComponentNewOne.propTypes = {
	color: PropTypes.string,
	usePalette: PropTypes.bool,
	palette: PropTypes.string,
	presetColors: PropTypes.object,
	handleChangeComplete: PropTypes.func,
	onPaletteChangeComplete: PropTypes.func,
	customizer: PropTypes.object
};

export default ColorComponentNewOne;
