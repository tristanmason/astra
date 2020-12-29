import PropTypes from 'prop-types';
import {Dashicon} from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';
import {useState} from 'react';

const ColorComponent = props => {
	let value
	if(props.control.setting.get().includes("palette")){
		var regex = /\d+/g;
		var string = props.control.setting.get();
		var matches = string.match(regex);
		var updated_palette = props.customizer.control('astra-settings[global-color-palette]').setting.get()		
		value = updated_palette[updated_palette.patterntype][matches]
	}else{
		 value = props.control.setting.get();
	}

	let defaultValue = props.control.params.default;
	
	const [state, setState] = useState({
		value: value,	
	});
	
	const updateValues = (value) => {
		setState(prevState => ({
			...prevState,
			value: value
		}));
		
		if(props.control.container[0].getAttribute('paleteindex')){			
			props.control.setting.set('var(--global-palette'+props.control.container[0].getAttribute('paleteindex')+')');
		}else{
			props.control.setting.set(value);
		}
			

		
	};

	const updatepaletteuse = (value,index) =>{
		props.control.container[0].setAttribute('paleteused', value);
		props.control.container[0].setAttribute('paleteindex', index);		

	}

	const updatePaletteState = (e) =>{
	
		if( e.detail.radiochange == "true" ){			
			var current_color;		

			switch(props.control.params.label) {
				case "Text Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][0]
				break;
				case "Theme Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][1]
				break;
				case "Link Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][2]
				break;
				case "Link Hover Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][3]
				break;
				case "Heading Color ( H1 - H6 )":
					current_color = e.detail.palette[e.detail.palette.patterntype][4]

				break;
				default:
					current_color = '';
			}			
			
		}else{

			if( ( props.control.params.label == "Text Color" || props.control.params.label == "Theme Color"|| props.control.params.label == "Link Color" || props.control.params.label == "Link Hover Color" || props.control.params.label == "Heading Color ( H1 - H6 )") && (props.control.container[0].getAttribute('paleteindex') && props.control.container[0].getAttribute('paleteindex') == e.detail.index )  && (state.value == e.detail.prevcolor)){
				var current_color = e.detail.newcolor;	
			}else{
				return
			}
			
		}
		
		updateValues(current_color)
	}
	document.addEventListener( 'colorpaletteglobal', updatePaletteState, false );

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

	const handleChangeComplete = ( color ) => {
		let value;

		if (typeof color === 'string' || color instanceof String) {
			value = color;
		} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
			value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}

		updateValues(value);
	};

	let labelHtml = null;
	const {
		label
	} = props.control.params;

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}


	


	return <>
		<label>
			{labelHtml}
		</label>
		<div className="ast-color-picker-alpha color-picker-hex">
			{renderOperationButtons()}
			<AstraColorPickerControl color={undefined !== state.value && state.value ? state.value : ''}
									 onChangeComplete={(color, backgroundType) => handleChangeComplete(color)}
									 backgroundType={'color'}
									 allowGradient={false}
									 allowImage={false}
									 defautColorPalette = {props.customizer.control('astra-settings[global-color-palette]').setting.get()}
									 isPaletteUsed={(value,index) => updatepaletteuse(value,index)}
									 container ={props.control.container[0]}
									 />
									 

		</div>
	</>;

};

ColorComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo ( ColorComponent );