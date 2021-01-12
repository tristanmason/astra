import PropTypes from 'prop-types';
import {useState} from 'react';
import {Dashicon} from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';
import {__} from '@wordpress/i18n';

const Background = props => {
	var dbValue= props.control.setting.get();
	var tempDbValue = Object.assign({},dbValue);

	let value
	if(tempDbValue['background-color'] && tempDbValue['background-color'].includes("palette")){
		var regex = /\d+/g;
		var string = tempDbValue['background-color'];
		var matches = string.match(regex);
		var updated_palette = props.customizer.control('astra-settings[global-color-palette]').setting.get()		
		tempDbValue['background-color'] = updated_palette[updated_palette.patterntype][matches]
		value = tempDbValue
	}else{		
		 value = props.control.setting.get();
	}

	const [props_value, setPropsValue] = useState(value);

	const updateBackgroundType = () => {
		let obj = {
			...props_value
		};

		if (props_value['background-type']) {
			if (props_value['background-color']) {
				obj['background-type'] = 'color';
				props.control.setting.set(obj);
				setPropsValue( obj );

				if (props_value['background-color'].includes('gradient')) {
					obj['background-type'] = 'gradient';
					props.control.setting.set(obj);
					setPropsValue( obj );
				}
			}

			if (props_value['background-image']) {
				obj['background-type'] = 'image';
				props.control.setting.set(obj);
				setPropsValue( obj );
			}
		}
	};

	const updatePaletteuse = (value,index,defaultset) =>{
		
		props.control.container[0].setAttribute('paletteused', value);
		props.control.container[0].setAttribute('paletteindex', index);		
		props.control.container[0].setAttribute('defaultset', defaultset);		

	}

	const renderReset = () => {
		return <span className="customize-control-title">
				<div className="ast-color-btn-reset-wrap">
					<button
						className="ast-reset-btn components-button components-circular-option-picker__clear is-secondary is-small"
						disabled={JSON.stringify(props_value) === JSON.stringify(props.control.params.default)} onClick={e => {
						e.preventDefault();
						let value = JSON.parse(JSON.stringify(props.control.params.default));

						if (undefined !== value && '' !== value) {
							if (undefined === value['background-color'] || '' === value['background-color']) {
								value['background-color'] = '';
								wp.customize.previewer.refresh();
							}

							if (undefined === value['background-image'] || '' === value['background-image']) {
								value['background-image'] = '';
								wp.customize.previewer.refresh();
							}

							if (undefined === value['background-media'] || '' === value['background-media']) {
								value['background-media'] = '';
								wp.customize.previewer.refresh();
							}
						}

						props.control.setting.set(value);
						setPropsValue( value );
						// refs.ChildAstraColorPickerControl.onResetRefresh();
					}}>
						<Dashicon icon='image-rotate' style={{
							width: 12,
							height: 12,
							fontSize: 12
						}}/>
					</button>
				</div>
			</span>;
	};

	const onSelectImage = ( media, backgroundType ) => {
		let obj = {
			...props_value
		};
		obj['background-media'] = media.id;
		obj['background-image'] = media.url;
		obj['background-type'] = backgroundType;
		props.control.setting.set(obj);
		setPropsValue( obj );
	};

	const onChangeImageOptions = ( mainKey, value, backgroundType ) => {
		let obj = {
			...props_value
		};
		obj[mainKey] = value;
		obj['background-type'] = backgroundType;
		props.control.setting.set(obj);
		setPropsValue( obj );
	};

	const renderSettings = () => {
		return <>
			<AstraColorPickerControl
				color={undefined !== props_value['background-color'] && props_value['background-color'] ? props_value['background-color'] : ''}
				onChangeComplete={(color, backgroundType) => handleChangeComplete(color, backgroundType)}
				media={undefined !== props_value['background-media'] && props_value['background-media'] ? props_value['background-media'] : ''}
				backgroundImage={undefined !== props_value['background-image'] && props_value['background-image'] ? props_value['background-image'] : ''}
				backgroundAttachment={undefined !== props_value['background-attachment'] && props_value['background-attachment'] ? props_value['background-attachment'] : ''}
				backgroundPosition={undefined !== props_value['background-position'] && props_value['background-position'] ? props_value['background-position'] : ''}
				backgroundRepeat={undefined !== props_value['background-repeat'] && props_value['background-repeat'] ? props_value['background-repeat'] : ''}
				backgroundSize={undefined !== props_value['background-size'] && props_value['background-size'] ? props_value['background-size'] : ''}
				onSelectImage={(media, backgroundType) => onSelectImage(media, backgroundType)}
				onChangeImageOptions={(mainKey, value, backgroundType) => onChangeImageOptions(mainKey, value, backgroundType)}
				backgroundType={undefined !== props_value['background-type'] && props_value['background-type'] ? props_value['background-type'] : 'color'}
				allowGradient={true} allowImage={true} 
				defautColorPalette = {props.customizer.control('astra-settings[global-color-palette]').setting.get()}
				isPaletteUsed={ (value,index,defaultset) => updatePaletteuse(value,index,defaultset)} 
				container ={props.control.container[0]} />
		</>;
	};

	const handleChangeComplete = ( color, backgroundType ) => {
		let value = '';

		if (color) {
			if (typeof color === 'string' || color instanceof String) {
				value = color;
			} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
				value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
			} else {
				value = color.hex;
			}
		}

		let obj = {
			...props_value
		};
		obj['background-color'] = value;
		obj['background-type'] = backgroundType;
		
		setPropsValue( obj );

		if(props.control.container[0].getAttribute('paletteindex')){	
			obj['background-color'] = 'var(--global-palette'+props.control.container[0].getAttribute('paletteindex')+')';

			props.control.setting.set(obj);
		}else{
			props.control.setting.set(obj);
		}

	};

	const {
		defaultValue,
		label,
		description
	} = props.control.params;
	let defaultVal = '#RRGGBB';
	let labelHtml = <span className="customize-control-title">{label ? label : __('Background', 'astra')}</span>;
	let descriptionHtml = description ?
		<span className="description customize-control-description">{description}</span> : null;
	let inputHtml = null;

	if (defaultValue) {
		if ('#' !== defaultValue.substring(0, 1)) {
			defaultVal = '#' + defaultValue;
		} else {
			defaultVal = defaultValue;
		}

		defaultValueAttr = ' data-default-color=' + defaultVal; // Quotes added automatically.
	}

	inputHtml = <div className="background-wrapper">
		<div className="background-container">
			{renderReset()}
			{renderSettings()}
		</div>
	</div>;
	return <>
		<label>
			{labelHtml}
			{descriptionHtml}
		</label>

		<div className="customize-control-content">
			{inputHtml}
		</div>
	</>;

};

Background.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( Background );
