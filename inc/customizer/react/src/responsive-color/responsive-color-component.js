import PropTypes from 'prop-types';

import { Component, Fragment } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import ColorControl from '../common/color';

class ResponsiveColorComponent extends Component {

    constructor(props) {
		
		super( props );

		let value = this.props.control.setting.get();

		this.defaultValue = this.props.control.params.default;

		let defaultParams = {
			colors: {
				color: {
					palette: true,
				},
			},
			allowGradient: false,
		};

		this.controlParams = this.props.control.params.input_attrs ? {
			...defaultParams,
			...this.props.control.params.input_attrs,
		} : defaultParams;

		const palette = JSON.parse( '{"palette":[{"color":"#000000","slug":"palette1","name":"Palette Color 1"},{"color":"#ffffff","slug":"palette2","name":"Palette Color 2"},{"color":"#dd3333","slug":"palette3","name":"Palette Color 3"},{"color":"#dd9933","slug":"palette4","name":"Palette Color 4"},{"color":"#eeee22","slug":"palette5","name":"Palette Color 5"},{"color":"#81d742","slug":"palette6","name":"Palette Color 6"},{"color":"#1e73be","slug":"palette7","name":"Palette Color 7"},{"color":"#8224e3","slug":"palette8","name":"Palette Color 8"}],"active":"palette"}' );
		console.log(this.props.control.params)
		this.state = {
			value: value,
			colorPalette: palette,
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
							this.updateValues( value, key );
						} }
					>
						<Dashicon icon='image-rotate' />
					</Button>
				</Fragment>
			</span>
		)
	}
	handleChangeComplete( color, isPalette, key ) {
		let value;
		
		if ( isPalette ) {
			switch (isPalette) {
				case 'palette1':
					isPalette = '#000000'
					break;
				case 'palette2':
					isPalette = '#ffffff'
					break;
				case 'palette3':
					isPalette = '#dd3333'
					break;
				case 'palette4':
					isPalette = '#dd9933'
					break;
				case 'palette5':
					isPalette = '#eeee22'
					break;
				case 'palette6':
					isPalette = '#81d742'
					break;
				case 'palette7':
					isPalette = '#1e73be'
					break;
				case 'palette8':
					isPalette = '#8224e3'
					break;
				default:
					break;
			}
			value = isPalette;
		} else if ( typeof color === 'string' || color instanceof String ) {
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
			rgba,
			name
		} = this.props.control.params

		let defaultVal = '#RRGGBB';
		let labelHtml = null;
		let responsiveHtml = null;
		let inputHtml = null;
		let value_desktop = '';
		let value_tablet  = '';
		let value_mobile  = '';


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

		if ( value['desktop'] ) { 

			value_desktop = this.state.value.desktop;
		} 

		if ( value['tablet'] ) { 

			value_tablet = this.state.value.tablet;
		} 

		if ( value['mobile'] ) { 

			value_mobile = this.state.value.mobile;
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
					<ColorControl
						// key={ item }
						presetColors={ this.state.colorPalette }
						color={ ( undefined !== this.state.value.desktop && this.state.value.desktop ? this.state.value.desktop : '' ) }
						usePalette={ true }
						onChangeComplete={ ( color, isPalette ) => this.handleChangeComplete( color, isPalette, 'desktop' ) }
						// allowGradient={ this.controlParams.allowGradient }
					/>
					</div>
					<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color tablet">
					{ this.renderReset( 'tablet' ) }
					<ColorControl
						// key={ item }
						presetColors={ this.state.colorPalette }
						color={ ( undefined !== this.state.value.tablet && this.state.value.tablet ? this.state.value.tablet : '' ) }
						usePalette={ true }
						onChangeComplete={ ( color, isPalette ) => this.handleChangeComplete( color, isPalette, 'tablet' ) }
						// allowGradient={ this.controlParams.allowGradient }
					/>
					</div>
					<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color mobile">
					{ this.renderReset( 'mobile' ) }
					<ColorControl
						// key={ item }
						presetColors={ this.state.colorPalette }
						color={ ( undefined !== this.state.value.mobile && this.state.value.mobile ? this.state.value.mobile : '' ) }
						usePalette={ true }
						onChangeComplete={ ( color, isPalette ) => this.handleChangeComplete( color, isPalette, 'mobile' ) }
						// allowGradient={ this.controlParams.allowGradient }
					/>
					</div>
				</>
			)
		}

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