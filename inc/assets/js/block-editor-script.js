jQuery(document).ready(function($) {
	$( '#astra_settings_meta_box #site-content-layout' ).on( 'click', function( event ) {
		// event.preventDefault();
		var content_Layout = jQuery( this ).val();

		if ( 'content-boxed-container' == content_Layout ) {
			jQuery('body').addClass( 'ast-separate-container' );
			jQuery('body').removeClass( 'ast-two-container ast-page-builder-template ast-plain-container' );
		} else if ( 'boxed-container' == content_Layout ) {
			jQuery('body').addClass( 'ast-separate-container ast-two-container' );
			jQuery('body').removeClass( 'ast-page-builder-template ast-plain-container' );
		} else if ( 'page-builder' == content_Layout ) {
			jQuery('body').addClass( 'ast-page-builder-template' );
			jQuery('body').removeClass( 'ast-two-container ast-plain-container ast-separate-container' );
		} else if ( 'plain-container' == content_Layout ) {
			jQuery('body').addClass( 'ast-plain-container' );
			jQuery('body').removeClass( 'ast-two-container ast-page-builder-template ast-separate-container' );
		}
	});
});