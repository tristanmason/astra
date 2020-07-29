import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import BackgroundColorControl from '../common/background-color';

class ColorComponent extends Component {

    constructor( props ) {

		super( props );
		this.handleChangeComplete = this.handleChangeComplete.bind( this );
		this.updateValues = this.updateValues.bind( this );
		this.renderReset = this.renderReset.bind( this );

		let value = this.props.control.setting.get();
		
		this.defaultValue = this.props.control.params.default;

		this.state = {
			value: value,
		};
	}
	renderReset () {
		return (
			<span className="customize-control-title">
				<>
					<Button
						className="reset astra-reset"
						disabled={ ( JSON.stringify( this.state.value ) === JSON.stringify( this.defaultValue ) ) }
						onClick={ () => {
							let value = JSON.parse( JSON.stringify( this.defaultValue ) );
							this.updateValues( value )
						} }
					>
						<Dashicon icon='image-rotate' />
					</Button>
				</>
			</span>
		)
	}
    handleChangeComplete( color ) {
		
		let value;
		
		if ( typeof color === 'string' || color instanceof String ) {
			value = color;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			value = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}
        this.updateValues( value );
    }

    render() {

		let labelHtml = null;
		
		const {
			label
		} = this.props.control.params
        
		if ( label ) { 

			labelHtml = <span className="customize-control-title">{ label }</span>
		} 
		return (
			<>
				<label>
					{ labelHtml }
				</label>
				<div className="ast-color-picker-alpha color-picker-hex">
					
					{ this. renderReset() }
					
					<BackgroundColorControl
						color={ ( undefined !== this.state.value && this.state.value ? this.state.value :  '' ) }
						onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color ) }
						backgroundType = { 'color' }
						allowGradient={ false }
						allowImage={ false }
					/>

				</div>
			</>
		);
    }
    
    updateValues( value ) {
		this.setState( { value: value } );
		this.props.control.setting.set( value );
	}
}

ColorComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ColorComponent;