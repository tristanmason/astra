import PropTypes from 'prop-types';
import { Component, Fragment } from '@wordpress/element';

class SettingsGroupComponent extends Component {
	render() {
		let htmlLabel = null;
        let htmlHelp = null;
        const clickHandler = () => {
            alert('working');
        };
		if ( this.props.control.params.label ) {
			htmlLabel = <span className="customize-control-title" onClick={clickHandler} >{ this.props.control.params.label }</span>;
		}
		if ( this.props.control.params.help ) {
			htmlHelp = <span className="ast-description">{ this.props.control.params.help }</span>;
        }
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
