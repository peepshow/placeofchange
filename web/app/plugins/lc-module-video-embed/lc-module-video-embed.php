<?php
/*
	Plugin Name: Live Composer Add-On - Video Embed Module
	Plugin URI: http://www.livecomposerplugin.com
	Description: Adds a new module for embeding videos.
	Author: Slobodan Kustrimovic
	Version: 1.0
	Author URI: http://livecomposerplugin.com
*/

	// Exit if accessed directly
	if ( ! defined( 'ABSPATH' ) ) exit;

	/**
	 * Register Module
	 *
	 * @since 1.0
	 */
	function lc_video_embed_module_init() {

		// Live Composer not active, do not proceed
		if ( ! defined( 'DS_LIVE_COMPOSER_VER' ) ) return;

		dslc_register_module( 'LC_Video_Embed_Module' );

	} add_action( 'dslc_hook_register_modules', 'lc_video_embed_module_init' );

	/**
	 * Load plugin textdomain.
	 *
	 * @since 1.0
	 */
	function lc_video_embed_module_i18n() {

		load_plugin_textdomain( 'lc-vid-embed', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' ); 

	} add_action( 'plugins_loaded', 'lc_video_embed_module_i18n' );

	/**
	 * The Module Class
	 *
	 * @since 1.0
	 */
	function lc_video_embed_moduled_class() {

		if ( ! defined( 'DS_LIVE_COMPOSER_VER' ) ) return;
	
		class LC_Video_Embed_Module extends DSLC_Module {

			var $module_id;
			var $module_title;
			var $module_icon;
			var $module_category;

			function __construct() {

				$this->module_id = 'LC_Video_Embed_Module';
				$this->module_title = __( 'Video Embed', 'lc-vid-embed' );
				$this->module_icon = 'play';
				$this->module_category = 'elements';

			}

			/**
			 * Module Options
			 *
			 * @since 1.0
			 */
			function options() {

				$dslc_options = array(

					array(
						'label' => __( 'Show On', 'lc-vid-embed' ),
						'id' => 'css_show_on',
						'std' => 'desktop tablet phone',
						'type' => 'checkbox',
						'choices' => array(
							array(
								'label' => __( 'Desktop', 'lc-vid-embed' ),
								'value' => 'desktop'
							),
							array(
								'label' => __( 'Tablet', 'lc-vid-embed' ),
								'value' => 'tablet'
							),
							array(
								'label' => __( 'Phone', 'lc-vid-embed' ),
								'value' => 'phone'
							),
						),
					),
					array(
						'label' => __( 'Video URL', 'lc-vid-embed' ),
						'id' => 'video_url',
						'std' => '',
						'type' => 'text',
					),
					array(
						'label' => __( 'Height', 'lc-vid-embed' ),
						'id' => 'video_height',
						'std' => '',
						'type' => 'text',
					),
					array(
						'label' => __( 'Width', 'lc-vid-embed' ),
						'id' => 'video_width',
						'std' => '',
						'type' => 'text',
					),
					
					/**
					 * Hidden
					 */

					array(
						'label' => 'Embed Bottom Margin',
						'id' => 'css_embed_margin_bottom',
						'std' => '0',
						'type' => 'text',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed iframe',
						'affect_on_change_rule' => 'margin-bottom',
						'section' => 'styling',
					),

					/**
					 * General
					 */

					array(
						'label' => __( 'Align', 'lc-vid-embed' ),
						'id' => 'css_align',
						'std' => 'left',
						'type' => 'text_align',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'text-align',
						'section' => 'styling',
					),
					array(
						'label' => __( 'BG Color', 'lc-vid-embed' ),
						'id' => 'css_bg_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'background-color',
						'section' => 'styling',
					),
					array(
						'label' => __( 'BG Color - Hover', 'lc-vid-embed' ),
						'id' => 'css_bg_color_hover',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed:hover',
						'affect_on_change_rule' => 'background-color',
						'section' => 'styling',
					),
					array(
						'label' => __( 'Border Color', 'lc-vid-embed' ),
						'id' => 'css_border_color',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'border-color',
						'section' => 'styling',
					),
					array(
						'label' => __( 'Border Color - Hover', 'lc-vid-embed' ),
						'id' => 'css_border_color_hover',
						'std' => '',
						'type' => 'color',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed:hover',
						'affect_on_change_rule' => 'border-color',
						'section' => 'styling',
					),
					array(
						'label' => __( 'Border Width', 'lc-vid-embed' ),
						'id' => 'css_border_width',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'border-width',
						'section' => 'styling',
						'ext' => 'px',
					),
					array(
						'label' => __( 'Borders', 'lc-vid-embed' ),
						'id' => 'css_border_trbl',
						'std' => 'top right bottom left',
						'type' => 'checkbox',
						'choices' => array(
							array(
								'label' => __( 'Top', 'lc-vid-embed' ),
								'value' => 'top'
							),
							array(
								'label' => __( 'Right', 'lc-vid-embed' ),
								'value' => 'right'
							),
							array(
								'label' => __( 'Bottom', 'lc-vid-embed' ),
								'value' => 'bottom'
							),
							array(
								'label' => __( 'Left', 'lc-vid-embed' ),
								'value' => 'left'
							),
						),
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'border-style',
						'section' => 'styling',
					),
					array(
						'label' => __( 'Border Radius', 'lc-vid-embed' ),
						'id' => 'css_border_radius',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'border-radius',
						'section' => 'styling',
						'ext' => 'px',
					),
					array(
						'label' => __( 'Margin Bottom', 'lc-vid-embed' ),
						'id' => 'css_margin_bottom',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'margin-bottom',
						'section' => 'styling',
						'ext' => 'px',
					),
					array(
						'label' => __( 'Minimum Height', 'lc-vid-embed' ),
						'id' => 'css_min_height',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'min-height',
						'section' => 'styling',
						'ext' => 'px',
						'min' => 0,
						'max' => 1000,
						'increment' => 5
					),
					array(
						'label' => __( 'Padding Vertical', 'lc-vid-embed' ),
						'id' => 'css_padding_vertical',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'padding-top,padding-bottom',
						'section' => 'styling',
						'ext' => 'px',
					),
					array(
						'label' => __( 'Padding Horizontal', 'lc-vid-embed' ),
						'id' => 'css_padding_horizontal',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'padding-left,padding-right',
						'section' => 'styling',
						'ext' => 'px',
					),

					/** 
					 * Responsive tablet
					 */

					array(
						'label' => __( 'Responsive Styling', 'lc-vid-embed' ),
						'id' => 'css_res_t',
						'std' => 'disabled',
						'type' => 'select',
						'choices' => array(
							array(
								'label' => __( 'Disabled', 'lc-vid-embed' ),
								'value' => 'disabled'
							),
							array(
								'label' => __( 'Enabled', 'lc-vid-embed' ),
								'value' => 'enabled'
							),
						),
						'section' => 'responsive',
						'tab' => __( 'tablet', 'lc-vid-embed' ),
					),
					array(
						'label' => __( 'Padding Vertical', 'lc-vid-embed' ),
						'id' => 'css_res_t_padding_vertical',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'padding-top,padding-bottom',
						'section' => 'responsive',
						'tab' => __( 'tablet', 'lc-vid-embed' ),
						'max' => 500,
						'increment' => 1,
						'ext' => 'px'
					),
					array(
						'label' => __( 'Padding Horizontal', 'lc-vid-embed' ),
						'id' => 'css_res_t_padding_horizontal',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'padding-left,padding-right',
						'section' => 'responsive',
						'tab' => __( 'tablet', 'lc-vid-embed' ),
						'ext' => 'px'
					),

					/** 
					 * Responsive phone
					 */

					array(
						'label' => __( 'Responsive Styling', 'lc-vid-embed' ),
						'id' => 'css_res_p',
						'std' => 'disabled',
						'type' => 'select',
						'choices' => array(
							array(
								'label' => __( 'Disabled', 'lc-vid-embed' ),
								'value' => 'disabled'
							),
							array(
								'label' => __( 'Enabled', 'lc-vid-embed' ),
								'value' => 'enabled'
							),
						),
						'section' => 'responsive',
						'tab' => __( 'phone', 'lc-vid-embed' ),
					),
					array(
						'label' => __( 'Padding Vertical', 'lc-vid-embed' ),
						'id' => 'css_res_p_padding_vertical',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'padding-top,padding-bottom',
						'section' => 'responsive',
						'tab' => __( 'phone', 'lc-vid-embed' ),
						'max' => 500,
						'increment' => 1,
						'ext' => 'px'
					),
					array(
						'label' => __( 'Padding Horizontal', 'lc-vid-embed' ),
						'id' => 'css_res_p_padding_horizontal',
						'std' => '0',
						'type' => 'slider',
						'refresh_on_change' => false,
						'affect_on_change_el' => '.lc-video-embed',
						'affect_on_change_rule' => 'padding-left,padding-right',
						'section' => 'responsive',
						'tab' => __( 'phone', 'lc-vid-embed' ),
						'ext' => 'px'
					),

				);

				$dslc_options = array_merge( $dslc_options, $this->presets_options() );

				return apply_filters( 'dslc_module_options', $dslc_options, $this->module_id );

			}

			/**
			 * Module Output
			 *
			 * @since 1.0
			 */
			function output( $options ) {

				$this->module_start( $options );

				/* Module output stars here */

				?>

					<div class="lc-video-embed">
						
						<?php

							// Embed Arguments
							$embed_args = array();

							// Embed Argument Height
							if ( isset( $options['video_height'] ) && $options['video_height'] && $options['video_height'] !== '' ) {
								$embed_args['height'] = $options['video_height'];
							}

							// Embed Argument Width
							if ( isset( $options['video_width'] ) && $options['video_width'] && $options['video_width'] !== '' ) {
								$embed_args['width'] = $options['video_width'];
							}

							// If a video URL is set
							if ( isset( $options['video_url'] ) && $options['video_url'] !== '' ) {						

								// Get embed code ( false if wrong )
								$embed_code = wp_oembed_get( $options['video_url'], $embed_args );

								// If embed code false
								if ( ! $embed_code ) {

									// Show meessage if editor is active
									if ( dslc_is_editor_active() ) {
										?><div class="dslc-notification dslc-red"><?php _e( 'Make sure you entered a valid URL ( ex. https://www.youtube.com/watch?v=ONHBaC-pfsk )', 'lc-vid-embed' ); ?><?php
									}

								// If embed code ok, display it
								} else {
									echo $embed_code;
								}

							// If no video URL supplied
							} else {

								// Show message if editor active
								if ( dslc_is_editor_active() ) {
									?><div class="dslc-notification dslc-red"><?php _e( 'A video URL needs to be set in the module options.', 'lc-vid-embed' ); ?><?php
								}
							}

						?>

					</div><!-- .lc-video-embed -->
					
				<?php

				/* Module output ends here */

				$this->module_end( $options );

			}

		}

	} add_action( 'plugins_loaded', 'lc_video_embed_moduled_class' );