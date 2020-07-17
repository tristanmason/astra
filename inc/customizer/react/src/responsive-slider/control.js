import ResponsiveSliderComponent from './responsive-slider-component.js';

export const responsiveSliderControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <ResponsiveSliderComponent control={ control } />, control.container[0] );
	},
	ready: function() {

		'use strict';

		let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

		jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper' ).removeClass( 'active' );

		jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper.' + device ).addClass( 'active' );

		jQuery( '.customize-control-ast-responsive-slider .ast-responsive-slider-btns li' ).removeClass( 'active' );

		jQuery( '.customize-control-ast-responsive-slider .ast-responsive-slider-btns li.' + device ).addClass( 'active' );

		jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

			var device = jQuery(this).attr('data-device');

			jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper, .customize-control .ast-responsive-slider-btns > li' ).removeClass( 'active' );
			jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper.' + device + ', .customize-control .ast-responsive-slider-btns > li.' + device ).addClass( 'active' );
		});

		this.container.find( '.ast-responsive-slider-btns button' ).on( 'click', function( event ) {

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
	}
} );