/**
 * Astra Builder admin settings
 *
 * @package Astra Builder
 * @since  x.x.x
 */

(function( $ ) {

	/**
	 * AJAX Request Queue
	 *
	 * - add()
	 * - remove()
	 * - run()
	 * - stop()
	 *
	 * @since x.x.x
	 */
	var AstraBuilderAjaxQueue = (function() {

		var requests = [];

		return {

			/**
			 * Add AJAX request
			 *
			 * @since x.x.x
			 */
			add:  function(opt) {
			    requests.push(opt);
			},

			/**
			 * Remove AJAX request
			 *
			 * @since x.x.x
			 */
			remove:  function(opt) {
			    if( jQuery.inArray(opt, requests) > -1 )
			        requests.splice($.inArray(opt, requests), 1);
			},

			/**
			 * Run / Process AJAX request
			 *
			 * @since x.x.x
			 */
			run: function() {
			    var self = this,
			        oriSuc;

			    if( requests.length ) {
			        oriSuc = requests[0].complete;

			        requests[0].complete = function() {
						if( typeof(oriSuc) === 'function' ) oriSuc();
						requests.shift();
						self.run.apply(self, []);
			        };

			        jQuery.ajax(requests[0]);

			    } else {

			      self.tid = setTimeout(function() {
			         self.run.apply(self, []);
			      }, 1000);
			    }
			},

			/**
			 * Stop AJAX request
			 *
			 * @since x.x.x
			 */
			stop:  function() {

			    requests = [];
			    clearTimeout(this.tid);
			}
		};

	}());

	/**
	 * Astra Builder Admin JS
	 *
	 * @since x.x.x
	 */
	AstBuilderAdmin = {

		init: function() {
			
			$( document ).delegate( ".ast-delete-old-options", "click", AstBuilderAdmin.delete_module );
			$( document ).delegate( ".ast-builder-migrate", "click", AstBuilderAdmin.migrate );
		},

		migrate: function( e ) {

			e.stopPropagation();
			e.preventDefault();

			$this = $( this );

			if ( $this.hasClass( 'updating-message' ) ) {
				return;
			}

			$this.addClass( 'updating-message' );

			 var data = {
				action: 'ast-migrate-to-builder',
				value: $(this).attr( 'data-value' ),
				nonce: astraBuilderModules.ajax_nonce,
			};

			$.ajax({
				url: astraBuilderModules.ajaxurl,
				type: 'POST',
				data: data,
				success: function( response ) {
					$this.removeClass( 'updating-message' );
					if ( response.success ) {
						if ( data.value == '1' ) {
							// Change button classes & text.
							$this.text( astraBuilderModules.old_header_footer );
							$this.attr( 'data-value', '0' );
							$( '.ast-delete-old-options' ).removeClass( 'hidden' );
						} else {
							// Change button classes & text.
							$this.text( astraBuilderModules.migrate_to_builder );
							$this.attr( 'data-value', '1' );
							$( '.ast-delete-old-options' ).addClass( 'hidden' );
						}
					}
				}
			})
		},

		/**
		 * Delete Module.
		 */
		delete_module: function( e ) {

			e.stopPropagation();
			e.preventDefault();

			var delete_status = confirm( astraBuilderModules.delete_permission );

			var button = $( this ),
				data = {
					module_id: 'astra-hf-builder',
					action: 'astra_addon_delete_module',
					nonce: astraBuilderModules.ajax_nonce,
				};

			if ( true == delete_status ) {
				if ( button.hasClass( 'updating-message' ) ) {
					return;
				}

				$( button ).addClass('updating-message');

				AstraBuilderAjaxQueue.add({
					url: ajaxurl,
					type: 'POST',
					data: data,
					success: function(data){
						// Change button classes & text.
						button.text(astraBuilderModules.deleted).removeClass('updating-message');

						setTimeout( function() {
							button.remove();
						}, 1000 );

					}
				})
				e.preventDefault();

				AstraBuilderAjaxQueue.run();
			}
		},
	}

	$( document ).ready(function() {
		AstBuilderAdmin.init();
	});

})( jQuery );
