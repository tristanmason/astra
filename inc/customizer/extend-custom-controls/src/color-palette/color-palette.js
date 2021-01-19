import PropTypes, { array } from 'prop-types';

import AstraColorPickerControl from '../common/astra-color-picker-control';

import testJSON from '../common/astra-common-function'; 

import {useState} from 'react';

import { Dashicon,RadioControl,Button,Popover,TabPanel,TextareaControl,ClipboardButton,TextControl } from '@wordpress/components';
import { Fragment } from 'react';

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
		var prevcolor = obj[obj.patterntype][index][0]
		
	
		let respectivePalette = {
			...obj[obj.patterntype]
		}
		
		let respectivePalette_index = {
			...respectivePalette[index]
		}
		
		respectivePalette_index= value
		respectivePalette[index][0] = respectivePalette_index
		obj[patterntype] = respectivePalette

		var newcolor = obj[obj.patterntype][index][0]
				
		setState(obj)
		props.control.setting.set( obj );		
		
		var passGlobalPalette = new CustomEvent( "colorpaletteglobal", 
				{ 
					"detail":{"palette":obj,"index":index,"prevcolor":prevcolor,"newcolor":newcolor}
				} 
			);
		document.dispatchEvent(passGlobalPalette);

	};

	const editLabel = (value,index) => {
		

		let obj = {
			...state
		};

		let respectivePalette = {
			...obj[obj.patterntype]
		}
		
		let respectivePalette_index = {
			...respectivePalette[index]
		}
		
		respectivePalette_index= value
		respectivePalette[index][1] = respectivePalette_index
		obj[obj.patterntype] = respectivePalette

		setState(obj)
		props.control.setting.set( obj );		

	}

	const addNewColorToPalette = () => {
		
		var new_color_array = [ "#ffffff", "Custom Color" ];

		
		let obj = {
			...state
		};

		let respectivePalette = {
			...obj[obj.patterntype]
		}
		respectivePalette[Object.keys(respectivePalette).length] = new_color_array
		
		obj[obj.patterntype] = respectivePalette
		
		setState(obj)	
		props.control.setting.set( obj );

	}

	const deleteCustomPalette = (index,item) => {
		let obj = {
			...state
		}

		var result = Object.keys(obj.pattern1).map((key) => obj.pattern1[key]);
		const filteredItems = result.slice(0, index).concat(result.slice(index + 1, result.length))	
		obj.pattern1 = filteredItems;
		
		setState(obj)	
		props.control.setting.set( obj );

	}

	var patternhtml = (
		<>
			<div className="ast-color-palette1-wrap">
				{ Object.keys(state.pattern1).map((item,index)=>{
					return (
						<div className={`ast-color-picker-palette-${index+1} `} key={index}>
							<TextControl
								className="ast-color-palette-label"
								value={ state.pattern1[index][1] }
								onChange={ ( value ) => editLabel(value,index) }
							/>
							<Button className='astra-palette-delete' 							
							disabled ={(index <= 4) ? true :false }
							onClick={ () => { deleteCustomPalette(index,item) } } >
								<Dashicon icon="trash" />
							</Button>
							<AstraColorPickerControl
								color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[index][0] : ''}
								onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',index)}
								backgroundType = { 'color' }
								allowGradient={ false }
								allowImage={ false }		
								disablePalette={true}			
							/>
						</div>
					)
				}) }
				<Button className='astra-add-new-color'  isPrimary onClick={ () => addNewColorToPalette() }>
					<Dashicon icon="plus" /> Add New Color
				</Button>	

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
		document.documentElement.style.setProperty('--global-palette' + index, item[0] );		
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
	
	const exportCopied = (item) => {
		setState(prevState => ({
			...prevState,
			exportCopied: item
		}));
	};

	const exportCopiedComplete = () => {
		setState(prevState => ({
			...prevState,
			exportCopied: ''
		}));
	};


	const deletePalette = (index,item) => {
		
		let obj = {
			...state
		}

		const filteredItems = obj.presetPalette.slice(0, index).concat(obj.presetPalette.slice(index + 1, obj.presetPalette.length))

		obj.presetPalette = filteredItems;
		
		setState(obj)	
		props.control.setting.set( obj );

	};

	const addToPalettePopup = () => {
		let obj = {
			...state
		}

		obj.presetPalette.push(obj[obj.patterntype]); //Keep copy of imported palette.
		
		setState(obj)	
		props.control.setting.set( obj );

	}

	return <>
		
		<label className="customizer-text">
			{ labelHtml }
		</label>
		{renderOperationButtons()}
		
		<div className="ast-color-palette-wrapper">	
			{ patternhtml }
			{/* <Button className='astra-add-to-palette-popup'  onClick={ () => addToPalettePopup() } label="Allows you to add this in presets." showTooltip={true}>
				<Dashicon icon="insert" />
			</Button> */}
		</div>		
		<input type="hidden" data-palette={JSON.stringify(state[state.patterntype])} id="ast-color-palette-hidden"/>
		
		<div className='astra-palette-import-wrap'>
			<Button className='astra-palette-import'  onClick={ () => { state.isVisible ? toggleClose() : toggleVisible() } }>
				{/* <Dashicon icon="open-folder" /> */}
				 <Dashicon icon="open-folder" /> Presets
			</Button>
			{ state.isVisible && (
                <Popover position={"bottom center"} onClose={ toggleClose } className="astra-global-palette-import">
                   <TabPanel className="astra-palette-popover-tabs"
						activeClass="active-tab"
						initialTabName={ 'import'}
						tabs={ [
							{
								name: 'import',
								title: __( 'Select a palette', 'astra' ),
								className: 'astra-color-presets palette-popupbutton',
							},
							{
								name: 'custom',
								title: __( 'Import', 'astra' ),
								className: 'astra-import palette-popupbutton',
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
														<div key={index}>
															<Button
																className='astra-palette-item'
																onClick={ () => handlePresetPalette( item ) }
																tabIndex={ 0 }
																key={index}
															>
																{ Object.keys( state.presetPalette[item] ).map( ( color, subIndex ) => {
																	return (
																		<div key={ subIndex } style={ {
																			width: 25,
																			height: 25,
																			marginBottom: 0,		
																			transform: 'scale(1)',
																			transition: '100ms transform ease',
																		} } className="astra-palette-individual-item-wrap">
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
															<ClipboardButton
																text={JSON.stringify(state.presetPalette[item])}
																onCopy={ () =>  exportCopied(item) }
																onFinishCopy={ () =>  exportCopiedComplete(item) }
																className='astra-palette-export'
															>
																{ state.exportCopied === item ? <Dashicon icon="yes" /> : <Dashicon icon="admin-page" /> }
															</ClipboardButton>
															
															<Button className='astra-palette-delete'  onClick={ () => { deletePalette(index,item) } } key={`delete-${index}`}>
																<Dashicon icon="trash" />
															</Button>
														</div>
															
														)
													} )}
												</>
											);
										} else {
											tabout = (
												<>
													<div >
														<h4>Required Format</h4>
														<p className="palette-format">{`["#733492","#AC238C","#24B460","#C0C2BA","#CBCB38"]`}</p>
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
