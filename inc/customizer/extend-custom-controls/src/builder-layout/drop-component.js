/* jshint esversion: 6 */
import { ReactSortable } from "react-sortablejs";
import ItemComponent from './item-component';
import AddComponent from './add-component';

const { Component, Fragment } = wp.element;

class DropComponent extends Component {

	render() {
		const location = this.props.zone.replace( this.props.row + '_', '');
		const currentList = ( typeof this.props.items != "undefined" && this.props.items != null && this.props.items.length != null && this.props.items.length > 0 ? this.props.items : [] );
		let choices = this.props.choices;

		let theItems = [];
		{ currentList.length > 0 && (
			currentList.map( ( item, key ) => {
				if ( Object.keys( choices ).includes( item ) ) {
					theItems.push(
						{
							id: item,
						}
					)
				} else {
					currentList.splice( key, 1 );
				}
			} )
		) }

		const currentCenterList = ( typeof this.props.centerItems != "undefined" && this.props.centerItems != null && this.props.centerItems.length != null && this.props.centerItems.length > 0 ? this.props.centerItems : [] );

		let theCenterItems = [];
		{ currentCenterList.length > 0 && (
			currentCenterList.map( ( item, key ) => {
				if ( Object.keys( choices ).includes( item ) ) {
					theCenterItems.push(
						{
							id: item,
						}
					)
				} else {
					currentCenterList.splice( key, 1 );
				}
			} )
		) }

		const sortableGroup = ( items, lists, loc ) => {
			let add_id_loc = loc.replace( "_", "-" )
			return (
				<Fragment>
					<ReactSortable
						animation={100}
						onStart={ () => this.props.showDrop() }
						onEnd={ () => this.props.hideDrop() }
						group={ this.props.controlParams.group }
						className={ 'ahfb-builder-drop ahfb-builder-sortable-panel ahfb-builder-drop-' + location + loc }
						list={ items }
						setList={ newState => this.props.onUpdate( this.props.row, this.props.zone + loc, newState ) }
					>
						{ lists.length > 0 && (
							lists.map( ( item, index ) => {
								return (
									<ItemComponent
										removeItem={ ( remove ) => this.props.removeItem( remove, this.props.row, this.props.zone + loc ) }
										focusItem={ ( focus ) => this.props.focusItem( focus ) }
										key={ item }
										index={ index }
										item={ item }
										controlParams={ this.props.controlParams }
									/>
								)
							} )
						) }
					</ReactSortable>
					<AddComponent
						row={ this.props.row }
						list={ items }
						settings={ this.props.settings }
						column={ this.props.zone + loc }
						setList={ newState => this.props.onAddItem( this.props.row, this.props.zone + loc, newState ) }
						key={ location }
						location={ location + loc }
						id={ 'add' + add_id_loc + '-' + location }
						controlParams={ this.props.controlParams }
						choices={ this.props.choices }
					/>
				</Fragment>
			)
		}

		if ( 'footer' === this.props.mode ) {
			return (
				<div className={ `ahfb-builder-area ahfb-builder-area-${ location }` } data-location={ this.props.zone }>
					<p className="ahfb-small-label">{ this.props.controlParams.zones[this.props.row][this.props.zone] }</p>
					{ sortableGroup( theItems, currentList, '' ) }
				</div>
			);
		}

		return (
			<div className={ `ahfb-builder-area ahfb-builder-area-${ location }` } data-location={ this.props.zone }>
				<p className="ahfb-small-label">{ this.props.controlParams.zones[this.props.row][this.props.zone] }</p>
				{
					('astra-settings[header-desktop-items]' === this.props.controlParams.group) &&
					'right' === location &&
					( sortableGroup( theCenterItems, currentCenterList, '_center' ) )
				}
				{ sortableGroup( theItems, currentList, '' ) }
				{
					('astra-settings[header-desktop-items]' === this.props.controlParams.group) &&
					'left' === location &&
					( sortableGroup( theCenterItems, currentCenterList, '_center' ) )
				}
			</div>
		);
	}
}

export default DropComponent;
