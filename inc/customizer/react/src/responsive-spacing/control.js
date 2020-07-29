import ResponsiveSpacingComponent from './responsive-spacing-component.js';

export const responsiveSpacingControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveSpacingComponent control={ control } />, control.container[0] );
	},
	ready: function() {

		'use strict';

		let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

		jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper' ).removeClass( 'active' );

		jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper.' + device ).addClass( 'active' );

		jQuery( '.customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li' ).removeClass( 'active' );

		jQuery( '.customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li.' + device ).addClass( 'active' );

		jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

			var device = jQuery(this).attr('data-device');

			jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper, .customize-control .ast-spacing-responsive-btns > li' ).removeClass( 'active' );
			jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper.' + device + ', .customize-control .ast-spacing-responsive-btns > li.' + device ).addClass( 'active' );
		});

		this.container.find( '.ast-spacing-responsive-btns button' ).on( 'click', function( event ) {

			var device = jQuery(this).attr('data-device');
			if( 'desktop' == device ) {
				device = 'tablet';
			} else if( 'tablet' == device ) {
				device = 'mobile';
			} else {
				device = 'desktop';
			}

			jQuery( '.wp-full-overlay-footer .devices button[data-device="' + device + '"]' ).trigger( 'click' );
		});
	},
} );