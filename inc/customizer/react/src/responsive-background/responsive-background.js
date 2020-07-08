import PropTypes from 'prop-types';
import { Component, Fragment } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';


import BackgroundColorControl from '../common/background-color';

class ResponsiveBackground extends Component {
	
	constructor(props) {

		super( props );

		let value = this.props.control.setting.get();
console.log(value)
		this.defaultValue = this.props.control.params.default;
		this.onSelectImage = this.onSelectImage.bind( this );
		
		this.state = {
			value: value,
		};

	}
	renderReset ( key ) {
		return (
			<span className="customize-control-title">
				<Fragment>
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
				</Fragment>
			</span>
		)
	}
	onSelectImage ( media, key ) {
		// console.log(media)
		let obj = {
			...this.state.value, 
		};
		let deviceObj = {
			...obj[key]
		};
		deviceObj['background-image'] = media.url
		deviceObj['background-media'] = media
		obj[key] = deviceObj

        this.updateValues( obj );
	}
	onChangeImageOptions( key, value , device ) {

		let obj = {
			...this.state.value, 
		};
		let deviceObj = {
			...obj[device]
		};
		deviceObj[key] = value
		obj[device] = deviceObj

        this.updateValues( obj );
	}
	renderSettings ( key ) {
		
		return (
			<>
				<BackgroundColorControl
					// key={ item }
					color={ ( undefined !== this.state.value[key]['background-color'] && this.state.value[key]['background-color'] ? this.state.value[key]['background-color'] :  '' ) }
					onChangeComplete={ ( color ) => this.handleChangeComplete( color, key ) }
					media={ ( undefined !== this.state.value[key]['background-media'] && this.state.value[key]['background-media'] ? this.state.value[key]['background-media'] :  '' ) }
					backgroundAttachment = { ( undefined !== this.state.value[key]['background-attachment'] && this.state.value[key]['background-attachment'] ? this.state.value[key]['background-attachment'] :  '' ) }
					backgroundPosition = { ( undefined !== this.state.value[key]['background-position'] && this.state.value[key]['background-position'] ? this.state.value[key]['background-position'] :  '' ) }
					backgroundRepeat = { ( undefined !== this.state.value[key]['background-repeat'] && this.state.value[key]['background-repeat'] ? this.state.value[key]['background-repeat'] :  '' ) }
					backgroundSize = { ( undefined !== this.state.value[key]['background-size'] && this.state.value[key]['background-size'] ? this.state.value[key]['background-size'] :  '' ) }
					onSelectImage = { ( media ) => this.onSelectImage( media, key ) }
					onChangeImageOptions = { ( mainKey, value ) => this.onSelectImage( mainKey, value, key ) }
					allowGradient={ true }
					allowImage={ true }
				/>
			</>
		)
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
		
		let obj = {
			...this.state.value, 
		};
		let deviceObj = {
			...obj[key]
		};
		deviceObj['background-color'] = value
		obj[key] = deviceObj

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

		responsiveHtml = (
			<ul className="ast-responsive-btns">
				<li className="desktop active">
					<button type="button" className="preview-desktop" data-device="desktop">
						<i className="dashicons dashicons-desktop"></i>
					</button>
				</li>
				<li className="tablet">
					<button type="button" className="preview-tablet" data-device="tablet">
						<i className="dashicons dashicons-tablet"></i>
					</button>
				</li>
				<li className="mobile">
					<button type="button" className="preview-mobile" data-device="mobile">
						<i className="dashicons dashicons-smartphone"></i>
					</button>
				</li>
			</ul>
		)
		
		inputHtml = (
			<>
				<div className="background-wrapper">
					<div className="background-container desktop active">
					{ this.renderReset( 'desktop' ) }
					{ this.renderSettings( 'desktop' ) }
					</div>
					<div className="background-container tablet">
					{ this.renderReset( 'tablet' ) }
					{ this.renderSettings( 'tablet' ) }
					</div>
					<div className="background-container mobile">
					{ this.renderReset( 'mobile' ) }
					{ this.renderSettings( 'mobile' ) }
					</div>
				</div>
			</>
		)
		
		return (
			<>
				<label>
					{ labelHtml }
				</label>

				{ responsiveHtml }

				<div className="customize-control-content">
					{ inputHtml }
				</div>
			</>
		);
	}
	updateValues( obj ) {
		// console.log(obj)
		this.setState( { value : obj } )
		this.props.control.setting.set( this.state.value );
	}
}

ResponsiveBackground.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveBackground;
