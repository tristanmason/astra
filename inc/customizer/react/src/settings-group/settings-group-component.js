import PropTypes from 'prop-types';
import { Component, Fragment } from '@wordpress/element';

class SettingsGroupComponent extends Component {
	render() {
		let htmlLabel = null;
        let htmlHelp = null;
        console.log('Image Dragons');
        console.log(this.props.control.params.label);
		if ( this.props.control.params.label ) {
			htmlLabel = <span className="customize-control-title">{ this.props.control.params.label }</span>;
		}
		if ( this.props.control.params.help ) {
			htmlHelp = <span className="ast-description">{ this.props.control.params.help }</span>;
        }
        const clickHandler = () => {
            alert('working');
        };
		return (
            <Fragment>
                <div className="ast-toggle-desc-wrap">
                    <label className="customizer-text">
                        { htmlLabel }
                        { htmlHelp }
                        <span className="ast-adv-toggle-icon dashicons" data-control={this.props.control.params.name} onClick={clickHandler}></span>
                    </label>
                </div>
                <div className="ast-field-settings-wrap">
                </div>
            </Fragment>
		);
	}
}

SettingsGroupComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default SettingsGroupComponent;
