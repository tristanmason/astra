import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class CustomizerLinkComponent extends Component {

	constructor( props ) {

		super( props );

		this.onLinkClick = this.onLinkClick.bind(this);
	}

	onLinkClick() {
		
		let linked = event.target.dataset.customizerLinked;
		let linkType = event.target.dataset.astCustomizerLinkType;

		switch ( linkType ) {

			case 'section':
				wp.customize.section( linked ).expand();
				
				break;

			case 'control':
				wp.customize.control( linked ).focus();
				break;
		
			default:
				break;
		}
	}

	render() {
		
		const {
			linked,
			link_text,
			link_type,
		} = this.props.control.params

		let linkHtml = null;

		if ( linked && link_text ) {

			linkHtml = (
				<a href="#" onClick= { () => { this.onLinkClick() } } className="customizer-link" data-customizer-linked={ linked } data-ast-customizer-link-type={ link_type } dangerouslySetInnerHTML={ { __html: link_text } } >
				</a>
			); 
			
		}

		return (
			<>
				{ linkHtml }
			</>
		);
	}
}

CustomizerLinkComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default CustomizerLinkComponent;
