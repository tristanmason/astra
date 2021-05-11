export function astraGetColor( control ) {
	'use strict';
	jQuery(document).mouseup(function(e){
		var container = jQuery(control);
		var colorWrap = container.find('.astra-color-picker-wrap');
		// If the target of the click isn't the container nor a descendant of the container.
		if (!colorWrap.is(e.target) && colorWrap.has(e.target).length === 0){
			container.find('.components-button.astra-color-icon-indicate.open').click();
		}
	});
}
export function astraGetBackground( control ) {
	'use strict';
	jQuery(document).mouseup(function(e){
		var container = jQuery(control);
		var bgWrap = container.find('.background-wrapper');
		// If the target of the click isn't the container nor a descendant of the container.
		if (!bgWrap.is(e.target) && bgWrap.has(e.target).length === 0){
			container.find('.components-button.astra-color-icon-indicate.open').click();
		}
	});
}
export function astraGetResponsiveBgJs( control, child_control_name ) {
    'use strict';

    jQuery('html').addClass('responsive-background-img-ready');

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-responsive-background .ast-responsive-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-background .ast-responsive-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive-background .customize-control-content .background-container.' + device ).addClass( 'active' );
        jQuery( '.customize-control-ast-responsive-background .ast-responsive-btns li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive-background .ast-responsive-btns li.' + device ).addClass( 'active' );
    });

    control.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).attr('data-device');
        if( 'desktop' == device ) {
            device = 'tablet';
        } else if( 'tablet' == device ) {
            device = 'mobile';
        } else {
            device = 'desktop';
        }

        jQuery( '.wp-full-overlay-footer .devices button[data-device="' + device + '"]' ).trigger( 'click' );
	});
	if (child_control_name) {
		jQuery(document).mouseup(function(e){
			var container = jQuery(child_control_name);
			var bgWrap = container.find('.background-wrapper');
			// If the target of the click isn't the container nor a descendant of the container.
			if (!bgWrap.is(e.target) && bgWrap.has(e.target).length === 0){
				container.find('.components-button.astra-color-icon-indicate.open').click();
			}
		});
	}
}
export function astraGetResponsiveColorJs( control, child_control_name ) {
    'use strict';

    jQuery('html').addClass('responsive-background-color-ready');

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-responsive-color .ast-responsive-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-color .ast-responsive-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive-color .customize-control-content .ast-responsive-color.' + device ).addClass( 'active' );
        jQuery( '.customize-control-ast-responsive-color .ast-responsive-btns li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive-color .ast-responsive-btns li.' + device ).addClass( 'active' );
    });

    control.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).attr('data-device');
        if( 'desktop' == device ) {
            device = 'tablet';
        } else if( 'tablet' == device ) {
            device = 'mobile';
        } else {
            device = 'desktop';
        }

        jQuery( '.wp-full-overlay-footer .devices button[data-device="' + device + '"]' ).trigger( 'click' );
	});
	if (child_control_name) {
		jQuery(document).mouseup(function(e){
			var container = jQuery(child_control_name);
			var resColorWrap = container.find('.customize-control-content');
			// If the target of the click isn't the container nor a descendant of the container.
			if (!resColorWrap.is(e.target) && resColorWrap.has(e.target).length === 0){
				container.find('.components-button.astra-color-icon-indicate.open').click();
			}
		});
	}
}
export function astraGetResponsiveJs ( control ) {
    'use strict';

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-responsive .input-wrapper input' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive .input-wrapper input.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-responsive .ast-responsive-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive .ast-responsive-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-responsive .input-wrapper input, .customize-control .ast-responsive-btns > li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive .input-wrapper input.' + device + ', .customize-control .ast-responsive-btns > li.' + device ).addClass( 'active' );

    });

    control.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).attr('data-device');
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
export function astraGetResponsiveSliderJs ( control ) {
    'use strict';

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-responsive-slider .ast-responsive-slider-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-slider .ast-responsive-slider-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper, .customize-control .ast-responsive-slider-btns > li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper.' + device + ', .customize-control .ast-responsive-slider-btns > li.' + device ).addClass( 'active' );
    });

    control.container.find( '.ast-responsive-slider-btns button i' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).parent('button').attr('data-device');
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
export function astraGetResponsiveSpacingJs ( control ) {
    'use strict';

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper, .customize-control .ast-spacing-responsive-btns > li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper.' + device + ', .customize-control .ast-spacing-responsive-btns > li.' + device ).addClass( 'active' );
    });

    control.container.find( '.ast-spacing-responsive-btns button' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).attr('data-device');
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
export function astraGetAlignmentJS ( control ) {
    'use strict';

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-selector .input-wrapper .ast-alignment-responsive' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-selector .input-wrapper .ast-alignment-responsive.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-selector .input-wrapper .ast-selector-responsive-wrap' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-selector .input-wrapper .ast-selector-responsive-wrap.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-selector .ast-responsive-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-selector .ast-responsive-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-selector .input-wrapper .ast-selector-responsive-wrap, .customize-control-ast-selector .input-wrapper .ast-alignment-responsive, .customize-control .ast-responsive-btns > li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-selector .input-wrapper .ast-selector-responsive-wrap.' + device + ', .customize-control-ast-selector .input-wrapper .ast-alignment-responsive.' + device + ', .customize-control .ast-responsive-btns > li.' + device ).addClass( 'active' );

    });

    control.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).attr('data-device');
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
export function astraGetResponsiveColorGroupJs( control, child_control_name ) {
    'use strict';

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-color-group .ast-field-color-group-wrap .ast-color-group-responsive-wrap' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-color-group .ast-field-color-group-wrap .ast-color-group-responsive-wrap.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-color-group .ast-responsive-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-color-group .ast-responsive-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-color-group .ast-field-color-group-wrap .ast-color-group-responsive-wrap' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-color-group .ast-field-color-group-wrap .ast-color-group-responsive-wrap.' + device ).addClass( 'active' );
        jQuery( '.customize-control-ast-color-group .ast-responsive-btns li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-color-group .ast-responsive-btns li.' + device ).addClass( 'active' );
    });

    control.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).attr('data-device');
        if( 'desktop' == device ) {
            device = 'tablet';
        } else if( 'tablet' == device ) {
            device = 'mobile';
        } else {
            device = 'desktop';
        }

        jQuery( '.wp-full-overlay-footer .devices button[data-device="' + device + '"]' ).trigger( 'click' );
	});
	if (child_control_name) {
		jQuery(document).mouseup(function(e){
			var container = jQuery(child_control_name);
			var bgWrap = container.find('.background-wrapper');
			// If the target of the click isn't the container nor a descendant of the container.
			if (!bgWrap.is(e.target) && bgWrap.has(e.target).length === 0){
				container.find('.components-button.astra-color-icon-indicate.open').click();
			}
		});
	}
}
export function astraGetResponsiveToggleControlJs ( control ) {

    'use strict';

    let device = jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device')

    jQuery( '.customize-control-ast-responsive-toggle-control .ast-responsive-toggle-control' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-toggle-control .ast-responsive-toggle-control.' + device ).addClass( 'active' );

    jQuery( '.customize-control-ast-responsive-toggle-control .ast-responsive-toggle-btns li' ).removeClass( 'active' );

    jQuery( '.customize-control-ast-responsive-toggle-control .ast-responsive-toggle-btns li.' + device ).addClass( 'active' );

    jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

        let device = jQuery(this).attr('data-device');

        jQuery( '.customize-control-ast-responsive-toggle-control .ast-responsive-toggle-control, .customize-control .ast-responsive-toggle-btns > li' ).removeClass( 'active' );
        jQuery( '.customize-control-ast-responsive-toggle-control .ast-responsive-toggle-control.' + device + ', .customize-control .ast-responsive-toggle-btns > li.' + device ).addClass( 'active' );
    });

    control.container.find( '.ast-responsive-toggle-btns button i' ).on( 'click', function( event ) {
        event.preventDefault();
        let device = jQuery(this).parent('button').attr('data-device');
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

/**
 * Conditionally hide/show Site Title and Tagline dependent controls
 */
export function siteTitleTaglineDependentControl ( control ) {
    'use strict';
    if('astra-settings[display-site-title-responsive]' === control.id){

        siteTitleDependentControls(control);

        var desktopToggleControl = jQuery(control.container).find('.ast-responsive-toggle-control.desktop .components-form-toggle__input');
        var tabletToggleControl = jQuery(control.container).find('.ast-responsive-toggle-control.tablet .components-form-toggle__input');
        var mobileToggleControl = jQuery(control.container).find('.ast-responsive-toggle-control.mobile .components-form-toggle__input');

        jQuery( desktopToggleControl ).change(function(){
            siteTitleDependentControls(control);
        });
        jQuery( tabletToggleControl ).change(function(){
            siteTitleDependentControls(control);
        });
        jQuery( mobileToggleControl ).change(function(){
            siteTitleDependentControls(control);
        });
    }

    if('astra-settings[display-site-tagline-responsive]' === control.id){

        siteTaglineDependentControls(control);

        var desktopToggleControl = jQuery(control.container).find('.ast-responsive-toggle-control.desktop .components-form-toggle__input');
        var tabletToggleControl = jQuery(control.container).find('.ast-responsive-toggle-control.tablet .components-form-toggle__input');
        var mobileToggleControl = jQuery(control.container).find('.ast-responsive-toggle-control.mobile .components-form-toggle__input');

        jQuery( desktopToggleControl ).change(function(){
            siteTaglineDependentControls(control);
        });
        jQuery( tabletToggleControl ).change(function(){
            siteTaglineDependentControls(control);
        });
        jQuery( mobileToggleControl ).change(function(){
            siteTaglineDependentControls(control);
        });
    }
}

/**
 * Conditionally hide/show Site Title dependent controls
 */
function siteTitleDependentControls(control){

    var container = jQuery(control.container);
    var desktopToggleVal = ( true === container.find('.ast-responsive-toggle-control.desktop .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';
    var tabletToggleVal = ( true === container.find('.ast-responsive-toggle-control.tablet .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';
    var mobileToggleVal = ( true === container.find('.ast-responsive-toggle-control.mobile .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';

    var dynamicStyle = '.preview-desktop #customize-control-blogname { display: ' + desktopToggleVal + ';} .preview-tablet #customize-control-blogname { display: ' + tabletToggleVal + ';} .preview-mobile #customize-control-blogname { display: ' + mobileToggleVal + ';}';
    astra_add_dynamic_css( 'site-title-textbox-visibility', dynamicStyle );

    inlineLogoTitleToggleVisibility();
}

/**
 * Conditionally hide/show Site Tagline dependent controls
 */
function siteTaglineDependentControls(control){

    var container = jQuery(control.container);
    var desktopToggleVal = ( true === container.find('.ast-responsive-toggle-control.desktop .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';
    var tabletToggleVal = ( true === container.find('.ast-responsive-toggle-control.tablet .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';
    var mobileToggleVal = ( true === container.find('.ast-responsive-toggle-control.mobile .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';

    var dynamicStyle = '.preview-desktop #customize-control-blogdescription, .preview-desktop #customize-control-astra-settings-ast-site-title-tagline-divider { display: ' + desktopToggleVal + ';} .preview-tablet #customize-control-blogdescription, .preview-tablet #customize-control-astra-settings-ast-site-title-tagline-divider { display: ' + tabletToggleVal + ';} .preview-mobile #customize-control-blogdescription, .preview-mobile #customize-control-astra-settings-ast-site-title-tagline-divider { display: ' + mobileToggleVal + ';}';
    astra_add_dynamic_css( 'site-tagline-textbox-visibility', dynamicStyle );

    inlineLogoTitleToggleVisibility();
}

/**
 * Conditionally hide/show Inline Logo & Site Title dependent controls
 */
function inlineLogoTitleToggleVisibility(){

    var titleContainer = jQuery('#customize-control-astra-settings-display-site-title-responsive');
    var taglineContainer = jQuery('#customize-control-astra-settings-display-site-tagline-responsive');

    var desktopToggleVal = ( true === titleContainer.find('.ast-responsive-toggle-control.desktop .components-form-toggle__input').prop("checked") || true === taglineContainer.find('.ast-responsive-toggle-control.desktop .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';
    var tabletToggleVal = ( true === titleContainer.find('.ast-responsive-toggle-control.tablet .components-form-toggle__input').prop("checked") || true === taglineContainer.find('.ast-responsive-toggle-control.tablet .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';
    var mobileToggleVal = ( true === titleContainer.find('.ast-responsive-toggle-control.mobile .components-form-toggle__input').prop("checked") || true === taglineContainer.find('.ast-responsive-toggle-control.mobile .components-form-toggle__input').prop("checked") ) ? 'block' : 'none';

    var dynamicStyle = '.preview-desktop #customize-control-astra-settings-logo-title-inline { display: ' + desktopToggleVal + ';} .preview-tablet #customize-control-astra-settings-logo-title-inline { display: ' + tabletToggleVal + ';} .preview-mobile #customize-control-astra-settings-logo-title-inline { display: ' + mobileToggleVal + ';}';
    astra_add_dynamic_css( 'inline-logo-title-toggle-visibility', dynamicStyle );
}

/**
 * Dynamic Internal/Embedded Style for a Control
 */
function astra_add_dynamic_css( control, style ) {
	control = control.replace( '[', '-' );
	control = control.replace( ']', '' );
	jQuery( 'style#' + control ).remove();

	jQuery( 'head' ).append(
		'<style id="' + control + '">' + style + '</style>'
	);
}