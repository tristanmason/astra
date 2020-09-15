import PropTypes from 'prop-types';

const { __ } = wp.i18n;
const { Component } = wp.element;
const { ToggleControl } = wp.components;

class SwitchComponent extends Component {
	constructor(props) {
		super( props );
		let value = props.control.setting.get();
		this.state = {
			value
		};
		this.defaultValue = props.control.params.default || '';
		this.updateValues = this.updateValues.bind( this );
	}

	render() {
		return (
				<div className="ahfb-control-field ahfb-switch-control">
					<ToggleControl
						label={ this.props.control.params.label ? this.props.control.params.label : undefined }
						checked={ this.state.value }
						onChange={ (value) => {
							this.updateValues( value );
						} }
					/>
				</div>
		);
	}

	updateValues(value) {
		this.setState( { value: value } );
		this.props.control.setting.set( value );
	}
}

SwitchComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default SwitchComponent;
