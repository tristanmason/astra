import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class SelectComponent extends Component {

	constructor( props ) {

		super( props );

		let value = this.props.control.setting.get()

		this.state = {
			value
		};

		this.onSelectChange = this.onSelectChange.bind(this);
	}

	onSelectChange() {
		this.updateValues( event.target.value )
	}

	render() {

		const {
			label,
			name,
			choices
		} = this.props.control.params

		let htmlLabel = null;

		if ( label ) {
			htmlLabel = <span className="customize-control-title">{ label }</span>;
		}

		let optionsHtml = Object.entries( choices ).map( ( key ) => {

			var html = (
				<option key={ key[0] } value={ key[0] }>{ key[1] }</option>
			);
			return html;
		} );

		return (
			<>
				{ htmlLabel }
				<div className="customize-control-content">
					<select className="ast-select-input" data-name={ name } data-value={ this.state.value } value={ this.state.value } onChange={ () => { this.onSelectChange() } } >
						{ optionsHtml }
					</select>
				</div>
			</>
		);
	}

	updateValues( updateState ) {
		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );
	}
}

SelectComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default SelectComponent;
