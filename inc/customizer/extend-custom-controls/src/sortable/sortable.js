import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class SortableComponent extends Component {

	render() {

		let labelHtml = null;
		let descriptionHtml = null;
		let visibleMetaHtml = null;
		let invisibleMetaHtml = null;

		const {
			label,
			description,
			value,
			choices,
			inputAttrs
		} = this.props.control.params
		
		if ( label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>;
		}

		if ( description ) {
			
			descriptionHtml = <span className="description customize-control-description">{ description }</span>;
		}

		visibleMetaHtml = Object.values( value ).map( ( choiceID ) => {

			if ( choices[ choiceID ] ) { 
				
				var html = ( 
					<li { ...inputAttrs } key={ choiceID } className='ast-sortable-item' data-value={ choiceID } >
						<i className='dashicons dashicons-menu'></i>
						<i className="dashicons dashicons-visibility visibility"></i>
						{ choices[ choiceID ] }
					</li> 
				);
			}

			return html;
		} );

		invisibleMetaHtml = Object.keys( choices ).map( ( choiceID ) => {

			if ( Array.isArray( value ) && -1 === value.indexOf( choiceID ) ) { 
				
				var html = ( 
					<li { ...inputAttrs } key={ choiceID } className='ast-sortable-item invisible' data-value={ choiceID }>
						<i className='dashicons dashicons-menu'></i>
						<i className="dashicons dashicons-visibility visibility"></i>
						{ choices[ choiceID ] }
					</li> 
				);
			}

			return html;
		} );

		return (
			<label className='ast-sortable'>
				{ labelHtml }
				{ descriptionHtml }
				<ul className="sortable">
					{ visibleMetaHtml }
					{ invisibleMetaHtml }
				</ul>
			</label>	
		);
	}
}

SortableComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default SortableComponent;
