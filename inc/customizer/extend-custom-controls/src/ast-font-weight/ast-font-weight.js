import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class FontWeightComponent extends Component {

	constructor( props ) {

		super( props );
		
		let value = this.props.control.setting.get();
		
		if ( undefined === value || '' === value ) {
			value = [];
		}

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
			link,
			ast_all_font_weight
		} = this.props.control.params

		let labelHtml = null;
		let descriptionHtml = null;
		let selectHtml = null;
		let inp_array = [];
		let inherit = __( 'Inherit', 'astra' );
		let optionsStaticHtml = null;

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

		let optionsHtml = Object.entries( ast_all_font_weight ).map( ( key ) => {

			var html = (
				 
				<option key={ key[0] } value={ key[0] }>{ key[1] }</option>
			);
			return html;
		} );

		if ( 'normal' === this.state.value ) {

			optionsStaticHtml = <option key="normal" value="normal">{ inherit }</option>;
		} else {
			optionsStaticHtml = <option key="inherit" value="inherit">{ inherit }</option>;
			
		}

		if ( connect ) {
			
			selectHtml = <select { ...inp_array } data-connected-control = { connect } data-value = { this.state.value }  data-name = { name } data-inherit = { inherit  } >
				{ optionsStaticHtml }
				{ optionsHtml }
			</select>
		}

		if ( variant ) {
			
			selectHtml = <select { ...inp_array } data-connected-variant = { variant } data-value = { this.state.value }  data-name = { name } data-inherit = { inherit } >
				{ optionsStaticHtml }
				{ optionsHtml }
			</select>
		}

		if ( connect && variant ) {
			
			selectHtml = <select { ...inp_array } data-connected-control = { connect } data-connected-variant = { variant } data-value = { this.state.value }  data-name = { name } data-inherit = { inherit  } >
				{ optionsStaticHtml }
				{ optionsHtml }
			</select>
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

	updateValues( updateState ) {
		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );
	}
}

FontWeightComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default FontWeightComponent;
