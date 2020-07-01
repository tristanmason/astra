import PropTypes from 'prop-types';

import { Component, Fragment } from '@wordpress/element';

class DividerComponent extends Component {

	render() {

        const {
            caption,
            separator,
            label,
            description
        } = this.props.control.params

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