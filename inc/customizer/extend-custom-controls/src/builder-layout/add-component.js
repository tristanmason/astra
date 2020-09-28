import classnames from "classnames"
import { __ } from '@wordpress/i18n';

const { ButtonGroup, Dashicon, Popover, Button } = wp.components;
const { Component, Fragment } = wp.element;

class AddComponent extends Component {

	constructor() {
		super( ...arguments );
		this.addItem = this.addItem.bind( this );
		this.state = {
			isVisible: false,
		}
	}

	addItem( item, row, column ) {
		const { setList, list } = this.props

		this.setState( { isVisible: false } );
		let updateItems = list;

		updateItems.push( {
			id: item,
		});

		setList( updateItems );
	}

	render() {

		const {
			controlParams,
			location,
			choices,
			row,
			column,
			id
		} = this.props

		const renderItems = ( item, row, column ) => {
			let available = true;
			controlParams.rows.map( ( zone ) => {
				Object.keys( this.props.settings[zone] ).map( ( area ) => {
					if ( this.props.settings[zone][area].includes( item ) ) {
						available = false;
					}
				} );
			} );
			return (
				<Fragment key={item}>
					{ available && (
						<Button
							isTertiary
							className={ 'builder-add-btn' }
							onClick={ () => {
								this.addItem( item, this.props.row, this.props.column );
							} }
						>
							<span className="add-btn-icon"> <Dashicon icon={ ( undefined !== choices[ item ] && undefined !== choices[ item ].icon ? choices[ item ].icon : '' ) }/> </span>
							<span className="add-btn-title">{ ( undefined !== choices[ item ] && undefined !== choices[ item ].name ? choices[ item ].name : '' ) }</span>
						</Button>
					) }
				</Fragment>
			);
		};

		const toggleClose = () => {
			if ( this.state.isVisible === true ) {
				this.setState( { isVisible: false } );
			}
		};

		let droppedCount = 0,
			droppableCount = Object.keys(choices).length;

		if( this.state.isVisible ) {
			controlParams.rows.map( ( zone ) => {
				Object.keys( this.props.settings[zone] ).map( ( area ) => {
					droppedCount = droppedCount + this.props.settings[zone][area].length;
				} );
			} );
		}

		return (
			<div
				className={classnames(
					'ahfb-builder-add-item',
					( ( ('astra-settings[header-desktop-items]' === controlParams.group) || ('astra-settings[footer-desktop-items]' === controlParams.group) ) && 'right' === location ) ? 'center-on-left' : null,
					( ( ('astra-settings[header-desktop-items]' === controlParams.group) || ('astra-settings[footer-desktop-items]' === controlParams.group) ) && 'left' === location ) ? 'center-on-right' :null,
					( ( ('astra-settings[header-desktop-items]' === controlParams.group) || ('astra-settings[footer-desktop-items]' === controlParams.group) ) && 'left_center' === location ) ? 'right-center-on-right' : null,
					( ( ('astra-settings[header-desktop-items]' === controlParams.group) || ('astra-settings[footer-desktop-items]' === controlParams.group) ) && 'right_center' === location ) ? 'left-center-on-left' : null,
				)}
				key={ id }
			>
				{ this.state.isVisible && (
					<Popover position="top" className="ahfb-popover-add-builder" onClose={ toggleClose }>
						<div className="ahfb-popover-builder-list">
							<ButtonGroup className="ahfb-radio-container-control">
								{ Object.keys( choices ).sort().map( ( item ) => {
									return renderItems( item, row, column );
								} ) }
								{
									droppableCount === droppedCount && (
										<p className="ahfb-all-coponents-used"> { __( 'Hurray! All Components Are Being Used.', 'astra' ) } </p>
									)
								}
							</ButtonGroup>
						</div>
					</Popover>
				) }
				<Button
					className="ahfb-builder-item-add-icon dashicon dashicons-plus-alt2"
					onClick={ () => {
						this.setState( { isVisible: true } );
					} }
				>
				</Button>
			</div>
		);
	}
}
export default AddComponent;
