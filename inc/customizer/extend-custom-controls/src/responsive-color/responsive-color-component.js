import PropTypes from 'prop-types';
import {useState} from 'react';
import {Dashicon} from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';

const ResponsiveColorComponent = props => {
	var dbvalue= props.control.setting.get();
	var temp_dbval = Object.assign({},dbvalue);

	let value
	if(temp_dbval.desktop && temp_dbval.desktop.includes("palette")){
		var regex = /\d+/g;
		var string = temp_dbval.desktop;
		var matches = string.match(regex);
		var updated_palette = props.customizer.control('astra-settings[global-color-palette]').setting.get()		
		temp_dbval.desktop = updated_palette[updated_palette.patterntype][matches]
		value = temp_dbval
	}else{		
		 value = props.control.setting.get();
	}
	
	
	const [props_value, setPropsValue] = useState(value);

	const updateValues = ( value, key ) => {
		
		let obj = {
			...props_value
		};
		
	
		if(key == "desktop"){
		
			if(props.control.container[0].getAttribute('paleteindex')){	
				obj[key] = 'var(--global-palette'+props.control.container[0].getAttribute('paleteindex')+')';
				
			}else{
				obj[key] = value;
			}
		}else{

			obj[key] = value;
			
		}


		setPropsValue(obj);
		props.control.setting.set(obj);
	};

	const updatepaletteuse = (value,index,defaultset) =>{
		
		props.control.container[0].setAttribute('paleteused', value);
		props.control.container[0].setAttribute('paleteindex', index);		
		props.control.container[0].setAttribute('defaultset', defaultset);		

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

			if( ( props.control.params.label == "Text Color" || props.control.params.label == "Theme Color"|| props.control.params.label == "Link Color" || props.control.params.label == "Link Hover Color" || props.control.params.label == "Heading Color ( H1 - H6 )" || props.control.params.label == "Background Color") && (props.control.container[0].getAttribute('paleteindex') && props.control.container[0].getAttribute('paleteindex') == e.detail.index )  && (props_value.desktop == e.detail.prevcolor)){
				var current_color = e.detail.newcolor;	
			}else{
				return
			}
			
		}
		updateValues(current_color,"desktop")
	}

	document.addEventListener( 'colorpaletteglobal', updatePaletteState, false );
	const renderReset = ( key ) => {
		let deleteBtnDisabled = true;
		let devices = ['desktop', 'mobile', 'tablet'];

		for (let device of devices) {
			if (props_value[device]) {
				deleteBtnDisabled = false;
			}
		}

		return <span className="customize-control-title">
			<>
				<div className="ast-color-btn-reset-wrap">
					<button
						className="ast-reset-btn components-button components-circular-option-picker__clear is-secondary is-small"
						disabled={JSON.stringify(props_value) === JSON.stringify(props.control.params.default)} onClick={e => {
						e.preventDefault();
						let value = JSON.parse(JSON.stringify(props.control.params.default));

						if (undefined !== value && '' !== value) {
							for (let device in value) {
								if (undefined === value[device] || '' === value[device]) {
									value[device] = '';
									wp.customize.previewer.refresh();
								}
							}
						}

						props.control.setting.set(value);
						setPropsValue(value);
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

	const renderSettings = ( key ) => {
	
		return <AstraColorPickerControl
			color={undefined !== value[key] && value[key] ? value[key] : ''}
			onChangeComplete={(color, backgroundType) => handleChangeComplete(color, key)} backgroundType={'color'}
			allowGradient={false} allowImage={false}
			defautColorPalette = {props.customizer.control('astra-settings[global-color-palette]').setting.get()}
			isPaletteUsed={key=='desktop' ? (value,index,defaultset) => updatepaletteuse(value,index,defaultset):''} 
			container ={props.control.container[0]}/>;
	};

	const handleChangeComplete = ( color, key ) => {
		let value;

		if (typeof color === 'string' || color instanceof String) {
			value = color;
		} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
			value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}

		updateValues(value, key);
	};

	const {
		defaultValue,
		label,
		description,
		responsive,
	} = props.control.params;

	let defaultVal = '#RRGGBB';
	let labelHtml = null;
	let descriptionHtml = null;
	let responsiveHtml = null;
	let inputHtml = null;

	if (defaultValue) {
		if ('#' !== defaultValue.substring(0, 1)) {
			defaultVal = '#' + defaultValue;
		} else {
			defaultVal = defaultValue;
		}

		defaultValueAttr = ' data-default-color=' + defaultVal; // Quotes added automatically.
	}

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}

	if (responsive) {
		responsiveHtml = <ul className="ast-responsive-btns">
			<li className="desktop active">
				<button type="button" className="preview-desktop" data-device="desktop">
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
		inputHtml = <>

			<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color desktop active">
				{renderReset('desktop')}
				{renderSettings('desktop')}
			</div>
			<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color tablet">
				{renderReset('tablet')}
				{renderSettings('tablet')}
			</div>
			<div className="ast-color-picker-alpha color-picker-hex ast-responsive-color mobile">
				{renderReset('mobile')}
				{renderSettings('mobile')}
			</div>
		</>;
	}

	return <>
		<label>
			{labelHtml}
			{descriptionHtml}
		</label>

		{responsiveHtml}

		<div className="customize-control-content">
			{inputHtml}
		</div>
	</>;

};

ResponsiveColorComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ResponsiveColorComponent );
