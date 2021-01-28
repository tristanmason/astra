import PropTypes from 'prop-types';
import {useState} from 'react';
import {Dashicon,Popover,Button} from '@wordpress/components';
import AstraColorPickerControl from '../common/astra-color-picker-control';

const ResponsiveColorComponent = props => {
	var dbValue= props.control.setting.get();
	var temp_dbval = Object.assign({},dbValue);

	let value
	if(temp_dbval.desktop && temp_dbval.desktop.includes("palette")){
		var regex = /\d+/g;
		var string = temp_dbval.desktop;
		var matches = string.match(regex);
		var updated_palette = props.customizer.control('astra-settings[global-color-palette]').setting.get()		
		temp_dbval.desktop = updated_palette[updated_palette.patterntype][matches][0]
		value = temp_dbval
	}else{		
		 value = props.control.setting.get();
	}
	const isVisible = false
	const [props_value, setPropsValue] = useState(value,isVisible);

	const updateValues = ( value, key ) => {
		
		let obj = {
			...props_value
		};		
	
		if( key === "desktop" ){
		
			if(props.control.container[0].getAttribute('paletteindex')){	
				obj[key] = 'var(--global-palette'+props.control.container[0].getAttribute('paletteindex')+')';
				
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
		
		props.control.container[0].setAttribute('paletteused', value);
		props.control.container[0].setAttribute('paletteindex', index);		
		props.control.container[0].setAttribute('defaultset', defaultset);		
	}

	const updatePaletteState = (e) =>{
	
		if( e.detail.radiochange == "true" ){			
			var current_color;		

			switch(props.control.params.label) {
				case "Text Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][0][0]
				break;
				case "Theme Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][1][0]
				break;
				case "Link Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][2][0]
				break;
				case "Link Hover Color":
					current_color = e.detail.palette[e.detail.palette.patterntype][3][0]
				break;
				case "Heading Color ( H1 - H6 )":
					current_color = e.detail.palette[e.detail.palette.patterntype][4][0]

				break;
				default:
					current_color = '';
			}			
			
		}else{

			if( ( props.control.params.label == ( "Text Color" ) || props.control.params.label == ( "Link / Text Color" ) ||
			props.control.params.label == ( "Link Color" ) || props.control.params.label == ( "Link Hover Color" ) || props.control.params.label == ( "Separator Color" ) || props.control.params.label == ( "Border Color" ) || props.control.params.label == ( "Content") || props.control.params.label == ( "Title" ) || props.control.params.label == ( "Link Hover" ) || props.control.params.label == ( "Link" ) || props.control.params.label == ( "Background Color" ) || props.control.params.label == ( "Color" ) || props.control.params.label == ( "Icon Color" ) || props.control.params.label == ( "Hover Color" ) || props.control.params.label == ( "Link Active / Hover Color" ) || props.control.params.label == ( "Site Title Color" ) || props.control.params.label == ( "Background Overlay" ) ) && (props.control.container[0].getAttribute('paletteindex') && props.control.container[0].getAttribute('paletteindex') == e.detail.index ) ){
				var current_color = e.detail.newcolor;	
			}else{
				return
			}
			
		}
		updateValues(current_color,"desktop")
	}

	document.addEventListener( 'colorpaletteglobal', updatePaletteState, false );

	var globalPalette = props.customizer.control('astra-settings[global-color-palette]').setting.get()

	const handleGlobalColorPopupBtn = (value,index,defaultset,color,key) => {
		updatepaletteuse(value,index,defaultset);		
		updateValues(color,key);
	}

	const toggleClose = () => {
		setPropsValue(prevState => ({
			...prevState,
			isVisible: !props_value.isVisible
		}));
	};

	const renderGlobalPalette = () =>{
		return (
		<div className="ast-global-color-btn-wrap">
				<button	className="ast-global-color-btn components-button is-secondary" 
				onClick={e => {
					e.preventDefault();
					setPropsValue(prevState => ({
						...prevState,
						isVisible: !props_value.isVisible
					}));
				}}>
					<Dashicon icon='admin-site-alt3' style={{
						width: 14,
						height: 14,
						fontSize: 14
					}}/>
				</button>
				{ props_value.isVisible && (
					<Popover position={"bottom center"} onClose={ toggleClose } className="ast-global-palette-popup">
						<label className="ast-global-color-palette-manage-label">Global Colors</label>
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
									<div className={value['desktop'] == globalPalette.pattern1[item][0] ? 'ast-global-color-sticker selected' : 'ast-global-color-sticker' }
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
			container ={props.control.container[0]}
			disablePalette={true}
			/>;
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
				{renderGlobalPalette()}
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
