const { Dashicon, Button } = wp.components;
const { Component } = wp.element;

class ItemComponent extends Component {

	constructor() {
		super( ...arguments );
		this.choices = ( AstraBuilderCustomizerData && AstraBuilderCustomizerData.choices && AstraBuilderCustomizerData.choices[ this.props.controlParams.group ] ? AstraBuilderCustomizerData.choices[ this.props.controlParams.group ] : [] );
	}

	render() {
		return (
			<div className="ahfb-builder-item" data-id={ this.props.item } data-section={ undefined !== this.choices[ this.props.item ] && undefined !== this.choices[ this.props.item ].section ? this.choices[ this.props.item ].section : '' } key={ this.props.item }
				onClick={ () => {
					this.props.focusItem( undefined !== this.choices[ this.props.item ] && undefined !== this.choices[ this.props.item ].section ? this.choices[ this.props.item ].section : '' );
				} }
			>
				<span className="ahfb-builder-item-text">
					{ ( undefined !== this.choices[ this.props.item ] && undefined !== this.choices[ this.props.item ].name ? this.choices[ this.props.item ].name : '' ) }
				</span>
				<Button
					className="ahfb-builder-item-icon"
					onClick={ (e) => {
						e.stopPropagation();
						this.props.removeItem( this.props.item );
					} }
				>
					<Dashicon icon="no-alt"/>
				</Button>
			</div>
		);
	}
}
export default ItemComponent;
