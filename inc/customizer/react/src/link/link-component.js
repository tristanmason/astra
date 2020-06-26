import PropTypes from 'prop-types';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

class LinkComponent extends Component {
	constructor(props) {
		super( props );

		this.state = {
			url : this.props.control.params.value.url,
			link_rel : this.props.control.params.value.link_rel
        };
	}

	render() {

		const {
			value,
			label,
			settings
		} = this.props.control.params

		var name = settings.default;
		name = name.replace( '[', '-' );
		name = name.replace( ']', '' );

		var checked = ( value.new_tab) ? true : false ;
		
		return (
			
			<Fragment>
				{ label && (
					<label>
						<span className="customize-control-title">{ label }</span>
					</label>
				) }
				<div className="customize-control-content">
					<input type="text" className="ast-link-input" value={ this.state.url } />
				</div>
				<div className="customize-control-content ast-link-open-in-new-tab-wrapper">
					<input type="checkbox" id="ast-link-open-in-new-tab" className="ast-link-open-in-new-tab" name="ast-link-open-in-new-tab" checked= { checked }/>
					<label htmlFor="ast-link-open-in-new-tab">{ __( 'Open in a New Tab' ) }</label>
				</div>
				<div className="customize-control-content">
					<label>
						<span className="customize-control-title">{ __( 'Button Link Rel' ) }</span>
					</label>
					<input type="text" className="ast-link-relationship" value={ this.state.link_rel } />
				</div>
				<input type="hidden" id={ `_customize-input-${ settings.default }` } className="customize-link-control-data" name={ name } data-customize-setting-link={ settings.default } data-value={ JSON.stringify( value ) }></input>
			</Fragment>
		);
	}
} 

LinkComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default LinkComponent;