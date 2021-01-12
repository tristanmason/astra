import PropTypes from 'prop-types';

import AstraColorPickerControl from '../common/astra-color-picker-control';

import testJSON from '../common/astra-common-function'; 

import {useState} from 'react';

import { Dashicon,RadioControl,Button,Popover,TabPanel,TextareaControl } from '@wordpress/components';

const { __ } = wp.i18n;


const ColorPaletteComponent = props => {

	let value = props.control.setting.get();

	let defaultValue = props.control.params.default;

	const {		
		label,
		description
	} = props.control.params;

	const [state, setState] = (value) ? useState(props.control.setting.get()) : useState(defaultValue);
	

	let labelHtml = null;
	let descriptionHtml = null;

	

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}

	const handleRadioChange = (value) => {
		let obj = {
			...state
		};
		obj['patterntype'] = value
		setState(obj)
		props.control.setting.set( obj );

		var event = new CustomEvent( "colorpaletteglobal", 
				{ 
					"detail":{"palette":obj,"radiochange":"true",}
				} 
			);
			
		document.dispatchEvent(event);
	}
	const handleChangeComplete = ( color,patterntype,index ) => {
		let value;
		
		
		if (typeof color === 'string' || color instanceof String) {
			value = color;
		} else if (undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a) {
			value = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			value = color.hex;
		}
		
		updateValues(value,patterntype,index);
	};

	const updateValues = (value,patterntype,index) => {
		let obj = {
			...state
		};
		var prevcolor = obj[obj.patterntype][index]
		
	
		let respectivePalette = {
			...obj[obj.patterntype]
		}
		
		let respectivePalette_index = {
			...respectivePalette[index]
		}
		
		respectivePalette_index= value
		respectivePalette[index] = respectivePalette_index
		obj[patterntype] = respectivePalette

		var newcolor = obj[obj.patterntype][index]
				
		setState(obj)
		props.control.setting.set( obj );		
		
		var passGlobalPalette = new CustomEvent( "colorpaletteglobal", 
				{ 
					"detail":{"palette":obj,"index":index,"prevcolor":prevcolor,"newcolor":newcolor}
				} 
			);
		document.dispatchEvent(passGlobalPalette);

	};

	var patternhtml = (
		<>
			<div className="ast-color-palette1-wrap">
				{ Object.keys(state.pattern1).map((item,index)=>{
					return (
						<div className={`ast-color-picker-palette-${index+1} ast-color-palette-inline`} key={index}>
							<AstraColorPickerControl
								color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[index] : ''}
								onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',index)}
								backgroundType = { 'color' }
								allowGradient={ false }
								allowImage={ false }					
							/>
						</div>
					)
				}) }				
			</div>	
			<div className="ast-color-palette2-wrap">			
				{ Object.keys(state.pattern2).map((item,index)=>{
					return (
						<div className={`ast-color-picker-palette-${index+1} ast-color-palette-inline`} key={index}>
							<AstraColorPickerControl
								color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[index] : ''}
								onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',index)}
								backgroundType = { 'color' }
								allowGradient={ false }
								allowImage={ false }					
							/>
						</div>
					)
				}) }
			</div>
		</>
	)

	const renderOperationButtons = () => {
		return <span className="customize-control-title">
				<>
					<div className="ast-color-btn-reset-wrap">
						<button
							className="ast-reset-btn components-button components-circular-option-picker__clear is-secondary is-small"
							disabled={JSON.stringify(state) === JSON.stringify(defaultValue)} onClick={e => {
							e.preventDefault();
							let value = JSON.parse(JSON.stringify(defaultValue));

							if (undefined === value || '' === value) {
								value = '';
								wp.customize.previewer.refresh();
							}

							resetValue(value);
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

	const resetValue = (value) => {		
		setState(value);
		props.control.setting.set(value);
	};

	const htmlpalette = Object.values(state[state.patterntype]).map( ( item, index ) => {
		document.documentElement.style.setProperty('--global-palette' + index, item );		
	} );

	const toggleVisible = () => {
		let obj = {
			...state
		};
		obj['isVisible'] = true
		setState(obj)
	};
	const toggleClose = () => {
		let obj = {
			...state
		};
		obj['isVisible'] = false
		if ( state.isVisible === true ) {
			setState(obj)			
		}
	};
	
	const handlePresetPalette = (item) => {
	
		
		let obj = {
			...state
		}

		let presetPalette = {
			...state.presetPalette
		}

		
		obj[obj.patterntype] = presetPalette[item]		
		obj['importError'] = false
		obj['isVisible'] = false
		obj['customImportText'] = ''

		setState(obj)	
		props.control.setting.set( obj );
		

		var event = new CustomEvent( "colorpaletteglobal", 
			{ 
				"detail":{"palette":obj,"radiochange":"true",}
			} 
		);
		
		document.dispatchEvent(event);

	}


	const addcustomImportText = ( text ) =>{
		let obj = {
			...state
		};
		obj['customImportText'] = text
		setState(obj)		
		
	}

	const handleTextImport = () =>{

		const importText = state.customImportText;

		if ( ! importText ) {
			setState(prevState => ({
				...prevState,
				importError: true
			}));
			return;
		}
		
		
		if ( testJSON(importText) && Object.keys( JSON.parse( importText ) ).length === 5 ) {
			var customImportText = JSON.parse( importText );
	
			let obj = {
				...state
			}
			
			obj[obj.patterntype] = customImportText
			
			obj['importError'] = false
			obj['isVisible'] = false
			obj['customImportText'] = ''

			
			obj.presetPalette.push(customImportText); //Keep copy of imported palette.

			setState(obj)	
			props.control.setting.set( obj );
		

			var event = new CustomEvent( "colorpaletteglobal", 
				{ 
					"detail":{"palette":obj,"radiochange":"true",}
				} 
			);
			
			document.dispatchEvent(event);
		}else{
			setState(prevState => ({
				...prevState,
				importError: true
			}));
		}

	}
	
	return <>
		
		<label className="customizer-text">
			{ labelHtml }
		</label>
		{renderOperationButtons()}
		
		<div className="ast-color-palette-wrapper">	
			{ patternhtml }
		</div>
		<RadioControl       
			selected={ state.patterntype }
			options={ [
				{ label: 'Pattern 1', value: 'pattern1' },
				{ label: 'Pattern 2', value: 'pattern2' },
			] }
			onChange={ value => handleRadioChange(value) }
    	/>
		<input type="hidden" data-palette={JSON.stringify(state[state.patterntype])} id="ast-color-palette-hidden"/>
		
		<div className='astra-palette-import-wrap'>
			<Button className='astra-palette-import'  onClick={ () => { state.isVisible ? toggleClose() : toggleVisible() } }>
				<Dashicon icon="open-folder" />
			</Button>
			{ state.isVisible && (
                <Popover position={"bottom center"} onClose={ toggleClose } className="astra-global-palette-import">
                   <TabPanel className="astra-palette-popover-tabs"
						activeClass="active-tab"
						initialTabName={ 'import'}
						tabs={ [
							{
								name: 'import',
								title: __( 'Select a Color Set', 'astra' ),
								className: 'astra-color-presets',
							},
							{
								name: 'custom',
								title: __( 'Import', 'astra' ),
								className: 'astra-import',
							}
						] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'import' === tab.name ) {
											tabout = (
												<>
													{ Object.keys( state.presetPalette ).map( ( item, index ) => { 
														
														return ( 
															<Button
																className='astra-palette-item'
																onClick={ () => handlePresetPalette( item ) }
																tabIndex={ 0 }
																key={index}
															>
																{ Object.keys( state.presetPalette[item] ).map( ( color, subIndex ) => {
																	return (
																		<div key={ subIndex } style={ {
																			width: 30,
																			height: 30,
																			marginBottom: 0,
																			marginRight: 20,
																			transform: 'scale(1)',
																			transition: '100ms transform ease',
																		} } className="astra-palette-item-wrap">
																			<span
																				className='astra-palette-individual-item'
																				style={ {
																					color: `${ state.presetPalette[item][color] }`,																					
																				} }
																				>
																			</span>
																		</div>
																	)
																} ) }
															</Button>
														)
													} )}
												</>
											);
										} else {
											tabout = (
												<>
													<div >
														<h4>Required Format</h4>
														<p className="palette-format">{`{"0":"#dc4040","1":"#0274be","2":"#0274b2","3":"#3a3a31","4":"#fffff3"}`}</p>
													</div>	
													<TextareaControl
														label="Import color set from text data."
														help="Follow format from above."
														value={ state.customImportText }
														onChange={ ( text ) => addcustomImportText(text) }
													/>
													{ state.importError && (
														<p style={{color:'red'}}>{ __( 'Error with Import data', 'astra') }</p>
													) }
													<Button
														className='astra-import-button'
														isPrimary
														disabled={ state.customImportText ? false : true }
														onClick={ () => handleTextImport() }
													>
														{ __('Import', 'astra' ) }
													</Button>
												</>
												
											);
										}
									}
									return <div>{ tabout }</div>;
								}
							}
					</TabPanel>
                </Popover>
            ) }
		</div>
	</>;
};

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ColorPaletteComponent );
