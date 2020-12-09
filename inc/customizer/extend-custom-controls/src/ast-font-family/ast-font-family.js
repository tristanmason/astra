import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class FontFamilyComponent extends Component {

	constructor( props ) {

		super( props );
		
		let value = this.props.control.setting.get();
		
		this.state = {
			value: value,
		};
	}

	render() {

		const {
			description,
			label,
			connect,
			variant,
			name,
			link
		} = this.props.control.params

		let labelHtml = null;
		let descriptionHtml = null;
		let selectHtml = null;
		let inp_array = [];
		let inherit = __( 'Inherit', 'astra' );

		if ( label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>;
		}

		if ( description ) {

			descriptionHtml = <span className="description customize-control-description">{ description }</span>
		}

		if ( undefined !== link ) {

			let splited_values = link.split( " " )

			splited_values.map(( item, i ) => {

				let item_values = item.split( "=" )

				if ( undefined !== item_values[1] ) {
					inp_array[ item_values[0] ] = item_values[1].replace( /"/g, "" );
				}
				
			});
		}

		if ( connect ) {
			
			selectHtml = <select { ...inp_array } data-connected-control = { connect } data-value = { this.state.value } data-name = { name } data-inherit = { inherit  }></select>
		}

		if ( variant ) {
			
			selectHtml = <select { ...inp_array } data-connected-variant = { variant } data-value = { this.state.value } data-name = { name } data-inherit = { inherit }></select>
		}

		if ( connect && variant ) {
			
			selectHtml = <select { ...inp_array } data-connected-control = { connect } data-connected-variant = { variant } data-value = { this.state.value } data-name = { name } data-inherit = { inherit  }></select>
		}

		return (
			<>
				<label>
					{ labelHtml }
					{ descriptionHtml }
				</label>

				{ selectHtml }
			</>
		);
	}
}

FontFamilyComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default FontFamilyComponent;
