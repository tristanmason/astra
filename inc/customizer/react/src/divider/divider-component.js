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

        const separatorHtml = () => {
            if( separator ){
                return <hr />
            }
            return null;
        };

        const captionHtml = () => {
            if( caption ){
                return <span className="customize-control-caption">{ caption }</span>
            }
            return null;
        };

        const labelHtml = () => {
            if( label ){
                return <span className="customize-control-title">{ label }</span>
            }
            return null;
        };

        const descriptionHtml = () => {
            if( description ){
                return <span className="description customize-control-description">{ description }</span>
            }
            return null;
        };

		return (
			<Fragment>

                {captionHtml()}

                {separatorHtml()}

                <label className="customizer-text">

                    {labelHtml()}

                    {descriptionHtml()}

                </label>

			</Fragment>
		);
	}
} 

DividerComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default DividerComponent; 