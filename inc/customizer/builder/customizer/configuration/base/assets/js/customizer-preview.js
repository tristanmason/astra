/**
 * HTML Component CSS.
 * 
 * @param string builder_type Builder Type.
 * @param string html_count HTML Count.
 * 
 */
function astra_builder_html_css( builder_type = 'header', html_count ) {

    for ( var index = 1; index <= html_count; index++ ) {

        let selector = ( 'header' === builder_type ) ? '.site-header-section .ast-builder-layout-element.ast-header-html-' + index : '.footer-widget-area[data-section="section-fb-html-' + index + '"]';
        
        let section = ( 'header' === builder_type ) ? 'section-hb-html-' + index : 'section-fb-html-' + index;

        // HTML color.
        astra_css(
            'astra-settings[' + builder_type + '-html-' + index + 'color]',
            'color',
            selector + ' .ast-builder-html-element'
        );

        // Advanced CSS Generation.
        astra_builder_advanced_css( section, selector );

        // Typography CSS Generation.
        astra_builder_typography_css( section, selector );
    }
}

/**
 * Social Component CSS.
 * 
 * @param string builder_type Builder Type.
 * @param string section Section.
 * 
 */
function astra_builder_social_css( builder_type = 'header' ) {

    var selector = '.ast-builder-layout-element .ast-' + builder_type + '-social-wrap';
	var section = 'section-' + builder_type + '-social-icons';

	// Icon Color.
	astra_color_responsive_css( 
		'hfb-soc-color', 
		'astra-settings[' + builder_type + '-social-icons-color]', 
		'color', 
		selector + ' .ast-builder-social-element' 
	);
	astra_color_responsive_css( 
		'hfb-soc-color-h', 
		'astra-settings[' + builder_type + '-social-icons-h-color]', 
		'color', 
		selector + ' .ast-builder-social-element:hover' 
	);
	astra_color_responsive_css( 
		'hfb-soc-svg-color-h', 
		'astra-settings[' + builder_type + '-social-icons-h-color]', 
		'fill', 
		selector + ' .ast-builder-social-element:hover svg' 
	);

	// Icon Background Color.
	astra_color_responsive_css( 
		'hfb-soc-bg-color', 
		'astra-settings[' + builder_type + '-social-icons-bg-color]', 
		'background-color', 
		selector + ' .ast-builder-social-element' 
	);
	astra_color_responsive_css( 
		'hfb-soc-bg-color-h', 
		'astra-settings[' + builder_type + '-social-icons-bg-h-color]', 
		'background-color', 
		selector + ' .ast-builder-social-element:hover' 
	);

	// Icon Size - Height.
	astra_css(
		'astra-settings[' + builder_type + '-social-icons-icon-size]',
		'height',
		selector + ' .ast-builder-social-element .ahfb-svg-icon',
		'px'
	);

	// Icon Size - Width.
	astra_css(
		'astra-settings[' + builder_type + '-social-icons-icon-size]',
		'width',
		selector + ' .ast-builder-social-element .ahfb-svg-icon',
		'px'
	);

	// Icon Background Space.
	astra_css(
		'astra-settings[' + builder_type + '-social-icons-icon-bg-space]',
		'padding',
		selector + ' .ast-builder-social-element',
		'px'
	);

	// Icon Border Radius.
	astra_css(
		'astra-settings[' + builder_type + '-social-icons-icon-radius]',
		'border-radius',
		selector + ' .ast-builder-social-element',
		'px'
	);

	// Icon Spacing.
	wp.customize( 'astra-settings[' + builder_type + '-social-icons-icon-space]', function( value ) {
		value.bind( function( spacing ) {
			if( '' !== spacing ) {
				var space = spacing/2;
				var dynamicStyle = '';
					dynamicStyle += selector + ' .ast-builder-social-element {';
					dynamicStyle += 'margin-left: ' + space + 'px;';
					dynamicStyle += 'margin-right: ' + space + 'px;';
				dynamicStyle += '} ';

				astra_add_dynamic_css( builder_type + '-social-icons-icon-space-toggle-button', dynamicStyle );
			}
		} );
	} );

	wp.customize( 'astra-settings[header-social-color-type]', function ( value ) {
        value.bind( function ( newval ) {
			
			var side_class = 'ast-social-color-type-' + newval;

			jQuery('.element-social-inner-wrap').removeClass( 'ast-social-color-type-custom' );
			jQuery('.element-social-inner-wrap').removeClass( 'ast-social-color-type-official' );
			jQuery('.element-social-inner-wrap').addClass( side_class );
        } );
	} );

	wp.customize( 'astra-settings[footer-social-color-type]', function ( value ) {
        value.bind( function ( newval ) {
			
			var side_class = 'ast-social-color-type-' + newval;

			jQuery('.element-social-inner-wrap').removeClass( 'ast-social-color-type-custom' );
			jQuery('.element-social-inner-wrap').removeClass( 'ast-social-color-type-official' );
			jQuery('.element-social-inner-wrap').addClass( side_class );
        } );
	} );

	// Advanced CSS Generation.
	astra_builder_advanced_css( section, selector );

	// Typography CSS Generation.
	astra_builder_typography_css( section, selector );
}