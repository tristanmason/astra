import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class BorderComponent extends Component {

	constructor( props ) {

		super( props );

		let value = this.props.control.setting.get()

		this.state = {
			value
		};

		this.onBorderChange = this.onBorderChange.bind(this);
		this.onConnectedClick = this.onConnectedClick.bind(this);
		this.onDisconnectedClick = this.onDisconnectedClick.bind(this);
	}

	onBorderChange ( key ) {
		
		const {
			choices,
		} = this.props.control.params

		let updateState = {
			...this.state.value
		}

		if ( ! event.target.classList.contains( 'connected' ) ) {

			updateState[ key ] = event.target.value;

		} else {

			for ( let choiceID in choices ) {
				updateState[ choiceID ] = event.target.value;
			}
		}

		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );

	}
	onConnectedClick () {

		let parent = event.target.parentElement.parentElement;

		let inputs = parent.querySelectorAll( '.ast-border-input' );

		for ( let i = 0; i < inputs.length; i++ ) {

			inputs[i].classList.remove( 'connected' );
			inputs[i].setAttribute( 'data-element-connect', '' )
		}
		event.target.parentElement.classList.remove( 'disconnected' );	
	}
	onDisconnectedClick () {

		let elements = event.target.dataset.elementConnect;

		let parent = event.target.parentElement.parentElement;

		let inputs = parent.querySelectorAll( '.ast-border-input' );

		for ( let i = 0; i < inputs.length; i++ ) {

			inputs[i].classList.add( 'connected' );
			inputs[i].setAttribute( 'data-element-connect', elements )
		}
		event.target.parentElement.classList.add( 'disconnected' );		
	}
	render() {

		const {
			label,
			description,
			linked_choices,
			id,
			choices,
			inputAttrs,
			name,
		} = this.props.control.params

		let htmlLabel = null;
		let htmlDescription = null;
		let htmlLinkedChoices = null;
		let htmlChoices = null;
		let itemLinkDesc = __( 'Link Values Together', 'astra' );

		if ( label ) {
			htmlLabel = <span className="customize-control-title">{ label }</span>;
		}

		if ( description ) {
			htmlDescription = <span className="description customize-control-description">{ description }</span>;
		}

		if ( linked_choices ) {
			htmlLinkedChoices = (
				<li key={ id } className="ast-border-input-item-link">
					<span className="dashicons dashicons-admin-links ast-border-connected wp-ui-highlight" onClick = { () => { this.onConnectedClick() } } data-element-connect={ id } title={ itemLinkDesc }></span>
					<span className="dashicons dashicons-editor-unlink ast-border-disconnected" onClick = { () => { this.onDisconnectedClick() } } data-element-connect={ id } title={ itemLinkDesc }></span>
				</li>
			);
		}

		
			
			htmlChoices = Object.keys( choices ).map( ( choiceID ) => {

				if ( choices[ choiceID ] ) { 

					var html = ( 
						<li { ...inputAttrs } key={ choiceID } className='ast-border-input-item'>
							<input type='number' className='ast-border-input ast-border-desktop' data-id= { choiceID } data-name={ name } onChange = { () => this.onBorderChange( choiceID ) } value={ this.state.value[ choiceID ] }/>
							<span className="ast-border-title">{ choices[ choiceID ] }</span>
						</li>
					);
				}

				return html;
			} );
		

		return (
			<>
				{ htmlLabel }
				{ htmlDescription }

				<div className="ast-border-outer-wrapper">
					<div className="input-wrapper ast-border-wrapper">
						<ul className="ast-border-wrapper desktop active">
							{ htmlLinkedChoices }
							{ htmlChoices }
						</ul>
					</div>
				</div>
			</>
		);
	}
}

BorderComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default BorderComponent;
