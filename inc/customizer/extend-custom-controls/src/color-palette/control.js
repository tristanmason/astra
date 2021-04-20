import ColorPaletteComponent from './color-palette.js';

export const colorPaletteControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(  <ColorPaletteComponent control={ control }  customizer={ wp.customize }/>, control.container[0] );
	},
	ready : function() {
		'use strict';
		let control = this;
		jQuery(document).mouseup(function(e){
			var container = jQuery(control.container);
			var colorWrap = container.find('.astra-color-picker-wrap');
			// If the target of the click isn't the container nor a descendant of the container.
			if (!colorWrap.is(e.target) && colorWrap.has(e.target).length === 0){
				container.find('.components-button.astra-color-icon-indicate.open').click();
			}
		});

		const globalPalette = wp.customize.control( 'astra-settings[global-color-palette]' ).setting.get();
		//this.setPaletteVariables( globalPalette.palette );

	},
	setPaletteVariables: function( palette ) {

		console.log( palette );

		var customizer_preview_container =  document.getElementById('customize-preview')
		var iframe = customizer_preview_container.getElementsByTagName('iframe')[0]
		var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
		var stylePrefix = astra.customizer.globalPaletteStylePrefix;

		Object.entries( palette ).map( ( paletteItem, index ) => {
			innerDoc.documentElement.style.setProperty( stylePrefix + index, paletteItem[1] );
			document.documentElement.style.setProperty( stylePrefix + index, paletteItem[1] );
		} );
	}
} );
