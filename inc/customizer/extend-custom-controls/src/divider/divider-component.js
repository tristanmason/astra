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

        let separatorHtml   = null;
        let captionHtml     = null;
        let labelHtml       = null;
        let descriptionHtml = null;

        if( separator ){
            separatorHtml = <hr />;
        }

        if( caption ){
            captionHtml =  <span className="customize-control-caption">{ caption }</span>;
        }

        if( label ){
            labelHtml = <span className="customize-control-title">{ label }</span>;
        }

        if( description ){
            descriptionHtml = <span className="description customize-control-description">{ description }</span>;
        }

		return (
			<Fragment>

                { captionHtml }

                { separatorHtml }

                <label className="customizer-text">

                    { labelHtml }

                    { descriptionHtml }

                </label>

			</Fragment>
		);
	}
} 

DividerComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default DividerComponent; 