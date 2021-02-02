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
	const color_group = [];

	Object.entries(linked_sub_colors).map(key => {
		color_group[linked_sub_colors[key[0]].name] = linked_sub_colors[key[0]].value;
	});

	const[ state , setState ] = useState({
		value: linked_sub_colors
	});

	console.log( color_group );

	const handleChangeComplete = ( key, color='' ) => {

		let updateState = {
			...state.value
		};

		console.log( key );

		let value;

		if (typeof color === 'string' || color instanceof String) {
			value = color;
		} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
			value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}

		setState(updateState => ({
            ...updateState,
            value: value
        }));

		wp.customize.control( key ).setting.set(value);
		setState(updateState);
	};

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









	if (label) {
		htmlLabel = <span className="customize-control-title">{label}</span>;
	}

	if (help) {
		htmlHelp = <span className="ast-description">{help}</span>;
	}	

	let optionsHtml = Object.entries(linked_sub_colors).map(key => {

		console.log( linked_sub_colors[key[0]] );

		let html = <Tooltip key={key} text={__('Toggle Item Visiblity', 'astra')}>
			<div className="color-group-item" id={linked_sub_colors[key[0]].name}>
				<AstraColorPickerControl color={linked_sub_colors[key[0]].value ? linked_sub_colors[key[0]].value : ''}
				onChangeComplete={(color, backgroundType) => handleChangeComplete(linked_sub_colors[key[0]].name, color)}
				backgroundType={'color'}
				allowGradient={false}
				allowImage={false}/>
			</div>
		</Tooltip>;
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
