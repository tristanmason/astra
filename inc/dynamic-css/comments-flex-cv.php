<?php
/**
 * Comments - Dynamic CSS
 *
 * @package astra-builder
 * @since 3.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_filter( 'astra_dynamic_theme_css', 'astra_comments_css', 11 );

/**
 * Comments - Dynamic CSS
 *
 * @param  string $dynamic_css          Astra Dynamic CSS.
 * @return String Generated dynamic CSS for Pagination.
 *
 * @since 3.2.0
 */
function astra_comments_css( $dynamic_css ) {

	if ( is_current_post_comment_enabled() ) {

		$body_font_size      = astra_get_option( 'font-size-body' );
		$theme_color         = astra_get_option( 'theme-color' );
		$link_color          = astra_get_option( 'link-color', $theme_color );
		$post_content_layout = astra_get_content_layout();

		if ( is_array( $body_font_size ) ) {
			$body_font_size_desktop = ( isset( $body_font_size['desktop'] ) && '' != $body_font_size['desktop'] ) ? $body_font_size['desktop'] : 15;
		} else {
			$body_font_size_desktop = ( '' != $body_font_size ) ? $body_font_size : 15;
		}

		$desktop_comment_global = array(
			'.comment-reply-title'                         => array(
				'font-size' => astra_get_font_css_value( (int) $body_font_size_desktop * 1.66666 ),
			),
			// Single Post Meta.
			'.ast-comment-meta'                            => array(
				'line-height'   => '1.666666667',
				'color'         => esc_attr( $link_color ),
				'font-size'     => astra_get_font_css_value( (int) $body_font_size_desktop * 0.8571428571 ),
				'margin-bottom' => '0.5em',
				'margin-left'   => '-20px',
				'margin-right'  => '-20px',
			),
			'.ast-comment-list #cancel-comment-reply-link' => array(
				'font-size' => astra_responsive_font( $body_font_size, 'desktop' ),
			),
		);
		$dynamic_css .= astra_parse_css( $desktop_comment_global );

		$single_post_comment_css = '
          .comments-title {
            background-color: var( --content-background-color );
            padding: var(--comment-tittle-padding);
            font-weight: normal;
            word-wrap: break-word;
          }
          .ast-comment-list {
            margin: 0;
            word-wrap: break-word;
            padding-bottom: 0.5em;
            list-style: none;
          }

          .ast-comment-list li {
            list-style: none;
          }

          .ast-comment-list .ast-comment-edit-reply-wrap {
            -js-display: flex;
            display: flex;
            justify-content: flex-end;
          }

          .ast-comment-list .ast-edit-link {
            flex: 1;
          }

          .ast-comment-list .comment-awaiting-moderation {
            margin-bottom: 0;
          }

          .ast-comment {
            padding: 1em 0;
          }
          .ast-comment-info img {
            border-radius: 50%;
          }
          .ast-comment-cite-wrap cite {
            font-style: normal;
          }

          .comment-reply-title {
            padding-top: 1em;
            font-weight: normal;
            line-height: 1.65;
          }
          .comments-area {
            border-top: var(--comment-border-top);
            margin-top: 2em;
          }

          .comments-area .comment-form-comment {
            width: 100%;
            --fieldset-border: none;
            --fieldset-margin: 0;
            --fieldset-padding: 0;
          }
          .comments-area .comment-notes,
          .comments-area .comment-textarea,
          .comments-area .form-allowed-tags {
            margin-bottom: 1.5em;
          }
          .comments-area .comment-textarea{
            margin-left: -20px;
            margin-right: -20px;
          }
          .comments-area .form-submit {
            margin-bottom: 0;
          }
          .comments-area textarea#comment,
          .comments-area .ast-comment-formwrap input[type="text"] {
            width: 100%;
            border-radius: 0;
            vertical-align: middle;
            margin-bottom: 10px;
          }
          .comments-area .no-comments {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
          }
          .comments-area p.logged-in-as {
            margin-bottom: 1em;
          }';
		if ( 'page-builder' == $post_content_layout || 'plain-container' == $post_content_layout ) {
			$single_post_comment_css .= '
            .ast-comment-list li.depth-1 .ast-comment,
            .ast-comment-list li.depth-2 .ast-comment {
              border-bottom: 1px solid #eeeeee;
            }';
		} elseif ( 'content-boxed-container' == $post_content_layout ) {
			$single_post_comment_css .= '
        .ast-comment-list {
          padding-bottom: var( --comment-padding-bottom );
        }
        .ast-comment-list li {
          background-color: var(--content-background-color);
        }
        .ast-comment-list .bypostauthor {
          padding: var(--comment-bypostauthor-padding);
        }
        .ast-comment-list li.depth-1 {
          padding: var( --comment-lidepth-padding );
          margin-bottom: var( --comment-list-margin-bottom );
        }
        @media (max-width: 1200px) {
          .ast-comment-list li.depth-1 {
            --comment-lidepth-padding: 3em 3.34em;
          }
        }
        .ast-comment-list li.depth-1 .children li {
          padding-bottom: var( --comment-padding-bottom );
          padding-top: var( --comment-border-top);
          margin-bottom: var( --comment-border-top);
        }
        .ast-comment-list li.depth-1 .ast-comment,
        .ast-comment-list li.depth-2 .ast-comment {
          border-bottom: var( --comment-border-bottom );
        }
        .ast-comment-list .comment-respond {
          padding-top: var( --comment-padding-top );
          padding-bottom: var( --comment-padding-bottom );
          background-color: var(--comment-transparent-color);
        }
        .ast-comment-list .pingback p {
          margin-bottom: var( --comment-border-bottom );
        }
        .ast-comment-list .bypostauthor li {
          background: var(--comment-transparent-color);
          padding: var(--comment-bypostauthor-child-padding);
        }
        .comment-respond {
          background-color: #fff;
          padding: var( --comment-layout-padding );
          border-bottom: var( --comment-border-bottom );
        }
        @media (max-width: 1200px) {
          .comment-respond {
            padding: var( --comment-respond-padding );
          }
        }
        .comment-reply-title {
          padding-top: var(--comment-border-bottom);
        }';
		}
		if ( is_rtl() ) {
			$single_post_comment_css .= '
            :root {
                --list-margin-left: 2em;
            }
            @media (max-width: 992px) {
              :root {
                    --list-margin-left: 1em;
              }
            }

            .ast-comment-list #cancel-comment-reply-link {
                white-space: nowrap;
                font-size: 15px;
                font-size: 1rem;
                margin-right: 1em;
            }

            .ast-comment-meta {
                justify-content: left;
                padding: 0 3.4em 1.333em;
            }

            .ast-comment-time .timendate,
                .ast-comment-time .reply {
                margin-left: 0.5em;
            }
            .comments-area #wp-comment-cookies-consent {
                margin-left: 10px;
            }
            .ast-page-builder-template .comments-area {
                padding-right: 20px;
                padding-left: 20px;
                margin-top: 2em;
                margin-bottom: 2em;
            }';
		} else {
			$single_post_comment_css .= '
            :root {
                --list-margin-left: 2em;
            }
            @media (max-width: 992px) {
              :root {
                    --list-margin-left: 1em;
                }
            }

            .ast-comment-list #cancel-comment-reply-link {
                white-space: nowrap;
                font-size: 15px;
                font-size: 1rem;
                margin-left: 1em;
            }

            .ast-comment-info {
                display: flex;
                position: relative;
            }
            .ast-comment-meta {
                justify-content: right;
                padding: 0 3.4em 1.60em;
            }
            .ast-comment-time .timendate{
                margin-right: 0.5em;
            }
            .comments-area #wp-comment-cookies-consent {
                margin-right: 10px;
            }
            .ast-page-builder-template .comments-area {
                padding-left: 20px;
                padding-right: 20px;
                margin-top: 2em;
                margin-bottom: 2em;
            }';
		}

		$dynamic_css .= Astra_Enqueue_Scripts::trim_css( $single_post_comment_css );

		$global_button_comment_mobile = array(
			// Single Post Meta.
			'.ast-comment-meta'                            => array(
				'font-size' => ! empty( $body_font_size['mobile'] ) ? astra_get_font_css_value( (int) $body_font_size['mobile'] * 0.8571428571, 'px', 'mobile' ) : '',
			),
			'.comment-reply-title'                         => array(
				'font-size' => ! empty( $body_font_size['mobile'] ) ? astra_get_font_css_value( (int) $body_font_size['mobile'] * 1.66666, 'px', 'mobile' ) : '',
			),
			'.ast-comment-list #cancel-comment-reply-link' => array(
				'font-size' => astra_responsive_font( $body_font_size, 'mobile' ),
			),
		);
		if ( 'content-boxed-container' == $post_content_layout ) {
			$layout_comment_mobile          = array(
				'.comments-count-wrapper' => array(
					'padding' => '1.5em 1em',
				),
			);
			$layout_comment_mobile[':root'] = array(
				'--comment-lidepth-padding'            => '1.5em 1em',
				'--comment-list-margin-bottom'         => '1.5em',
				'--comment-bypostauthor-padding'       => '.5em',
				'--comment-layout-padding'             => '1.5em 1em',
				'--comment-bypostauthor-child-padding' => '0 0 0 .5em',
			);

			$global_button_comment_mobile = array_merge( $layout_comment_mobile, $global_button_comment_mobile );
		}

		$dynamic_css .= astra_parse_css( $global_button_comment_mobile, '', astra_get_mobile_breakpoint() );

		if ( is_rtl() ) {
			$global_button_mobile_lang_direction_css = array(
				'.ast-comment-list .children' => array(
					'margin-right' => '0.66666em',
				),
			);
		} else {
			$global_button_mobile_lang_direction_css = array(
				'.ast-comment-list .children' => array(
					'margin-left' => '0.66666em',
				),
			);
		}
		/* Parse CSS from array() -> max-width: (mobile-breakpoint) px  */
		$dynamic_css .= astra_parse_css( $global_button_mobile_lang_direction_css, '', astra_get_mobile_breakpoint() );

		$global_button_comment_tablet = array(
			'.ast-comment-avatar-wrap img'                 => array(
				'max-width' => '2.5em',
			),
			'.comments-area'                               => array(
				'margin-top' => '1.5em',
			),
		
			'.ast-comment-meta'                            => array(
				'padding'   => '0 1.8888em 1.3333em',
				'font-size' => ! empty( $body_font_size['tablet'] ) ? astra_get_font_css_value( (int) $body_font_size['tablet'] * 0.8571428571, 'px', 'tablet' ) : '',
			),
			'.comment-reply-title'                         => array(
				'font-size' => ! empty( $body_font_size['tablet'] ) ? astra_get_font_css_value( (int) $body_font_size['tablet'] * 1.66666, 'px', 'tablet' ) : '',
			),
			'.ast-comment-list #cancel-comment-reply-link' => array(
				'font-size' => astra_responsive_font( $body_font_size, 'tablet' ),
			),
			'.ast-comment-meta'                            => array(
				'padding' => '0 1.8888em 1.3333em',
			),
		);

		if ( is_rtl() ) {
			$global_button_tablet_lang_direction_css = array(
				'.ast-comment-avatar-wrap' => array(
					'margin-left' => '0.5em',
				),
			);
		} else {
			$global_button_tablet_lang_direction_css = array(
				'.ast-comment-avatar-wrap' => array(
					'margin-right' => '0.5em',
				),
			);
		}

		$dynamic_css .= astra_parse_css( $global_button_tablet_lang_direction_css, '', astra_get_tablet_breakpoint() );

		if ( 'content-boxed-container' == $post_content_layout ) {
			$content_box_comment_tablet          = array(
				'.comments-count-wrapper' => array(
					'padding' => '2em 2.14em',
				),
			);
			$content_box_comment_tablet[':root'] = array(
				'--comment-tittle-padding'  => '1.43em 1.48em',
				'--comment-lidepth-padding' => '1.5em 2.14em',
				'--comment-respond-padding' => '2em 2.14em',
			);

			$global_button_comment_tablet = array_merge( $global_button_comment_tablet, $content_box_comment_tablet );
			$dynamic_css                 .= astra_parse_css( $global_button_comment_tablet, '', astra_get_tablet_breakpoint() );

			$static_layout_css_min_comment = array(
				'.ast-comment-list li .comment-respond' => array(
					'padding-left'  => '2.66666em',
					'padding-right' => '2.66666em',
				),
			);
			$dynamic_css                  .= astra_parse_css( $static_layout_css_min_comment, astra_get_tablet_breakpoint( '', '1' ) );
		}   
	}
	return $dynamic_css;
}
