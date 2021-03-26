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

	const handleChangeComplete = (color, index) => {
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

		const newItems = updateState.palette.map((item, thisIndex) => {
			if (parseInt(index) === parseInt(thisIndex)) {
				item.color = value;
			}

			return item;
		});

		updateState.palette = newItems;

		setState(updateState);
		props.control.setting.set({ ...updateState, flag: !updateState.flag });
	};

	const SinglePalette = ({ singlePalette }) => {
		const singlePaletteHTML = Object.entries(singlePalette).map(
			([key, value]) => {
				return (
					<div className="ast-color-picker-wrap" key={key}>
						<AstraColorPickerControl
							color={value}
							onChangeComplete={(value) =>
								handleChangeComplete(key, color)
							}
							backgroundType="color"
						/>
					</div>
				);
			}
		);

		return singlePaletteHTML;
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
							<label>
							<input type="radio" className="ast-palette-radio-input"/>
							{palette_label}
							</label>
							<SinglePalette singlePalette={palette_color_obj} />
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
