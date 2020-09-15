/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra Builder
 * @since x.x.x
 */

(function ($) {

    var $body = jQuery('body'),
        layout_width = $body.width(),
        stick_main = astraAddon.header_main_stick || '',
        main_shrink = astraAddon.header_main_shrink || '',
        stick_above = astraAddon.header_above_stick || '',
        stick_below = astraAddon.header_below_stick || '',
        site_layout = astraAddon.site_layout || '',
        sticky_header_on_devices = astraAddon.sticky_header_on_devices || 'desktop',
        sticky_header_style = astraAddon.sticky_header_style || 'none',
        sticky_hide_on_scroll = astraAddon.sticky_hide_on_scroll || '';

    jQuery(document).on('ready readyAgain', function ($) {

        if ('1' == sticky_hide_on_scroll) {
            if ('1' == main_shrink) {
                jQuery('#ast-fixed-header').addClass('ast-sticky-shrunk').stop();
            }

            if (!('1' == stick_above || 'on' == stick_above)) {
                jQuery('#ast-fixed-header .ast-above-header').hide();
            }
            if (!('1' == stick_main || 'on' == stick_main)) {
                jQuery('#ast-fixed-header .main-header-bar').hide();
            }
            if (!('1' == stick_below || 'on' == stick_below)) {
                jQuery('#ast-fixed-header .ast-below-header').hide();
            }

            jQuery('#ast-fixed-header').astExtSticky({
                //dependent: ['#masthead .ast-above-header'],
                max_width: layout_width,
                site_layout: site_layout,
                sticky_on_device: sticky_header_on_devices,
                header_style: 'slide',
                hide_on_scroll: sticky_hide_on_scroll,
            });
        } else {

            jQuery('#ast-fixed-header').addClass('ast-sticky-shrunk').stop();

            if (!('1' == stick_above || 'on' == stick_above)) {
                jQuery('#ast-fixed-header .ast-above-header').hide();
            }
            if (!('1' == stick_main || 'on' == stick_main)) {
                jQuery('#ast-fixed-header .main-header-bar').hide();
            }
            if (!('1' == stick_below || 'on' == stick_below)) {
                jQuery('#ast-fixed-header .ast-below-header').hide();
            }
            /**
             * Stick Main Header
             */
            if ('1' == stick_above || 'on' == stick_above
                || '1' == stick_main || 'on' == stick_main
                || '1' == stick_below || 'on' == stick_below
            ) {

                // If shrink is enabled
                // then add shrink top and bottom paddings.
                var shrink_options = '';
                if (main_shrink) {
                    shrink_options = {
                        padding_top: '',
                        padding_bottom: '',
                    }
                }

                jQuery('#ast-fixed-header').astExtSticky({
                    //dependent: ['#masthead .ast-above-header'],
                    max_width: layout_width,
                    site_layout: site_layout,
                    shrink: shrink_options,
                    sticky_on_device: sticky_header_on_devices,
                    header_style: sticky_header_style,
                    hide_on_scroll: sticky_hide_on_scroll,
                });
            }

        }

        // If Sticky Header for both mobile , desktops.
        if ('mobile' == sticky_header_on_devices || 'both' == sticky_header_on_devices) {
            // Normal Header Mobile Menu Toggled
            jQuery('#masthead .main-header-menu-toggle').click(function (event) {

                /* If menu navigation is opened and has sticky active */
                if (jQuery('#masthead .main-header-menu-toggle').hasClass('toggled')) {
                    // Add body class to update the stick_upto_scroll.
                    $body.addClass('ast-sticky-toggled-off');

                    if (
                        'none' == defaults['header_style'] &&
                        (jQuery('#masthead .main-header-bar').hasClass('ast-sticky-active') ||
                            jQuery('#masthead .ast-stick-primary-below-wrapper').hasClass('ast-sticky-active'))
                    ) {

                        // Only If none style is selected
                        var windowHeight = jQuery(window).height(),
                            headerSectionHeight = 0;

                        if (jQuery('#masthead .ast-above-header') && jQuery('#masthead .ast-above-header').length) {
                            headerSectionHeight = jQuery('#masthead .ast-above-header').height();
                        }

                        // overflow hide for html.
                        if ('1' == sticky_hide_on_scroll) {
                            jQuery('html').css({
                                'overflow': 'hidden',
                            });
                        }
                        // add min height to wrapper class of primary header and below header
                        if ('1' == main_shrink &&
                            ('1' == stick_main || 'on' == stick_main) &&
                            ('1' == stick_below || 'on' == stick_below)
                        ) {
                            jQuery('#masthead .ast-stick-primary-below-wrapper').css({
                                'max-height': (windowHeight - headerSectionHeight) + 'px',
                                'overflow-y': 'auto',
                            });
                        } else {
                            // ass max height to sticky header.
                            jQuery('#masthead .main-header-bar.ast-sticky-active').css({
                                'max-height': (windowHeight - headerSectionHeight) + 'px',
                                'overflow-y': 'auto',
                            });
                        }
                    }
                } else {
                    $body.addClass('ast-sticky-toggled-off');
                    jQuery('html').css({
                        'overflow': '',
                    });
                    if ('1' == main_shrink &&
                        ('1' == stick_main || 'on' == stick_main) &&
                        ('1' == stick_below || 'on' == stick_below)
                    ) {
                        jQuery('#masthead .ast-stick-primary-below-wrapper').css({
                            'max-height': '',
                            'overflow-y': '',
                        });
                    } else {
                        // ass max height to sticky header.
                        jQuery('#masthead .main-header-bar.ast-sticky-active').css({
                            'max-height': '',
                            'overflow-y': '',
                        });
                    }
                }
            });
            // Fixed Header Mobile Menu Toggled
            jQuery('#ast-fixed-header .main-header-menu-toggle').click(function (event) {
                /* If menu navigation is opened and has sticky active */

                if (jQuery('#ast-fixed-header .main-header-menu-toggle').hasClass('toggled')) {

                    var windowHeight = jQuery(window).height();

                    // overflow hide for html.
                    if ('1' == sticky_hide_on_scroll) {
                        jQuery('html').css({
                            'overflow': 'auto',
                        });
                    }
                    // ass max height to sticky header.
                    jQuery('#ast-fixed-header').css({
                        'max-height': (windowHeight) + 'px',
                        'overflow-y': 'auto',
                    });
                }
                // remove css if menu toggle is closed.
                else {
                    jQuery('html').css({
                        'overflow': '',
                    });
                    jQuery('#ast-fixed-header').css({
                        'max-height': '',
                        'overflow-y': '',
                    });
                }
            });
        }

    });

    const partial_ids = [
        'astra-settings[header-desktop-items]',
    ];

    wp.customize.bind('preview-ready', () => {
        wp.customize.selectiveRefresh.bind('partial-content-rendered', response => {
            if (partial_ids.indexOf(response.partial.id) > -1) {

                jQuery(document).trigger('readyAgain');
            }
        })
    })

    wp.customize('astra-settings[header-above-stick]', function (setting) {
        setting.bind(function (is_enabled) {

            if ("none" === sticky_header_style) {
                wp.customize.preview.send('refresh');
            } else {
                stick_above = is_enabled ? '1' : '';
                jQuery(document).trigger('readyAgain');
            }


        });
    });

    wp.customize('astra-settings[header-main-stick]', function (setting) {
        setting.bind(function (is_enabled) {
            if ("none" === sticky_header_style) {
                wp.customize.preview.send('refresh');
            } else {
                stick_main = is_enabled ? '1' : '';
                jQuery(document).trigger('readyAgain');
            }
        });
    });

    wp.customize('astra-settings[header-below-stick]', function (setting) {
        setting.bind(function (is_enabled) {
            if ("none" === sticky_header_style) {
                wp.customize.preview.send('refresh');
            } else {
                stick_below = is_enabled ? '1' : '';
                jQuery(document).trigger('readyAgain');
            }
        });
    });

})(jQuery);
