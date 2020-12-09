import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Component, Fragment } from '@wordpress/element';

class DescriptionComponent extends Component {
	render() {
		let htmlLabel = null;
        let htmlHelp = null;
		let htmlDescription = null;
		if ( this.props.control.params.label ) {
			htmlLabel = <span className="customize-control-title">{ this.props.control.params.label }</span>;
		}
		if ( this.props.control.params.help ) {
			htmlHelp = <span className="ast-description">{ ReactHtmlParser (this.props.control.params.help) }</span>;
		}
		if ( this.props.control.params.description ) {
			htmlDescription = <span className="description customize-control-description">{ this.props.control.params.description }</span>;
		}
		return (
			<Fragment>
                <label className="customizer-text">
                    { htmlLabel }
                    { htmlHelp }
                    { htmlDescription }
                </label>
			</Fragment>
		);
	}
}

DescriptionComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default DescriptionComponent;
