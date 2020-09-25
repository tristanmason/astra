import PropTypes, { array } from 'prop-types';
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Popover, Dashicon, Button, ColorIndicator, TabPanel, __experimentalGradientPicker, ColorPicker, SelectControl, ColorPalette } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

class AstraColorPickerControl extends Component {

	constructor( props ) {

		super( props );
		this.onChangeComplete = this.onChangeComplete.bind( this );
		this.onPaletteChangeComplete = this.onPaletteChangeComplete.bind( this );
		this.onChangeGradientComplete = this.onChangeGradientComplete.bind( this );
		this.renderImageSettings = this.renderImageSettings.bind( this );
		this.onSelectImage = this.onSelectImage.bind( this );
		this.open = this.open.bind( this );
		this.onColorClearClick = this.onColorClearClick.bind( this );
		this.state = {
			isVisible: false,
			refresh: false,
			color: this.props.color,
			modalCanClose: true,
			backgroundType: this.props.backgroundType,
			supportGradient: ( undefined === __experimentalGradientPicker ? false : true ),
		};

		if ( this.props.allowImage ) {

			this.state['backgroundImage'] = this.props.backgroundImage;
			this.state['media'] = this.props.media;
			this.state['backgroundAttachment'] = this.props.backgroundAttachment;
			this.state['backgroundPosition'] = this.props.backgroundPosition;
			this.state['backgroundRepeat'] = this.props.backgroundRepeat;
			this.state['backgroundSize'] = this.props.backgroundSize;
		}
	}

	render() {

		const {
			refresh,
			modalCanClose,
			isVisible,
			supportGradient,
			backgroundType,
			color
		} = this.state

		const {
			allowGradient,
			allowImage
		} = this.props

		const toggleVisible = () => {
			if ( refresh === true ) {
				this.setState( { refresh: false } );
			} else {
				this.setState( { refresh: true } );
			}
			this.setState( { isVisible: true } );
		};

		const toggleClose = () => {
			if ( modalCanClose ) {
				if ( isVisible === true ) {
					this.setState( { isVisible: false } );
				}
			}
		};

        const showingGradient = ( allowGradient && supportGradient ? true : false );

        let tabs = [
            {
                name: 'color',
                title: __( 'Color', 'astra' ),
                className: 'astra-color-background',
            },

        ];

        if ( showingGradient ) {

            let gradientTab = {
                name: 'gradient',
                title: __( 'Gradient', 'astra' ),
                className: 'astra-image-background',
            };

            tabs.push( gradientTab )
		}

        if ( allowImage ) {

            let imageTab = {
                name: 'image',
                title: __( 'Image', 'astra' ),
                className: 'astra-image-background',
            };

            tabs.push( imageTab )
		}

		let finalpaletteColors = [];
		let count = 0;

		const defaultColorPalette = [...astColorPalette.colors];

		defaultColorPalette.forEach( singleColor => {
			let paletteColors = {};
			Object.assign( paletteColors, { name: count + '_' + singleColor } );
			Object.assign( paletteColors, { color: singleColor } );
			finalpaletteColors.push(paletteColors);
			count ++;
		});

		return (
			<>
				<div className="color-button-wrap">
					<Button className={ isVisible ? 'astra-color-icon-indicate open' : 'astra-color-icon-indicate' } onClick={ () => { isVisible ? toggleClose() : toggleVisible() } }>
						{ ( 'color' === backgroundType || 'gradient' === backgroundType ) &&
						<ColorIndicator className="astra-advanced-color-indicate" colorValue={ this.props.color } />
						}
						{ 'image' === backgroundType &&
							<>
								<ColorIndicator className="astra-advanced-color-indicate" colorValue='#ffffff' />
								<Dashicon icon="format-image" />
							</>
						}
					</Button>
				</div>
				<div className="astra-color-picker-wrap">
					<>
						{ isVisible && (
							<div className="astra-popover-color" onClose={ toggleClose }>
								{ 1 < tabs.length &&
									<TabPanel className="astra-popover-tabs astra-background-tabs"
										activeClass="active-tab"
										initialTabName={ backgroundType }
										tabs={ tabs }>
										{
											( tab ) => {
												let tabout;

												if ( tab.name ) {
													if ( 'gradient' === tab.name ) {
														tabout = (
															<>
																<__experimentalGradientPicker
																	className="ast-gradient-color-picker"
																	value={ color && color.includes( 'gradient' ) ? color : '' }
																	onChange={ ( gradient ) => this.onChangeGradientComplete( gradient ) }
																/>
															</>
														);
													}  if ( 'image' === tab.name ) {
														tabout = (
															this.renderImageSettings()
														);
													} else if ( 'color' === tab.name ){
														tabout = (
															<>
																{ refresh && (
																	<>
																		<ColorPicker
																			color={ color }
																			onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
																		/>
																	</>
																) }
																{ ! refresh &&  (
																	<>
																		<ColorPicker
																			color={ color }
																			onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
																		/>

																	</>
																) }
																<ColorPalette
																	colors={ finalpaletteColors }
																	value={ color }
																	clearable={ false }
																	disableCustomColors={ true }
																	className="ast-color-palette"
																	onChange={ ( color ) => this.onPaletteChangeComplete( color ) }
																/>
																<button type="button" onClick = { () => { this.onColorClearClick() } } className="astra-color-clear-button components-button components-circular-option-picker__clear is-secondary is-small">{ __( 'Clear', 'astra' ) }</button>
															</>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
								}
								{ 1 === tabs.length &&

									<>
										{ refresh && (
											<>
												<ColorPicker
													color={ color }
													onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
												/>
											</>
										) }
										{ ! refresh &&  (
											<>
												<ColorPicker
													color={ color }
													onChangeComplete={ ( color ) => this.onChangeComplete( color ) }
												/>

											</>
										) }
										<ColorPalette
											colors={ finalpaletteColors }
											value={ color }
											clearable={ false }
											disableCustomColors={ true }
											className="ast-color-palette"
											onChange={ ( color ) => this.onPaletteChangeComplete( color ) }
										/>
										<button type="button" onClick = { () => { this.onColorClearClick() } } className="astra-color-clear-button components-button components-circular-option-picker__clear is-secondary is-small">{ __( 'Clear', 'astra' ) }</button>
									</>
								}
							</div>
						) }
					</>
				</div>
			</>
		);
	}

	onColorClearClick() {

		this.setState( { color: 'unset' } );

		if ( this.state.refresh === true ) {
			this.setState( { refresh: false } );
		} else {
			this.setState( { refresh: true } );
		}
		this.props.onChangeComplete( 'unset', 'color' );
	}
	onChangeGradientComplete( gradient ) {

		let newColor;
		if ( undefined === gradient ) {
			newColor = '';
		} else {
			newColor = gradient;
		}
		this.setState( { color: newColor } );
		this.setState( { backgroundType: 'gradient' } );
		this.props.onChangeComplete( newColor, 'gradient' );
	}

	onChangeComplete( color ) {

		let newColor;
		if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			newColor = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			newColor = color.hex;
		}
		this.setState( { color: newColor } );
		this.setState( { backgroundType: 'color' } );
		this.props.onChangeComplete( color, 'color' );
	}

	onPaletteChangeComplete( color ) {
		this.setState( { color: color } );
		if ( this.state.refresh === true ) {
			this.setState( { refresh: false } );
		} else {
			this.setState( { refresh: true } );
		}
		this.props.onChangeComplete( color, 'color' );
	}

	onSelectImage( media ) {

		this.setState( { modalCanClose: true } );
		this.setState( { media: media } );
		this.setState( { backgroundType: 'image' } );
		this.props.onSelectImage( media, 'image' );
	}

	open( open ) {
		this.setState( { modalCanClose: false } );
		open()
	}

	onChangeImageOptions( tempKey, mainkey, value ) {

		this.setState( { [tempKey]: value } );
		this.setState( { backgroundType: 'image' } );
		this.props.onChangeImageOptions( mainkey, value, 'image' );
	}

	toggleMoreSettings() {

		let parent = event.target.parentElement.parentElement;
		let trigger = parent.querySelector( '.more-settings' );
		let wrapper = parent.querySelector( '.media-position-setting' );

		var dataDirection = trigger.dataset.direction;
		let dataId = trigger.dataset.id;

		if( 'down' === dataDirection ) {
			trigger.setAttribute( 'data-direction', 'up' );
			parent.querySelector('.message').innerHTML = __( "Less Settings" );
			parent.querySelector('.icon').innerHTML = '↑';
		} else {
			trigger.setAttribute( 'data-direction', 'down' );
			parent.querySelector('.message').innerHTML = __( "More Settings" );
			parent.querySelector('.icon').innerHTML = '↓';
		}

		if ( wrapper.classList.contains( 'hide-settings' ) ) {
			wrapper.classList.remove( 'hide-settings' );
		} else {
			wrapper.classList.add( 'hide-settings' );
		}
	}

	renderImageSettings() {

		const {
			media,
			backgroundImage,
			backgroundPosition,
			backgroundAttachment,
			backgroundRepeat,
			backgroundSize
		} = this.state

		return (
			<>
				{ ( media.url || backgroundImage ) &&

					<img src={ ( media.url ) ? media.url : backgroundImage } />
				}
				<MediaUpload
					title={ __( "Select Background Image", 'astra' )  }
					onSelect={ ( media ) =>  this.onSelectImage( media ) }
					allowedTypes={ [ "image" ] }
					value={ ( undefined !== media && media ? media :  '' ) }
					render={ ( { open } ) => (
						<Button className="upload-button button-add-media" isDefault onClick={ () => this.open( open ) }>
							{ ( ! media && ! backgroundImage ) ? __( "Select Background Image", 'astra' )  : __( "Replace image", 'astra' )  }
						</Button>
					) }
				/>

				{ ( media || backgroundImage ) &&
					<>
						<a href="#" className="more-settings" onClick={ this.toggleMoreSettings } data-direction="down" data-id="desktop">
							<span className="message"> { __( "More Settings" ) } </span>
							<span className="icon"> ↓ </span>
						</a>

						<div className="media-position-setting hide-settings">
							<SelectControl
							label={ __( "Image Position" ) }
							value={ backgroundPosition }
							onChange={ ( value ) => this.onChangeImageOptions( 'backgroundPosition', 'background-position', value  ) }
							options={ [
								{ value: "left top", label:  __( "Left Top", 'astra'  )  },
								{ value: "left center", label:  __( "Left Center", 'astra'  )  },
								{ value: "left bottom", label:  __( "Left Bottom", 'astra'  )  },
								{ value: "right top", label:  __( "Right Top", 'astra'  )  },
								{ value: "right center", label:  __( "Right Center", 'astra'  )  },
								{ value: "right bottom", label:  __( "Right Bottom", 'astra'  )  },
								{ value: "center top", label:  __( "Center Top", 'astra'  )  },
								{ value: "center center", label:  __( "Center Center", 'astra'  )  },
								{ value: "center bottom", label:  __( "Center Bottom", 'astra'  )  },
							] }
							/>
							<SelectControl
							label={ __( "Attachment", 'astra' ) }
							value={ backgroundAttachment }
							onChange={ ( value ) => this.onChangeImageOptions( 'backgroundAttachment', 'background-attachment', value  ) }
							options={ [
								{ value: "fixed", label:  __( "Fixed", 'astra' )  },
								{ value: "scroll", label:  __( "Scroll", 'astra' )  }
							] }
							/>
							<SelectControl
							label={ __( "Repeat", 'astra' ) }
							value={ backgroundRepeat }
							onChange={ ( value ) => this.onChangeImageOptions( 'backgroundRepeat', 'background-repeat', value  ) }
							options={ [
								{ value: "no-repeat", label:  __( "No Repeat", 'astra' )  },
								{ value: "repeat", label:  __( "Repeat All", 'astra' )  },
								{ value: "repeat-x", label:  __( "Repeat Horizontally", 'astra' )  },
								{ value: "repeat-y", label:  __( "Repeat Vertically", 'astra' )  }
							] }
							/>
							<SelectControl
							label={ __( "Size", 'astra' ) }
							value={ backgroundSize }
							onChange={ ( value ) => this.onChangeImageOptions( 'backgroundSize', 'background-size', value  ) }
							options={ [
								{ value: "auto", label:  __( "Auto", 'astra' )  },
								{ value: "cover", label:  __( "Cover", 'astra' )  },
								{ value: "contain", label:  __( "Contain", 'astra' )  }
							] }
							/>
						</div>
					</>
				}
			</>
		)
	}
}

AstraColorPickerControl.propTypes = {
	color: PropTypes.string,
	usePalette: PropTypes.bool,
	palette: PropTypes.string,
	presetColors: PropTypes.object,
	onChangeComplete: PropTypes.func,
	onPaletteChangeComplete: PropTypes.func,
	onChange: PropTypes.func,
	customizer: PropTypes.object
};

export default AstraColorPickerControl;
