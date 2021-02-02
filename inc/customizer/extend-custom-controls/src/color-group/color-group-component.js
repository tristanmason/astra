import PropTypes from 'prop-types';
import AstraColorPickerControl from '../common/astra-color-picker-control';
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

	const[ state , setState ] = useState({
		value: linked_sub_colors
	});

	console.log( state.value );

	// const [props_value, setPropsValue] = useState(props.control.setting.get());
	// const onAlignChange = ( value, device='' ) => {
	// 	let updateState = {
	// 		...props_value
    //     };
    //     if ( '' !== device ) {
    //         updateState[device] = value;
    //     } else {
    //         updateState = value;
    //     }
	// 	props.control.setting.set(updateState);
	// 	setPropsValue(updateState);
	// };

	// const updateValues = (key, value) => {
	// 	setState(prevState => ({
	// 		...prevState,
	// 		value: value
	// 	}));
	// 	let sub_control = wp.customize.control( key );
	// 	sub_control.setting.set( value );
	// };

	const handleChangeComplete = ( key, color='' ) => {

		let updateState = {
			...state.value
		};

		let value;
		let sub_control = wp.customize.control( key );

		if (typeof color === 'string' || color instanceof String) {
			value = color;
		} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
			value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}

		sub_control.setting.set(updateState);
		setState(updateState);
	};









	if (label) {
		htmlLabel = <span className="customize-control-title">{label}</span>;
	}

	if (help) {
		htmlHelp = <span className="ast-description">{help}</span>;
	}	

	let optionsHtml = Object.entries(state.value).map(key => {

		let html = <div key={key} className="color-group-item" id={state.value[key[0]].name}>
				<AstraColorPickerControl color={undefined !== state.value[key[0]].value && state.value[key[0]].value ? state.value[key[0]].value : ''}
				onChangeComplete={(color, backgroundType) => handleChangeComplete(state.value[key[0]].name, color)}
				backgroundType={'color'}
				allowGradient={false}
				allowImage={false}/>
			</div>;
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
