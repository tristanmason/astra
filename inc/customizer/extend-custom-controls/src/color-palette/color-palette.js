import PropTypes from "prop-types";
import AstraColorPickerControl from "../common/astra-color-picker-control";
import { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";

const ColorPaletteComponent = (props) => {
	const value = props.control.setting.get();
	const defaultValue = props.control.params.default;
	let labelHtml = null;
	const { label } = props.control.params;

	const [state, setState] = value ? useState(value) : useState(defaultValue);

	useEffect(() => {
		// If settings are changed externally.
		if (state !== value) {
			setState(value);
		}
	}, [props]);

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}

	const handleChangeComplete = (colorIndex, color) => {
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

		updateState.palette[colorIndex] = value;

		setState(updateState);
		props.control.setting.set({ ...updateState, flag: !props.control.setting.get().flag });
	};

	var palettehtml = (
		<>
			<div className="ast-single-palette-wrap">
				<div className="ast-single-palette-color-group">
					{Object.entries(state.palette).map(
						([palette_key, color]) => {
							return (
								<div
									className="ast-color-picker-wrap"
									key={palette_key}
								>
									<AstraColorPickerControl
										color={state.palette[palette_key]}
										onChangeComplete={(color) =>
											handleChangeComplete(
												palette_key,
												color
											)
										}
										backgroundType={"color"}
										allowGradient={false}
										allowImage={false}
										disablePalette={true}
									/>
								</div>
							);
						}
					)}
				</div>
			</div>
		</>
	);

	const updatePaletteVariables = (e) => {
		props.control.setPaletteVariables(e.detail.data.palette);
	};

	document.addEventListener(
		"AstPaletteUpdated",
		updatePaletteVariables,
		false
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

export default React.memo(ColorPaletteComponent);
