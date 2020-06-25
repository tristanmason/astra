import PropTypes from 'prop-types';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

class HeadingComponent extends Component {
	constructor(props) {
		super( props );
	}

	render() {
		console.log('Working baba');
		return (
			<Fragment>
				{ this.props.control.params.label && (
					<span className="customize-control-caption">{ this.props.control.params.caption }</span>
				) }
				<div className="ast-heading-wrapper wp-ui-highlight">
					<label className="customizer-text">
						{ this.props.control.params.label && (
							<span className="customize-control-title wp-ui-text-highlight">{ this.props.control.params.label }</span>
						) }
						{ this.props.control.params.description && (
							<span className="description customize-control-description">{ this.props.control.params.description }</span>
						) }
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
