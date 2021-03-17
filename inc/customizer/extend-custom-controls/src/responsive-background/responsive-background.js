import PropTypes from 'prop-types';
import {Dashicon, Popover, Button} from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';
import {__} from '@wordpress/i18n';
import {useEffect, useState} from 'react';

const ResponsiveBackground = props => {

	let defaultPropsValue = props.control.params.default;
	let value = props.control.setting.get();

	const [state, setState] = useState({
		value: value,
		isVisible:false,
	});

	const toggleClose = () => {
		setState(prevState => ({
			...prevState,
			isVisible: false
		}));
	};

	const updatepaletteuse = (value,index,defaultset) =>{

		props.control.container[0].setAttribute('paletteused', value);
		props.control.container[0].setAttribute('paletteindex', index);
		props.control.container[0].setAttribute('defaultset', defaultset);

	}

	const updateValues = (obj) => {
		setState(prevState => ({
			...prevState,
			value: obj
		}));

		if(props.control.container[0].getAttribute('paletteindex')){
			obj['desktop']['background-color']  = 'var(--ast-global-palette'+props.control.container[0].getAttribute('paletteindex')+')';
		}

		props.control.setting.set(obj);
	};


	const updateBackgroundType = (device) => {

		let value = props.control.setting.get();
		let obj = {
			...value
		};
		if ( ! state.value[device]['background-type']) {
			let deviceObj = {
				...obj[device]
			};

			if (state.value[device]['background-color']) {
				deviceObj['background-type'] = 'color';
				obj[device] = deviceObj;
				updateValues(obj);

				if (state.value[device]['background-color'].includes('gradient')) {
					deviceObj['background-type'] = 'gradient';
					obj[device] = deviceObj;
					updateValues(obj);
				}
			}

			if (state.value[device]['background-image']) {
				deviceObj['background-type'] = 'image';
				obj[device] = deviceObj;
				updateValues(obj);
			}
		}
	};

	var globalPalette = props.customizer.control('astra-settings[global-color-palette]').setting.get()

	const handleGlobalColorPopupBtn = (value,index,defaultset,color,key) => {

		let obj = {
			...state.value
		};

		let palette = {
			...obj[key]
		};
		let palette_index = {
			...palette['background-color']
		};

		palette_index = color
		palette['background-color'] = palette_index
		palette['background-type'] = 'color';
		obj[key] = palette

		updatepaletteuse(value,index,defaultset);
		updateValues(obj);

	}
	var paletteSelectedIndex = ''
	if(state.value['desktop']['background-color'] && state.value['desktop']['background-color'].includes("palette")){
		var regex = /\d+/g;
		var string = state.value['desktop']['background-color'];
		paletteSelectedIndex = string.match(regex)[0];
	}
	const renderGlobalPalette = () => {
		return (
			<div className="ast-global-color-btn-wrap">
				<button	className="ast-global-color-btn components-button is-secondary"
				onClick={e => {
					e.preventDefault();
					setState(prevState => ({
						...prevState,
						isVisible: !state.isVisible
					}));
				}}>
					<Dashicon icon='admin-site-alt3' style={{
						width: 14,
						height: 14,
						fontSize: 14
					}}/>
				</button>
				{ state.isVisible && (
					<Popover position={"bottom center"} onClose={ toggleClose } className="ast-global-palette-popup">
						<label className="ast-global-color-palette-manage-label">{ __( 'Global Colors','astra' ) }</label>
						<Button
							className='ast-global-color-palette-manage'
							onClick={ () =>props.customizer.control('astra-settings[global-color-palette]').focus() }
							tabIndex={ 0 }
						>
							<Dashicon icon='admin-generic' style={{
								width: 12,
								height: 12,
								fontSize: 12
							}}/>
						</Button>
						<hr/>
						{ Object.keys( globalPalette.pattern1 ).map( ( item, index ) => {

							return (
								<Button
									className='ast-global-color-individual-btn'
									onClick={ () =>handleGlobalColorPopupBtn( true,index,'no',globalPalette.pattern1[item][0],'desktop' ) }
									tabIndex={ 0 }
									key={index}
									title={ globalPalette.pattern1[item][1]}
								>
									<div className={ paletteSelectedIndex === item ? 'ast-global-color-sticker selected' : 'ast-global-color-sticker' }
										style={{ background:globalPalette.pattern1[item][0] }}
									/>
									<div className="ast-global-color-title">{ globalPalette.pattern1[item][1]}</div>
									<div className="ast-global-color-hexcode">{ globalPalette.pattern1[item][0]}</div>
								</Button>
							)
						} )}
					</Popover>
				)}
			</div>
		)
	}

	const renderReset = () => {
		let reserBtnDisabled = true;
		let devices = ['desktop', 'mobile', 'tablet'];

		for (let device of devices) {

			if (state.value[device]['background-color'] !== defaultPropsValue[device]['background-image'] || state.value[device]['background-image'] !== defaultPropsValue[device]['background-color'] || state.value[device]['background-media'] !== defaultPropsValue[device]['background-media']) {
				reserBtnDisabled = false;
			}
		}

		return <div className="ast-color-btn-reset-wrap">
						<button
							className="ast-reset-btn components-button components-circular-option-picker__clear is-secondary is-small"
							disabled={reserBtnDisabled} onClick={e => {
							e.preventDefault();
							let value = JSON.parse(JSON.stringify(defaultPropsValue));

							if (undefined !== value && '' !== value) {
								for (let device in value) {
									if (undefined === value[device]['background-color'] || '' === value[device]['background-color']) {
										value[device]['background-color'] = '';
									}

									if (undefined === value[device]['background-image'] || '' === value[device]['background-image']) {
										value[device]['background-image'] = '';
									}

									if (undefined === value[device]['background-media'] || '' === value[device]['background-media']) {
										value[device]['background-media'] = '';
									}
								}
							}

							updateValues(value);

						}}>
							<Dashicon icon='image-rotate'/>
						</button>
					</div>;
	};

	const onSelectImage = (media, key, backgroundType) => {
		let obj = {
			...state.value
		};
		let deviceObj = {
			...obj[key]
		};
		deviceObj['background-image'] = media.url;
		deviceObj['background-media'] = media.id;
		deviceObj['background-type'] = backgroundType;
		obj[key] = deviceObj;
		updateValues(obj);
	};

	const onChangeImageOptions = (mainKey, value, device, backgroundType) => {
		let obj = {
			...state.value
		};
		let deviceObj = {
			...obj[device]
		};
		deviceObj[mainKey] = value;
		deviceObj['background-type'] = backgroundType;
		obj[device] = deviceObj;
		updateValues(obj);
	};

	useEffect(() => {

		let devices = ['desktop', 'mobile', 'tablet'];
		for (let device of devices) {
			updateBackgroundType(device);
		}

	}, []);

	const renderSettings = (key) => {
		return <>
			<AstraColorPickerControl
				color={undefined !== state.value[key]['background-color'] && state.value[key]['background-color'] ? state.value[key]['background-color'] : ''}
				onChangeComplete={(color, backgroundType) => handleChangeComplete(color, key, backgroundType)}
				media={undefined !== state.value[key]['background-media'] && state.value[key]['background-media'] ? state.value[key]['background-media'] : ''}
				backgroundImage={undefined !== state.value[key]['background-image'] && state.value[key]['background-image'] ? state.value[key]['background-image'] : ''}
				backgroundAttachment={undefined !== state.value[key]['background-attachment'] && state.value[key]['background-attachment'] ? state.value[key]['background-attachment'] : ''}
				backgroundPosition={undefined !== state.value[key]['background-position'] && state.value[key]['background-position'] ? state.value[key]['background-position'] : ''}
				backgroundRepeat={undefined !== state.value[key]['background-repeat'] && state.value[key]['background-repeat'] ? state.value[key]['background-repeat'] : ''}
				backgroundSize={undefined !== state.value[key]['background-size'] && state.value[key]['background-size'] ? state.value[key]['background-size'] : ''}
				onSelectImage={(media, backgroundType) => onSelectImage(media, key, backgroundType)}
				onChangeImageOptions={(mainKey, value, backgroundType) => onChangeImageOptions(mainKey, value, key, backgroundType)}
				backgroundType={undefined !== state.value[key]['background-type'] && state.value[key]['background-type'] ? state.value[key]['background-type'] : 'color'}
				allowGradient={true} allowImage={true}
				defautColorPalette = {props.customizer.control('astra-settings[global-color-palette]').setting.get()}
				isPaletteUsed={key=='desktop' ? (value,index,defaultset) => updatepaletteuse(value,index,defaultset):''}
				container ={props.control.container[0]}
				disablePalette={true}
				colorIndicator = { value[key]['background-color'] }
				/>
		</>;
	};

	const handleChangeComplete = (color, key, backgroundType) => {
		let value = '';

		if (color) {
			if (typeof color === 'string' || color instanceof String) {
				value = color;
			} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
				value = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
			} else {
				value = color.hex;
			}
		}

		let obj = {
			...state.value
		};
		let deviceObj = {
			...obj[key]
		};

		deviceObj['background-color'] = value;
		deviceObj['background-type'] = backgroundType;
		obj[key] = deviceObj;
		updateValues(obj);
	};

	const {
		label,
		description
	} = props.control.params;
	let labelHtml = null;
	let descriptionHtml = null;
	let responsiveHtml = null;
	let inputHtml = null;

	if (label && '' !== label && undefined !== label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	} else {
		labelHtml = <span className="customize-control-title">{__('Background', 'astra')}</span>;
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}

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

	inputHtml = <div className="background-wrapper">
		<div className="background-container desktop active">
			{renderGlobalPalette()}
			{renderReset('desktop')}
			{renderSettings('desktop')}
		</div>
		<div className="background-container tablet">
			{renderSettings('tablet')}
		</div>
		<div className="background-container mobile">
			{renderSettings('mobile')}
		</div>
	</div>;

	return <>
		<label>
			{labelHtml}
			{descriptionHtml}
		</label>
		{responsiveHtml}
		{renderReset()}
		<div className="customize-control-content">
			{inputHtml}
		</div>
	</>;
};

ResponsiveBackground.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ResponsiveBackground );
