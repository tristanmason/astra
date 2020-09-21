import SocialIcons from './icons.js';

const { __ } = wp.i18n;
const { Dashicon, Tooltip, TextControl, Button } = wp.components;

const { Component, Fragment } = wp.element;
class ItemComponent extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			open: false,
		};
	}
	render() {
		return (
			<div className="ahfb-sorter-item" data-id={ this.props.item.id } key={ this.props.item.id }>
				<div className="ahfb-sorter-item-panel-header"
					onClick={ () => {
						this.setState( { open: ( this.state.open ? false : true ) } )
					} } >
					<Tooltip text={ __( 'Toggle Item Visiblity', 'astra' ) }>
						<Button
							className="ahfb-sorter-visiblity"
						>
						{ SocialIcons[this.props.item.id] }
						</Button>
					</Tooltip>
					<span className="ahfb-sorter-title">
						{ ( undefined !== this.props.item.label && '' !== this.props.item.label ? this.props.item.label : __( 'Social Item', 'astra' ) ) }
					</span>
					<Button
						className={ `ahfb-sorter-item-expand ${ ( this.props.item.enabled ? 'item-is-visible' : 'item-is-hidden' ) }`}
						onClick={ (e) => {
							e.stopPropagation();
							this.props.toggleEnabled( ( this.props.item.enabled ? false : true ), this.props.index );
						} }
					>
						<Dashicon icon="visibility"/>
					</Button>
					<Button
						className="ahfb-sorter-item-remove"
						isDestructive
						onClick={ () => {
							this.props.removeItem( this.props.index );
						} }
					>
						<Dashicon icon="no-alt"/>
					</Button>
				</div>
				{ this.state.open && (
					<div className="ahfb-sorter-item-panel-content">
						<TextControl
							label={ __( 'Label', 'astra' ) }
							value={ this.props.item.label ? this.props.item.label : '' }
							onChange={ ( value ) => {
								this.props.onChangeLabel( value, this.props.index );
							} }
						/>

						<TextControl
							label={ __( 'URL', 'astra' ) }
							value={ this.props.item.url ? this.props.item.url : '' }
							onChange={ ( value ) => {
								this.props.onChangeURL( value, this.props.index );
							} }
						/>
					</div>
				) }
			</div>
		);
	}
}
export default ItemComponent;
