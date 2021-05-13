import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import {useState, useEffect} from 'react';

const ButtonPresetsComponent = props => {

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

        </>
    )
}

ButtonPresetsComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ButtonPresetsComponent );
