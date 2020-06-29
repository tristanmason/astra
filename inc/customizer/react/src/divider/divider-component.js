import PropTypes from 'prop-types';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

class DividerComponent extends Component {
	constructor(props) {
		super( props );
	}

	render() {

        const {
            caption,
            separator,
            label,
            description
        } = this.props.control.params

        console.log(separator);
		return (
			<Fragment>

                { caption && (
                    <span className="customize-control-caption">{ caption }</span>
                ) }

                { separator && (
                    <hr />
                ) }

                <label className="customizer-text">

                    { label && (
                        <span className="customize-control-title">{ label }</span>
                    ) }
                    { description && (
                        <span className="description customize-control-description">{ description }</span>
                    ) }

                </label>

			</Fragment>
		);
	}
} 

DividerComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default DividerComponent; 