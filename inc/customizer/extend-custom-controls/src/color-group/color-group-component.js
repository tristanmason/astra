import PropTypes from 'prop-types';

const ColorGroupComponent = props => {

	let htmlLabel = null;
	let htmlHelp = null;
	const {
		label,
		help,
		name
	} = props.control.params;

	if (label) {
		htmlLabel = <span className="customize-control-title">{label}</span>;
	}

	if (help) {
		htmlHelp = <span className="ast-description">{help}</span>;
	}

	return <>
		<div className="ast-toggle-desc-wrap">
			<label className="customizer-text">
				{htmlLabel}
				{htmlHelp}
			</label>
		</div>
		<div className="ast-field-color-group-wrap">
		</div>
	</>;
};

ColorGroupComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo(  ColorGroupComponent );
