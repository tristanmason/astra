import PropTypes from "prop-types";
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

	if (true === label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	}

	const editLabel = (value, index) => {
		let updateState = {
			...state,
		};

		const newItems = updateState.palette.map((item, thisIndex) => {
			if (parseInt(index) === parseInt(thisIndex)) {
				item.label = value;
			}

			return item;
		});

		updateState.palette = newItems;

		setState(updateState);
		props.control.setting.set({ ...updateState, flag: !updateState.flag });
	};

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

	const addNewColorToPalette = () => {};

	var palettehtml = (
		<>
			<div className="ast-color-palette-wrap">
				{Object.keys(state.palette).map((item, index) => {
					return (
						<div
							className={`ast-color-picker-palette-${index + 1} `}
							key={index}
						>
							<TextControl
								className="ast-color-palette-label"
								value={state.palette[index]["label"]}
								onChange={(value) => editLabel(value, index)}
							/>
							<span
								title={
									index <= 4
										? __(
												"This color can't be deleted",
												"astra"
										  )
										: ""
								}
							>
								<Button
									className="ast-palette-delete"
									disabled={index <= 4 ? true : false}
									onClick={() => {
										deleteCustomPalette(index, item);
									}}
								>
									<Dashicon icon="trash" />
								</Button>
							</span>
							<AstraColorPickerControl
								color={
									undefined !== state.palette && state.palette
										? state.palette[index]["color"]
										: ""
								}
								onChangeComplete={(color, backgroundType) =>
									handleChangeComplete(color, index)
								}
								backgroundType={"color"}
								allowGradient={false}
								allowImage={false}
								disablePalette={true}
								colorIndicator={
									undefined !== state.palette && state.palette
										? state.palette[index]["color"]
										: ""
								}
							/>
						</div>
					);
				})}
				<Button
					className="ast-add-new-color"
					isPrimary
					onClick={() => addNewColorToPalette()}
				>
					<Dashicon icon="plus" />
					<span>{__("Add New Color", "astra")}</span>
				</Button>
				<Button
					className="ast-palette-import"
					isPrimary
					onClick={() => {
						state.isVisible ? toggleClose() : toggleVisible();
					}}
				>
					<Dashicon icon="open-folder" /> Presets
				</Button>
			</div>
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
