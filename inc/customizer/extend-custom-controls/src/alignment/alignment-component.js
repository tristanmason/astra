import PropTypes from 'prop-types';
import {useState} from 'react';
import { IconButton } from '@wordpress/components';
import {__} from '@wordpress/i18n';

const AlignmentComponent = props => {

	const [props_value, setPropsValue] = useState(props.control.setting.get());
	
	const onAlignChange = ( value, device='' ) => {
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
		
		if ( false === resp ) {

			props_value_new = props_value.replace( "align-", "" );

			if ( props_value_new !== props_value ) {

				onAlignChange( props_value_new );
			}
			
			return <div className="ast-alignmet-inner-wrap active">
                <IconButton
                    key={ "left" }
                    icon="editor-alignleft"
                    label="Left"
                    onClick={ () => onAlignChange( 'left' ) }
                    aria-pressed = { "left" === props_value }
                    isPrimary = { "left" === props_value }
                />
                <IconButton
                    key={ "center" }
                    icon="editor-aligncenter"
                    label="Center"
                    onClick={ () => onAlignChange( 'center' ) }
                    aria-pressed = { "center" === props_value }
                    isPrimary = { "center" === props_value }
                />
                <IconButton
                    key={ "right" }
                    icon="editor-alignright"
                    label="Right"
                    onClick={ () => onAlignChange( 'right' ) }
                    aria-pressed = { "right" === props_value }
                    isPrimary = { "right" === props_value }
                />
			</div>;
		}

		props_value_new = props_value[device].replace( "align-", "" );

		if ( props_value_new !== props_value[device] ) {
			
			onAlignChange( props_value_new );
		}

		return <div className={ `ast-alignment-inner-wrap ast-alignment-responsive ${device} ${active}` }>
            <IconButton
                key={ "left" }
                icon="editor-alignleft"
                label="Left"
                onClick={ () => onAlignChange( 'left', device ) }
                aria-pressed = { "left" === props_value[device] }
                isPrimary = { "left" === props_value[device] }
            />
            <IconButton
                key={ "center" }
                icon="editor-aligncenter"
                label="Center"
                onClick={ () => onAlignChange( 'center', device ) }
                aria-pressed = { "center" === props_value[device] }
                isPrimary = { "center" === props_value[device] }
            />
            <IconButton
                key={ "right" }
                icon="editor-alignright"
                label="Right"
                onClick={ () => onAlignChange( 'right', device ) }
                aria-pressed = { "right" === props_value[device] }
                isPrimary = { "right" === props_value[device] }
            />
		</div>;
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
