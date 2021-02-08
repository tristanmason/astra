import PropTypes from 'prop-types';
import {Button} from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import {__} from '@wordpress/i18n';
import {useEffect, useState} from 'react';

const ResponsiveImage = props => {

    let prop_value = props.control.setting.get();

	const [state, setState] = useState( prop_value );

	const updateValues = (updateState) => {
		setState(updateState);
		props.control.setting.set(updateState);
	};

    const {
		label,
    } = props.control.params;

    let labelHtml = null;
    let responsiveHtml = null;
    let inputHtml = null;

    if (label && '' !== label && undefined !== label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	} else {
		labelHtml = <span className="customize-control-title">{__('Background', 'astra')}</span>;
    }
    
    responsiveHtml = <ul className="ast-image-responsive-btns">
		<li className="desktop active">
			<button type="button" className="preview-desktop" data-device="desktop">
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

    inputHtml = <div className="responsive-image-wrapper">
		<div className="responsive-image-container desktop active">
			{renderSettings('desktop')}
		</div>
		<div className="responsive-image-container mobile">
			{renderSettings('mobile')}
		</div>
	</div>;

	const onSelectImage = (media, device) => {
		let updateState = {...state};
		updateState[device] = media.url;
		updateValues(updateState);
	};
	const onRemoveImage = (device) => {
		let updateState = {...state};
		updateState[device] = '';
		updateValues(updateState);
	};
	
	function renderSettings(device) {
		var media = '';
		var image = undefined !== state[device] && state[device] ? state[device] : '';
		return <>

			{ image &&

			<img src={ image } />
			}

			<MediaUpload
				title={ __( "Select Background Image", 'astra' )  }
				onSelect={ ( media ) =>  onSelectImage( media, device ) }
				allowedTypes={ [ "image" ] }
				value={ ( media && media ? media :  '' ) }
				render={ ( { open } ) => (
					<Button className="upload-button button-add-media" isDefault onClick={ open }>
						{ ( '' === image ) ? __( "Select Image", 'astra' )  : __( "Replace Image", 'astra' )  }
					</Button>
				) }
			/>

			{ image &&
				<>
					<Button className="ast-responsive-img-remove" onClick={() => { onRemoveImage(device); }}>
						{ __( "Remove Image", 'astra' ) }
					</Button>

				</>
			}

		</>;
	};

    return <>   
		<label>
			{labelHtml}
		</label>
		<div className="customize-control-content">
			{responsiveHtml}
			{inputHtml}
		</div>
	</>;
}


ResponsiveImage.propTypes = {
	control: PropTypes.object.isRequired
};

export default React.memo( ResponsiveImage );