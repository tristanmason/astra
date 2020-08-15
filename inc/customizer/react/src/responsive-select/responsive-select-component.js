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

		return (
			<Fragment>
				{ responsiveHtml }
				<SelectComponent control={ this.props.control } />
				<SelectComponent control={ this.props.control } />
				<SelectComponent control={ this.props.control } />
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
