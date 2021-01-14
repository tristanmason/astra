import PropTypes from 'prop-types';
import {__} from '@wordpress/i18n';
import {RangeControl} from '@wordpress/components';
import {useState, useEffect} from 'react';

const SliderComponent = props => {

	const [props_value, setPropsValue] = useState( props.control.setting.get() );

	const {
		label,
		description,
		suffix,
		input_attrs,
	} = props.control.params;

	let labelHtml = null,
		descriptionHtml = null,
		suffixHtml = null;

	const defaults = { min: 0, max: 500, step: 1 };
	const controlProps = {
		...defaults,
		...( input_attrs || {} ),
	};
	const { min, max, step } = controlProps;

	if (label) {
		labelHtml = <label><span className="customize-control-title">{label}</span></label>;
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}

	if (suffix) {
		suffixHtml = <span className="ast-range-unit">{suffix}</span>;
	}

	const updateValues = ( newVal ) => {
		console.log( newVal );
		setPropsValue( newVal );
		props.control.setting.set( newVal );
	};

	return <label>
		{labelHtml}
		{descriptionHtml}

		<div className="wrapper">
			<RangeControl
				value={ parseInt( props_value ) === 0 ? 0 : props_value || '' }
				onChange={ updateValues	}
				resetFallbackValue={''}
				min={ min < 0 ? min : 0 }
				max={ max || 500 }
				step={ step || 1 }
				allowReset
			/>
		</div>
	</label>;
};

SliderComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( SliderComponent );
