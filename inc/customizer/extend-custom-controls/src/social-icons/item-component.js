import {useState} from 'react';

const {__} = wp.i18n;
const {Dashicon, Tooltip, TextControl, Button, Popover, TabPanel } = wp.components;
import AstraColorPickerControl from '../common/astra-color-picker-control';
import ResponsiveColorComponent from '../responsive-color/responsive-color-component';

const ItemComponent = props => {

	const Icons = window.svgIcons;

	const [state, setState] = useState({
		open: false,
		isVisible: false,
		colors: {}
	});

	const toggleClose = () => {
		let obj = {
			...state
		};
		obj['isVisible'] = false
		if ( state.isVisible === true ) {
			setState(obj)			
		}
	};
	const toggleVisible = () => {
		let obj = {
			...state
		};
		obj['isVisible'] = true
		setState(obj)
	};
	return <div className="ahfb-sorter-item" data-id={props.item.id} key={props.item.id}>
		<div className="ahfb-sorter-item-panel-header" onClick={() => {
			setState((prevState => ({
				...prevState,
				open: state.open ? false : true
			})))
		}}>
			<Tooltip text={__('Toggle Item Visiblity', 'astra')}>
				<Button className="ahfb-sorter-visiblity">
							<span dangerouslySetInnerHTML={{
								__html: Icons[props.item.id]
							}}/>
				</Button>
			</Tooltip>
			<span className="ahfb-sorter-title">
						{undefined !== props.item.label && '' !== props.item.label ? props.item.label : __('Social Item', 'astra')}
					</span>
			<Button className={`ahfb-sorter-item-expand ${props.item.enabled ? 'item-is-visible' : 'item-is-hidden'}`}
					onClick={e => {
						e.stopPropagation();
						props.toggleEnabled(props.item.enabled ? false : true, props.index);
					}}>
				<Dashicon icon="visibility"/>
			</Button>
			<Button className="ahfb-sorter-item-remove" isDestructive onClick={() => {
				props.removeItem(props.index);
			}}>
				<Dashicon icon="no-alt"/>
			</Button>
		</div>
		{ state.open && <div className="ahfb-sorter-item-panel-content">
			<TextControl label={__('Label', 'astra')} value={props.item.label ? props.item.label : ''}
						 onChange={value => {
							 props.onChangeLabel(value, props.index);
						 }}/>

			<TextControl label={__('URL', 'astra')} value={props.item.url ? props.item.url : ''} onChange={value => {
				props.onChangeURL(value, props.index);
			}}/>
			<p> { __( 'Colors', 'astra' ) } </p>
			<Button className={ 'astra-palette-import' } onClick={ () => { state.isVisible ? toggleClose() : toggleVisible() } }>
				<Dashicon icon="open-folder" />
			</Button>
			{ state.isVisible && (
				<Popover
					position="bottom center"
					onClose={ toggleClose }
					className="ast-social-color-popover"
				>
					<TabPanel className="ast-social-color-tabs" activeClass="active-tab"
							tabs={ [
								{
									name: "normal",
									title: __( 'Normal', 'astra' ),
									className: "ast-normal-tab ast-responsive-tabs",
								},
								{
									name: "hover",
									title:  __( 'Hover', 'astra' ),
									className: "ast-hover-tab ast-responsive-tabs",
								},
							] }>
							{
								( tab ) => {
									let tabout

									if ( "normal" === tab.name ) {
										props.control.params.responsive = true;
										tabout = (
											<div className="ast-social-icon-color">
												<ResponsiveColorComponent control={props.control} customizer={ wp.customize }/>
											</div>
										)
									} else if ( "hover" === tab.name ) {
										tabout = (
											__( 'Hover', 'astra' )
										)
									} 
									return <div>{ tabout }</div>
								}
							}
						</TabPanel>
				</Popover>
			) }
		</div>}
	</div>;
};
export default ItemComponent;
