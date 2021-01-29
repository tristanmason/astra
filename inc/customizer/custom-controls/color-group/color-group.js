( function( $ ) {

    wp.customize.controlConstructor['ast-color-group'] = wp.customize.Control.extend({

        ready : function() {

            'use strict';

            console.log( 'in color-group.js' );

            var control = this,
            value   = control.setting._value;
            control.registerToggleEvents();

            this.container.on( 'ast_color_group_changed', control.onOptionChange );
        },

        registerToggleEvents: function() {

            var control = this;
            var $this = jQuery(this);

            var parent_wrap = $this.closest( '.customize-control-ast-color-group' );
            var parent_section = parent_wrap.parents('.control-section');

            var fields = control.params.ast_fields;

            var $modal_wrap = jQuery( astra.customizer.color_group_modal_tmpl );

            console.log( control );

            parent_wrap.find( '.ast-field-color-group-wrap' ).append( $modal_wrap );
            parent_wrap.find( '.ast-fields-wrap' ).attr( 'data-control', control.params.name );
            control.ast_render_field( parent_wrap, fields, control );
        },

        ast_render_field: function( wrap, fields, control_elem ) {

            var control = this;
            var ast_field_wrap = wrap.find( '.ast-group-wrap' );
            var fields_html = '';
            var control_types = [];
            var field_values = control.isJsonString( control_elem.params.value ) ? JSON.parse( control_elem.params.value ) : {};

    		console.log( field_values );

                var result = control.generateFieldHtml( fields, field_values );

                fields_html += result.html;
                
                _.each( result.controls, function (control_value, control_key) {
                    control_types.push({
                        key: control_value.key,
                        value: control_value.value,
                        name: control_value.name
                    });
                });

                ast_field_wrap.html(fields_html);


            _.each( control_types, function( control_type, index ) {

                switch( control_type.key ) {

                    case "ast-responsive-color":
                        control.initResponsiveColor( ast_field_wrap, control_elem, control_type.name );
                    break;  

                    case "ast-color": 
                        control.initColor( ast_field_wrap, control_elem, control_type.name );
                    break;
                }

            });

            wrap.find( '.ast-field-color-group-modal' ).data( 'loaded', true );
            
        },

        generateFieldHtml: function ( fields_data, field_values ) {    

            var fields_html = '';
            var control_types = [];


            _.each(fields_data, function (attr, index) {

                new_value = ( wp.customize.control( 'astra-settings['+attr.name+']' ) ? wp.customize.control( 'astra-settings['+attr.name+']' ).params.value : '' ); 
                var control = attr.control;
                var template_id = "customize-control-" + control + "-content";
                var template = wp.template(template_id);
                var value = new_value || attr.default;
                attr.value = value;
                var dataAtts = '';
                var input_attrs = '';

                attr.label = attr.title;

                // Data attributes.
                _.each( attr.data_attrs, function( value, name ) {
                    dataAtts += " data-" + name + " ='" + value + "'";
                });

                // Input attributes
                _.each( attr.input_attrs, function ( value, name ) {
                    input_attrs += name + " ='" + value + "'";
                });

                attr.dataAttrs = dataAtts;
                attr.inputAttrs = input_attrs;

                control_types.push({
                    key: control,
                    value: value,
                    name: attr.name
                });

                if ('ast-responsive' == control) {
                    var is_responsive = 'undefined' == typeof attr.responsive ? true : attr.responsive;
                    attr.responsive = is_responsive;
                }

                var control_clean_name = attr.name.replace('[', '-');
                control_clean_name = control_clean_name.replace(']', '');

                fields_html += "<li id='customize-control-" + control_clean_name + "' class='customize-control customize-control-" + attr.control + "' >";
                fields_html += template(attr);
                fields_html += '</li>';

            });

            var result = new Object();

            result.controls = control_types;
            result.html     = fields_html;

            return result;
        },

        initResponsiveTrigger: function( wrap, control_elem ) {

            wrap.find('.ast-responsive-btns button').on('click', function (event) {

                var device = jQuery(this).attr('data-device');
                if ('desktop' == device) {
                    device = 'tablet';
                } else if ('tablet' == device) {
                    device = 'mobile';
                } else {
                    device = 'desktop';
                }

                jQuery('.wp-full-overlay-footer .devices button[data-device="' + device + '"]').trigger('click');
            });

        },

        initColor: function ( wrap, control_elem, name ) {

            var control = this;
            var picker = wrap.find('.customize-control-ast-color .ast-color-picker-alpha');

            picker.wpColorPicker({

                change: function (event, ui) {

                    if ('undefined' != typeof event.originalEvent || 'undefined' != typeof ui.color._alpha) {
                    
                        var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0];
                        jQuery(element).val( ui.color.toString() );
                        name = jQuery(element).parents('.customize-control').attr('id');
                        name = name.replace( 'customize-control-', '' );
                        control.container.trigger( 'ast_color_group_changed', [control, jQuery( element ), ui.color.toString(), name ] );
                    }
                },

                /**
                 * @param {Event} event - standard jQuery event, produced by "Clear"
                 * button.
                 */
                clear: function (event) {
                    var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0];
                    jQuery(element).val('');

                    name = jQuery(element).parents('.customize-control').attr('id');
                    name = name.replace( 'customize-control-', '' );
                    control.container.trigger( 'ast_color_group_changed', [control, jQuery(element), '', name ] );
                    wp.customize.previewer.refresh();
                }
            });
        },

        initResponsiveColor: function( wrap, control_elem, name ) {

            var control = this;
            var picker = wrap.find( '.ast-responsive-color' );

            picker.wpColorPicker({

                change: function(event, ui) {

                    if ('undefined' != typeof event.originalEvent || 'undefined' != typeof ui.color._alpha) {
                        if ( jQuery('html').hasClass('responsive-background-color-ready') ) {

                            var option_name = jQuery(this).data('name');
                            var stored = {
                                'desktop' : jQuery( ".desktop.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                                'tablet'  : jQuery( ".tablet.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                                'mobile'  : jQuery( ".mobile.ast-responsive-color[data-name='"+ option_name +"']" ).val()
                            };

                            var element = event.target;
                            var device = jQuery( this ).data( 'id' );
                            var newValue = {
                                'desktop' : stored['desktop'],
                                'tablet'  : stored['tablet'],
                                'mobile'  : stored['mobile'],
                            };
                            if ( 'desktop' === device ) {
                                newValue['desktop'] = ui.color.toString();
                            }
                            if ( 'tablet' === device ) {
                                newValue['tablet'] = ui.color.toString();
                            }
                            if ( 'mobile' === device ) {
                                newValue['mobile'] = ui.color.toString();
                            }

                            jQuery(element).val( ui.color.toString() );

                            name = jQuery(element).parents('.customize-control').attr('id');
                            name = name.replace( 'customize-control-', '' );

                            control.container.trigger( 'ast_color_group_changed', [ control, jQuery(this), newValue, name ] );
                        }
                    }
                },

                    /**
                 * @param {Event} event - standard jQuery event, produced by "Clear"
                 * button.
                 */
                clear: function (event) {
                    var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0],
                        device = jQuery( this ).closest('.wp-picker-input-wrap').find('.wp-color-picker').data( 'id' );

                    var option_name = jQuery( element ).attr('data-name');
                    var stored = {
                        'desktop' : jQuery( ".desktop.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                        'tablet'  : jQuery( ".tablet.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                        'mobile'  : jQuery( ".mobile.ast-responsive-color[data-name='"+ option_name +"']" ).val()
                    };

                    var newValue = {
                        'desktop' : stored['desktop'],
                        'tablet'  : stored['tablet'],
                        'mobile'  : stored['mobile'],
                    };

                    wp.customize.previewer.refresh();

                    if ( element ) {
                        if ( 'desktop' === device ) {
                            newValue['desktop'] = '';
                        }
                        if ( 'tablet' === device ) {
                            newValue['tablet'] = '';
                        }
                        if ( 'mobile' === device ) {
                            newValue['mobile'] = '';
                        }

                        jQuery(element).val( '' );
                        control.container.trigger( 'ast_color_group_changed', [ control, jQuery(element), newValue, name ] );
                    }

                    name = jQuery(element).parents('.customize-control').attr('id');
                    name = name.replace( 'customize-control-', '' );
                }
            });

            wrap.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {

                var device = jQuery(this).attr('data-device');
                if( 'desktop' == device ) {
                    device = 'tablet';
                } else if( 'tablet' == device ) {
                    device = 'mobile';
                } else {
                    device = 'desktop';
                }

                jQuery( '.wp-full-overlay-footer .devices button[data-device="' + device + '"]' ).trigger( 'click' );
            });

            // Set desktop colorpicker active.
            wrap.find( '.ast-responsive-color.desktop' ).parents( '.wp-picker-container' ).addClass( 'active' );
        },

        onOptionChange:function ( e, control, element, value, name ) {

            var control_id  = $( '.hidden-field-astra-settings-' + name );
            control_id.val( value );
            sub_control = wp.customize.control( "astra-settings[" + name + "]" );
            sub_control.setting.set( value );
        },

        /**
         * Updates the responsive param value.
         */
        updateResonsiveValue: function( element, name ) {

            'use strict';

            var control = this,
            newValue = {};

            // Set the spacing container.
            control.responsiveContainer = element.closest( '.ast-responsive-wrapper' );

            control.responsiveContainer.find( 'input.ast-responsive-input' ).each( function() {
                var responsive_input = jQuery( this ),
                item = responsive_input.data( 'id' ),
                item_value = responsive_input.val();

                newValue[item] = item_value;
            });

            control.responsiveContainer.find( 'select.ast-responsive-select' ).each( function() {
                var responsive_input = jQuery( this ),
                item = responsive_input.data( 'id' ),
                item_value = responsive_input.val();

                newValue[item] = item_value;
            });

            control.container.trigger( 'ast_color_group_changed', [ control, element, newValue, name ] );
        },

        isJsonString: function( str ) {

            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        saveValue: function ( screen, property, value, element, name ) {

            var control = this,
                input = jQuery('#customize-control-' + control.id.replace('[', '-').replace(']', '') + ' .responsive-background-hidden-value'); 

            var val = JSON.parse( input.val() );
            val[screen][property] = value;

            jQuery(input).attr( 'value', JSON.stringify(val) ).trigger( 'change' );

            name = jQuery(element).parents('.customize-control').attr('id');
            name = name.replace( 'customize-control-', '' );
            control.container.trigger( 'ast_color_group_changed', [control, element, val, name ] );
        },
    });

})(jQuery);
