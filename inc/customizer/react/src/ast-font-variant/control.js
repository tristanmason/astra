import FontVariantComponent from './ast-font-variant.js';

export const astFontVariantControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <FontVariantComponent control={ control } />, control.container[0] );
	},
	ready: function() {
		AstTypography.init();
	}
} );