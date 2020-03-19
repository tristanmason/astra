var title_checkbox = jQuery('#site-post-title');

var title_meta_customizer_value =  title_meta_customizer_value.includes("single-title-meta");
jQuery('.editor-post-title__block').load( title_toggle );
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