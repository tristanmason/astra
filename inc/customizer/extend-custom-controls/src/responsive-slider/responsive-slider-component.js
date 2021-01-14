import PropTypes from 'prop-types';
import {RangeControl} from '@wordpress/components';
import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';

const ResponsiveSliderComponent = props => {

	const [props_value, setPropsValue] = useState(props.control.setting.get());

	const onResetClick = (e) => {
		e.preventDefault();
		props.control.setting.set(props.control.params.default);
		setPropsValue(props.control.params.default);
	};

	const updateValues = (newVal) => {
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
		let suffixHtml = null;

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
				resetFallbackValue={''}
				value={ parseInt( props_value[device] ) === 0 ? 0 : props_value[device] || '' }
				min={ min < 0 ? min : 0 }
				max={ max || 100 }
				step={ step || 1 }
				allowReset
				onChange={ updateValues(device, newVal ) }
			/>
		</div>;
	};

	const {
		description,
		label
	} = props.control.params;

	const reset = __('Back to default', 'astra');

	let labelHtml = null;
	let responsiveHtml = null;
	let descriptionHtml = null;
	let inputHtml = null;
	let resetHtml = null;

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
	resetHtml = <div className="ast-responsive-slider-reset" onClick={e => {
		onResetClick(e);
	}}>
		<span className="dashicons dashicons-image-rotate ast-control-tooltip" title={reset}></span>
	</div>;
	return <label key={'customizer-text'}>
		{labelHtml}
		{responsiveHtml}
		{descriptionHtml}

		<div className="wrapper">
			{inputHtml}
			{resetHtml}
		</div>
	</label>;

};

ResponsiveSliderComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ResponsiveSliderComponent );
