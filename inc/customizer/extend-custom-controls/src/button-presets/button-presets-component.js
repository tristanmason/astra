import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "react";

const ButtonPresetsComponent = (props) => {
	const { title, options } = props.control.params;

	let value = props.control.setting.get();

	useEffect(() => {}, []);

	const onChangePreset = (presetKey) => {
		let borderRadius = options[presetKey]["border-radius"];
		let btnBackgroundColor = options[presetKey]["button-bg-color"];
		let btnColor = options[presetKey]["button-color"];

		props.customizer
			.control("astra-settings[button-radius]")
			.setting.set(borderRadius);

		props.customizer
			.control("astra-settings[button-bg-color]")
			.setting.set(btnBackgroundColor);

		props.customizer
			.control("astra-settings[button-color]")
			.setting.set(btnColor);
	};

	const renderBtnPresetHtml = () => {
		let htmlContent = Object.entries(options).map(([key, value]) => {
			const btnStyle = {
				borderRadius: value["border-radius"],
				backgroundColor: value["button-bg-color"],
				color: value["button-color"],
				paddingTop: value["button-padding"]["desktop"]["top"],
				paddingRight: value["button-padding"]["desktop"]["right"],
				paddingBottom: value["button-padding"]["desktop"]["bottom"],
				paddingLeft: value["button-padding"]["desktop"]["left"],
			};

			return (
				<div className="ast-btn-style-item">
					<button
						className="btn"
						style={btnStyle}
						type="button"
						onClick={() => onChangePreset(key)}
					>
						Button
					</button>
				</div>
			);
		});

		return htmlContent;
	};

	return (
		<>
			<label>
				<span className="customize-control-title">{title}</span>
			</label>

			<div className="ast-btn-preset-wrap">{renderBtnPresetHtml()}</div>
		</>
	);
};

ButtonPresetsComponent.propTypes = {
	control: PropTypes.object.isRequired,
};

export default React.memo(ButtonPresetsComponent);
