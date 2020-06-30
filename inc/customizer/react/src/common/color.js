import PropTypes from 'prop-types';
import SwatchesControl from './swatches';
import AstraColorPicker from './color-picker';
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Button, Popover, Dashicon, ColorIndicator, Tooltip, TabPanel, __experimentalGradientPicker } from '@wordpress/components';

class ColorControl extends Component {
	constructor(props) {
		super( props );
		this.onChangeState = this.onChangeState.bind( this );
		this.onChangeComplete = this.onChangeComplete.bind( this );
		this.onChangeGradientComplete = this.onChangeGradientComplete.bind( this );
		this.state = {
			isVisible: false,
			refresh: false,
			stateColor: this.props.color,
			color: this.props.color,
			isPalette: ( this.props.color && this.props.color.includes( 'palette' ) ? true : false ),
			palette: ( this.props.presetColors && this.props.presetColors ? this.props.presetColors : [] ),
			activePalette: ( this.props.presetColors && this.props.presetColors.active ? this.props.presetColors.active : 'palette' ),
			supportGradient: ( undefined === __experimentalGradientPicker ? false : true ),
		};
	}

	render() {
		const toggleVisible = () => {
			if ( this.props.usePalette ) {
				console.log(this.props.presetColors);
				const updateColors = this.props.presetColors;
				const active = ( updateColors && updateColors.active ? updateColors.active : 'palette' );
				this.setState( { palette: updateColors, activePalette: active } );
			}
			if ( this.state.refresh === true ) {
				this.setState( { refresh: false } );
			} else {
				this.setState( { refresh: true } );
			}
			this.setState( { isVisible: true } );
		};
		const toggleClose = () => {
			if ( this.state.isVisible === true ) {
				this.setState( { isVisible: false } );
			}
		};
		const showingGradient = ( this.props.allowGradient && this.state.supportGradient ? true : false );
		return (
			<div className="astra-color-picker-wrap">
				{ this.props.colorDefault && this.props.color && this.props.color !== this.props.colorDefault && (
					<Tooltip text={ __( 'Clear' ) }>
						<span className="tooltip-clear">
							<Button
								className="components-color-palette__clear"
								type="button"
								onClick={ () => {
									this.setState( { color: this.props.colorDefault, isPalette: '' } );
									this.props.onChangeComplete( '', '' );
								} }
								isSmall
							>
								<Dashicon icon="redo" />
							</Button>
						</span>
					</Tooltip>
				) }
				{ showingGradient && (
					<Fragment>
						{ this.state.isVisible && (
							<Popover position="top left" className="astra-popover-color" onClose={ toggleClose }>
								<TabPanel className="astra-popover-tabs astra-background-tabs"
									activeClass="active-tab"
									initialTabName={ ( this.state.color && this.state.color.includes( 'gradient' ) ? 'gradient' : 'color' ) }
									tabs={ [
										{
											name: 'color',
											title: __( 'Color', 'astra-blocks' ),
											className: 'astra-color-background',
										},
										{
											name: 'gradient',
											title: __( 'Gradient', 'astra-blocks' ),
											className: 'astra-gradient-background',
										}
									] }>
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
												} else {
													tabout = (
														<Fragment>
															{ this.state.refresh && (
																<Fragment>
																	<AstraColorPicker
																		color={ ( this.state.isPalette && this.state.palette.palette && this.state.palette.palette[parseInt(this.state.color.slice(-1), 10 ) - 1] ? this.state.palette.palette[parseInt(this.state.color.slice(-1), 10 ) - 1 ].color : this.state.color ) }
																		onChange={ ( color ) => this.onChangeState( color, '' ) }
																		onChangeComplete={ ( color ) => this.onChangeComplete( color, '' ) }
																	/>
																	{ this.props.usePalette && (
																		<SwatchesControl
																			colors={ ( this.state.palette && this.state.palette[ this.state.activePalette ] ? this.state.palette[ this.state.activePalette ] : [] ) }
																			isPalette={ ( this.state.isPalette ? this.state.color : '' ) }
																			onClick={ ( color, palette ) => this.onChangeComplete( color, palette ) }
																		/>
																	) }
																</Fragment>
															) }
															{ ! this.state.refresh &&  (
																<Fragment>
																	<AstraColorPicker
																		color={ ( this.state.isPalette && this.state.palette[ this.state.activePalette ] && this.state.palette[ this.state.activePalette ][parseInt(this.state.color.slice(-1), 10 ) - 1] ? this.state.palette[ this.state.activePalette ][parseInt(this.state.color.slice(-1), 10 ) - 1 ].color : this.state.color ) }
																		onChange={ ( color ) => this.onChangeState( color, '' ) }
																		onChangeComplete={ ( color ) => this.onChangeComplete( color, '' ) }
																	/>
																	{ this.props.usePalette && (
																		<SwatchesControl
																			colors={ ( this.state.palette && this.state.palette[ this.state.activePalette ] ? this.state.palette[ this.state.activePalette ] : [] ) }
																			isPalette={ ( this.state.isPalette ? this.state.color : '' ) }
																			onClick={ ( color, palette ) => this.onChangeComplete( color, palette ) }
																		/>
																	) }
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
				) }
				{ ! showingGradient && (
					<Fragment>
						{ this.state.isVisible && this.state.refresh && (
							<Popover position="top left" className="astra-popover-color" onClose={ toggleClose }>
								<AstraColorPicker
									color={ ( this.state.isPalette && this.state.palette.palette && this.state.palette.palette[parseInt(this.state.color.slice(-1), 10 ) - 1] ? this.state.palette.palette[parseInt(this.state.color.slice(-1), 10 ) - 1 ].color : this.state.color ) }
									onChange={ ( color ) => this.onChangeState( color, '' ) }
									onChangeComplete={ ( color ) => this.onChangeComplete( color, '' ) }
								/>
								{ this.props.usePalette && (
									<SwatchesControl
										colors={ ( this.state.palette && this.state.palette[ this.state.activePalette ] ? this.state.palette[ this.state.activePalette ] : [] ) }
										isPalette={ ( this.state.isPalette ? this.state.color : '' ) }
										onClick={ ( color, palette ) => this.onChangeComplete( color, palette ) }
									/>
								) }
							</Popover>
						) }
						{ this.state.isVisible && ! this.state.refresh &&  (
							<Popover position="top left" className="astra-popover-color" onClose={ toggleClose }>
								<AstraColorPicker
									color={ ( this.state.isPalette && this.state.palette[ this.state.activePalette ] && this.state.palette[ this.state.activePalette ][parseInt(this.state.color.slice(-1), 10 ) - 1] ? this.state.palette[ this.state.activePalette ][parseInt(this.state.color.slice(-1), 10 ) - 1 ].color : this.state.color ) }
									onChange={ ( color ) => this.onChangeState( color, '' ) }
									onChangeComplete={ ( color ) => this.onChangeComplete( color, '' ) }
								/>
								{ this.props.usePalette && (
									<SwatchesControl
										colors={ ( this.state.palette && this.state.palette[ this.state.activePalette ] ? this.state.palette[ this.state.activePalette ] : [] ) }
										isPalette={ ( this.state.isPalette ? this.state.color : '' ) }
										onClick={ ( color, palette ) => this.onChangeComplete( color, palette ) }
									/>
								) }
							</Popover>
						) }
					</Fragment>
				) }
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

	onChangeState( color, palette ) {
		let newColor;
		if ( palette ) {
			newColor = palette;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			newColor = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			newColor = color.hex;
		}
		this.setState( { color: newColor, isPalette: ( palette ? true : false ) } );
		if ( undefined !== this.props.onChange ) {
			this.props.onChange( color, palette );
		}
	}
	onChangeGradientComplete( gradient ) {
		let newColor;
		if ( undefined === gradient ) {
			newColor = '';
		} else {
			newColor = gradient;
		}
		this.setState( { color: newColor, isPalette: false } );
		this.props.onChangeComplete( newColor, '' );
	}
	onChangeComplete( color, palette ) {
		let newColor;
		if ( palette ) {
			newColor = palette;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			newColor = 'rgba(' +  color.rgb.r + ',' +  color.rgb.g + ',' +  color.rgb.b + ',' + color.rgb.a + ')';
		} else {
			newColor = color.hex;
		}
		this.setState( { color: newColor, isPalette: ( palette ? true : false ) } );
		this.props.onChangeComplete( color, palette );
	}

}

ColorControl.propTypes = {
	color: PropTypes.string,
	usePalette: PropTypes.bool,
	palette: PropTypes.string,
	presetColors: PropTypes.object,
	onChangeComplete: PropTypes.func,
	onChange: PropTypes.func,
	customizer: PropTypes.object
};

export default ColorControl;
