import ColorGroupComponent from './color-group-component';
import ColorComponent from '../color/color-component';
import ResponsiveColorComponent from '../responsive-color/responsive-color-component';

import {
	astraGetColor,
	astraGetResponsiveColorJs,
} from '../common/responsive-helper';

export const colorGroupControl = wp.customize.astraControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render( <ColorGroupComponent control={ control } />, control.container[0] );
	},
	ready : function() {
		'use strict';

		var control = this;
	
		control.registerToggleEvents();

		this.container.on( 'ast_color_group_changed', control.onOptionChange );
	},
	
	registerToggleEvents: function() {

		var control = this,
			$this = jQuery(control.selector),
			parent_wrap = $this.closest( '.customize-control-ast-color-group' ),
			fields = control.params.ast_fields,
			modal_wrap = jQuery( astra.customizer.color_group_modal_tmpl );

		parent_wrap.find( '.ast-field-color-group-wrap' ).append( modal_wrap );
		parent_wrap.find( '.ast-fields-wrap' ).attr( 'data-control', control.params.name );
		control.ast_render_field( parent_wrap, fields, control );
	},

	ast_render_field: function( wrap, fields, control_elem ) {

		var control = this;
		var ast_field_wrap = wrap.find( '.ast-field-color-group-wrap' );
		var fields_html = '';
		var control_types = [];

		console.log( fields );

		var result = control.generateFieldHtml( fields );

			fields_html += result.html;

			_.each( result.controls, function (control_value, control_key) {
				control_types.push({
					key: control_value.key,
					value: control_value.value,
					name: control_value.name
				});
			});

			ast_field_wrap.html(fields_html);

			control.renderReactControl( fields, control );

		_.each( control_types, function( control_type, index ) {

			switch( control_type.key ) {

				case "ast-color":
					astraGetColor( "#customize-control-" + control_type.name )
					break;
				case "ast-responsive-color":
					astraGetResponsiveColorJs( control, "#customize-control-" + control_type.name )
					break;
			}

		});
	},
	getJS: function( control ) {

	},
	generateFieldHtml: function ( fields_data ) {

		var fields_html = '';
		var control_types = [];

		_.each(fields_data, function (attr, index) {

			console.log( attr );

			var new_value = ( wp.customize.control( 'astra-settings['+attr.name+']' ) ? wp.customize.control( 'astra-settings['+attr.name+']' ).params.value : '' );
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
				input_attrs += name + '="' + value + '" ';
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

	onOptionChange:function ( e, control, element, value, name ) {

		var control_id  = jQuery( '.hidden-field-astra-settings-' + name );
		control_id.val( value );
		let sub_control = wp.customize.control( "astra-settings[" + name + "]" );
		sub_control.setting.set( value );
	},

	isJsonString: function( str ) {

		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	},
	getFinalControlObject: function ( attr, controlObject ) {

		if ( undefined !== attr.choices && undefined === controlObject.params['choices'] ) {
			controlObject.params['choices'] = attr.choices;
		}
		if ( undefined !== attr.inputAttrs && undefined === controlObject.params['inputAttrs'] ) {
			controlObject.params['inputAttrs'] = attr.inputAttrs;
		}
		if ( undefined !== attr.link && undefined === controlObject.params['link'] ) {
			controlObject.params['link'] = attr.link;
		}
		if ( undefined !== attr.units && undefined === controlObject.params['units'] ) {
			controlObject.params['units'] = attr.units;
		}
		if ( undefined !== attr.linked_choices && undefined === controlObject.params['linked_choices'] ) {
			controlObject.params['linked_choices'] = attr.linked_choices;
		}
		if ( undefined !== attr.title && ( undefined === controlObject.params['label'] || '' === controlObject.params['label'] || null === controlObject.params['label'] ) ) {
			controlObject.params['label'] = attr.title;
		}
		if ( undefined !== attr.responsive && ( undefined === controlObject.params['responsive'] || '' === controlObject.params['responsive'] || null === controlObject.params['responsive'] ) ) {
			controlObject.params['responsive'] = attr.responsive;
		}

		return controlObject;
	},
	renderReactControl: function( fields, control ) {

		const reactControls = {
			'ast-responsive-color' : ResponsiveColorComponent,
			'ast-color' : ColorComponent,
		};

		if( 'undefined' != typeof fields ) {

			_.each(fields, function (attr, index) {

				var control_clean_name = attr.name.replace('[', '-');
				control_clean_name = control_clean_name.replace(']', '');
				var selector = '#customize-control-' + control_clean_name;
				var controlObject = wp.customize.control( 'astra-settings['+attr.name+']' );
				controlObject = control.getFinalControlObject( attr, controlObject );
				const ComponentName = reactControls[ attr.control ];

				ReactDOM.render(
					<ComponentName control={controlObject} customizer={ wp.customize }/>,
					jQuery( selector )[0]
				);
			});
		}
	}
} );
