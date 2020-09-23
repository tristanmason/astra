import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';
import { __ } from '@wordpress/i18n';

class Background extends Component {

	constructor(props) {

		super( props );

		let value = this.props.control.setting.get();

		this.defaultValue = this.props.control.params.default;
		this.onSelectImage = this.onSelectImage.bind( this );

		this.state = {
			value: value,
		};

		this.updateBackgroundType();
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
	renderReset () {
		let deleteBtnDisabled = true;
		return (
			<span className="customize-control-title">
				<div className="ast-color-btn-reset-wrap">
					<button
						className="ast-reset-btn components-button components-circular-option-picker__clear is-secondary is-small"
						disabled={ ( JSON.stringify( this.state.value ) === JSON.stringify( this.defaultValue ) ) }
						onClick={ () => {
							let value = JSON.parse( JSON.stringify( this.defaultValue ) );

							this.updateValues( value );
						} }
					>
						<Dashicon icon='image-rotate' />
					</button>
				</div>
				<div className="ast-color-btn-clear-wrap">
					<button type="button" onClick={ () => {
						let value = JSON.parse( JSON.stringify( this.defaultValue ) );
						const bgDevices = [ 'desktop', 'mobile', 'tablet' ];
						for( let device of bgDevices ) {
							value[device]['background-color'] = '';
							value[device]['background-image'] = '';
							value[device]['background-media'] = '';
						}
						this.updateValues( value );
					} } className="astra-color-clear-button components-button components-circular-option-picker__clear is-secondary is-small" disabled={ deleteBtnDisabled }><Dashicon icon="trash" /></button>
				</div>
			</span>
		)
	}
	onSelectImage ( media, backgroundType ) {

		let obj = {
			...this.state.value,
		};
		obj['background-media'] = media.id
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
				<AstraColorPickerControl
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

		obj['background-color'] = value;
		obj['background-type'] = backgroundType;

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

		inputHtml = (
			<div className="background-wrapper">
				<div className="background-container">
				{ this.renderReset() }
				{ this.renderSettings() }
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
