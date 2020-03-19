var title_checkbox = jQuery('#site-post-title');
console.log('hi');
console.log(title_meta_customizer_value);
var title_meta_customizer_value =  title_meta_customizer_value.includes("single-title-meta");
jQuery('.editor-post-title__block').load( title_toggle );
setTimeout(function() {
	if ( !( title_meta_customizer_value ) || (title_checkbox.prop("checked") == true) ){
		var title_block =  jQuery('.editor-post-title__block'  );
		title_block.css('opacity','0.2');
		title_block.css('pointer-events','none');
	}
            }, 500)
var title_toggle = function (){
	var title_block =  jQuery('.editor-post-title__block'  );
	if( jQuery(this).prop("checked") == true ){	
		title_block.css('opacity','0.2');
		title_block.css('pointer-events','none');
	}
	else if (  title_meta_customizer_value  ){
		title_block.css('opacity','1.0');
		title_block.css('pointer-events','auto');	
	}
}
title_checkbox.on('change', title_toggle ); 