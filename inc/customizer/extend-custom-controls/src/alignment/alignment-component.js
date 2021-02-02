import PropTypes from 'prop-types';
import {useState} from 'react';
import { Button } from '@wordpress/components';
import {__} from '@wordpress/i18n';

const AlignmentComponent = props => {

	const [props_value, setPropsValue] = useState(props.control.setting.get());

	const Icons = window.svgIcons;

	const onValueChange = ( value, device='' ) => {
		let updateState = {
			...props_value
        };
        if ( '' !== device ) {
            updateState[device] = value;
        } else {
            updateState = value;
        }
        
		props.control.setting.set(updateState);
		setPropsValue(updateState);
	};

	const renderInputHtml = ( device, active = '', resp = true ) => {
		
		const {
			choices
		} = props.control.params;

		if ( ! choices ) {
			return;
		}

		if ( false === resp ) {

			let optionsHtml = Object.entries( choices ).map( ( [value, icon] ) => {
				
				let html = (
					<div className="ast-alignmet-inner-wrap active" key={ value }>
						<Button
							key={ value }
							onClick={ () => onValueChange( value ) }
							aria-pressed = { value === props_value }
							isPrimary = { value === props_value }
						>
							<span className="ahfb-icon-set" 
								dangerouslySetInnerHTML={ { __html: Icons[ icon ]  } }
							></span>
						</Button>
					</div>
				);

				return html;
			} );

			return optionsHtml;
		}

		let optionsHtml = Object.entries( choices ).map( ( [value, icon] ) => {
				
			let html = (
				<div className={ `ast-alignment-inner-wrap ast-alignment-responsive ${device} ${active}` } key={ value } >
					<Button
						key={ value }
						onClick={ () => onValueChange( value, device ) }
						aria-pressed = { value === props_value[device] }
						isPrimary = { value === props_value[device] }
					>
						<span className="ahfb-icon-set" 
							dangerouslySetInnerHTML={ { __html: Icons[ icon ]  } }
						></span>
					</Button>
				</div>
			);

			return html;
		} );

		return optionsHtml;
	};

	const {
		description,
		label,
		responsive
	} = props.control.params;
	let labelHtml = null;
	let responsiveHtml = null;
	let descriptionHtml = null;
	let inputHtml = null;

	let responsive_flag = ( false === responsive ) ? false : true ;

	if (label) {
		labelHtml = <span className="customize-control-title">{label}</span>;

		if (responsive_flag) {
			responsiveHtml = <ul key={'ast-resp-ul'} className="ast-responsive-btns">
				<li key={'desktop'} className="desktop active">
					<button type="button" className="preview-desktop" data-device="desktop">
						<i className="dashicons dashicons-desktop"></i>
					</button>
				</li>
				<li key={'tablet'} className="tablet">
					<button type="button" className="preview-tablet" data-device="tablet">
						<i className="dashicons dashicons-tablet"></i>
					</button>
				</li>
				<li key={'mobile'} className="mobile">
					<button type="button" className="preview-mobile" data-device="mobile">
						<i className="dashicons dashicons-smartphone"></i>
					</button>
				</li>
			</ul>;
		}
	}

	if (description) {
		descriptionHtml = <span className="description customize-control-description">{description}</span>;
	}

	if (responsive_flag) {
		inputHtml = <>
			{renderInputHtml('desktop', 'active')}
			{renderInputHtml('tablet')}
			{renderInputHtml('mobile')}
		</>;
	} else {
		inputHtml = <>
			{renderInputHtml('desktop', 'active', false)}
		</>;
	}

	return <label key={'customizer-text'} className="customizer-text">
		{labelHtml}
		{responsiveHtml}
		{descriptionHtml}
		<div className="input-wrapper ast-alignment-wrapper">
			{inputHtml}
		</div>
	</label>;

};

AlignmentComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( AlignmentComponent );
