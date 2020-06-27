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
		return (
            <input type='hidden' className={ 'hidden-field-' + this.name } data-name={ this.name } value={ this.state.value }/>
		);
    }

}

HiddenComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default HiddenComponent;
