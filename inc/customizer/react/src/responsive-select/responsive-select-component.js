import PropTypes from 'prop-types';
import { Component, Fragment } from '@wordpress/element';
import SelectComponent from '../select/select-component';

class ResponsiveSelectComponent extends Component {

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

		const responsiveHtml = (
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

		let optionsHtml = Object.entries( choices ).map( ( key ) => {

			var html = (
				<option key={ key[0] } value={ key[0] }>{ key[1] }</option>
			);
			return html;
		} );

		return (
			<Fragment>
				{ htmlLabel }
				{ responsiveHtml }
				<div className="customize-control-content">
					<div className="ast-responsive-select-wrapper">
						<div className="ast-responsive-select-container desktop">
							<select className="ast-select-input" data-name={ name } data-value={ this.state.value.desktop } value={ this.state.value.desktop } onChange={ () => { this.onSelectChange() } } >
								{ optionsHtml }
							</select>
						</div>
						<div className="ast-responsive-select-container tablet">
							<select className="ast-select-input" data-name={ name } data-value={ this.state.value.tablet } value={ this.state.value.tablet } onChange={ () => { this.onSelectChange() } } >
								{ optionsHtml }
							</select>
						</div>
						<div className="ast-responsive-select-container mobile">
							<select className="ast-select-input" data-name={ name } data-value={ this.state.value.mobile } value={ this.state.value.mobile } onChange={ () => { this.onSelectChange() } } >
								{ optionsHtml }
							</select>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	updateValues( updateState ) {
		this.setState( { value : updateState } )
		this.props.control.setting.set( updateState );
	}
}

ResponsiveSelectComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveSelectComponent;
