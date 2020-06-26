import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

class DescriptionComponent extends Component {
	constructor(props) {
		super( props );
	}

	render() {
		return (
			<Fragment>
                <label className="customizer-text">
                    { this.props.control.params.label && (
                        <span className="customize-control-title">{ this.props.control.params.label }</span>
                    ) }
                    { this.props.control.params.help && (
                        <span className="ast-description">{ ReactHtmlParser (this.props.control.params.help) }</span>
                    ) }
                    { this.props.control.params.description && (
                        <span className="description customize-control-description">{ this.props.control.params.description }</span>
                    ) }
                </label>
			</Fragment>
		);
	}
}

DescriptionComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default DescriptionComponent;
