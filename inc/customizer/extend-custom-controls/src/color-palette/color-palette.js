import PropTypes from 'prop-types';

import {Fragment} from '@wordpress/element';

import AstraColorPickerControl from '../common/astra-color-picker-control';

const { __ } = wp.i18n;

import {useState} from 'react';

import { SelectControl,Dashicon,RadioControl,Button,Popover,TabPanel,TextareaControl } from '@wordpress/components';



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
		

		if (patterntype == "pattern1") {
			
			let pattern1 = {
				...obj.pattern1
			}
			let pattern1_index = {
				...pattern1[index]
			}
			
			pattern1_index= value
			pattern1[index] = pattern1_index
			obj['pattern1'] = pattern1
		}else if(patterntype == "pattern2"){
			let pattern2 = {
				...obj.pattern2
			}
			let pattern2_index = {
				...pattern2[index]
			}
			
			pattern2_index= value
			pattern2[index] = pattern2_index
			obj['pattern2'] = pattern2
		}
		var newcolor = obj[obj.patterntype][index]
		
		
		
		setState(obj)
		props.control.setting.set( obj );		
		
		var passglobalpalette = new CustomEvent( "colorpaletteglobal", 
				{ 
					"detail":{"palette":obj,"index":index,"prevcolor":prevcolor,"newcolor":newcolor}
				} 
			);
		document.dispatchEvent(passglobalpalette);

		
	};

	var pattern1html = (
		<Fragment>		
			<div className="ast-color-palette1-wrap">
				<div className="ast-color-picker-palette-1 ast-color-palette-inline" title="Text Color">
					<AstraColorPickerControl
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[0] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',0)}
						backgroundType = { 'color' }
						allowGradient={ false }
						allowImage={ false }	
						disablePalette = { true }										
					/>
				</div>
				<div className="ast-color-picker-palette-2 ast-color-palette-inline" title="Theme Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[1] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',1)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}		
						disablePalette = { true }
					/>
				</div>
				<div className="ast-color-picker-palette-3 ast-color-palette-inline" title="Link Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[2] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',2)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
						disablePalette = { true }
					/>
				</div>
				<div className="ast-color-picker-palette-4 ast-color-palette-inline" title="Link Hover Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[3] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',3)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
						disablePalette = { true }
					/>
				</div>
				<div className="ast-color-picker-palette-5 ast-color-palette-inline" title="Custom Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ?  state.pattern1[4]  : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',4)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
						disablePalette = { true }
					/>
				</div>
			</div>
		</Fragment>
	)

	var pattern2html = (
		<div className="ast-color-palette2-wrap">			
		
				<div className="ast-color-picker-palette-1 ast-color-palette-inline" title="Text Color">
					<AstraColorPickerControl
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[0] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',0)}
						backgroundType = { 'color' }
						allowGradient={ false }
						allowImage={ false }					
					/>
				</div>
				<div className="ast-color-picker-palette-2 ast-color-palette-inline" title="Theme Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[1] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',1)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}					
					/>
				</div>
				<div className="ast-color-picker-palette-3 ast-color-palette-inline" title="Link Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[2] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',2)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}					
					/>
				</div>
				<div className="ast-color-picker-palette-4 ast-color-palette-inline" title="Link Hover Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[3] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',3)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
					/>
				</div>
				<div className="ast-color-picker-palette-5 ast-color-palette-inline" title="Custom Color">
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ?  state.pattern2[4]  : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',4)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
					/>
				</div>
		</div>
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
		function testJSON(text) { 
            if (typeof text !== "string") { 
                return false; 
            } 
            try { 
                JSON.parse(text); 
                return true; 
            } catch (error) { 
                return false; 
            } 
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
	
	return <Fragment>
		
		<label className="customizer-text">
			{ labelHtml }
		</label>
		{renderOperationButtons()}
		
		<div className="ast-color-palette-wrapper">			
			{	pattern1html }
			{	pattern2html }
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
		{/* <p>
			{ descriptionHtml }	
		</p> */}
		<div className={'astra-palette-import-wrap'}>
			<Button className={ 'astra-palette-import' } onClick={ () => { state.isVisible ? toggleClose() : toggleVisible() } }>
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
								className: 'astra-export-import',
							}
						] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'import' === tab.name ) {
											tabout = (
												<Fragment>
													{ Object.keys( state.presetPalette ).map( ( item, index ) => { 
														
														return ( 
															<Button
																className={ 'astra-palette-item' }
																style={ {
																	height: '100%',
																	width: '100%',
																} }
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
																				className={ 'astra-palette-item' }
																				style={ {
																					height: '100%',
																					display: 'block',
																					width: '100%',
																					border: '1px solid #929ba4',
																					color: `${ state.presetPalette[item][color] }`,
																					borderRadius: '4px',								
																					boxShadow: `inset 0 0 0 ${ 30 / 2 }px`,
																					transition: '100ms box-shadow ease',
																				} }
																				>
																			</span>
																		</div>
																	)
																} ) }
															</Button>
														)
													} )}
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<div >
														<h4>Required Format</h4>
														<p className="palette-format">{`{"0":"#dc4040","1":"#0274be","2":"#0274b2","3":"#3a3a31","4":"#fffff3"}`}</p>
													</div>	
													<TextareaControl
														label="Import color set from text data."
														help="Follow format from export above."
														value={ state.customImportText }
														onChange={ ( text ) => addcustomImportText(text) }
													/>
													{ state.importError && (
														<p style={{color:'red'}}>{ __( 'Error with Import data', 'astra') }</p>
													) }
													<Button
														className={ 'astra-import-button' }
														isPrimary
														disabled={ state.customImportText ? false : true }
														onClick={ () => handleTextImport() }
													>
														{ __('Import', 'astra' ) }
													</Button>
												</Fragment>
												
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
	</Fragment>;
};

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ColorPaletteComponent );
