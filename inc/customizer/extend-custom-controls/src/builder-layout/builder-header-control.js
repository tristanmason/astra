/* global wp, jQuery */
import React from 'react';
import ReactDOM from 'react-dom';
const { __ } = wp.i18n;

const BuilderHeader = ( props ) => {

	if( "section-footer-builder" === props.control.params.section ) {
		return (
			<React.Fragment>
				<span className="ast-customize-control-title"></span>
				<span className="ast-customize-control-description">
					<span className="button button-secondary ahfb-builder-section-shortcut section-footer-builder" data-section="section-footer-builder"> <span className="dashicons dashicons-admin-generic"> </span> </span>
					<span className="button button-secondary ahfb-builder-hide-button ahfb-builder-tab-toggle">
						<span className="ast-builder-hide-action"> <span className="dashicons dashicons-arrow-down-alt2"></span> { __( 'Hide Builder', 'astra' ) } </span>
						<span className="ast-builder-show-action"> <span className="dashicons dashicons-arrow-up-alt2"></span> { __( 'Show Builder', 'astra' ) } </span>
					</span>
				</span>
			</React.Fragment>
		);

	} else if( "section-header-builder" === props.control.params.section ) {
		return (
			<React.Fragment>
				<span className="ast-customize-control-title"></span>
				<span className="ast-customize-control-description">
					<span className="button button-secondary ahfb-builder-section-shortcut section-header-builder" data-section="section-header-builder"> <span className="dashicons dashicons-admin-generic"> </span> </span>
					<span className="button button-secondary ahfb-builder-hide-button ahfb-builder-tab-toggle">
						<span className="ast-builder-hide-action"> <span className="dashicons dashicons-arrow-down-alt2"></span> { __( 'Hide Builder', 'astra' ) } </span>
						<span className="ast-builder-show-action"> <span className="dashicons dashicons-arrow-up-alt2"></span> { __( 'Show Builder', 'astra' ) } </span>
					</span>
				</span>
			</React.Fragment>
		);
	} else {
		return (
			<React.Fragment>
				<div className="ahfb-compontent-tabs nav-tab-wrapper wp-clearfix">
					<a href="#"
					   className={"nav-tab ahfb-general-tab ahfb-compontent-tabs-button " + ( ( 'general' === props.tab ) ? "nav-tab-active" : "" ) }
					   data-tab="general">
						<span>{ __( 'General', 'astra' ) }</span>
					</a>
					<a href="#" className={"nav-tab ahfb-design-tab ahfb-compontent-tabs-button " + ( ( 'design' ===  props.tab ) ? "nav-tab-active" : "" ) }
					   data-tab="design">
						<span>{ __( 'Design', 'astra' ) }</span>
					</a>
				</div>
			</React.Fragment>
		)
	}


};

export const BuilderHeaderControl = wp.customize.astraControl.extend( {
    renderContent: function renderContent() {
        let control = this;

        ReactDOM.render(
        	<BuilderHeader
				control={control}
				tab={ wp.customize.state( 'astra-customizer-tab' ).get() }
				customizer={ wp.customize } />, control.container[0] );
    }
} );

