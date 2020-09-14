/* jshint esversion: 6 */
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ResponsiveControl from '../common/responsive.js';
import Icons from '../common/icons.js';

const { __ } = wp.i18n;

const { ButtonGroup, Dashicon, Tooltip, Button } = wp.components;

const { Component, Fragment } = wp.element;
class RowLayoutComponent extends Component {
	constructor() {
		
		super( ...arguments );

		this.updateValues = this.updateValues.bind( this );
		this.onFooterUpdate = this.onFooterUpdate.bind( this );
		this.onColumnUpdate();
		let value = this.props.control.setting.get();
		let defaultParams = {
			desktop: {
				'5': {
					'5-equal': {
						icon: 'fivecol',
					},
				},
				'4': {
					'4-equal': {
						icon: 'fourcol',
					},
					'4-lheavy': {
						icon: 'lfourforty',
					},
					'4-rheavy': {
						icon: 'rfourforty',
					},
				},
				'3': {
					'3-equal': {
						icon: 'threecol',
					},
					'3-lheavy': {
						icon: 'lefthalf',
					},
					'3-rheavy': {
						icon: 'righthalf',
					},
					'3-cheavy': {
						icon: 'centerhalf',
					},
					'3-cwide': {
						icon: 'widecenter',
					},
				},
				'2': {
					'2-equal': {
						icon: 'twocol',
					},
					'2-lheavy': {
						icon: 'twoleftgolden',
					},
					'2-rheavy': {
						icon: 'tworightgolden',
					},
				},
				'1': {
					'full': {
						icon: 'row',
					},
				}
			},
			tablet: {
				'5': {
					'5-equal': {
						tooltip: __( 'Equal Width Columns', 'astra' ),
						icon: 'fivecol',
					},
					'full': {
						tooltip: __( 'Collapse to Rows', 'astra' ),
						icon: 'collapserowfive',
					},
				},
				'4': {
					'4-equal': {
						tooltip: __( 'Equal Width Columns', 'astra' ),
						icon: 'fourcol',
					},
					'2-equal': {
						tooltip: __( 'Two Column Grid', 'astra' ),
						icon: 'grid',
					},
					'full': {
						tooltip: __( 'Collapse to Rows', 'astra' ),
						icon: 'collapserowfour',
					},
				},
				'3': {
					'3-equal': {
						tooltip: __( 'Equal Width Columns', 'astra' ),
						icon: 'threecol',
					},
					'3-lheavy': {
						tooltip: __( 'Left Heavy 50/25/25', 'astra' ),
						icon: 'lefthalf',
					},
					'3-rheavy': {
						tooltip: __( 'Right Heavy 25/25/50', 'astra' ),
						icon: 'righthalf',
					},
					'3-cheavy': {
						tooltip: __( 'Center Heavy 25/50/25', 'astra' ),
						icon: 'centerhalf',
					},
					'3-cwide': {
						tooltip: __( 'Wide Center 20/60/20', 'astra' ),
						icon: 'widecenter',
					},
					'3-firstrow': {
						tooltip: __( 'First Row, Next Columns 100 - 50/50', 'astra' ),
						icon: 'firstrow',
					},
					'3-lastrow': {
						tooltip: __( 'Last Row, Previous Columns 50/50 - 100', 'astra' ),
						icon: 'lastrow',
					},
					'full': {
						tooltip: __( 'Collapse to Rows', 'astra' ),
						icon: 'collapserowthree',
					},
				},
				'2': {
					'2-equal': {
						tooltip: __( 'Equal Width Columns', 'astra' ),
						icon: 'twocol',
					},
					'2-lheavy': {
						tooltip: __( 'Left Heavy 66/33', 'astra' ),
						icon: 'twoleftgolden',
					},
					'2-rheavy': {
						tooltip: __( 'Right Heavy 33/66', 'astra' ),
						icon: 'tworightgolden',
					},
					'full': {
						tooltip: __( 'Collapse to Rows', 'astra' ),
						icon: 'collapserow',
					},
				},
				'1': {
					'full': {
						tooltip: __( 'Single Row', 'astra' ),
						icon: 'row',
					},
				}
			},
			mobile: {
				'5': {
					'5-equal': {
						icon: 'fivecol',
					},
					'full': {
						icon: 'collapserowfive',
					},
				},
				'4': {
					'4-equal': {
						icon: 'fourcol',
					},
					'2-equal': {
						icon: 'grid',
					},
					'full': {
						icon: 'collapserowfour',
					},
				},
				'3': {
					'3-equal': {
						icon: 'threecol',
					},
					'3-lheavy': {
						icon: 'lefthalf',
					},
					'3-rheavy': {
						icon: 'righthalf',
					},
					'3-cheavy': {
						icon: 'centerhalf',
					},
					'3-cwide': {
						icon: 'widecenter',
					},
					'3-firstrow': {
						icon: 'firstrow',
					},
					'3-lastrow': {
						icon: 'lastrow',
					},
					'full': {
						icon: 'collapserowthree',
					},
				},
				'2': {
					'2-equal': {
						icon: 'twocol',
					},
					'2-lheavy': {
						icon: 'twoleftgolden',
					},
					'2-rheavy': {
						icon: 'tworightgolden',
					},
					'full': {
						icon: 'collapserow',
					},
				},
				'1': {
					'full': {
						icon: 'row',
					},
				}
			},
			responsive: true,
		};
		this.controlParams = this.props.control.params.input_attrs ? {
			...defaultParams,
			...this.props.control.params.input_attrs,
		} : defaultParams;
		let responsiveDefault = {
			'mobile': 'row',
			'tablet': '',
			'desktop': 'equal'
		};
		let nonResponsiveDefault = 'equal';
		let baseDefault;
		let type = this.props.control.id.replace( 'astra-settings[', '' ).replace( '-footer-layout]', '' );
		this.type = type;
		this.footer_type = ( this.type === 'hb' ) ? 'primary' : ( ( this.type === 'hba' ) ? 'above' : 'below' );
		if ( this.controlParams.responsive ) {
			baseDefault = responsiveDefault;
			this.defaultValue = this.props.control.params.default ? {
				...baseDefault,
				...this.props.control.params.default
			} : baseDefault;
		} else {
			baseDefault = nonResponsiveDefault;
			this.defaultValue = this.props.control.params.default ? this.props.control.params.default : baseDefault;
		}
		if ( this.controlParams.responsive ) {
			value = value ? {
				...JSON.parse( JSON.stringify( this.defaultValue ) ),
				...value
			} : JSON.parse( JSON.stringify( this.defaultValue ) );
		} else {
			value = value ? value : this.defaultValue;
		}
		let columns = 0;
		columns = parseInt( this.props.customizer.control( 'astra-settings[' + this.type + '-footer-column]' ).setting.get(), 10 );
		this.state = {
			currentDevice: 'desktop',
			columns: columns,
			value: value,
			is_updated: false
		};
	}
	render() {

		const responsiveControlLabel = (
			<Fragment>
				{ this.state.currentDevice !== 'desktop' && (
					<Tooltip text={ __( 'Reset Device Values', 'astra' ) }>
						<Button
							className="reset ahfb-reset"
							disabled={ ( this.state.value[this.state.currentDevice] === this.defaultValue[this.state.currentDevice] ) }
							onClick={ () => {
								let value = this.state.value;
								value[this.state.currentDevice] = this.defaultValue[this.state.currentDevice];
								this.setState( { value: value } );
								this.updateValues();
							} }
						>
							<Dashicon icon='image-rotate' />
						</Button>
					</Tooltip>
				) }
				{ this.props.control.params.label &&
					this.props.control.params.label
				}
			</Fragment>
		);
		const controlLabel = (
			<Fragment>
				<Tooltip text={ __( 'Reset Values', 'astra' ) }>
					<Button
						className="reset ahfb-reset"
						disabled={ ( this.state.value === this.defaultValue ) }
						onClick={ () => {
							let value = this.defaultValue;
							this.setState( { value: this.defaultValue } );
							this.updateValues();
						} }
					>
						<Dashicon icon='image-rotate' />
					</Button>
				</Tooltip>
				{ this.props.control.params.label &&
					this.props.control.params.label
				}
			</Fragment>
		);
		let controlMap = {}
		if ( this.state.currentDevice !== 'desktop' ) {
			controlMap = this.controlParams.mobile[ this.state.columns ];
		} else {
			controlMap = this.controlParams.desktop[ this.state.columns ];
		}

		return (
			<div className="ahfb-control-field ahfb-radio-icon-control ahfb-row-layout-control">
				{ this.controlParams.responsive && (
					<ResponsiveControl
						onChange={ ( currentDevice) => this.setState( { currentDevice } ) }
						controlLabel={ responsiveControlLabel }
					>
						<ButtonGroup className="ahfb-radio-container-control">
							{ Object.keys( controlMap ).map( ( item, key ) => {
								return (
									<Button
									 	key = { key }
										isTertiary
										className={ ( item === this.state.value[this.state.currentDevice] ?
												'active-radio ' :
												'' ) + 'ast-radio-img-svg ahfb-btn-item-' + key }
										onClick={ () => {
											let value = this.state.value;
											value[ this.state.currentDevice ] = item;
											this.setState( { value: value } );
											this.updateValues();
										} }
									>
										{ controlMap[ item ].icon && (
											<span className="ahfb-radio-icon">
												{ Icons[ controlMap[ item ].icon ] }
											</span>
										) }
										{ controlMap[ item ].dashicon && (
											<span className="ahfb-radio-icon ahfb-radio-dashicon">
												<Dashicon icon={ controlMap[ item ].dashicon } />
											</span>
										) }
										{ controlMap[ item ].name && (
												controlMap[ item ].name
										) }
									</Button>
								);
							} )}
						</ButtonGroup>
					</ResponsiveControl>
				) }
			</div>
		);
	}

	onFooterUpdate() {
		const columns = parseInt( this.props.customizer.control( 'astra-settings[' + this.type + '-footer-column]' ).setting.get(), 10 );
		let value = this.state.value;
		if ( this.state.columns !== columns ) {
			this.setState( { columns: columns } );
			let defaults = {
				'1' : 'full',
				'2' : '2-equal',
				'3' : '3-equal',
				'4' : '4-equal',
				'5' : '5-equal'
			}
			value.desktop = defaults[columns];
			value.tablet  = defaults[columns];
			value.mobile  = 'full';
			this.setState( { value : value } );
			this.updateValues();
		}
	}

	onColumnUpdate() {
		let self = this;
		document.addEventListener( 'AstraBuilderChangeRowLayout', function( e ) {
			if ( e.detail.columns ) {
				self.onFooterUpdate();
			}
		} );
	}

	updateValues() {

		let event = new CustomEvent(
			'AstraBuilderChangeRowLayout', {
				'detail': {
					'columns' : wp.customize.value('astra-settings[' + this.type + '-footer-column]').get(),
					'layout' : this.state.value,
					'type' : this.footer_type
				},
			}
		);

		let value = this.state.value;

		document.dispatchEvent( event );
		this.props.control.setting.set( {
			...this.props.control.setting.get(),
			...value,
			flag: !this.props.control.setting.get().flag
		} );
	}
}

RowLayoutComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default RowLayoutComponent;
