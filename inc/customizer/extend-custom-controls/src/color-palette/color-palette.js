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

		const newItems = updateState.palettes[currentPalette].map(
			(palette, colorIndex) => {
				if (parseInt(index) === parseInt(colorIndex)) {
					palette = value;
				}

				return palette;
			}
		);

		updateState.palettes[currentPalette] = newItems;

		setState(updateState);
		props.control.setting.set({ ...updateState, flag: !updateState.flag });

		// If color is from selected palette, set color value in selected palette option also.
		if (updateState.currentPalette === currentPalette) {
			const selectedPalette = props.customizer
				.control("astra-settings[selected-color-palette]")
				.setting.get();
			const modifiedPalette = Object.assign([], selectedPalette, {
				[index]: value,
			});

			props.customizer
				.control("astra-settings[selected-color-palette]")
				.setting.set(modifiedPalette);
		}
	};

	const onPaletteChange = (key) => {
		let updateState = {
			...state,
		};

		updateState.currentPalette = key;
		setState(updateState);
		props.control.setting.set({ ...updateState, flag: !updateState.flag });
	};

	var palettehtml = (
		<>
			{Object.entries(state.palettes).map(
				([palette_key, paletteColorObj]) => {
					return (
						<div
							key={palette_key}
							className={`ast-color-picker-${palette_key} ast-single-palette-wrap`}
						>
							<label
								onClick={() => {
									onPaletteChange(palette_key);
								}}
							>
								<input
									type="radio"
									className="ast-palette-radio-input"
									value={palette_key}
									checked={
										state.currentPalette === palette_key
									}
									onChange={() => {}}
									name="ast-color-palette-radio-input"
								/>

								<div className="ast-single-palette-color-group">
									{Object.entries(
										state.palettes[palette_key]
									).map(([key, value]) => {
										return (
											<div
												className="ast-color-picker-wrap"
												key={key}
											>
												<AstraColorPickerControl
													color={
														state.palettes[palette_key][
															key
														]
													}
													onChangeComplete={(color) =>
														handleChangeComplete(
															key,
															color,
															palette_key
														)
													}
													backgroundType={"color"}
													allowGradient={false}
													allowImage={false}
												/>
											</div>
										);
									})}
								</div>
							</label>
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

export default React.memo(ColorPaletteComponent);
