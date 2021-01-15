import PropTypes from 'prop-types';
import {RangeControl} from '@wordpress/components';
import {useState} from 'react';
import {__} from '@wordpress/i18n';

const ResponsiveSliderComponent = props => {

	const [props_value, setPropsValue] = useState(props.control.setting.get());

	const updateValues = (device, newVal) => {
		let updateState = {...props_value};
		updateState[device] = newVal;
		props.control.setting.set(updateState);
		setPropsValue(updateState);
	};

	const renderInputHtml = (device, active = '') => {
		const {
			input_attrs,
			suffix
		} = props.control.params;
		let suffixHtml = null,
			defaultVal = parseInt( props.control.params.default[device] ) === 0 ? 0 : Number( props.control.params.default[device] ) || 0 ;

		const defaults = { min: 0, max: 500, step: 1 };
		const controlProps = {
			...defaults,
			...( input_attrs || {} ),
		};
		const { min, max, step } = controlProps;

		if (suffix) {
			suffixHtml = <span className="ast-range-unit">{suffix}</span>;
		}

		return <div className={`input-field-wrapper ${device} ${active}`}>
			<RangeControl
				resetFallbackValue={defaultVal}
				value={ parseInt( props_value[device] ) === 0 ? 0 : props_value[device] || '' }
				min={ min < 0 ? min : 0 }
				max={ max || 100 }
				step={ step || 1 }
				allowReset
				onChange={ (newVal) => {updateValues(device, newVal )} }
			/>
		</div>;
	};

	const {
		description,
		label
	} = props.control.params;

	let labelHtml = null;
	let responsiveHtml = null;
	let descriptionHtml = null;
	let inputHtml = null;

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
		responsiveHtml = <ul key={'ast-resp-ul'} className="ast-responsive-slider-btns">
			<li className="desktop active">
				<button type="button" className="preview-desktop active" data-device="desktop">
					<i className="dashicons dashicons-desktop"></i>
				</button>
			</li>
			<li className="tablet">
				<button type="button" className="preview-tablet" data-device="tablet">
					<i className="dashicons dashicons-tablet"></i>
				</button>
			</li>
			<li className="mobile">
				<button type="button" className="preview-mobile" data-device="mobile">
					<i className="dashicons dashicons-smartphone"></i>
				</button>
			</li>
		</ul>;
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}

	inputHtml = <>
		{renderInputHtml('desktop', 'active')}
		{renderInputHtml('tablet')}
		{renderInputHtml('mobile')}
	</>;

	return <label key={'customizer-text'}>
		{labelHtml}
		{responsiveHtml}
		{descriptionHtml}

		<div className="wrapper">
			{inputHtml}
		</div>
	</label>;

};

ResponsiveSliderComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ResponsiveSliderComponent );
