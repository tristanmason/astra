import PropTypes from 'prop-types';
import {Dashicon} from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';
import {useState} from 'react';

const ColorComponent = props => {

	let value = props.control.setting.get();
	let defaultValue = props.control.params.default;

	const [state, setState] = useState({
		value: value,
	});

	const updateValues = (value) => {
		setState(prevState => ({
			...prevState,
			value: value
		}));
		props.control.setting.set(value);
	};

	const handleChangeComplete = ( color ) => {
		console.log('COLOR<<<<COMPONENT');
		// let value;sa
		// if (typeof color === 'string' || color instanceof String) {
		// 	value = color;
		// } else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
		// 	value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		// } else {
		// 	value = color.hex;
		// }

		// console.log('INSIDE Color Palette');

		// updateValues(value,patterntype,index);
	};

	const renderOperationButtons = () => {
		return <span className="customize-control-title">
				<>
					<div className="ast-color-btn-reset-wrap">
						<button
							className="ast-reset-btn components-button components-circular-option-picker__clear is-secondary is-small"
							disabled={JSON.stringify(state.value) === JSON.stringify(defaultValue)} onClick={e => {
							e.preventDefault();
							let value = JSON.parse(JSON.stringify(defaultValue));

							if (undefined === value || '' === value) {
								value = '';
								wp.customize.previewer.refresh();
							}

							updateValues(value);
						}}>
						<Dashicon icon='image-rotate' style={{
							width: 12,
							height: 12,
							fontSize: 12
						}}/>
						</button>
					</div>
				</>
			</span>;
	};

	// const handleChangeComplete = ( color ) => {
	// 	let value;

	// 	if (typeof color === 'string' || color instanceof String) {
	// 		value = color;
	// 	} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
	// 		value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
	// 	} else {
	// 		value = color.hex;
	// 	}

	// 	updateValues(value);
	// };

	let labelHtml = null;
	const {
		label
	} = props.control.params;

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}


	var element =  document.getElementById("ast-color-palette-hidden");
	if (typeof(element) != 'undefined' && element != null)
	{
		var custompalette = document.getElementById("ast-color-palette-hidden").getAttribute('data-palette');
	}
	var current_color = state.value

	if(props.control.id  == "astra-settings[text-color]"){
		current_color = Object.values(JSON.parse(custompalette))[0]
	}else if(props.control.id  == "astra-settings[theme-color]"){
		current_color = Object.values(JSON.parse(custompalette))[1]
	}else if(props.control.id  == "astra-settings[link-color]"){
		current_color = Object.values(JSON.parse(custompalette))[2]
	}else if(props.control.id  == "astra-settings[link-h-color]"){
		current_color = Object.values(JSON.parse(custompalette))[3]
	}else if(props.control.id  == "astra-settings[heading-base-color]"){
		current_color = Object.values(JSON.parse(custompalette))[4]
	}


	return <>
		<label>
			{labelHtml}
		</label>
		<div className="ast-color-picker-alpha color-picker-hex">
			{renderOperationButtons()}
			<AstraColorPickerControl
				color={undefined !== state.value && state.value ? state.value : ''}
				onChangeComplete={(color, backgroundType) => handleChangeComplete(color)}
				backgroundType={'color'}
				allowGradient={false}
				allowImage={false}
				defautColorPalette = {props.customizer.control('astra-settings[global-color-palette]').setting.get()}
			/>


		</div>
	</>;

};

ColorComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo ( ColorComponent );
