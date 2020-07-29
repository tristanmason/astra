import ResponsiveBackground from './responsive-background.js';

export const responsiveBackgroundControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveBackground control={ control } />, control.container[0] );
	},
	ready: function() {

		'use strict';

		jQuery('html').addClass('responsive-background-img-ready');
		
		let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

		jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container' ).removeClass( 'active' );

		jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container.' + device ).addClass( 'active' );

		jQuery( '.customize-control-ast-responsive-background .ast-responsive-btns li' ).removeClass( 'active' );

		jQuery( '.customize-control-ast-responsive-background .ast-responsive-btns li.' + device ).addClass( 'active' );

		jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

			var device = jQuery(this).attr('data-device');

			jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container' ).removeClass( 'active' );
			jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container.' + device ).addClass( 'active' );
		});

		this.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {

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