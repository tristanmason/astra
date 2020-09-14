import DropComponent from './drop-component';

const { __ } = wp.i18n;
const { Dashicon, Button } = wp.components;
const { Component } = wp.element;

class RowComponent extends Component {

	render() {

		let centerClass = 'no-center-items';
		let mode = ( this.props.controlParams.group.indexOf( 'header' ) !== -1 ? 'header' : 'footer' );
		let besideItems = [];
		let layout = '';
		let zone_count = 0;
		let rowClass = '';
		let enableRow = true;

		if ( 'footer' === mode ) {
			layout = `ast-grid-row-layout-${this.props.layout[this.props.row].layout.desktop}`
			zone_count = ( this.props.layout[this.props.row].column - 1 )

			Object.keys( this.props.controlParams.zones[ this.props.row ] ).map( ( zone, index ) => {
				if ( zone_count < index ) {
					this.props.items[zone] = [];
				}
			});
		}

		if (
			( 'astra-settings[header-desktop-items]' === this.props.controlParams.group ) &&
			typeof this.props.items[this.props.row + '_center'] != "undefined" &&
			this.props.items[this.props.row + '_center'] != null &&
			this.props.items[this.props.row + '_center'].length != null &&
			this.props.items[this.props.row + '_center'].length > 0
		) {
			centerClass = 'has-center-items';
		}

		if ( 'popup' === this.props.row ) {
			centerClass = 'popup-vertical-group';
		}

		if( this.props.controlParams.hasOwnProperty('status') ) {
			switch ( this.props.row ) {

				case 'above':
					if( ! this.props.controlParams.status.above ) {
						enableRow = false;
						rowClass = 'ahfb-grid-disabled';
					}
					break;
				case 'primary':
					if( ! this.props.controlParams.status.primary ) {
						enableRow = false;
						rowClass = 'ahfb-grid-disabled';
					}
					break;
				case 'below':
					if( ! this.props.controlParams.status.below ) {
						enableRow = false;
						rowClass = 'ahfb-grid-disabled';
					}
					break;
			}
		}

		return (
			<div className={ `ahfb-builder-areas ahfb-builder-mode-${mode} ${ centerClass }` } data-row={this.props.row}>
				<Button
					className="ahfb-row-actions"
					onClick={ () => this.props.focusPanel( this.props.row + '-' + mode  ) }
				>
					<Dashicon icon="admin-generic" />
					{ ( this.props.row === 'popup' ? __( 'Off Canvas', 'astra' ) : this.props.row + ' ' + mode ) }
				</Button>
					<div className={`ahfb-builder-group ahfb-builder-group-horizontal ${layout}`} data-setting={ this.props.row }>
					{ Object.keys( this.props.controlParams.zones[ this.props.row ] ).map( ( zone, index ) => {

						if ( 'footer' === mode && zone_count < index ) {
							return;
						}

						if ( ( this.props.row + '_left_center' === zone || this.props.row + '_right_center' === zone ) && 'footer' !== mode ) {
							return;
						}

						if ( ( 'astra-settings[header-desktop-items]' === this.props.controlParams.group ) && this.props.row + '_left' === zone && 'footer' !== mode ) {
							besideItems = this.props.items[ this.props.row + '_left_center' ];
						}

						if ( ('astra-settings[header-desktop-items]' === this.props.controlParams.group ) && this.props.row + '_right' === zone && 'footer' !== mode ) {
							besideItems = this.props.items[ this.props.row + '_right_center' ];
						}

						return enableRow && ( <DropComponent
								removeItem={ ( remove, removeRow, removeZone ) => this.props.removeItem( remove, removeRow, removeZone ) }
								focusItem={ ( focus ) => this.props.focusItem( focus ) }
								hideDrop={ () => this.props.hideDrop() }
								showDrop={ () => this.props.showDrop() }
								onUpdate={ ( updateRow, updateZone, updateItems ) => this.props.onUpdate( updateRow, updateZone, updateItems ) }
								zone={ zone }
								row={ this.props.row }
								choices={ this.props.choices }
								key={ zone }
								items={ this.props.items[zone] }
								centerItems={ besideItems }
								controlParams={ this.props.controlParams }
								onAddItem={ ( updateRow, updateZone, updateItems ) => this.props.onAddItem( updateRow, updateZone, updateItems ) }
								settings={ this.props.settings }
								mode={ mode }
							/>
						);
					} ) }
				</div>
			</div>
		);
	}
}
export default RowComponent;
