import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';
import { __ } from '@wordpress/i18n';

class ResponsiveBackground extends Component {

	constructor(props) {

		super( props );

		let value = this.props.control.setting.get();
		this.defaultValue = this.props.control.params.default;
		this.onSelectImage = this.onSelectImage.bind( this );

		this.state = {
			value: value,
		};
	}
	componentDidMount() {

		let devices = [ 'desktop', 'mobile', 'tablet' ];

		for( let device of devices ) {

			this.updateBackgroundType( device );
		}
	}
	updateBackgroundType( device ) {

		let obj = {
			...this.state.value,
		};

		if ( undefined === this.state.value[ device ]['background-type']  || '' === this.state.value[ device ]['background-type'] ) {

			let deviceObj = {
				...obj[ device ]
			};

			if ( undefined !== this.state.value[ device ]['background-color'] ) {

				deviceObj['background-type'] = 'color';
				obj[ device ] = deviceObj
				this.updateValues( obj );

				if ( this.state.value[ device ]['background-color'].includes('gradient') ) {

					deviceObj['background-type'] = 'gradient';
					obj[ device ] = deviceObj
					this.updateValues( obj );
				}
			}
			if ( undefined !== this.state.value[ device ]['background-image'] ) {

				deviceObj['background-type'] = 'image';
				obj[ device ] = deviceObj
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
	onSelectImage ( media, key, backgroundType ) {

		let obj = {
			...this.state.value,
		};
		let deviceObj = {
			...obj[key]
		};
		deviceObj['background-image'] = media.url
		deviceObj['background-media'] = media.id
		deviceObj['background-type'] = backgroundType
		obj[key] = deviceObj

        this.updateValues( obj );
	}
	onChangeImageOptions( mainKey, value, device, backgroundType ) {

		let obj = {
			...this.state.value,
		};
		let deviceObj = {
			...obj[device]
		};

		deviceObj[mainKey] = value
		deviceObj['background-type'] = backgroundType
		obj[device] = deviceObj

        this.updateValues( obj );
	}
	renderSettings ( key ) {

		return (
			<>
				<AstraColorPickerControl
					color={ ( undefined !== this.state.value[key]['background-color'] && this.state.value[key]['background-color'] ? this.state.value[key]['background-color'] :  '' ) }
					onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, key, backgroundType ) }
					media={ ( undefined !== this.state.value[key]['background-media'] && this.state.value[key]['background-media'] ? this.state.value[key]['background-media'] :  '' ) }
					backgroundImage = { ( undefined !== this.state.value[key]['background-image'] && this.state.value[key]['background-image'] ? this.state.value[key]['background-image'] :  '' ) }
					backgroundAttachment = { ( undefined !== this.state.value[key]['background-attachment'] && this.state.value[key]['background-attachment'] ? this.state.value[key]['background-attachment'] :  '' ) }
					backgroundPosition = { ( undefined !== this.state.value[key]['background-position'] && this.state.value[key]['background-position'] ? this.state.value[key]['background-position'] :  '' ) }
					backgroundRepeat = { ( undefined !== this.state.value[key]['background-repeat'] && this.state.value[key]['background-repeat'] ? this.state.value[key]['background-repeat'] :  '' ) }
					backgroundSize = { ( undefined !== this.state.value[key]['background-size'] && this.state.value[key]['background-size'] ? this.state.value[key]['background-size'] :  '' ) }
					onSelectImage = { ( media, backgroundType ) => this.onSelectImage( media, key, backgroundType ) }
					onChangeImageOptions = { ( mainKey, value, backgroundType ) => this.onChangeImageOptions( mainKey, value, key, backgroundType ) }
					backgroundType = { ( undefined !== this.state.value[key]['background-type'] && this.state.value[key]['background-type'] ? this.state.value[key]['background-type'] :  'color' ) }
					allowGradient={ true }
					allowImage={ true }
				/>
			</>
		)
	}
	handleChangeComplete( color, key, backgroundType ) {
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
		deviceObj['background-type'] = backgroundType
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
		let descriptionHtml = null;
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

		if ( label && '' !== label && undefined !== label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>
		} else {
			labelHtml = <span className="customize-control-title">{ __( 'Background', 'astra' ) }</span>
		}

		if ( description ) {

			descriptionHtml = <span className="description customize-control-description">{ description }</span>
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
		)

		return (
			<>
				<label>
					{ labelHtml }
					{ descriptionHtml }
				</label>
				<div className="customize-control-content">
					{ responsiveHtml }
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

ResponsiveBackground.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveBackground;
