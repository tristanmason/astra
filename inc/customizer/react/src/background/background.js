import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import BackgroundColorControl from '../common/background-color';

class Background extends Component {
	
	constructor(props) {

		super( props );

		let value = this.props.control.setting.get();
		
		this.defaultValue = this.props.control.params.default;
		this.onSelectImage = this.onSelectImage.bind( this );
		
		this.state = {
			value: value,
		};
		console.log(this.state.value)
		// this.updateBackgroundType();
	}

	updateBackgroundType() {

		let obj = {
			...this.state.value, 
		};
		
		if ( undefined === this.state.value['background-type']  || '' === this.state.value['background-type'] ) {

			if ( undefined !== this.state.value['background-color'] ) {

				obj['background-type'] = 'color';
				this.updateValues( obj );

				if ( this.state.value['background-color'].includes('gradient') ) {
					
					obj['background-type'] = 'gradient';

					this.updateValues( obj );
				}
			}
			if ( undefined !== this.state.value['background-image'] ) {
				
				obj['background-type'] = 'image';
				this.updateValues( obj );
			}
		}
	}
	renderReset ( key ) {
		return (
			<span className="customize-control-title">
				<>
					<Button
						className="reset astra-reset"
						disabled={ ( JSON.stringify( this.state.value ) === JSON.stringify( this.defaultValue ) ) }
						onClick={ () => {
							let value = JSON.parse( JSON.stringify( this.defaultValue ) );
							
							this.updateValues( value );
						} }
					>
						<Dashicon icon='image-rotate' />
					</Button>
				</>
			</span>
		)
	}
	onSelectImage ( media, backgroundType ) {

		let obj = {
			...this.state.value, 
		};
		obj['background-media'] = media
		obj['background-image'] = media.url
		
		obj['background-type'] = backgroundType

        this.updateValues( obj );
	}
	onChangeImageOptions( mainKey, value, backgroundType ) {

		let obj = {
			...this.state.value, 
		};

		obj[mainKey] = value
		obj['background-type'] = backgroundType

        this.updateValues( obj );
	}
	renderSettings () {
		
		return (
			<>
				<BackgroundColorControl
					color={ ( undefined !== this.state.value['background-color'] && this.state.value['background-color'] ? this.state.value['background-color'] :  '' ) }
					onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, backgroundType ) }
					media={ ( undefined !== this.state.value['background-media'] && this.state.value['background-media'] ? this.state.value['background-media'] :  '' ) }
					backgroundImage = { ( undefined !== this.state.value['background-image'] && this.state.value['background-image'] ? this.state.value['background-image'] :  '' ) }
					backgroundAttachment = { ( undefined !== this.state.value['background-attachment'] && this.state.value['background-attachment'] ? this.state.value['background-attachment'] :  '' ) }
					backgroundPosition = { ( undefined !== this.state.value['background-position'] && this.state.value['background-position'] ? this.state.value['background-position'] :  '' ) }
					backgroundRepeat = { ( undefined !== this.state.value['background-repeat'] && this.state.value['background-repeat'] ? this.state.value['background-repeat'] :  '' ) }
					backgroundSize = { ( undefined !== this.state.value['background-size'] && this.state.value['background-size'] ? this.state.value['background-size'] :  '' ) }
					onSelectImage = { ( media, backgroundType ) => this.onSelectImage( media, backgroundType ) }
					onChangeImageOptions = { ( mainKey, value, backgroundType ) => this.onChangeImageOptions( mainKey, value, backgroundType ) }
					backgroundType = { ( undefined !== this.state.value['background-type'] && this.state.value['background-type'] ? this.state.value['background-type'] :  'color' ) }
					allowGradient={ true }
					allowImage={ true }
				/>
			</>
		)
	}
	handleChangeComplete( color, backgroundType ) {
		let value;

		if ( typeof color === 'string' || color instanceof String ) {
			value = color;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			value = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}
		
		let obj = {
			...this.state.value, 
		};

		obj['background-color'] = value
		obj['background-type'] = backgroundType

        this.updateValues( obj );
	}
	
    render() {
		
		const {
			defaultValue,
			label,
			description,
		} = this.props.control.params

		let defaultVal = '#RRGGBB';
		let labelHtml = null;
		let responsiveHtml = null;
		let inputHtml = null;

		if ( defaultValue ) {

			if ( '#' !== defaultValue.substring( 0, 1 ) ) {
				defaultVal = '#' + defaultValue;
			} else {
				defaultVal = defaultValue;
			}

			defaultValueAttr = ' data-default-color=' + defaultVal; // Quotes added automatically.
		}

		if ( label ) { 

			labelHtml = <span className="customize-control-title">{ label }</span>
		} 

		if ( description ) { 

			labelHtml = <span className="description customize-control-description">{ description }</span>
		}

		inputHtml = (
			<>
				<div className="background-wrapper">
					<div className="background-container">
					{ this.renderReset() }
					{ this.renderSettings() }
					</div>
				</div>
			</>
		)
		
		return (
			<>
				<label>
					{ labelHtml }
				</label>

				<div className="customize-control-content">
					{ inputHtml }
				</div>
			</>
		);
	}
	updateValues( obj ) {
		this.setState( { value : obj } )
		this.props.control.setting.set( obj );
	}
}

Background.propTypes = {
	control: PropTypes.object.isRequired
};

export default Background;
