import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Popover, Dashicon, Button, ColorIndicator, Tooltip, TabPanel, __experimentalGradientPicker, ColorPicker, SelectControl } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

class BackgroundColorControl extends Component {

	constructor(props) {
		super( props );
		this.onChangeComplete = this.onChangeComplete.bind( this );
		this.onChangeGradientComplete = this.onChangeGradientComplete.bind( this );
		this.renderImageSettings = this.renderImageSettings.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.onSelectImage = this.onSelectImage.bind( this );
		this.open = this.open.bind( this );


		this.state = {
			isVisible: false,
			refresh: false,
			color: this.props.color,
			modalCanClose: true,
			supportGradient: ( undefined === __experimentalGradientPicker ? false : true ),
		};

		if ( this.props.allowImage ) {

			this.state['media'] = this.props.media;
			this.state['backgroundAttachment'] = this.props.backgroundAttachment;
			this.state['backgroundPosition'] = this.props.backgroundPosition;
			this.state['backgroundRepeat'] = this.props.backgroundRepeat;
			this.state['backgroundSize'] = this.props.backgroundSize;
		}
	}

	render() {

		const toggleVisible = () => {
			if ( this.state.refresh === true ) {
				this.setState( { refresh: false } );
			} else {
				this.setState( { refresh: true } );
			}
			this.setState( { isVisible: true } );
		};

		const toggleClose = () => {
			if ( this.state.modalCanClose ) {
				if ( this.state.isVisible === true ) {
					this.setState( { isVisible: false } );
				}
			} 
		};
		
        const showingGradient = ( this.props.allowGradient && this.state.supportGradient ? true : false );
        
        let tabs = [
            {
                name: 'color',
                title: __( 'Color', 'astra-blocks' ),
                className: 'astra-color-background',
            },
            
        ];

        if ( showingGradient ) {

            let gradientTab = {
                name: 'gradient',
                title: __( 'Gradient', 'astra-blocks' ),
                className: 'astra-image-background',
            };

            tabs.push( gradientTab )
		}
		
        if ( this.props.allowImage ) {

            let imageTab = {
                name: 'image',
                title: __( 'Image', 'astra-blocks' ),
                className: 'astra-image-background',
            };

            tabs.push( imageTab )
        }

		return (
			<div className="astra-color-picker-wrap">
				
                <Fragment>
                    { this.state.isVisible && (
                        <Popover position="top left" className="astra-popover-color" onClose={ toggleClose }>
							{ 1 < tabs.length && 
								<TabPanel className="astra-popover-tabs astra-background-tabs"
									activeClass="active-tab"
									initialTabName={ 'color' }
									tabs={ tabs }>
									{
										( tab ) => {
											let tabout;
											
											if ( tab.name ) {
												if ( 'gradient' === tab.name ) {
													tabout = (
														<Fragment>
															<__experimentalGradientPicker
																value={ this.state.color && this.state.color.includes( 'gradient' ) ? this.state.color : '' }
																onChange={ ( gradient ) => this.onChangeGradientComplete( gradient ) }
															/>
														</Fragment>
													);
												}  if ( 'image' === tab.name ) {
													tabout = (
														this.renderImageSettings()
													);
												} else if ( 'color' === tab.name ){
													tabout = (
														<Fragment>
															{ this.state.refresh && (
																<Fragment>
																	<ColorPicker
																		color={ this.state.color }
																		onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
																	/>
																</Fragment>
															) }
															{ ! this.state.refresh &&  (
																<Fragment>
																	<ColorPicker
																		color={ this.state.color }
																		onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
																	/>
																	
																</Fragment>
															) }
														</Fragment>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
							}
							{ 1 === tabs.length &&

								<Fragment>
									{ this.state.refresh && (
										<Fragment>
											<ColorPicker
												color={ this.state.color }
												onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
											/>
										</Fragment>
									) }
									{ ! this.state.refresh &&  (
										<Fragment>
											<ColorPicker
												color={ this.state.color }
												onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
											/>
											
										</Fragment>
									) }
								</Fragment>
							}
                        </Popover>
                    ) }
                </Fragment>

				<div className="color-button-wrap">
					<Button className={ 'astra-color-icon-indicate' } onClick={ () => { this.state.isVisible ? toggleClose() : toggleVisible() } }>
						<ColorIndicator className="astra-advanced-color-indicate" colorValue={ this.props.color } />
						{ this.state.isPalette && (
							<Dashicon icon="admin-site" />
						) }
					</Button>
				</div>
			</div>
		);
	}

	onChangeGradientComplete( gradient ) {

		let newColor;
		if ( undefined === gradient ) {
			newColor = '';
		} else {
			newColor = gradient;
		}
		this.setState( { color: newColor } );
		this.props.onChangeComplete( newColor );
	}

	onChangeComplete( color ) {

		let newColor;
		if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			newColor = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			newColor = color.hex;
		}
		this.setState( { color: newColor } );
		this.props.onChangeComplete( color );
	}

	onSelectImage( media ) {

		this.setState( { modalCanClose: true } );
		this.setState( { media: media } );
		this.props.onSelectImage( media );
	}

	onRemoveImage() {

		this.setState( { modalCanClose: true } );
		this.setState( { media: '' } );
		this.props.onSelectImage( '' );
	}

	open( open ) {
		this.setState( { modalCanClose: false } );
		open()
	}

	onChangeImageOptions( tempKey, mainkey, value ) {
		
		this.setState( { [tempKey]: value } );
		this.props.onChangeImageOptions( mainkey, value );
	}

	renderImageSettings() {

		return ( 
			<>
				{ this.state.media.url &&

					<img src={ this.state.media.url } width="200" height="200" />
				}
				<MediaUpload
					title={ "Select Background Image"  }
					onSelect={ ( media ) =>  this.onSelectImage( media ) }
					allowedTypes={ [ "image" ] }
					value={ ( undefined !== this.state.media && this.state.media ? this.state.media :  '' ) }
					render={ ( { open } ) => (
						<Button className="upload-button button-add-media" isDefault onClick={ () => this.open( open ) }>
							{ ! this.state.media ? "Select Background Image"  : "Replace image"  }
						</Button>
					) }
				/>
				
				{ this.state.media &&
					<>
						<Button className="uagb-rm-btn" onClick={ this.onRemoveImage } isLink isDestructive>
							{  "Remove Image" }
						</Button> 

						<SelectControl
						label={  "Image Position"  }
						value={ this.state.backgroundPosition }
						onChange={ ( value ) => this.onChangeImageOptions( 'backgroundPosition', 'background-position', value  ) }
						options={ [
							{ value: "top-left", label:  "Top Left"  },
							{ value: "top-center", label:  "Top Center"  },
							{ value: "top-right", label:  "Top Right"  },
							{ value: "center-left", label:  "Center Left"  },
							{ value: "center-center", label:  "Center Center"  },
							{ value: "center-right", label:  "Center Right"  },
							{ value: "bottom-left", label:  "Bottom Left"  },
							{ value: "bottom-center", label:  "Bottom Center"  },
							{ value: "bottom-right", label:  "Bottom Right"  },
						] }
						/>
						<SelectControl
						label={ __( "Attachment" ) }
						value={ this.state.backgroundAttachment }
						onChange={ ( value ) => this.onChangeImageOptions( 'backgroundAttachment', 'background-attachment', value  ) }
						options={ [
							{ value: "fixed", label:  "Fixed"  },
							{ value: "scroll", label:  "Scroll"  }
						] }
						/>
						<SelectControl
						label={ __( "Repeat" ) }
						value={ this.state.backgroundRepeat }
						onChange={ ( value ) => this.onChangeImageOptions( 'backgroundRepeat', 'background-repeat', value  ) }
						options={ [
							{ value: "no-repeat", label:  "No Repeat"  },
							{ value: "repeat", label:  "Repeat"  },
							{ value: "repeat-x", label:  "Repeat-x"  },
							{ value: "repeat-y", label:  "Repeat-y"  }
						] }
						/>
						<SelectControl
						label={ __( "Size" ) }
						value={ this.state.backgroundSize }
						onChange={ ( value ) => this.onChangeImageOptions( 'backgroundSize', 'background-size', value  ) }
						options={ [
							{ value: "auto", label:  "Auto"  },
							{ value: "cover", label:  "Cover"  },
							{ value: "contain", label:  "Contain"  }
						] }
						/>
					</>
				} 
			</>
		)
	}

}

BackgroundColorControl.propTypes = {
	color: PropTypes.string,
	usePalette: PropTypes.bool,
	palette: PropTypes.string,
	presetColors: PropTypes.object,
	onChangeComplete: PropTypes.func,
	onChange: PropTypes.func,
	customizer: PropTypes.object
};

export default BackgroundColorControl;
