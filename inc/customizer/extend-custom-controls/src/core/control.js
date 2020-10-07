/**
 * Extending Customizer Control wp.customize.Control.
 *
 * @since x.x.x
 */
export const coreControl = wp.customize.astraControl = wp.customize.Control.extend( {
	/**
	 * A Customizer Control.
	 *
	 * A control provides a UI element that allows a user to modify a Customizer Setting.
	 * Overriding this method to provide lazy loading of controls by initializing all the controls.
	 *
	 * @see PHP class WP_Customize_Control.
	 *
	 * @constructs wp.customize.Control
	 * @augments   wp.customize.Class
	 *
	 * @since x.x.x
	 *
	 * @return {void}
	 */
	initialize: function( id, options ) {
		var control = this,
			args    = options || {};

		args.params = args.params || {};
		if ( ! args.params.type ) {
			args.params.type = 'ast-core';
		}
		if ( ! args.params.content ) {
			args.params.content = jQuery( '<li></li>' );
			args.params.content.attr( 'id', 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ) );
			args.params.content.attr( 'class', 'customize-control customize-control-' + args.params.type );
		}

		control.propertyElements = [];
		wp.customize.Control.prototype.initialize.call( control, id, args );
	},

	/**
	 * Triggered when the control's markup has been injected into the DOM.
	 * Injecting markup from component based controls.
	 *
	 * @since x.x.x
	 *
	 * @returns {void}
	 */
	ready: function() {
		var control = this;
		wp.customize.Control.prototype.ready.call( control );
		control.deferred.embedded.done();
	},

	/**
	 * Embed the control in the DOM.
	 *
	 * Override the embed() method to do nothing,
	 * so that the control isn't embedded on load,
	 * unless the containing section is already expanded.
	 *
	 * @returns {void}
	 */
	embed: function() {
		var control   = this,
			sectionId = control.section();

		if ( ! sectionId ) {
			return;
		}

		wp.customize.section( sectionId, function( section ) {
			if ( section.expanded() || wp.customize.settings.autofocus.control === control.id ) {
				control.actuallyEmbed();
			} else {
				section.expanded.bind( function( expanded ) {
					if ( expanded ) {
						control.actuallyEmbed();
					}
				} );
			}
		} );
	},

	/**
	 * Deferred embedding of control when actually
	 *
	 * This function is called in Section.onChangeExpanded() so the control
	 * will only get embedded when the Section is first expanded.
	 *
	 * @returns {null}
	 */
	actuallyEmbed: function() {
		var control = this;
		if ( 'resolved' === control.deferred.embedded.state() ) {
			return;
		}
		control.renderContent();
		control.deferred.embedded.resolve(); // This triggers control.ready().
		// Fire event after control is initialized.
		control.container.trigger( 'init' );
	},

	/**
	 * This is not working with autofocus.
	 *
	 * @param {object} [args] Args.
	 * @returns {null}
	 */
	focus: function( args ) {
		var control = this;
		control.actuallyEmbed();
		wp.customize.Control.prototype.focus.call( control, args );
	},

} );
