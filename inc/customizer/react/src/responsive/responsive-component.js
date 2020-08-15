import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class ResponsiveComponent extends Component {

	constructor( props ) {

		super( props );

		let value = this.props.control.setting.get();

		this.state = {
			value: value,
		};

		this.renderInputHtml = this.renderInputHtml.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onSelectChange = this.onSelectChange.bind(this);
	}

	onInputChange( device ) {

		let updateState = {
			...this.state.value
		}

		updateState[ device ]  = event.target.value;

		this.updateValues( updateState );
	}

	onSelectChange( device ) {

		let updateState = {
			...this.state.value
		}

		updateState[ `${ device }-unit` ]  = event.target.value;

		this.updateValues( updateState );
	}

	renderInputHtml( device, active='', resp=true ) {

		const {
			units,
		} = this.props.control.params

		var disabled = false;

		if ( 1 === units.length ) {
			disabled = true;
		}

		let optionsHtml = Object.keys( units ).map( ( key ) => {

			var html = (
				<option key={ key } value={ key } >{ units[ key ] }</option>
			);
			return html;
		} );

		if ( false === resp ) {

			return (
				<>
					<input key={ device + 'input' } data-id={ device } className={ `ast-responsive-input ast-non-reponsive ${ device } ${ active }` } type="number" value={ this.state.value[ device ] } onChange={ () => { this.onInputChange( device ) } } />
					<select key={ device + 'select' } value={ this.state.value[`${ device }-unit`] } className={ `ast-responsive-select ${ device }` } data-id={ `${ device }-unit` } disabled={ disabled } onChange={ () => { this.onSelectChange( device ) } } >
						{ optionsHtml }
					</select>
				</>
			);
		}
		return (
			<>
				<input  key={ device + 'input' } data-id={ device } className={ `ast-responsive-input ${ device } ${ active }` } type="number" value={ this.state.value[ device ] } onChange={ () => { this.onInputChange( device ) } } />
				<select key={ device + 'select' } value={ this.state.value[`${ device }-unit`] } className={ `ast-responsive-select ${ device }` } data-id={ `${ device }-unit` } disabled={ disabled } onChange={ () => { this.onSelectChange( device ) } } >
					{ optionsHtml }
				</select>
			</>
		);

	}
	render() {

		const {
			description,
			label,
			responsive,
		} = this.props.control.params

		let labelHtml = null;
		let responsiveHtml = null;
		let descriptionHtml = null;
		let inputHtml = null;
		let inputResponsiveHtml = null;

		if ( label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>;

			if ( responsive ) {

				responsiveHtml = (
					<ul key={ 'ast-resp-ul' } className="ast-responsive-btns">
						<li key={ 'desktop' } className="desktop active">
							<button type="button" className="preview-desktop" data-device="desktop">
								<i className="dashicons dashicons-desktop"></i>
							</button>
						</li>
						<li key={ 'tablet' } className="tablet">
							<button type="button" className="preview-tablet" data-device="tablet">
								<i className="dashicons dashicons-tablet"></i>
							</button>
						</li>
						<li key={ 'mobile' } className="mobile">
							<button type="button" className="preview-mobile" data-device="mobile">
								<i className="dashicons dashicons-smartphone"></i>
							</button>
						</li>
					</ul>
				);

			}
		}

		if ( description ) {

			descriptionHtml = <span className="description customize-control-description">{ description }</span>
		}

		if ( responsive ) {

			inputHtml = (
				<>
					{ this.renderInputHtml( 'desktop', 'active' ) }
					{ this.renderInputHtml( 'tablet' ) }
					{ this.renderInputHtml( 'mobile' ) }
				</>
			);
		} else {
			inputHtml = (
				<>
					{ this.renderInputHtml( 'desktop', 'active', false ) }
				</>
			);
		}
		return (
			<label key={ 'customizer-text' } className="customizer-text" >
				{ labelHtml }
				{ responsiveHtml }
				{ descriptionHtml }

				<div className="input-wrapper ast-responsive-wrapper">
					{ inputHtml }
				</div>
			</label>
		);
	}

	updateValues( updateState ) {
		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );
	}
}

ResponsiveComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveComponent;
