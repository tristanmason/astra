import PropTypes from 'prop-types';
import { Component, Fragment } from '@wordpress/element';

class RadioImageComponent extends Component {

	constructor(props) {

		super( props );
		let value = this.props.control.setting.get()

		this.state = {
			value
		};

		this.onLayoutChange = this.onLayoutChange.bind(this);
	}

	onLayoutChange() {
		
		if ( ! this.props.control.params.choices.hasOwnProperty( event.target.value ) ) {
			event.target.value = this.props.control.params.default;
		}

		this.setState( { value : event.target.value } );

		this.props.control.setting.set( event.target.value );
	}

	render() {

		const {
			label,
			description,
			id,
			choices,
			inputAttrs,
			choices_titles,
			link,
			labelStyle
		} = this.props.control.params

		let htmlLabel = null;
		let htmlDescription = null;
		let htmlRadio;
		var inp_array = [];
		var splited_values = [];

		if ( label ) {

			htmlLabel = <span className="customize-control-title">{ label }</span>;
		}

		if ( description ) {

			htmlDescription = <span className="description customize-control-description">{ description }</span>;
		}

		if ( inputAttrs && undefined !== inputAttrs ) {

			splited_values = inputAttrs.split( " " );
			splited_values.map( (item, i ) => {
				let item_values = item.split( "=" )
				if ( undefined !== item_values[1] ) {
					inp_array[ item_values[0] ] = item_values[1].replace( /"/g, "" );
				}
			});
		}
		if ( link && undefined !== link ) {
			
			splited_values = link.split( " " );
			splited_values.map( (item, i ) => {
				let item_values = item.split( "=" )
				if ( undefined !== item_values[1] ) {
					inp_array[ item_values[0] ] = item_values[1].replace( /"/g, "" );
				}
			});
		}

		htmlRadio = Object.entries( choices ).map( ( [ key, value ] ) => {

			let checked = ( this.state.value === key ) ? true : false;
			return (
				<Fragment key={key}>
					<input { ...inp_array } className="image-select" type="radio" value={ key } name={ `_customize-radio-${ id }` } id={ id + key } checked={ checked } onChange={ () => this.onLayoutChange( key ) } />

					<label htmlFor={ id + key } { ...labelStyle } className="ast-radio-img-svg" >
						<span dangerouslySetInnerHTML={{ __html: choices[ key ] }} />
						<span className="image-clickable" title={ choices_titles[ key ] } ></span>
					</label>
				</Fragment>
			);
		});

		return (
			<Fragment>
				<label className="customizer-text">
					{ htmlLabel }
					{ htmlDescription }
				</label>
				<div id={ `input_${ id }` } className="image" >

					{ htmlRadio }

				</div>
			</Fragment>
		);
	}
}

RadioImageComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default RadioImageComponent;
