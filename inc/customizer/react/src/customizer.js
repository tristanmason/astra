( function( $, api ) {
    var $window = $( window ),
		$document = $( document ),
		$body = $( 'body' );
	/**
	 * API on ready event handlers
	 *
	 * All handlers need to be inside the 'ready' state.
	 */
	wp.customize.bind( 'ready', function() {

        /**
		 * Init Header & Footer Builder
		 */
		var initHeaderBuilderPanel = function( panel ) {
			var section =  wp.customize.section( 'section-header-builder' ),
				$section = section.contentContainer;

			panel.expanded.bind(function( isExpanded ) {
				_.each(section.controls(), function( control ) {
					if ( 'resolved' === control.deferred.embedded.state() ) {
						return;
					}
					control.renderContent();
					control.deferred.embedded.resolve(); // This triggers control.ready().
					
					// Fire event after control is initialized.
					control.container.trigger( 'init' );
				});

				if ( isExpanded ) {
					$body.addClass( 'astra-builder-is-active' );
					$section.addClass( 'astra-builder-active' );
				} else {
					$body.removeClass( 'astra-builder-is-active' );
					$section.removeClass( 'astra-builder-active' );
				}
			});
			// Attach callback to builder toggle.
			$section.on( 'click', '.astra-builder-tab-toggle', function( e ) {
				e.preventDefault();
				$section.toggleClass( 'astra-builder-hide' );
				// resizePreviewer();
			});

		};
        wp.customize.panel( 'panel-hfb', initHeaderBuilderPanel );
        
    });
} )( jQuery, wp );
