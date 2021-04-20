import PropTypes from 'prop-types';
import {Fragment} from '@wordpress/element';
import {useState} from 'react';
import {ToggleControl} from '@wordpress/components';

const AstResponsiveToggleControl = props => {

    let htmlTitle = null;
	let responsiveHtml = null;
	let inputHtml = null;

    const [props_value, setPropsValue] = useState(props.control.setting.get());
  
    if (props.control.params.title) {
      htmlTitle = <span className="toggle-control-label">{props.control.params.title}</span>;
      responsiveHtml = <ul key={'ast-resp-ul'} className="ast-responsive-slider-btns">
            <li className="desktop active">
                <button type="button" className="preview-desktop active" data-device="desktop">
                    <i className="dashicons dashicons-desktop"></i>
                </button>
            </li>
            <li className="tablet">
                <button type="button" className="preview-tablet" data-device="tablet">
                    <i className="dashicons dashicons-tablet"></i>
                </button>
            </li>
            <li className="mobile">
                <button type="button" className="preview-mobile" data-device="mobile">
                    <i className="dashicons dashicons-smartphone"></i>
                </button>
            </li>
        </ul>;
    }
  
    const updateValues = (device) => {
        let updateProps = {...props_value};
        updateProps[device] = ! props_value[device];
        setPropsValue( updateProps );
        props.control.setting.set( updateProps );
	};

    const renderInputHtml = (device, active = '') => {

		return <div className={`ast-responsive-toggle-control ${device} ${active}`}>
			<ToggleControl
			label={htmlTitle}
			checked={props_value[device]}
			onChange={() => updateValues(device)}
			/>
		</div>;

	}
	
	inputHtml = <>
		{renderInputHtml('desktop', 'active')}
		{renderInputHtml('tablet')}
		{renderInputHtml('mobile')}
	</>;
  
    return <Fragment>
				<div className="ast-responsive-toggle-control-wrapper">
					{inputHtml}
					{responsiveHtml}
				</div>
            </Fragment>;
}

AstResponsiveToggleControl.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( AstResponsiveToggleControl );