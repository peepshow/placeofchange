<?php
/**
 * Beans images options.
 *
 * @ignore
 *
 * @package API\Image
 */
class _Beans_Image_Options {

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Load in priority 15 so that we can check if other beans metaboxes exists.
		add_action( 'admin_init', array( $this, 'register' ), 15 );
		add_action( 'admin_init', array( $this, 'flush' ) , -1 );
		add_action( 'admin_notices', array( $this, 'admin_notice' ) );
		add_action( 'beans_field_flush_edited_images', array( $this, 'option' ) );

	}


	/**
	 * Register options.
	 */
	public function register() {

		global $wp_meta_boxes;

		$fields = array(
			array(
				'id' => 'beans_edited_images_directories',
				'type' => 'flush_edited_images',
				'description' => 'Clear all edited images. New images will be created on page load.'
			)
		);

		beans_register_options( $fields, 'beans_settings', 'images_options', array(
			'title' => __( 'Images options', 'tm-beans' ),
			'context' => beans_get( 'beans_settings', $wp_meta_boxes ) ? 'column' : 'normal' // Check of other beans boxes.
		) );

	}


	/**
	 * Flush images for all folders set.
	 */
	public function flush() {

		if ( !beans_post( 'beans_flush_edited_images' ) )
			return;

		beans_remove_dir( beans_get_images_dir() );

	}


	/**
	 * Image editor notice notice.
	 */
	public function admin_notice() {

		if ( !beans_post( 'beans_flush_edited_images' ) )
			return;

		echo '<div id="message" class="updated"><p>' . __( 'Images flushed successfully!', 'tm-beans' ) . '</p></div>' . "\n";

	}


	/**
	 * Add button used to flush images.
	 */
	public function option( $field ) {

		if ( $field['id'] !== 'beans_edited_images_directories' )
			return;

		echo '<input type="submit" name="beans_flush_edited_images" value="' . __( 'Flush images', 'tm-beans' ) . '" class="button-secondary" />';

	}

}

new _Beans_Image_Options();