import PropTypes from 'prop-types';
import {Button} from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import {__} from '@wordpress/i18n';
import {useEffect, useState} from 'react';

const ResponsiveImage = props => {
	console.log(props);
    let prop_value = props.control.setting.get();
    
    // const [state, setState] = useState({
    //     value: value,
    // }
	// );
	const [state, setState] = useState( prop_value );
	console.log(state);
	const updateValues = (obj) => {
		setState(prevState => ({
			...prevState,
			value: obj
		}));
		props.control.setting.set(obj);
	};

    const {
		// defaultValue,
		label,
		// description
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

	const onSelectImage = (media, key) => {
		console.log(media);
		console.log(key);
		// let obj = {
		// 	...state.value
		// };
		// let deviceObj = {
		// 	...obj[key]
		// };
		// deviceObj['background-image'] = media.url;
		// deviceObj['background-media'] = media.id;
		// obj[key] = deviceObj;
		// updateValues(obj);
	};
	
	function renderSettings(key) {
		console.log(key);
// console.log(state);
		var media = '';
		// var media = undefined !== state.value[key]['media'] && state.value[key]['media'] ? state.value[key]['media'] : '';
		// var image = undefined !== state.value[key]['image'] && state.value[key]['image'] ? state.value[key]['image'] : '';
		return <>

			{/* { ( media.url || image ) &&

			<img src={ ( media.url ) ? media.url : image } />
			} */}

			<MediaUpload
				title={ __( "Select Background Image", 'astra' )  }
				onSelect={ ( media ) =>  onSelectImage( media, key ) }
				allowedTypes={ [ "image" ] }
				value={ ( media && media ? media :  '' ) }
				render={ ( { open } ) => (
					<Button className="upload-button button-add-media" isDefault onClick={ open }>
						{ __( "Select Image", 'astra' )  }
					</Button>
				) }
			/>

			{/* { ( this.props.media || this.props.backgroundImage ) &&
				<>
					<Button className="ast-bg-img-remove" onClick={ this.onRemoveImage } isLink isDestructive>
						{ __( "Remove Image", 'astra' ) }
					</Button>

				</>
			} */}

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