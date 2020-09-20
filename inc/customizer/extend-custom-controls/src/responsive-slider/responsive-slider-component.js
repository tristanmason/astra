import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class ResponsiveSliderComponent extends Component {

	constructor( props ) {

		super( props );

		let value = this.props.control.setting.get();

		this.state = {
			value: value,
		};

		this.renderInputHtml = this.renderInputHtml.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onResetClick = this.onResetClick.bind(this);
	}

	onResetClick () {

		this.updateValues( this.props.control.params.default );
		
	}
	onInputChange( device ) {

		let updateState = {
			...this.state.value
		}

		updateState[ device ]  = event.target.value;

		this.updateValues( updateState );
	}

	renderInputHtml( device, active='' ) {

		const {
			inputAttrs,
			suffix
		} = this.props.control.params

		let suffixHtml = null;
		let inp_array = [];

		if ( suffix ) { 
			suffixHtml = <span className="ast-range-unit">{ suffix }</span>
		}

		if ( undefined !== inputAttrs ) {

			let splited_values = inputAttrs.split( " " );

			splited_values.map( (item, i ) => {

				let item_values = item.split( "=" )

				if ( undefined !== item_values[1] ) {

					inp_array[ item_values[0] ] = item_values[1].replace( /"/g, "" );
				}
				
			});
		}

		return (
			<div className={ `input-field-wrapper ${ device } ${ active }` }>
				<input type="range" { ...inp_array } value={ this.state.value[ device ] } data-reset_value={ this.props.control.params.default[ device ] } onChange={ () => { this.onInputChange( device ) } } />
				<div className="astra_range_value">
					<input type="number" { ...inp_array } data-id={ device } className="ast-responsive-range-value-input" value={ this.state.value[ device ] } onChange={ () => { this.onInputChange( device ) } } />
					{ suffixHtml }
				</div>
			</div>
		);
	}
	render() {
		
		const {
			description,
			label,
		} = this.props.control.params

		const reset = __( 'Back to default', 'astra' );
		let labelHtml = null;
		let responsiveHtml = null;
		let descriptionHtml = null;
		let inputHtml = null;
		let resetHtml = null;
		

		if ( label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>;

			responsiveHtml = (
				<ul key={ 'ast-resp-ul' } className="ast-responsive-slider-btns">
					<li className="desktop active">
						<button type="button" className="preview-desktop active" data-device="desktop">
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
			);			
		}

		if ( description ) {

			descriptionHtml = <span className="description customize-control-description">{ description }</span>
		}

		inputHtml = (
			<>
				{ this.renderInputHtml( 'desktop', 'active' ) }
				{ this.renderInputHtml( 'tablet' ) }
				{ this.renderInputHtml( 'mobile' ) }
			</>
		);

		resetHtml = (
			<div className="ast-responsive-slider-reset" onClick={ () => { this.onResetClick() } } >
				<span className="dashicons dashicons-image-rotate ast-control-tooltip" title={ reset } ></span>
			</div>
		);

		return (
			<label key={ 'customizer-text' }>
				{ labelHtml } 
				{ responsiveHtml }
				{ descriptionHtml }

				<div className="wrapper">
					{ inputHtml }
					{ resetHtml }
				</div>
			</label>
		);
	}

	updateValues( updateState ) {

		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );
	}
}

ResponsiveSliderComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveSliderComponent;
