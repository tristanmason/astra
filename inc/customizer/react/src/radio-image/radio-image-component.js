import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

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
		this.setState( { value : event.target.value } )
		this.props.control.setting.set( event.target.value );
	}

	render() {

		const {
			label,
			description,
			id,
			choices,
			inputAttrs,
			link,
			labelStyle,
			choices_titles,
			value
		} = this.props.control.params

		let htmlLabel = null;
		let htmlRadio;

		if ( label ) {

			htmlLabel = <span className="customize-control-title">{ label }</span>;
		}

		if ( description ) {

			htmlLabel = <span className="description customize-control-description">{ description }</span>;
		}
		
		htmlRadio = Object.keys( choices ).map( ( key ) => {

			let checked = ( this.state.value === key ) ? true : false;

			return (
				<>
					<input { ...inputAttrs } key={ key } className="image-select" type="radio" value={ key } name={ `_customize-radio-${ id }` } id={ id + key } checked={ checked } onChange={ () => this.onLayoutChange( key ) } onClick={ () => this.onLayoutChange() } />

					<label htmlFor={ id + key } key={ key + id } className="ast-radio-img-svg" >
						<span key={ key + id } dangerouslySetInnerHTML={{ __html: choices[ key ] }} />
						<span key={ key } className="image-clickable" title={ choices_titles[ key ] } ></span>
					</label>
				</>
			);
		})

		return (
			<>
				<label className="customizer-text">
					{ htmlLabel }
				</label>
				<div id={ `input_${ id }` } className="image" >
					
					{ htmlRadio }
					
				</div>
			</>
		);
	}
}

RadioImageComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default RadioImageComponent;
