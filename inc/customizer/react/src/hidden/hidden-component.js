import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class HiddenComponent extends Component {
	constructor(props) {
        super( props );
        this.value = props.control.setting.get();
        this.state = {
			value : this.value,
        };
        
        this.name = props.control.params.settings.default;
        this.name = this.name.replace( '[', '-' );
        this.name = this.name.replace( ']', '' );
	}
      
	render() {
            const cssClass = `hidden-field-${ this.name }`;
		return (
                  <input type='hidden' className={ cssClass } data-name={ this.name } value={ this.state.value }/>
		);
    }

}

HiddenComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default HiddenComponent;
