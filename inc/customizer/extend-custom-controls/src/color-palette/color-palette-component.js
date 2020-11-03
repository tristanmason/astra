import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class ColorPaletteComponent extends Component {

    constructor( props ) {

		super( props );

		let value = this.props.control.setting.get();

		this.defaultValue = this.props.control.params.default;

		this.state = {
			value: value,
		};
	}

    render() {

		let labelHtml = null;

		const {
			label
		} = this.props.control.params

		if ( label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>
		}
		return (
			<>
				<label>
					{ labelHtml }
				</label>
			</>
		);
    }
}

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ColorPaletteComponent;
