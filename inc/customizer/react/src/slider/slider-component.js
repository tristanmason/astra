import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class SliderComponent extends Component {

	constructor( props ) {

		super( props );

		let value = this.props.control.setting.get()

		this.state = {
			value
		};

		this.updateValues = this.updateValues.bind(this);
	}

	render() {
		
		const {
			label,
			description,
			suffix,
			link,
			inputAttrs,
			name
		} = this.props.control.params

		let labelHtml = null;
		let descriptionHtml = null;
		let suffixHtml = null;
		let reset = __( "Back to default", 'astra' );

		if ( label ) {

			labelHtml = <label><span className="customize-control-title">{ label }</span></label>
		}

		if ( description ) {

			descriptionHtml = <span className="description customize-control-description">{ description }</span>
		}
		if ( suffix ) {

			suffixHtml = <span className="ast-range-unit">{ suffix }</span>
		}

		return (
			<label>
				{ labelHtml }
				{ descriptionHtml }
				<div className="wrapper">
					<input  type="range" value={ this.state.value } data-reset_value={ this.props.control.params.default } onChange = { () => this.updateValues( event.target.value ) } />
					<div className="astra_range_value">
						<input type="number" data-name={ name } className="value ast-range-value-input" value={ this.state.value }  onChange = { () => this.updateValues( event.target.value ) } />
						{ suffixHtml }
					</div>
					<div className="ast-slider-reset" onClick = { () => { this.updateValues( this.props.control.params.default ) } } >
						<span className="dashicons dashicons-image-rotate ast-control-tooltip" title={ reset } ></span>
					</div>
				</div>	
			</label>
		);
	}

	updateValues( updateState ) {
		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );
	}
}

SliderComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default SliderComponent;
