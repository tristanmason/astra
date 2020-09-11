/* jshint esversion: 6 */
import PropTypes from 'prop-types';
import RowComponent from './row-component';

const { Component } = wp.element;

class BuilderComponent extends Component {

	constructor() {
		super( ...arguments );
		this.updatePresetSettings = this.updatePresetSettings.bind( this );
		this.updateRowLayout = this.updateRowLayout.bind( this );
		this.updateValues = this.updateValues.bind( this );
		this.onDragEnd = this.onDragEnd.bind( this );
		this.onAddItem = this.onAddItem.bind( this );
		this.onDragStart = this.onDragStart.bind( this );
		this.onDragStop = this.onDragStop.bind( this );
		this.removeItem = this.removeItem.bind( this );
		this.focusPanel = this.focusPanel.bind( this );
		this.focusItem = this.focusItem.bind( this );

		let value = this.props.control.setting.get();


		let baseDefault = {};
		this.defaultValue = this.props.control.params.default ? {
			...baseDefault,
			...this.props.control.params.default
		} : baseDefault;

		value = value ? {
			...this.defaultValue,
			...value
		} : this.defaultValue;

		let defaultParams = {};

		this.controlParams = this.props.control.params.input_attrs ? {
			...defaultParams,
			...this.props.control.params.input_attrs,
		} : defaultParams;

		this.choices = ( AstraBuilderCustomizerData && AstraBuilderCustomizerData.choices && AstraBuilderCustomizerData.choices[ this.controlParams.group ] ? AstraBuilderCustomizerData.choices[ this.controlParams.group ] : [] );

		this.state = {
			value: value,
			layout: this.controlParams.layouts
		};
		this.updatePresetSettings();
		this.updateRowLayout();

	}

	updateRowLayout() {
		let self = this;
		document.addEventListener( 'AstraBuilderChangeRowLayout', function( e ) {
			if( "astra-settings[footer-desktop-items]" !== self.controlParams.group ) {
				return;
			}

			if ( '' === e.detail.type ) {
				return;
			}

			let newParams = self.controlParams;

			if ( newParams.layouts[e.detail.type] ) {

				newParams.layouts[e.detail.type] = {
					'column' : e.detail.columns,
					'layout' : e.detail.layout,
				}

				self.setState( { layout: newParams.layouts } );
				self.updateValues( newParams );
			}

		} );
	}

	updatePresetSettings() {
		let self = this;
		document.addEventListener( 'AstraBuilderPresetSettingsUpdate', function( event ) {

			// Load Only Context Area.
			if( self.controlParams.group === event.detail.id ) {

				self.setState( { value: event.detail.grid_layout } );
				self.updateValues( event.detail.grid_layout );
			}


		} );
	}

	onDragStart() {
		var dropzones = document.querySelectorAll( '.ahfb-builder-area' );
		var i;
		for (i = 0; i < dropzones.length; ++i) {
			dropzones[i].classList.add( 'ahfb-dragging-dropzones' );
		}
	}

	onDragStop() {
		var dropzones = document.querySelectorAll( '.ahfb-builder-area' );
		var i;
		for (i = 0; i < dropzones.length; ++i) {
			dropzones[i].classList.remove( 'ahfb-dragging-dropzones' );
		}
	}

	removeItem( item, row, zone ) {
		let updateState = this.state.value;
		let update = updateState[ row ];
		let updateItems = [];
		{ update[ zone ].length > 0 && (
			update[ zone ].map( ( old ) => {
				if ( item !== old ) {
					updateItems.push( old );
				}
			} )
		) }

		if ( ( ('astra-settings[header-desktop-items]' === this.controlParams.group) )  &&  row + '_center' === zone && updateItems.length === 0 ) {
			if ( update[ row + '_left_center' ].length > 0 ) {
				update[ row + '_left_center' ].map( ( move ) => {
					updateState[ row ][ row + '_left' ].push( move );
				} )
				updateState[ row ][ row + '_left_center' ] = [];
			}
			if ( update[ row + '_right_center' ].length > 0 ) {
				update[ row + '_right_center' ].map( ( move ) => {
					updateState[ row ][ row + '_right' ].push( move );
				} )
				updateState[ row ][ row + '_right_center' ] = [];
			}
		}
		update[ zone ] = updateItems;
		updateState[ row ][ zone ] = updateItems;
		this.setState( { value: updateState } );
		this.updateValues( updateState );
		let event = new CustomEvent(
			'AstraBuilderRemovedBuilderItem', {
				'detail': this.controlParams.group
			}
		);
		document.dispatchEvent( event );
	}

	onDragEnd( row, zone, items ) {

		let updateState = this.state.value;
		let update = updateState[ row ];
		let updateItems = [];
		{ items.length > 0 && (
			items.map( ( item ) => {
				updateItems.push( item.id );
			} )
		) };
		if ( ! this.arraysEqual( update[ zone ], updateItems ) ) {
			if ( ( ('astra-settings[header-desktop-items]' === this.controlParams.group) ) && row + '_center' === zone && updateItems.length === 0 ) {
				if ( update[ row + '_left_center' ].length > 0 ) {
					update[ row + '_left_center' ].map( ( move ) => {
						updateState[ row ][ row + '_left' ].push( move );
					} )
					updateState[ row ][ row + '_left_center' ] = [];
				}
				if ( update[ row + '_right_center' ].length > 0 ) {
					update[ row + '_right_center' ].map( ( move ) => {
						updateState[ row ][ row + '_right' ].push( move );
					} )
					updateState[ row ][ row + '_right_center' ] = [];
				}
			}
			update[ zone ] = updateItems;
			updateState[ row ][ zone ] = updateItems;
			this.setState( { value: updateState } );
			this.updateValues( updateState );
		}
	}

	onAddItem( row, zone, items ) {

		this.onDragEnd( row, zone, items );
		let event = new CustomEvent(
			'AstraBuilderRemovedBuilderItem', {
				'detail': this.controlParams.group
			} );
		document.dispatchEvent( event );
	}

	arraysEqual( a, b ) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;		
		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	focusPanel( item ) {

		item = 'section-' + item + '-builder';

		if ( undefined !== this.props.customizer.section( item ) ) {
			this.props.customizer.section( item ).focus();
		}
	}

	focusItem( item ) {
		if ( undefined !== this.props.customizer.section( item ) ) {
			this.props.customizer.section( item ).focus();
		}
	}

	render() {

		return (
			<div className="ahfb-control-field ahfb-builder-items">
				{ this.controlParams.rows.includes( 'popup' ) && (
					<RowComponent
						showDrop={ () => this.onDragStart() }
						focusPanel={ ( item ) => this.focusPanel( item ) }
						focusItem={ ( item ) => this.focusItem( item ) }
						removeItem={ ( remove, row, zone ) => this.removeItem( remove, row, zone ) }
						onAddItem={ ( updateRow, updateZone, updateItems ) => this.onAddItem( updateRow, updateZone, updateItems ) }
						hideDrop={ () => this.onDragStop() }
						onUpdate={ ( updateRow, updateZone, updateItems ) => this.onDragEnd( updateRow, updateZone, updateItems ) }
						key={ 'popup' }
						row={ 'popup' }
						controlParams={ this.controlParams }
						choices={ this.choices }
						items={ this.state.value[ 'popup' ] }
						settings={ this.state.value }
						layout={ this.state.layout }
					/>
				) }
				<div className="ahfb-builder-row-items">
					{ this.controlParams.rows.map( ( row ) => {
						if ( 'popup' === row ) {
							return;
						}
						return <RowComponent
							showDrop={ () => this.onDragStart() }
							focusPanel={ ( item ) => this.focusPanel( item ) }
							focusItem={ ( item ) => this.focusItem( item ) }
							removeItem={ ( remove, row, zone ) => this.removeItem( remove, row, zone ) }
							hideDrop={ () => this.onDragStop() }
							onUpdate={ ( updateRow, updateZone, updateItems ) => this.onDragEnd( updateRow, updateZone, updateItems ) }
							onAddItem={ ( updateRow, updateZone, updateItems ) => this.onAddItem( updateRow, updateZone, updateItems ) }
							key={ row }
							row={ row }
							controlParams={ this.controlParams }
							choices={ this.choices }
							customizer={ this.props.customizer }
							items={ this.state.value[ row ] }
							settings={ this.state.value }
							layout={ this.state.layout }
						/>
					} ) }
				</div>
			</div>
		);
	}

	updateValues( value ) {

		this.props.control.setting.set( {
			...this.props.control.setting.get(),
			...value,
			flag: !this.props.control.setting.get().flag
		} );
	}

}

BuilderComponent.propTypes = {
	control: PropTypes.object.isRequired,
	customizer: PropTypes.func.isRequired
};

export default BuilderComponent;
