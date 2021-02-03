import ColorGroupComponent from './color-group-component';

export const colorGroupControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render( <ColorGroupComponent control={ control } />, control.container[0] );
	},
	ready : function() {
		'use strict';
		var control = this;
		// control.registerToggleEvents();
	},
	registerToggleEvents: function() {
		/* Close popup when click outside anywhere outside of popup */
		jQuery( '.wp-full-overlay-sidebar-content, .wp-picker-container' ).click( function( e ) {
			if ( ! jQuery( e.target ).closest( '.ast-field-color-group-wrap .astra-popover-color' ).length ) {
				jQuery( e.target ).closest( '.ast-field-color-group-wrap .astra-color-icon-indicate' ).trigger( 'click' );
			}
		});
	},
} );
