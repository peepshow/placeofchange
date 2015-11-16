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
