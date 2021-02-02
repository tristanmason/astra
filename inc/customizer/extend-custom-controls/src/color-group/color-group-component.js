import PropTypes from 'prop-types';
const {__} = wp.i18n;
import AstraColorPickerControl from '../common/astra-color-picker-control';
const {Tooltip} = wp.components;
import {useState} from 'react';

const ColorGroupComponent = props => {

	let htmlLabel = null;
	let htmlHelp = null;
	const {
		label,
		help,
		name
	} = props.control.params;

	const linked_sub_colors = AstraBuilderCustomizerData.js_configs.sub_controls[name];
	const color_group = [],
		tooltips = [];

	Object.entries( linked_sub_colors ).map( ( [ key,value ] ) => {
		color_group[value.name] = wp.customize.control( value.name ).setting.get();
		tooltips[value.name] = value.title;
	});

	const[ state , setState ] = useState(color_group);

	const handleChangeComplete = ( key, color='' ) => {

		let updateState = {
			...state
		};

		let value;

		if (typeof color === 'string' || color instanceof String) {
			value = color;
		} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
			value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}
		
		updateState[key] = value;
		wp.customize.control( key ).setting.set(value);
		
		setState(updateState);
	};

	if (label) {
		htmlLabel = <span className="customize-control-title">{label}</span>;
	}

	if (help) {
		htmlHelp = <span className="ast-description">{help}</span>;
	}	

	let optionsHtml = Object.entries( state ).map( ( [ key,value ] ) => {

		var tooltip = tooltips[key] || __('Color', 'astra');

		let html = (

			<Tooltip key={ key } text={ tooltip }>

				<div className="color-group-item" id={ key }>
					<AstraColorPickerControl color={value ? value : ''}
					onChangeComplete={(color, backgroundType) => handleChangeComplete(key, color)}
					backgroundType={'color'}
					allowGradient={false}
					allowImage={false}/>
				</div>

			</Tooltip> 
		);

		return html;
	});

	return <>
		<div className="ast-toggle-desc-wrap">
			<label className="customizer-text">
				{htmlLabel}
				{htmlHelp}
			</label>
		</div>
		<div className="ast-field-color-group-wrap">
			{optionsHtml}
		</div>
	</>;
};

ColorGroupComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo(  ColorGroupComponent );
