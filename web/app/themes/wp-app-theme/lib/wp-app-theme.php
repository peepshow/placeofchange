<?php

class WPAPP_THEME {

	function __construct(){
		add_action( 'wp_enqueue_scripts', array( $this, 'wpApp_baseScripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'angularScripts' ) );
	}

	function wpApp_baseScripts() {
		// The App Script
		wp_enqueue_script( 'wpApp', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app.js', array( 'AngularCore' ), null, true );
		//wp_localize_script( 'wpApp', 'APIdata', array( 'api_url' => esc_url_raw( get_json_url() ), 'api_nonce' => wp_create_nonce( 'wp_json' ), 'templateUrl' => get_bloginfo( 'template_directory' ) ) );
    wp_localize_script( 'wpApp', 'APIdata', array( 'api_url' => esc_url_raw( rest_url() ), 'api_nonce' => wp_create_nonce( 'wp_rest' ), 'templateUrl' => get_bloginfo( 'template_directory' ) ) );

		// Misc Scripts
		wp_enqueue_script( 'wpAppScripts', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app-scripts.js', array( 'jquery' ), null, true );

		// Routes
		wp_enqueue_script( 'wpAppRoutes', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app-routes.js', array( 'wpApp' ), null, true );

		// Factories
		wp_enqueue_script( 'wpAppFactories', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app-factories.js', array( 'wpApp' ), null, true );

		// Controllers
		wp_enqueue_script( 'wpAppSignup', get_stylesheet_directory_uri() . '/assets/js/wp-app/controllers/wp-app-signup.js', array( 'wpAppFactories' ), null, true );
		wp_enqueue_script( 'wpAppStyleGuide', get_stylesheet_directory_uri() . '/assets/js/wp-app/controllers/wp-app-sg.js', array( 'wpAppFactories' ), null, true );
	}


	// Making this a plublic function so AngularJS scripts don't load on every page by default
	public function angularScripts() {
		// USING GOOGLE CDN
		wp_enqueue_script(
			'AngularCore',
			'//ajax.googleapis.com/ajax/libs/angularjs/1.3.5/angular.min.js',
			array( 'jquery' ),
			null,
			false
		);
		wp_enqueue_script(
			'AngularRoute',
			'//ajax.googleapis.com/ajax/libs/angularjs/1.3.5/angular-route.min.js',
			array('AngularCore'),
			null,
			false
		);
		wp_enqueue_script(
			'AngularRes',
			'//ajax.googleapis.com/ajax/libs/angularjs/1.3.5/angular-resource.min.js',
			array('AngularRoute'),
			null,
			false
		);
	}
}


new WPAPP_THEME();

?>
