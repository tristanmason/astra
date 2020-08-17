import PropTypes from 'prop-types';
import { Component, Fragment } from '@wordpress/element';

class HeadingComponent extends Component {
	render() {
		let htmlCaption = null;
		let htmlLabel = null;
		let htmlDescription = null;
		if ( this.props.control.params.caption ) {
			htmlCaption = <span className="customize-control-caption">{ this.props.control.params.caption }</span>;
		}
		if ( this.props.control.params.label ) {
			htmlLabel = <span className="customize-control-title wp-ui-text-highlight">{ this.props.control.params.label }</span>;
		}
		if ( this.props.control.params.description ) {
			htmlDescription = <span className="description customize-control-description">{ this.props.control.params.description }</span>;
		}
		return (
			<Fragment>
				{ htmlCaption }
				<div className="ast-heading-wrapper wp-ui-highlight">
					<label className="customizer-text">
						{ htmlLabel }
						{ htmlDescription }
					</label>
				</div>
			</Fragment>
		);
	}
}

HeadingComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default HeadingComponent;
