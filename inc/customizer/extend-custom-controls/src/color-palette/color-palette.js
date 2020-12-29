import PropTypes from 'prop-types';

import {Fragment} from '@wordpress/element';

import AstraColorPickerControl from '../common/astra-color-picker-control';


import {useState} from 'react';

import { SelectControl,Dashicon,RadioControl } from '@wordpress/components';



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
		<p>
			{ descriptionHtml }	
		</p>
	</Fragment>;
};

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ColorPaletteComponent );
