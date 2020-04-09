

var title_meta_customizer_value =  title_meta_customizer_value.includes("single-title-meta");
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

	var title_checkbox = jQuery('#site-post-title');
	
	//function to toggle the title div in gutenber customizer
	var title_toggle = function (){
		var title_block =  jQuery('.editor-post-title__block'  );
		if( jQuery(this).prop("checked") == true ){	
			title_block.css('opacity','0.2');
		}
		else if (  title_meta_customizer_value  ){
			title_block.css('opacity','1.0');
		}
	}
	title_checkbox.on('change', title_toggle ); 
});

