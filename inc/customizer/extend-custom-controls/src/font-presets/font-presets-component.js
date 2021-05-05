import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import {useState, useEffect} from 'react';

const List = ({ className, options, selected }) => {
    return (
        <ul className={`ast-font-selector ${className}`}>
            {
               Object.entries(options).map(
				([key, item]) => {
                    let bodyFont = item["body-font-family"] || '';
                    let headingFont = item["headings-font-family"] || '';
                    let preview = item["preview"] || '';
                    return (
                        <li
                            className="ast-font-list-item"
                            key={key}
                            active={key == selected ? true : false}
                        >
                            { '' !== preview
                                ?
                                <img src={preview} />
                                :
                                <>
                                    {
                                        headingFont ? <Typography font={headingFont} large>{headingFont}</Typography> : ''}
                                    {bodyFont ? <Typography font={bodyFont}>{bodyFont}</Typography> : ''}
                                </>
                            }
                        </li>
                    )
                }
			)}
        </ul>
    )
}

export const getFontName = (fontName, inheritFont) => {
    if (!fontName) {
        return '';
    }
    let matches = fontName.match(/'([^']+)'/);

    if (matches) {
        return matches[1];
    }

    if (inheritFont) {
        return inheritFont;
    }

    return fontName;
}

const FontPresetsComponent = props => {

	const {
		title,
		options
	} = props.control.params;

	let value = props.control.setting.get();

    useEffect(() => {

    }, []);

    return (
        <>
            <label>
				<span className="customize-control-title" >
				{title}</span>
			</label>

			<List className="ast-font-presets" options={options} selected={value} />

        </>
    )
}

FontPresetsComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( FontPresetsComponent );
