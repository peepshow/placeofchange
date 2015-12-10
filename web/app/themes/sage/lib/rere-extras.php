<?php

namespace Roots\Sage\Extras;

use Roots\Sage\Setup;

function oembed_result( $html, $url, $args ) {

	/* Modify video parameters. */
	if ( strstr( $html,'youtube.com/embed/' ) ) {
		$html = str_replace( '?feature=oembed', '?feature=oembed&enablejsapi=1', $html );
	}

    return $html;
}
add_filter( 'oembed_result', __NAMESPACE__ . '\\oembed_result', 10, 3 );

/**
 * Only allow GET requests
 */
// add_action( 'rest_api_init', function() {
//
// 	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
// 	add_filter( 'rest_pre_serve_request', function( $value ) {
// 		$origin = get_http_origin();
// 		if ( $origin ) {
// 			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
// 		}
// 		header( 'Access-Control-Allow-Origin: ' . esc_url_raw( site_url() ) );
// 		header( 'Access-Control-Allow-Methods: GET' );
// 		return $value;
//
// 	});
// }, 15 );
add_filter( 'json_serve_request', function( ) {
	header( "Access-Control-Allow-Origin: *" );
});
