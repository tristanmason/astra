import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class ResponsiveSpacingComponent extends Component {

	constructor( props ) {

		super( props );

		let value = this.props.control.setting.get()

		this.state = {
			value
		};

		this.renderInputHtml = this.renderInputHtml.bind(this);
		this.renderResponsiveInput = this.renderResponsiveInput.bind(this);
		this.onUnitChange = this.onUnitChange.bind(this);
		this.updateValues = this.updateValues.bind(this);
		this.onSpacingChange = this.onSpacingChange.bind(this);
		this.onConnectedClick = this.onConnectedClick.bind(this);
		this.onDisconnectedClick = this.onDisconnectedClick.bind(this);
	}
	onConnectedClick () {

		let parent = event.target.parentElement.parentElement;

		let inputs = parent.querySelectorAll( '.ast-spacing-input' );

		for ( let i = 0; i < inputs.length; i++ ) {

			inputs[i].classList.remove( 'connected' );
			inputs[i].setAttribute( 'data-element-connect', '' )
		}
		event.target.parentElement.classList.remove( 'disconnected' );	
	}
	onDisconnectedClick () {

		let elements = event.target.dataset.elementConnect;

		let parent = event.target.parentElement.parentElement;

		let inputs = parent.querySelectorAll( '.ast-spacing-input' );

		for ( let i = 0; i < inputs.length; i++ ) {

			inputs[i].classList.add( 'connected' );
			inputs[i].setAttribute( 'data-element-connect', elements )
		}
		event.target.parentElement.classList.add( 'disconnected' );		
	}
	
	onSpacingChange( device, choiceID ) {

		const {
			choices,
		} = this.props.control.params

		let updateState = {
			...this.state.value
		}
		let deviceUpdateState = {
			...updateState[ device ]
		}
		if ( ! event.target.classList.contains( 'connected' ) ) {

			deviceUpdateState[ choiceID ]  = event.target.value;
		} else {
			for ( let choiceID in choices ) {
				deviceUpdateState[ choiceID ] = event.target.value;
			}
		}
		updateState[ device ] = deviceUpdateState;

		this.updateValues( updateState );
	}

	onUnitChange( device, unitKey ) {

		let updateState = {
			...this.state.value
		}

		updateState[ `${ device }-unit` ]  = unitKey;

		this.updateValues( updateState );
	}

	renderResponsiveInput( device ) {
		
		return(
			<input type='hidden' onChange = { () => this.onUnitChange( device, '' ) } className={ `ast-spacing-unit-input ast-spacing-${ device }-unit` } data-device={ `${ device }` } value={ this.state.value[ `${ device }-unit` ] }></input>
		);
	}

	renderInputHtml( device, active='' ) {

		const {
			linked_choices,
			id,
			choices,
			inputAttrs,
			unit_choices
		} = this.props.control.params

		let itemLinkDesc = 'Link Values Together';
		let linkHtml = null;
		let htmlChoices = null;
		let respHtml = null;

		if ( linked_choices ) {

			linkHtml = (
				<li className="ast-spacing-input-item-link">
					<span className="dashicons dashicons-admin-links ast-spacing-connected wp-ui-highlight" onClick = { () => { this.onConnectedClick() } } data-element-connect={ id } title={ itemLinkDesc }></span>
					<span className="dashicons dashicons-editor-unlink ast-spacing-disconnected" onClick = { () => { this.onDisconnectedClick() } } data-element-connect={ id } title={ itemLinkDesc }></span>
				</li>
			);
		}

		htmlChoices = Object.keys( choices ).map( ( choiceID ) => {

			var html = ( 
				<li { ...inputAttrs } className='ast-spacing-input-item'>
					<input type='number' className={ `ast-spacing-input ast-spacing-${ device }` } data-id={ choiceID } value={ this.state.value[ device ][ choiceID ] } onChange = { () => this.onSpacingChange( device, choiceID ) } />
					<span className="ast-spacing-title">{ choices[ choiceID ] }</span>
				</li>
			);

			return html;
		} );

		respHtml = Object.values( unit_choices ).map( ( unitKey ) => {

			var unitClass = '';

			if ( this.state.value[ `${ device }-unit` ] === unitKey ) { 
				unitClass = 'active';
			}

			var html = ( 
				<li className={ `single-unit ${ unitClass }` } onClick = { () => this.onUnitChange( device, unitKey ) } data-unit={ unitKey } >
					<span className="unit-text">{ unitKey }</span>
				</li>
			);

			return html;
		} );

		return (
			<ul className={ `ast-spacing-wrapper ${ device } ${ active }` }>
				{ linkHtml }
				{ htmlChoices }
				<ul className={ `ast-spacing-responsive-units ast-spacing-${ device }-responsive-units` }>
					{ respHtml }
				</ul>
			</ul>
		);
	}

	render() {
		
		const {
			label,
			description,
		} = this.props.control.params

		let htmlLabel = null;
		let htmlDescription = null;
		let inputHtml = null;
		let responsiveHtml = null;

		if ( label ) {
			htmlLabel = <span className="customize-control-title wp-ui-text-highlight">{ label }</span>;
		}

		if ( description ) {
			htmlDescription = <span className="description customize-control-description">{ description }</span>;
		}

		inputHtml = (
			<>
				{ this.renderInputHtml( 'desktop', 'active' ) }
				{ this.renderInputHtml( 'tablet' ) }
				{ this.renderInputHtml( 'mobile' ) }
			</>
		);

		responsiveHtml = (
			<>
				<div className="unit-input-wrapper ast-spacing-unit-wrapper">
					{ this.renderResponsiveInput( 'desktop' ) }
					{ this.renderResponsiveInput( 'tablet' ) }
					{ this.renderResponsiveInput( 'mobile' ) }
				</div>
				<ul className="ast-spacing-responsive-btns">
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
			</>
		);
		return (
			<label className='ast-spacing-responsive'>
				{ htmlLabel }
				{ htmlDescription }
				<div className="ast-spacing-responsive-outer-wrapper">
					<div className="input-wrapper ast-spacing-responsive-wrapper">
						{ inputHtml }
					</div>
					<div className="ast-spacing-responsive-units-screen-wrap">
						{ responsiveHtml }
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

ResponsiveSpacingComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveSpacingComponent;
