import PropTypes from 'prop-types';

import { Component } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';

class ResponsiveColorComponent extends Component {

    constructor(props) {
		
		super( props );

		let value = this.props.control.setting.get();

		this.defaultValue = this.props.control.params.default;

		this.state = {
			value: value,
		};
		
	}
	renderReset ( key ) {
		return (
			<span className="customize-control-title">
				<Button
					className="reset astra-reset"
					disabled={ ( JSON.stringify( this.state.value ) === JSON.stringify( this.defaultValue ) ) }
					onClick={ () => {
						let value = JSON.parse( JSON.stringify( this.defaultValue ) );
						this.setState( { value : value } )
						this.props.control.setting.set( value );
					} }
				>
					<Dashicon icon='image-rotate' />
				</Button>
			</span>
		)
	}
	renderSettings ( key ) {
		
		return (
			<AstraColorPickerControl
				color={ ( undefined !== this.state.value[key] && this.state.value[key] ? this.state.value[key] :  '' ) }
				onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, key ) }
				backgroundType = { 'color' }
				allowGradient={ false }
				allowImage={ false }
			/>
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
        this.updateValues( value, key );
    }
    render() {
        
		const {
			defaultValue,
			label,
			description,
			responsive,
			value,
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

		if ( label ) { 

			labelHtml = <span className="customize-control-title">{ label }</span>
		} 

		if ( description ) { 

			descriptionHtml = <span className="description customize-control-description">{ description }</span>
		}

		if ( responsive ) {

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
					
					<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color desktop active">
						{ this.renderReset( 'desktop' ) }
						{ this.renderSettings( 'desktop' ) }
					</div>
					<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color tablet">
						{ this.renderReset( 'tablet' ) }
						{ this.renderSettings( 'tablet' ) }
					</div>
					<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color mobile">
						{ this.renderReset( 'mobile' ) }
						{ this.renderSettings( 'mobile' ) }
					</div>
				</>
			)
		}

		return (
			<>
				<label>
					{ labelHtml }
					{ descriptionHtml }
				</label>

				{ responsiveHtml }

				<div className="customize-control-content">
					{ inputHtml }
				</div>
			</>
		);
	}
	updateValues( value, key ) {

		const obj = {
			...this.state.value, 
		};
		obj[ key ] = value
		this.setState( { value : obj } )
		this.props.control.setting.set( obj );
	}
}

ResponsiveColorComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveColorComponent;