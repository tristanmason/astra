/**
 *
 * Handle Mobile Cart events.
 *
 * @since 3.1.0
 * @package Astra
 */

( function() {

    var cart_flyout = document.getElementById( 'astra-mobile-cart-drawer' ),
    main_header_masthead = document.getElementById('masthead'),
    woo_data = '',
    mobileHeader = main_header_masthead.querySelector("#ast-mobile-header"),
    edd_data = '';

    if ( undefined !== cart_flyout && '' !== cart_flyout && null !== cart_flyout ) {
		woo_data = cart_flyout.querySelector( '.widget_shopping_cart.woocommerce' );
		edd_data = cart_flyout.querySelector( '.widget_edd_cart_widget' );
    }
    
    /**
	 * Opens the Cart Flyout.
	 */
	cartFlyoutOpen = function ( event ) {
		event.preventDefault();

		var current_cart = event.currentTarget.cart_type;

		if ( 'woocommerce' === current_cart && document.body.classList.contains('woocommerce-cart') ) {
			return;
		}
		
		if ( undefined !== cart_flyout && '' !== cart_flyout && null !== cart_flyout ) {
			
			cart_flyout.classList.add( 'active' );
			document.documentElement.classList.add( 'ast-mobile-cart-active' );
			if ( undefined !== edd_data && '' !== edd_data && null !== edd_data ) {
				edd_data.style.display = 'block';
				if ( 'woocommerce' === current_cart ) {
					edd_data.style.display = 'none';
				}
			}
			if ( undefined !== woo_data && '' !== woo_data && null !== woo_data ) {
				woo_data.style.display = 'block';
				if ( 'edd' === current_cart ) {
					woo_data.style.display = 'none';
				}
			}
		}
	}

	/**
	 * Closes the Cart Flyout.
	 */
	cartFlyoutClose = function ( event ) {

		event.preventDefault();
		if ( undefined !== cart_flyout && '' !== cart_flyout && null !== cart_flyout ) {
			cart_flyout.classList.remove( 'active' );
			document.documentElement.classList.remove( 'ast-mobile-cart-active' );

		}
    }
    
     /**
	 * Main Init Function.
	 */
	function cartinit( ) {
        // Close Popup if esc is pressed.
            document.addEventListener( 'keyup', function (event) {
                // 27 is keymap for esc key.
            if ( event.keyCode === 27 ) {
                event.preventDefault();
                cart_flyout.classList.remove( 'active' );
                document.documentElement.classList.remove( 'ast-mobile-cart-active' );
                updateTrigger();
            }
        });

        // Close Popup on outside click.
        document.addEventListener('click', function (event) {

            var target = event.target;
            var cart_modal = document.querySelector( '.ast-mobile-cart-active .astra-mobile-cart-overlay' );

            if ( target === cart_modal ) {
                cart_flyout.classList.remove( 'active' );
                document.documentElement.classList.remove( 'ast-mobile-cart-active' );
            }
        });

		if ( undefined !== mobileHeader && '' !== mobileHeader && null !== mobileHeader ) {

			// Mobile Header Cart Flyout.
			var woo_cart = document.querySelector( '.ast-header-woo-cart' );
			var edd_cart = document.querySelector( '.ast-header-edd-cart' );
			var cart_close = document.querySelector( '.astra-cart-drawer-close' );
	
			if ( undefined !== woo_cart && '' !== woo_cart && null !== woo_cart ) {
               
				woo_cart.addEventListener("click", cartFlyoutOpen, false);
				woo_cart.cart_type = 'woocommerce';
			}
			if ( undefined !== edd_cart && '' !== edd_cart && null !== edd_cart ) {
                edd_cart.addEventListener("click", cartFlyoutOpen, false);
				edd_cart.cart_type = 'edd';
			}
			if ( undefined !== cart_close && '' !== cart_close && null !== cart_close ) {
				cart_close.addEventListener("click", cartFlyoutClose, false);
			}
		}
		
    }

    window.addEventListener('resize', function () {
		// Close Cart
		var cart_close = document.querySelector( '.astra-cart-drawer-close' );
		if ( undefined !== cart_close && '' !== cart_close && null !== cart_close ) {
			cart_close.click();
		}
    });
    
    window.addEventListener( 'load', function() {
		cartinit();
	} );
	document.addEventListener( 'astLayoutWidthChanged', function() {
		cartinit();
    } );
    
    document.addEventListener( 'astPartialContentRendered', function() {
		cartinit();
    } );
    
    var doit;
	window.addEventListener('resize', function () {
		clearTimeout(doit);
		doit = setTimeout(function () {
			cartinit();
			document.dispatchEvent( new CustomEvent( "astLayoutWidthChanged",  { "detail": { 'response' : '' } }) );
		}, 50);
	});

})();