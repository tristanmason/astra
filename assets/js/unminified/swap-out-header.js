( function() {

    var swap_out_header = null,
	    current_header = null;
        main_header_masthead = document.getElementById('masthead')
function swap_header_on_breakpoint( swap ) {

    main_header_masthead = document.getElementById('masthead');

    if (undefined === main_header_masthead || null === main_header_masthead) {
        return;
    }
    var window_width = body.clientWidth;
    var break_point = astra.break_point;

    var desktop_header = main_header_masthead.querySelector("#masthead > #ast-desktop-header");
    var mobile_header = main_header_masthead.querySelector("#masthead > #ast-mobile-header");

    if ( desktop_header.classList.contains('ast-desktop-mobile-common-layout') ) {
        return;
    }

    if (window_width <= break_point) { // Rendering Mobile

        if ('mobile' === current_header) {
            return;
        }

        if (swap && swap_out_header) {
            if (mobile_header) {
                main_header_masthead.removeChild(mobile_header);
            }
            main_header_masthead.appendChild(swap_out_header);
        }
        if (swap && desktop_header) {
            swap_out_header = desktop_header.cloneNode(true);
        }

        current_header = 'mobile';
        if( desktop_header ) {
            main_header_masthead.removeChild(desktop_header);
        }


    } else { // Rendering Desktop

        if ('desktop' === current_header) {
            return;
        }

        if (swap && swap_out_header) {
            if (desktop_header) {
                main_header_masthead.removeChild(desktop_header);
            }
            main_header_masthead.appendChild(swap_out_header);
        }

        if (swap && mobile_header) {
            swap_out_header = mobile_header.cloneNode(true);
        }

        current_header = 'desktop';
        if( mobile_header ) {
            main_header_masthead.removeChild(mobile_header);
        }

    }

}

window.addEventListener('load', function () {
    swap_header_on_breakpoint(true);
});

document.addEventListener('astPartialContentRendered', function () {
    swap_header_on_breakpoint();
});

var doit;
	window.addEventListener('resize', function () {
		clearTimeout(doit);
		doit = setTimeout(function () {
			swap_header_on_breakpoint(true);
		}, 50);
	});
})();