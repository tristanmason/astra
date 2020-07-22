( function( $ ) {
	/**
	 * File spacing.js
	 *
	 * Handles the spacing
	 *
	 * @package Astra
	 */

	wp.customize.controlConstructor['ast-border'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this,
			value;
			

			// Set the spacing container.
			// this.container = control.container.find( 'ul.ast-border-wrapper' ).first();

			// Save the value.
			this.container.on( 'change keyup paste', 'input.ast-border-input', function() {

				value = jQuery( this ).val();

				// Update value on change.
				control.updateValue();
			});
		},

		/**
		 * Updates the spacing values
		 */
		updateValue: function() {

			'use strict';

			var control = this,
				newValue = {
					'top' 	: '',
					'right' : '',
					'bottom' : '',
					'left'	 : '',
				};

			control.container.find( 'input.ast-border-desktop' ).each( function() {
				var spacing_input = jQuery( this ),
				item = spacing_input.data( 'id' ),
				item_value = spacing_input.val();

				newValue[item] = item_value;
			});

			control.setting.set( newValue );
		},

	});

	jQuery( document ).ready( function( ) {

		// Connected button
		jQuery( '.ast-border-connected' ).on( 'click', function() {

			// Remove connected class
			jQuery(this).parent().parent( '.ast-border-wrapper' ).find( 'input' ).removeClass( 'connected' ).attr( 'data-element-connect', '' );
			
			// Remove class
			jQuery(this).parent( '.ast-border-input-item-link' ).removeClass( 'disconnected' );

		} );

		// Disconnected button
		jQuery( '.ast-border-disconnected' ).on( 'click', function() {

			// Set up variables
			var elements 	= jQuery(this).data( 'element-connect' );
			
			// Add connected class
			jQuery(this).parent().parent( '.ast-border-wrapper' ).find( 'input' ).addClass( 'connected' ).attr( 'data-element-connect', elements );

			// Add class
			jQuery(this).parent( '.ast-border-input-item-link' ).addClass( 'disconnected' );

		} );

		// Values connected inputs
		jQuery( '.ast-border-input-item' ).on( 'input', '.connected', function() {

			var dataElement 	  = jQuery(this).attr( 'data-element-connect' ),
				currentFieldValue = jQuery( this ).val();

			jQuery(this).parent().parent( '.ast-border-wrapper' ).find( '.connected[ data-element-connect="' + dataElement + '" ]' ).each( function( key, value ) {
				jQuery(this).val( currentFieldValue ).change();
			} );

		} );
	});
})(jQuery);

( function( $ ) {

	/**
	 * File slider.js
	 *
	 * Handles Slider control
	 *
	 * @package Astra
	 */

	jQuery(window).on("load", function() {
		jQuery('html').addClass('colorpicker-ready');
	});

	wp.customize.controlConstructor['ast-color'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this,
				value,
				thisInput,
				inputDefault,
				changeAction;			

			this.container.find('.ast-color-picker-alpha' ).wpColorPicker({
				/**
			     * @param {Event} event - standard jQuery event, produced by whichever
			     * control was changed.
			     * @param {Object} ui - standard jQuery UI object, with a color member
			     * containing a Color.js object.
			     */
			    change: function (event, ui) {
			        var element = event.target;
			        var color = ui.color.toString();

			        if ( jQuery('html').hasClass('colorpicker-ready') ) {
						control.setting.set( color );
			        }
			    },

			    /**
			     * @param {Event} event - standard jQuery event, produced by "Clear"
			     * button.
			     */
			    clear: function (event) {
			        var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0];
			        var color = '';

			        if (element) {
			            // Add your code here
			        	control.setting.set( color );
			        }
			    }
			});
		}
	});

})(jQuery);

( function( $ ) {
	/**
	 * File link.js
	 *
	 * Handles the link
	 *
	 * @package Astra
	 */

	wp.customize.controlConstructor['ast-link'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this;
			var data = jQuery( '.customize-link-control-data' ).data('value');

			// Save the value.
			this.container.on( 'change keyup', '.ast-link-input', function(e) {
				e.preventDefault();
				
				value = jQuery( this ).val();
				data.url = value;
				
				jQuery('.customize-link-control-data').attr('data-value', JSON.stringify( data )).trigger( 'change' );

				// Update value on change.
				control.setting.set( data );
			});
			
			// Save the value.
			this.container.on( 'change click', '.ast-link-open-in-new-tab', function() {
				
				value = jQuery( this ).is(":checked");
				data.new_tab = value;
				
				jQuery('.customize-link-control-data').attr('data-value', JSON.stringify( data )).trigger( 'change' );
				
				// Update value on change.
				control.setting.set( data );
			});
			
			// Save the value.
			this.container.on( 'change keyup', '.ast-link-relationship', function(e) {
				e.preventDefault();
				
				value = jQuery( this ).val();
				data.link_rel = value;
				
				jQuery('.customize-link-control-data').attr('data-value', JSON.stringify( data )).trigger( 'change' );
				
				// Update value on change.
                control.setting.set( data );
			});
		},
	});
})(jQuery);

/**
 * File spacing.js
 *
 * Handles the spacing
 *
 * @package Astra
 */

wp.customize.controlConstructor['ast-customizer-link'] = wp.customize.Control.extend({

	ready: function () {
		'use strict';

		// Add event listener for click action.
		this.container.on('click', '.customizer-link', function (e) {
			e.preventDefault();

			var section;
			var linked = this.getAttribute('data-customizer-linked');
			var linkType = this.getAttribute('data-ast-customizer-link-type');
			switch (linkType) {
				case 'section':
					section = wp.customize.section(linked);
					section.expand();
					break;

				case 'control':
					wp.customize.control(linked).focus();
					break;
			
				default:
					break;
			}
		});
	},

});

/**
 * File radio-image.js
 *
 * Handles toggling the radio images button
 *
 * @package Astra
 */

wp.customize.controlConstructor['ast-radio-image'] = wp.customize.Control.extend({

	ready: function() {

		'use strict';

		var control = this;

		// Change the value.
		this.container.on( 'click', 'input', function() {
			control.setting.set( jQuery( this ).val() );
		});

	}

});

( function( $ ) {
	/**
	 * File responsive.js
	 *
	 * Handles the responsive
	 *
	 * @package Astra
	 */

	wp.customize.controlConstructor['ast-responsive'] = wp.customize.Control.extend({

		// When we're finished loading continue processing.
		ready: function() {

			'use strict';

			var control = this,
			value;

			control.astResponsiveInit();
			
			/**
			 * Save on change / keyup / paste
			 */
			this.container.on( 'change keyup paste', 'input.ast-responsive-input, select.ast-responsive-select', function() {

				value = jQuery( this ).val();

				// Update value on change.
				control.updateValue();
			});

			/**
			 * Refresh preview frame on blur
			 */
			this.container.on( 'blur', 'input', function() {

				value = jQuery( this ).val() || '';

				if ( value == '' ) {
					wp.customize.previewer.refresh();
				}

			});

			jQuery( '.customize-control-ast-responsive .input-wrapper input.' + 'desktop' + ', .customize-control .ast-responsive-btns > li.' + 'desktop' ).addClass( 'active' );

		},

		/**
		 * Updates the sorting list
		 */
		updateValue: function() {

			'use strict';

			var control = this,
			newValue = {};

			// Set the spacing container.
			control.responsiveContainer = control.container.find( '.ast-responsive-wrapper' ).first();

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

			control.setting.set( newValue );
		},

		astResponsiveInit : function() {
			
			'use strict';
			this.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {

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
		},
	});

	jQuery(' .wp-full-overlay-footer .devices button ').on('click', function() {

		var device = jQuery(this).attr('data-device');

		jQuery( '.customize-control-ast-responsive .input-wrapper input, .customize-control .ast-responsive-btns > li' ).removeClass( 'active' );
		jQuery( '.customize-control-ast-responsive .input-wrapper input.' + device + ', .customize-control .ast-responsive-btns > li.' + device ).addClass( 'active' );
	});
})(jQuery);

( function( $ ) {
	jQuery(window).on("load", function() {
		jQuery('html').addClass('responsive-background-color-ready');
	});
	/**
	 * File responsive-color.js
	 *
	 * Handles the responsive color
	 *
	 * @package Astra
	 */
	wp.customize.controlConstructor['ast-responsive-color'] = wp.customize.Control.extend({

		// When we're finished loading continue processing
		ready: function() {

			'use strict';

			var control = this;

			// Init the control.
			control.initAstBgControl();
		},

		initAstBgControl: function() {

			var control = this,
				value   = control.setting._value,
				picker  = control.container.find( '.ast-responsive-color' );

			// Color.
			picker.wpColorPicker({

				change: function(event, ui) {
					if ( jQuery('html').hasClass('responsive-background-color-ready') ) {

						var stored = control.setting.get();
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
						control.setting.set( newValue );
					}
				},

				/**
				 * @param {Event} event - standard jQuery event, produced by "Clear"
				 * button.
				 */
				clear: function (event) {
					var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0],
						device = jQuery( this ).closest('.wp-picker-input-wrap').find('.wp-color-picker').data( 'id' );

						var stored = control.setting.get();
						var newValue = {
							'desktop' : stored['desktop'],
							'tablet'  : stored['tablet'],
							'mobile'  : stored['mobile'],
						};
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
						control.setting.set( newValue );
					}
				}
			});

			this.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {

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

			jQuery( '.customize-control-ast-responsive-color .customize-control-content .ast-responsive-color.desktop' ).parents( '.wp-picker-container' ).addClass( 'active' );

		}
	});


	jQuery('.wp-full-overlay-footer .devices button').on('click', function() {

		var device = jQuery(this).attr('data-device');

		jQuery( '.customize-control-ast-responsive-color .customize-control-content .wp-picker-container' ).removeClass( 'active' );
		jQuery( '.customize-control-ast-responsive-color .customize-control-content .ast-responsive-color.' + device ).parents( '.wp-picker-container' ).addClass( 'active' );
	});
})(jQuery);

jQuery(window).on("load", function() {
	jQuery('html').addClass('responsive-background-img-ready');
});
wp.customize.controlConstructor['ast-responsive-background'] = wp.customize.Control.extend({

	// When we're finished loading continue processing
	ready: function() {

		'use strict';

		var control = this;

		// Init the control.
		control.initAstBgControl();
		control.astResponsiveInit();
	},

	initAstBgControl: function() {

		var control = this,
			value   = control.setting._value,
			picker  = control.container.find( '.ast-responsive-bg-color-control' );

		// Hide unnecessary controls if the value doesn't have an image.
		if ( _.isUndefined( value['desktop']['background-image']) || '' === value['desktop']['background-image']) {
			control.container.find( '.background-wrapper > .background-container.desktop > .background-repeat' ).hide();
			control.container.find( '.background-wrapper > .background-container.desktop > .background-position' ).hide();
			control.container.find( '.background-wrapper > .background-container.desktop > .background-size' ).hide();
			control.container.find( '.background-wrapper > .background-container.desktop > .background-attachment' ).hide();
		}
		if ( _.isUndefined( value['tablet']['background-image']) || '' === value['tablet']['background-image']) {
			control.container.find( '.background-wrapper > .background-container.tablet > .background-repeat' ).hide();
			control.container.find( '.background-wrapper > .background-container.tablet > .background-position' ).hide();
			control.container.find( '.background-wrapper > .background-container.tablet > .background-size' ).hide();
			control.container.find( '.background-wrapper > .background-container.tablet > .background-attachment' ).hide();
		}
		if ( _.isUndefined( value['mobile']['background-image']) || '' === value['mobile']['background-image']) {
			control.container.find( '.background-wrapper > .background-container.mobile > .background-repeat' ).hide();
			control.container.find( '.background-wrapper > .background-container.mobile > .background-position' ).hide();
			control.container.find( '.background-wrapper > .background-container.mobile > .background-size' ).hide();
			control.container.find( '.background-wrapper > .background-container.mobile > .background-attachment' ).hide();
		}

		// Color.
		picker.wpColorPicker({
			change: function(event, ui) {
				var device = jQuery( this ).data( 'id' );
				if ( jQuery('html').hasClass('responsive-background-img-ready') ) {
					control.saveValue( device, 'background-color', ui.color.toString() );
				}
			},

			/**
		     * @param {Event} event - standard jQuery event, produced by "Clear"
		     * button.
		     */
		    clear: function (event)
		    {
		    	var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0],
			    	responsive_input = jQuery( this ),
					screen = responsive_input.closest('.wp-picker-input-wrap').find('.wp-color-picker').data( 'id' );
		        if (element) {
					control.saveValue( screen, 'background-color', '' );
				}
		    }
		});

		// Background-Repeat.
		control.container.on( 'change', '.background-repeat select', function() {
			var responsive_input = jQuery( this ),
				screen = responsive_input.data( 'id' ),
				item_value = responsive_input.val();

			control.saveValue( screen, 'background-repeat', item_value );
		});

		// Background-Size.
		control.container.on( 'change click', '.background-size input', function() {
			var responsive_input = jQuery( this ),
				screen = responsive_input.data( 'id' ),
				item_value = responsive_input.val();

			responsive_input.parent( '.buttonset' ).find( '.switch-input' ).removeAttr('checked');
			responsive_input.attr( 'checked', 'checked' );

			control.saveValue( screen, 'background-size', item_value );
		});
		
		// Background-Position.
		control.container.on( 'change', '.background-position select', function() {
			var responsive_input = jQuery( this ),
				screen = responsive_input.data( 'id' ),
				item_value = responsive_input.val();

			control.saveValue( screen, 'background-position', item_value );
		});
		
		// Background-Attachment.
		control.container.on( 'change click', '.background-attachment input', function() {
			var responsive_input = jQuery( this ),
				screen = responsive_input.data( 'id' ),
				item_value = responsive_input.val();

			responsive_input.parent( '.buttonset' ).find( '.switch-input' ).removeAttr('checked');
			responsive_input.attr( 'checked', 'checked' );

			control.saveValue( screen, 'background-attachment', item_value );
		});
		
		// Background-Image.
		control.container.on( 'click', '.background-image-upload-button', function( e ) {
			var responsive_input = jQuery( this ),
			screen = responsive_input.data( 'id' );
			
			var image = wp.media({ multiple: false }).open().on( 'select', function() {

				// This will return the selected image from the Media Uploader, the result is an object.
				var uploadedImage = image.state().get( 'selection' ).first(),
					previewImage   = uploadedImage.toJSON().sizes.full.url,
					imageUrl,
					imageID,
					imageWidth,
					imageHeight,
					preview,
					removeButton;

				if ( ! _.isUndefined( uploadedImage.toJSON().sizes.medium ) ) {
					previewImage = uploadedImage.toJSON().sizes.medium.url;
				} else if ( ! _.isUndefined( uploadedImage.toJSON().sizes.thumbnail ) ) {
					previewImage = uploadedImage.toJSON().sizes.thumbnail.url;
				}

				imageUrl    = uploadedImage.toJSON().sizes.full.url;
				imageID     = uploadedImage.toJSON().id;
				imageWidth  = uploadedImage.toJSON().width;
				imageHeight = uploadedImage.toJSON().height;

				// Show extra controls if the value has an image.
				if ( '' !== imageUrl ) {
					control.container.find( '.background-wrapper > .background-repeat, .background-wrapper > .background-position, .background-wrapper > .background-size, .background-wrapper > .background-attachment' ).show();
				}

				control.saveValue( screen, 'background-image', imageUrl );
				preview      = control.container.find( '.background-container.'+screen+' .placeholder, .background-container.'+screen+' .thumbnail' );
				removeButton = control.container.find( '.background-container.'+screen+' .background-image-upload-remove-button' );

				if ( preview.length ) {
					preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + previewImage + '" alt="" />' );
				}
				if ( removeButton.length ) {
					removeButton.show();
				}
			});

			e.preventDefault();
		});

		control.container.on( 'click', '.background-image-upload-remove-button', function( e ) {

			var preview,
				removeButton,
				responsive_input = jQuery( this ),
				screen = responsive_input.data( 'id' );

			e.preventDefault();

			control.saveValue( screen, 'background-image', '' );

			preview      = control.container.find( '.background-container.'+ screen +' .placeholder, .background-container.'+ screen +' .thumbnail' );
			removeButton = control.container.find( '.background-container.'+ screen +' .background-image-upload-remove-button' );

			// Hide unnecessary controls.
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-repeat' ).hide();
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-position' ).hide();
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-size' ).hide();
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-attachment' ).hide();
			
			control.container.find( '.background-container.'+ screen +' .more-settings' ).attr('data-direction', 'down');
			control.container.find( '.background-container.'+ screen +' .more-settings' ).find('.message').html( astraCustomizerControlBackground.moreSettings );
			control.container.find( '.background-container.'+ screen +' .more-settings' ).find('.icon').html( '↓' );

			if ( preview.length ) {
				preview.removeClass().addClass( 'placeholder' ).html( astraCustomizerControlBackground.placeholder );
			}
			if ( removeButton.length ) {
				removeButton.hide();
			}
		});

		control.container.on( 'click', '.more-settings', function( e ) {

			var responsive_input = jQuery( this ),
				screen = responsive_input.data( 'id' );
			// Hide unnecessary controls.
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-repeat' ).toggle();
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-position' ).toggle();
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-size' ).toggle();
			control.container.find( '.background-wrapper > .background-container.'+ screen +' > .background-attachment' ).toggle();

			if( 'down' === jQuery(this).attr( 'data-direction' ) )
			{
				jQuery(this).attr('data-direction', 'up');
				jQuery(this).find('.message').html( astraCustomizerControlBackground.lessSettings )
				jQuery(this).find('.icon').html( '↑' );
			} else {
				jQuery(this).attr('data-direction', 'down');
				jQuery(this).find('.message').html( astraCustomizerControlBackground.moreSettings )
				jQuery(this).find('.icon').html( '↓' );
			}
		});
	},
	astResponsiveInit : function() {
			
			'use strict';
			this.container.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {

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
	},

	/**
	 * Saves the value.
	 */
	saveValue: function( screen, property, value ) {

		var control = this,
			input   = jQuery( '#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .responsive-background-hidden-value' ),
			val     = control.setting._value;
		
		val[ screen ][ property ] = value;

		jQuery( input ).attr( 'value', JSON.stringify( val ) ).trigger( 'change' );
		control.setting.set( val );
	}
});


	jQuery(' .wp-full-overlay-footer .devices button ').on('click', function() {

		var device = jQuery(this).attr('data-device');

		jQuery( '.customize-control-ast-responsive-background .background-container, .customize-control .ast-responsive-btns > li' ).removeClass( 'active' );
		jQuery( '.customize-control-ast-responsive-background .background-container.' + device + ', .customize-control .ast-responsive-btns > li.' + device ).addClass( 'active' );
	});
( function( $ ) {

	/**
	 * File slider.js
	 *
	 * Handles Slider control
	 *
	 * @package Astra
	 */

	wp.customize.controlConstructor['ast-responsive-slider'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this,
				value,
				thisInput,
				inputDefault,
				changeAction;

			control.astResponsiveInit();

			// Update the text value.
			this.container.on( 'input change', 'input[type=range]', function() {
				var value 		 = jQuery( this ).val(),
					input_number = jQuery( this ).closest( '.input-field-wrapper' ).find( '.ast-responsive-range-value-input' );
				
				input_number.val( value );
				input_number.trigger( 'change' );
			});

			// Handle the reset button.
			this.container.on('click', '.ast-responsive-slider-reset', function() {
				
				var wrapper 		= jQuery( this ).parent().find('.input-field-wrapper.active'),
					input_range   	= wrapper.find( 'input[type=range]' ),
					input_number 	= wrapper.find( '.ast-responsive-range-value-input' ),
					default_value	= input_range.data( 'reset_value' );

				input_range.val( default_value );
				input_number.val( default_value );
				input_number.trigger( 'change' );
			});

			// Save changes.
			this.container.on( 'input change', 'input[type=number]', function() {
				var value = jQuery( this ).val();
				jQuery( this ).closest( '.input-field-wrapper' ).find( 'input[type=range]' ).val( value );
				
				control.updateValue();
			});
		},

		/**
		 * Updates the sorting list
		 */
		updateValue: function() {

			'use strict';

			var control = this,
			newValue = {};

			// Set the spacing container.
			control.responsiveContainer = control.container.find( '.wrapper' ).first();

			control.responsiveContainer.find( '.ast-responsive-range-value-input' ).each( function() {
				var responsive_input = jQuery( this ),
				item = responsive_input.data( 'id' ),
				item_value = responsive_input.val();

				newValue[item] = item_value;

			});

			control.setting.set( newValue );
		},

		astResponsiveInit : function() {
			
			this.container.on( 'click', '.ast-responsive-slider-btns button', function( event ) {

				event.preventDefault();
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
		},
	});

	jQuery(' .wp-full-overlay-footer .devices button ').on('click', function() {

		var device = jQuery(this).attr('data-device');

		jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper, .customize-control .ast-responsive-slider-btns > li' ).removeClass( 'active' );
		jQuery( '.customize-control-ast-responsive-slider .input-field-wrapper.' + device + ', .customize-control .ast-responsive-slider-btns > li.' + device ).addClass( 'active' );
	});
	
})(jQuery);

( function( $ ) {
	/**
	 * File spacing.js
	 *
	 * Handles the spacing
	 *
	 * @package Astra
	 */

	wp.customize.controlConstructor['ast-responsive-spacing'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this,
		    value;
		    
		    control.astResponsiveInit();

			// Set the spacing container.
			// this.container = control.container.find( 'ul.ast-spacing-wrapper' ).first();

			// Save the value.
			this.container.on( 'change keyup paste', 'input.ast-spacing-input', function() {

				value = jQuery( this ).val();

				// Update value on change.
				control.updateValue();
			});
		},

		/**
		 * Updates the spacing values
		 */
		updateValue: function() {

			'use strict';

			var control = this,
				newValue = {
					'desktop' 		: {},
					'tablet'  		: {},
					'mobile'  		: {},
					'desktop-unit'	: 'px',
					'tablet-unit'	: 'px',
					'mobile-unit'	: 'px',
				};

			control.container.find( 'input.ast-spacing-desktop' ).each( function() {
				var spacing_input = jQuery( this ),
				item = spacing_input.data( 'id' ),
				item_value = spacing_input.val();

				newValue['desktop'][item] = item_value;
			});

			control.container.find( 'input.ast-spacing-tablet' ).each( function() {
				var spacing_input = jQuery( this ),
				item = spacing_input.data( 'id' ),
				item_value = spacing_input.val();

				newValue['tablet'][item] = item_value;
			});

			control.container.find( 'input.ast-spacing-mobile' ).each( function() {
				var spacing_input = jQuery( this ),
				item = spacing_input.data( 'id' ),
				item_value = spacing_input.val();

				newValue['mobile'][item] = item_value;
			});

			control.container.find('.ast-spacing-unit-wrapper .ast-spacing-unit-input').each( function() {
				var spacing_unit 	= jQuery( this ),
					device 			= spacing_unit.attr('data-device'),
					device_val 		= spacing_unit.val(),
					name 			= device + '-unit';
					
				newValue[ name ] = device_val;
			});

			control.setting.set( newValue );
		},

		/**
		 * Set the responsive devices fields
		 */
		astResponsiveInit : function() {
			
			'use strict';

			var control = this;
			
			control.container.find( '.ast-spacing-responsive-btns button' ).on( 'click', function( event ) {

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

			// Unit click
			control.container.on( 'click', '.ast-spacing-responsive-units .single-unit', function() {
				
				var $this 		= jQuery(this);

				if ( $this.hasClass('active') ) {
					return false;
				}

				var	unit_value 	= $this.attr('data-unit'),
					device 		= jQuery('.wp-full-overlay-footer .devices button.active').attr('data-device');
				
				$this.siblings().removeClass('active');
				$this.addClass('active');

				control.container.find('.ast-spacing-unit-wrapper .ast-spacing-' + device + '-unit').val( unit_value );

				// Update value on change.
				control.updateValue();
			});
		},
	});

	jQuery( document ).ready( function( ) {

		// Connected button
		jQuery( '.ast-spacing-connected' ).on( 'click', function() {

			// Remove connected class
			jQuery(this).parent().parent( '.ast-spacing-wrapper' ).find( 'input' ).removeClass( 'connected' ).attr( 'data-element-connect', '' );
			
			// Remove class
			jQuery(this).parent( '.ast-spacing-input-item-link' ).removeClass( 'disconnected' );

		} );

		// Disconnected button
		jQuery( '.ast-spacing-disconnected' ).on( 'click', function() {

			// Set up variables
			var elements 	= jQuery(this).data( 'element-connect' );
			
			// Add connected class
			jQuery(this).parent().parent( '.ast-spacing-wrapper' ).find( 'input' ).addClass( 'connected' ).attr( 'data-element-connect', elements );

			// Add class
			jQuery(this).parent( '.ast-spacing-input-item-link' ).addClass( 'disconnected' );

		} );

		// Values connected inputs
		jQuery( '.ast-spacing-input-item' ).on( 'input', '.connected', function() {

			var dataElement 	  = jQuery(this).attr( 'data-element-connect' ),
				currentFieldValue = jQuery( this ).val();

			jQuery(this).parent().parent( '.ast-spacing-wrapper' ).find( '.connected[ data-element-connect="' + dataElement + '" ]' ).each( function( key, value ) {
				jQuery(this).val( currentFieldValue ).change();
			} );

		} );
	});

	jQuery('.wp-full-overlay-footer .devices button ').on('click', function() {

		var device = jQuery(this).attr('data-device');
		jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper, .customize-control .ast-spacing-responsive-btns > li' ).removeClass( 'active' );
		jQuery( '.customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper.' + device + ', .customize-control .ast-spacing-responsive-btns > li.' + device ).addClass( 'active' );
	});
})(jQuery);

( function( $ ) {
	/**
	 * File slider.js
	 *
	 * Handles Slider control
	 *
	 * @package Astra
	 */

	wp.customize.controlConstructor['ast-slider'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this,
				value,
				thisInput,
				inputDefault,
				changeAction;

			// Update the text value.
			jQuery( 'input[type=range]' ).on( 'input change', function() {
				var value 		 = jQuery( this ).attr( 'value' ),
					input_number = jQuery( this ).closest( '.wrapper' ).find( '.astra_range_value .value' );

				input_number.val( value );
				input_number.change();
			});

			// Handle the reset button.
			jQuery( '.ast-slider-reset' ).click( function() {
				var wrapper 		= jQuery( this ).closest( '.wrapper' ),
					input_range   	= wrapper.find( 'input[type=range]' ),
					input_number 	= wrapper.find( '.astra_range_value .value' ),
					default_value	= input_range.data( 'reset_value' );

				input_range.val( default_value );
				input_number.val( default_value );
				input_number.change();
			});

			// Save changes.
			this.container.on( 'input change', 'input[type=number]', function() {
				var value = jQuery( this ).val();
				jQuery( this ).closest( '.wrapper' ).find( 'input[type=range]' ).val( value );
				control.setting.set( value );
			});
		}
	});
})(jQuery);

( function( $ ) {
	/**
	 * File sortable.js
	 *
	 * Handles sortable list
	 *
	 * @package Astra
	 */

	wp.customize.controlConstructor['ast-sortable'] = wp.customize.Control.extend({

		ready: function() {

			'use strict';

			var control = this;

			// Set the sortable container.
			control.sortableContainer = control.container.find( 'ul.sortable' ).first();

			// Init sortable.
			control.sortableContainer.sortable({

				// Update value when we stop sorting.
				stop: function() {
					control.updateValue();
				}
			}).disableSelection().find( 'li' ).each( function() {

					// Enable/disable options when we click on the eye of Thundera.
					jQuery( this ).find( 'i.visibility' ).click( function() {
						jQuery( this ).toggleClass( 'dashicons-visibility-faint' ).parents( 'li:eq(0)' ).toggleClass( 'invisible' );
					});
			}).click( function() {

				// Update value on click.
				control.updateValue();
			});
		},

		/**
		 * Updates the sorting list
		 */
		updateValue: function() {

			'use strict';

			var control = this,
		    newValue = [];

			this.sortableContainer.find( 'li' ).each( function() {
				if ( ! jQuery( this ).is( '.invisible' ) ) {
					newValue.push( jQuery( this ).data( 'value' ) );
				}
			});

			control.setting.set( newValue );
		}
	});
})(jQuery);

/**
 * File typography.js
 *
 * Handles Typography of the site
 *
 * @package Astra
 */

( function( $ ) {

	/* Internal shorthand */
	var api = wp.customize;

	/**
	 * Helper class for the main Customizer interface.
	 *
	 * @since 1.0.0
	 * @class AstTypography
	 */
	AstTypography = {

		/**
		 * Initializes our custom logic for the Customizer.
		 *
		 * @since 1.0.0
		 * @method init
		 */
		init: function() {
			AstTypography._initFonts();
		},

		/**
		 * Initializes logic for font controls.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _initFonts
		 */
		_initFonts: function()
		{
			$( '.customize-control-ast-font-family select' ).each( function(e) {

				if( 'undefined' != typeof astra.customizer ) {
					var fonts = astra.customizer.settings.google_fonts;
					var optionName = $(this).data('name');

					$(this).html( fonts );

					// Set inherit option text defined in control parameters.
					$("select[data-name='" + optionName + "'] option[value='inherit']").text( $(this).data('inherit') );

					var font_val = $(this).data('value');

					$(this).val( font_val );
				}
			});

			$( '.customize-control-ast-font-family select' ).each( AstTypography._initFont );
			// Added select2 for all font family & font variant.
			$('.customize-control-ast-font-family select, .customize-control-ast-font-variant select').selectWoo();

			$('.customize-control-ast-font-variant select').on('select2:unselecting', function (e) {
				var variantSelect = $(this).data( 'customize-setting-link' ),
				    unselectedValue = e.params.args.data.id || '';

				if ( unselectedValue ) {
					$(this).find('option[value="' + e.params.args.data.id + '"]').removeAttr('selected');
					if ( null === $(this).val() ) {
						api( variantSelect ).set( '' );
					}
				}
			});
		},

		/**
		 * Initializes logic for a single font control.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _initFont
		 */
		_initFont: function()
		{
			var select  = $( this ),
			link    = select.data( 'customize-setting-link' ),
			weight  = select.data( 'connected-control' ),
			variant  = select.data( 'connected-variant' );

			if ( 'undefined' != typeof weight ) {
				api( link ).bind( AstTypography._fontSelectChange );
				AstTypography._setFontWeightOptions.apply( api( link ), [ true ] );
			}

			if ( 'undefined' != typeof variant ) {
				api( link ).bind( AstTypography._fontSelectChange );
				AstTypography._setFontVarianttOptions.apply( api( link ), [ true ] );
			}
		},

		/**
		 * Callback for when a font control changes.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _fontSelectChange
		 */
		_fontSelectChange: function()
		{
			var fontSelect          = api.control( this.id ).container.find( 'select' ),
			variants            	= fontSelect.data( 'connected-variant' );

			AstTypography._setFontWeightOptions.apply( this, [ false ] );
			
			if ( 'undefined' != typeof variants ) {
				AstTypography._setFontVarianttOptions.apply( this, [ false ] );
			}
		},

		/**
		 * Clean font name.
		 *
		 * Google Fonts are saved as {'Font Name', Category}. This function cleanes this up to retreive only the {Font Name}.
		 *
		 * @since  1.3.0
		 * @param  {String} fontValue Name of the font.
		 * 
		 * @return {String}  Font name where commas and inverted commas are removed if the font is a Google Font.
		 */
		_cleanGoogleFonts: function(fontValue)
		{
			// Bail if fontVAlue does not contain a comma.
			if ( ! fontValue.includes(',') ) return fontValue;

			var splitFont 	= fontValue.split(',');
			var pattern 	= new RegExp("'", 'gi');

			// Check if the cleaned font exists in the Google fonts array.
			var googleFontValue = splitFont[0].replace(pattern, '');
			if ( 'undefined' != typeof AstFontFamilies.google[ googleFontValue ] ) {
				fontValue = googleFontValue;
			}

			return fontValue;
		},

		/**
		 * Get font Weights.
		 *
		 * This function gets the font weights values respective to the selected fonts family{Font Name}.
		 *
		 * @since  1.5.2
		 * @param  {String} fontValue Name of the font.
		 * 
		 * @return {String}  Available font weights for the selected fonts.
		 */
		_getWeightObject: function(fontValue)
		{
			var weightObject        = [ '400', '600' ];
			if ( fontValue == 'inherit' ) {
				weightObject = [ '100','200','300','400','500','600','700','800','900' ];
			} else if ( 'undefined' != typeof AstFontFamilies.system[ fontValue ] ) {
				weightObject = AstFontFamilies.system[ fontValue ].weights;
			} else if ( 'undefined' != typeof AstFontFamilies.google[ fontValue ] ) {
				weightObject = AstFontFamilies.google[ fontValue ][0];
				weightObject = Object.keys(weightObject).map(function(k) {
				  return weightObject[k];
				});
			} else if ( 'undefined' != typeof AstFontFamilies.custom[ fontValue ] ) {
				weightObject = AstFontFamilies.custom[ fontValue ].weights;
			}

			return weightObject;
		},

		/**
		 * Sets the options for a font weight control when a
		 * font family control changes.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _setFontWeightOptions
		 * @param {Boolean} init Whether or not we're initializing this font weight control.
		 */
		_setFontWeightOptions: function( init )
		{
			var i               = 0,
			fontSelect          = api.control( this.id ).container.find( 'select' ),
			fontValue           = this(),
			selected            = '',
			weightKey           = fontSelect.data( 'connected-control' ),
			inherit             = fontSelect.data( 'inherit' ),
			weightSelect        = api.control( weightKey ).container.find( 'select' ),
			currentWeightTitle  = weightSelect.data( 'inherit' ),
			weightValue         = init ? weightSelect.val() : '400',
			inheritWeightObject = [ 'inherit' ],
			weightObject        = [ '400', '600' ],
			weightOptions       = '',
			weightMap           = astraTypo;
			if ( fontValue == 'inherit' ) {
				weightValue     = init ? weightSelect.val() : 'inherit';
			}

			var fontValue = AstTypography._cleanGoogleFonts(fontValue);
			var weightObject = AstTypography._getWeightObject( fontValue );

			weightObject = $.merge( inheritWeightObject, weightObject )
			weightMap[ 'inherit' ] = currentWeightTitle;
			for ( ; i < weightObject.length; i++ ) {

				if ( 0 === i && -1 === $.inArray( weightValue, weightObject ) ) {
					weightValue = weightObject[ 0 ];
					selected 	= ' selected="selected"';
				} else {
					selected = weightObject[ i ] == weightValue ? ' selected="selected"' : '';
				}
				if( ! weightObject[ i ].includes( "italic" ) ){
					weightOptions += '<option value="' + weightObject[ i ] + '"' + selected + '>' + weightMap[ weightObject[ i ] ] + '</option>';
				}
			}

			weightSelect.html( weightOptions );

			if ( ! init ) {
				api( weightKey ).set( '' );
				api( weightKey ).set( weightValue );
			}
		},
		/**
		 * Sets the options for a font variant control when a
		 * font family control changes.
		 *
		 * @since 1.5.2
		 * @access private
		 * @method _setFontVarianttOptions
		 * @param {Boolean} init Whether or not we're initializing this font variant control.
		 */
		_setFontVarianttOptions: function( init )
		{
				var i               = 0,
				fontSelect          = api.control( this.id ).container.find( 'select' ),
				fontValue           = this(),
				selected            = '',
				variants            = fontSelect.data( 'connected-variant' ),
				inherit             = fontSelect.data( 'inherit' ),
				variantSelect       = api.control( variants ).container.find( 'select' ),
				variantSavedField   = api.control( variants ).container.find( '.ast-font-variant-hidden-value' ),
				weightValue        = '',
				weightOptions       = '',
				currentWeightTitle  = variantSelect.data( 'inherit' ),
				weightMap           = astraTypo;

				var variantArray = variantSavedField.val().split(',');

				// Hide font variant for any ohter fonts then Google
				var selectedOptionGroup = fontSelect.find('option[value="' + fontSelect.val() + '"]').closest('optgroup').attr('label') || '';
				if ( 'Google' == selectedOptionGroup ) {
					variantSelect.parent().removeClass('ast-hide');
				} else{
					variantSelect.parent().addClass('ast-hide');
				}

				var fontValue = AstTypography._cleanGoogleFonts(fontValue);
				var weightObject = AstTypography._getWeightObject( fontValue );

				weightMap[ 'inherit' ] = currentWeightTitle;
				
				for ( var i = 0; i < weightObject.length; i++ ) {
					for ( var e = 0; e < variantArray.length; e++ ) {
						if ( weightObject[i] === variantArray[e] ) {
							weightValue = weightObject[ i ];
							selected 	= ' selected="selected"';
						} else{
							selected = ( weightObject[ i ] == weightValue ) ? ' selected="selected"' : '';
						}
					}
					weightOptions += '<option value="' + weightObject[ i ] + '"' + selected + '>' + weightMap[ weightObject[ i ] ] + '</option>';
				}

				variantSelect.html( weightOptions );
				if ( ! init ) {
					api( variants ).set( '' );
				}
		},
	};

	$( function() { AstTypography.init(); } );

})( jQuery );
