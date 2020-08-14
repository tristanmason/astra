import Background from './background.js';

export const backgroundControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <Background control={ control } />, control.container[0] );
	},
	ready: function() {

		'use strict';

		jQuery('html').addClass('background-colorpicker-ready');
		
	},
} );