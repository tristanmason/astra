import PropTypes from 'prop-types';

import {Fragment} from '@wordpress/element';

import AstraColorPickerControl from '../common/astra-color-picker-control';

import {useState} from 'react';


const ColorPaletteComponent = props => {
// console.log(props);
	let value = props.control.setting.get();

	let defaultValue = props.control.params.default;

	const {		
		label,
		description
	} = props.control.params;

	const [state, setState] = (value) ? useState(props.control.setting.get()) : useState({
		pattern1: [
			
			{  color: "#3b9e3b" },
			{  color: "#a74848"	},
			{  color: "#eeee22"	},
			{  color: "#1e73be"	},
			{  color: "#8224e3"	},
			
		   ],
		pattern2: [
		
			{  color: "blue" },
			{  color: "red"	},
			{  color: "black"	},
			{  color: "orange"	},
			{  color: "yellow"	},
		
		]

	});
		// const [state, setState] = useState({
		// 	pattern1: [
				
		// 		{  color: "#3b9e3b" },
		// 		{  color: "#a74848"	},
		// 		{  color: "#eeee22"	},
		// 		{  color: "#1e73be"	},
		// 		{  color: "#8224e3"	},
				
		// 	   ],
		// 	pattern2: [
			
		// 	{  palette1: "blue" },
		// 	{  palette2: "red"	},
		// 	{  palette3: "black"	},
		// 	{  palette4: "orange"	},
		// 	{  palette5: "yellow"	},
			
		// 	]
	
		// });
	

	let labelHtml = null;
	let descriptionHtml = null;

	
// console.log(state.pattern1[0]['palette1']);
	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}
	// console.log(props);

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

		if (patterntype == "pattern1") {
			
			let pattern1 = {
				...obj.pattern1
			}
			let pattern1_index = {
				...pattern1[index]
			}
			
			pattern1_index['color']= value
			pattern1[index] = pattern1_index
			obj['pattern1'] = pattern1
		}else if(patterntype == "pattern2"){
			let pattern2 = {
				...obj.pattern2
			}
			let pattern2_index = {
				...pattern2[index]
			}
			
			pattern2_index['color']= value
			pattern2[index] = pattern2_index
			obj['pattern2'] = pattern2
		}
		
		setState(obj)
		props.control.setting.set( obj );
	};
console.log(state);
	var palettehtml = (
		<Fragment>		
			<div className="ast-color-palette1-wrap">
				<div className="ast-color-picker-palette-1 ast-color-palette-inline" >
					<AstraColorPickerControl
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[0]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',0)}
						backgroundType = { 'color' }
						allowGradient={ false }
						allowImage={ false }					
					/>
				</div>
				<div className="ast-color-picker-palette-2 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[1]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',1)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}					
					/>
				</div>
				<div className="ast-color-picker-palette-3 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[2]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',2)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}					
					/>
				</div>
				<div className="ast-color-picker-palette-4 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ? state.pattern1[3]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',3)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
					/>
				</div>
				<div className="ast-color-picker-palette-5 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern1 && state.pattern1 ?  state.pattern1[4]['color']  : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern1',4)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
					/>
				</div>
			</div>
			
			<div className="ast-color-palette2-wrap">
				<div className="ast-color-picker-palette-1 ast-color-palette-inline" >
					<AstraColorPickerControl
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[0]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',0)}
						backgroundType = { 'color' }
						allowGradient={ false }
						allowImage={ false }					
					/>
				</div>
				<div className="ast-color-picker-palette-2 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[1]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',1)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}					
					/>
				</div>
				<div className="ast-color-picker-palette-3 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[2]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',2)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}					
					/>
				</div>
				<div className="ast-color-picker-palette-4 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ? state.pattern2[3]['color'] : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',3)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
					/>
				</div>
				<div className="ast-color-picker-palette-5 ast-color-palette-inline" >
					<AstraColorPickerControl 
						color={undefined !== state.pattern2 && state.pattern2 ?  state.pattern2[4]['color']  : ''}
						onChangeComplete={(color, backgroundType) => handleChangeComplete(color,'pattern2',4)}
						backgroundType={'color'}
						allowGradient={false}
						allowImage={false}
					/>
				</div>
			</div>
			
		</Fragment>
	)
	return <Fragment>
		
		<label className="customizer-text">
			{ labelHtml }
		</label>
		<div>
			{ palettehtml }
		</div>
		<label>
			{ descriptionHtml }	
		</label>
	</Fragment>;
};

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ColorPaletteComponent );
