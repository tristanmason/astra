import PropTypes from 'prop-types';
import {Dashicon} from '@wordpress/components';
// import AstraColorPickerControl from '../common/astra-color-picker-control';
import {__} from '@wordpress/i18n';
import {useEffect, useState} from 'react';

const ResponsiveImage = props => {

    let value = props.control.setting.get();
    let defaultPropsValue = props.control.params.default;
    
    const [state, setState] = useState({
        value: value,
    }
	);
	
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

    const renderReset = (key) => {
		let deleteBtnDisabled = true;
		let reserBtnDisabled = true;
		let devices = ['desktop', 'mobile', 'tablet'];

		for (let device of devices) {
			if (state.value[device]['image'] || state.value[device]['media']) {
				deleteBtnDisabled = false;
			}

			if (state.value[device]['image'] !== defaultPropsValue[device]['image'] || state.value[device]['media'] !== defaultPropsValue[device]['media']) {
				reserBtnDisabled = false;
			}
		}

		return <span className="customize-control-title">
				<>
					<div className="ast-color-btn-reset-wrap">
						<button
							className="ast-reset-btn components-button components-circular-option-picker__clear is-secondary is-small"
							disabled={reserBtnDisabled} onClick={e => {
							e.preventDefault();
							let value = JSON.parse(JSON.stringify(defaultPropsValue));

							if (undefined !== value && '' !== value) {
								for (let device in value) {

									if (undefined === value[device]['image'] || '' === value[device]['image']) {
										value[device]['image'] = '';
										wp.customize.previewer.refresh();
									}

									if (undefined === value[device]['media'] || '' === value[device]['media']) {
										value[device]['media'] = '';
										wp.customize.previewer.refresh();
									}
								}
							}

							updateValues(value);

						}}>
							<Dashicon icon='image-rotate' style={{
								width: 12,
								height: 12,
								fontSize: 12
							}}/>
						</button>
					</div>
				</>
			</span>;
	};

    
    if (label && '' !== label && undefined !== label) {
		labelHtml = <span className="customize-control-title">{label}</span>;
	} else {
		labelHtml = <span className="customize-control-title">{__('Background', 'astra')}</span>;
    }
    
    responsiveHtml = <ul className="ast-responsive-btns">
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

    inputHtml = <div className="background-wrapper">
		<div className="background-container desktop active">
			{renderReset('desktop')}
			{renderSettings('desktop')}
		</div>
		<div className="background-container tablet">
			{renderReset('tablet')}
			{renderSettings('tablet')}
		</div>
		<div className="background-container mobile">
			{renderReset('mobile')}
			{renderSettings('mobile')}
		</div>
	</div>;

	// onSelectImage( media ) {

	// 	this.setState( { modalCanClose: true } );
	// 	this.setState( { backgroundType: 'image' } );
	// 	this.props.onSelectImage( media, 'image' );
	// }
	
	const renderSettings = (key) => {

		media = undefined !== state.value[key]['media'] && state.value[key]['media'] ? state.value[key]['media'] : '';
		image = undefined !== state.value[key]['image'] && state.value[key]['image'] ? state.value[key]['image'] : '';
		return <>

			{ ( media.url || image ) &&

			<img src={ ( media.url ) ? media.url : image } />
			}

			<MediaUpload
				title={ __( "Select Background Image", 'astra' )  }
				onSelect={ ( media ) =>  onSelectImage( media ) }
				allowedTypes={ [ "image" ] }
				value={ ( media && media ? media :  '' ) }
				render={ ( { open } ) => (
					<Button className="upload-button button-add-media" isDefault onClick={ () => this.open( open ) }>
						{ ( ! this.props.media && ! this.props.backgroundImage ) ? __( "Select Background Image", 'astra' )  : __( "Replace image", 'astra' )  }
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