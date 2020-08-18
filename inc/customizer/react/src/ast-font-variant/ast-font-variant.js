import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class FontVariantComponent extends Component {

	constructor( props ) {

		super( props );
		
		let value = this.props.control.setting.get();
		
		if ( undefined === value || '' === value ) {
			value = [];
		}

		this.state = {
			value: value,
		};

		this.onSelectChange = this.onSelectChange.bind(this);
	}

	onSelectChange() {
		this.updateValues( event.target.value )
	}

	render() {
		const {
			description,
			label,
			connect,
			variant,
			name,
			link,
			value
		} = this.props.control.params

		let labelHtml = null;
		let descriptionHtml = null;
		let selectHtml = null;
		let inp_array = [];
		let inherit = __( 'Inherit', 'astra' );
		let options_array = [];

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

		if ( this.state.value && '' !== this.state.value && 0 < this.state.value.length ) {
			options_array = this.state.value.split( ',' )
		}

		let optionsHtml = Object.values( options_array ).map( ( key ) => {

			var html = ( 
				<option key={ key } value={ key }>{ key }</option>
			);
			return html;
		} );

		let inputHtml = <input className="ast-font-variant-hidden-value" type="hidden" value={ this.state.value } onChange={ () => { this.onSelectChange() } } />;

		if ( connect ) {
			
			selectHtml = <select { ...inp_array } data-connected-control = { connect } data-value = { this.state.value }  data-name = { name } data-inherit = { inherit  } multiple >
				{ optionsHtml }
				{ inputHtml }
			</select>
		}

		if ( variant ) {
			
			selectHtml = <select { ...inp_array } data-connected-variant = { variant } data-value = { this.state.value }  data-name = { name } data-inherit = { inherit } multiple >
				{ optionsHtml }
				{ inputHtml }
			</select>
		}

		if ( connect && variant ) {
			
			selectHtml = <select { ...inp_array } data-connected-control = { connect } data-connected-variant = { variant } data-value = { this.state.value }  data-name = { name } data-inherit = { inherit  } multiple >
				{ optionsHtml }
				{ inputHtml }
			</select>
		}

		return (
			<>
				<label>
					{ labelHtml }
					{ descriptionHtml }
				</label>

				{ selectHtml }

				<span className="ast-control-tooltip dashicons dashicons-editor-help ast-variant-description" title="Only selected Font Variants will be loaded from Google Fonts."></span>
				<select className="test">
					<option value="1">1</option>
					<option value="2">2</option>
					<input className="ast-testettste" type="hidden"></input>
				</select>
			</>
		);
	}

	updateValues( updateState ) {
		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );
	}
}

FontVariantComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default FontVariantComponent;
