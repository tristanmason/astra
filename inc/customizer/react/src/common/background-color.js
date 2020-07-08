import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Popover, Dashicon, Button, ColorIndicator, Tooltip, TabPanel, __experimentalGradientPicker, ColorPicker } from '@wordpress/components';
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
			stateColor: this.props.color,
			color: this.props.color,
			media: this.props.media,
			modalCanClose: true,
			supportGradient: ( undefined === __experimentalGradientPicker ? false : true ),
		};
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
			} else {
				if ( this.state.isVisible === false ) {
					this.setState( { isVisible: true } );
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
                            <TabPanel className="astra-popover-tabs astra-background-tabs"
                                activeClass="active-tab"
                                initialTabName={ ( this.state.color && this.state.color.includes( 'gradient' ) ? 'gradient' : 'color' ) }
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
		console.log(color)
		
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

		this.setState( { media: media } );
		this.props.onSelectImage( media );
	}
	onRemoveImage() {
		this.setState( { media: '' } );
		this.props.onSelectImage( '' );
	}
	open( open ) {
		this.setState( { modalCanClose: false } );
		open()
	}
	renderImageSettings() {

		return ( 
			<>
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
					( <Button className="uagb-rm-btn" onClick={ this.onRemoveImage } isLink isDestructive>
						{  "Remove Image" }
					</Button> )
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
