import PropTypes, { object } from "prop-types";
import AstraColorPickerControl from "../common/astra-color-picker-control";
import { useEffect, useState } from "react";
import { Dashicon, Button, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const ColorPaletteComponent = (props) => {
	let value = props.control.setting.get();
	let defaultValue = props.control.params.default;
	let labelHtml = null;
	const { label } = props.control.params;

	const [state, setState] = value
		? useState(props.control.setting.get())
		: useState(defaultValue);

	useEffect(() => {
		// If settings are changed externally.
		if (state !== value) {
			setState(value);
		}
	}, [props]);

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}

	const handleChangeComplete = (index, color, currentPalette) => {
		let updateState = {
			...state,
		};

		let value;

		if (typeof color === "string") {
			value = color;
		} else if (
			undefined !== color.rgb &&
			undefined !== color.rgb.a &&
			1 !== color.rgb.a
		) {
			value = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
		} else {
			value = color.hex;
		}

		Object.entries( updateState.palettes ).map(item => {
			var temp = Object.assign({}, item);

			if( temp[0] == currentPalette ) {
				temp[1][index] = value;
			}

			return temp;
		});

		setState( updateState );
		props.control.setting.set({ ...updateState, flag: !updateState.flag });

		// If color is from selected palette, set color value in selected palette option also.
		if( updateState.current_palette === currentPalette ) {

			const sel_palettes = props.customizer.control( 'astra-settings[selected-color-palette]' ).setting.get();
			const modifiedPalette = Object.assign({}, sel_palettes, {[index]: value});

			props.customizer.control( 'astra-settings[selected-color-palette]' ).setting.set( modifiedPalette );
		}

	};

	const SinglePalette = ({ singlePalette, currentPalette }) => {
		const singlePaletteHTML = Object.entries(singlePalette).map(
			([key, value]) => {
				return (
					<div className="ast-color-picker-wrap" key={key}>
						<AstraColorPickerControl
							color={value}
							onChangeComplete={(color) =>
								handleChangeComplete(key, color, currentPalette)
							}
							backgroundType={'color'}
							allowGradient={false}
							allowImage={false}
						/>
					</div>
				);
			}
		);

		return singlePaletteHTML;
	};

	const onPaletteChange = (key) => {

		let updateState = {
			...state,
		};

		updateState.current_palette = key;
		setState( updateState );
		props.control.setting.set({ ...updateState, flag: !updateState.flag });
	};

	var palettehtml = (
		<>
			{Object.entries(state.palettes).map(
				([palette_key, palette_color_obj]) => {

					let palette_label = (
						palette_key[0].toUpperCase() + palette_key.substring(1)
					).replace(/-/g, " ");
					return (
						<div
							key={palette_key}
							className={`ast-color-picker-${palette_key} ast-single-palette-wrap`}
						>
							<label
								onClick={() => {
									onPaletteChange( palette_key )
							}}>
								<input
									type="radio"
									className="ast-palette-radio-input"
									value={palette_key}
									checked={state.current_palette === palette_key}
									onChange={() => {}}
									name="ast-color-palette-radio-input"
								/>
								{palette_label}
							</label>
							<div className="ast-single-palette-color-group" >
							<SinglePalette
								currentPalette={palette_key}
								singlePalette={palette_color_obj}
							/>
							</div>
						</div>
					);
				}
			)}
		</>
	);

	return (
		<>
			<label className="customizer-text">{labelHtml}</label>
			<div className="ast-color-palette-wrapper">{palettehtml}</div>
		</>
	);
};

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired,
};

export default ColorPaletteComponent;
