import FontPresetsComponent from './font-presets-component';

export const FontPresetControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render( <FontPresetsComponent control={ control } />, control.container[0] );
	},
	ready : function() {
		'use strict';
		let control = this;
		jQuery(document).mouseup(function(e) {

		});
	},
} );
