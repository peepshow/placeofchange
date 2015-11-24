<?php

// if (!defined('PR_ENV')) {
//     // 'production' || 'development'
//     define('PR_ENV', 'production');  
// }

define('PR_ENV', '');

if (PR_ENV === 'development') {

    $assets = array(
        'css'       => 'assets/css/styles.css',
        'js'        => 'assets/js/scripts.js',
        'toc-css'   => 'assets/css/toc.css',
        'toc-js'    => 'assets/js/toc.js'
    );

} else {

    $get_assets = file_get_contents(dirname(dirname(__FILE__)) . '/assets/pr-manifest.json');
    $assets     = json_decode($get_assets, true);
    $assets     = array(
        'css'       => 'assets/css/styles.' . $assets['assets/css/styles.min.css']['hash'].'.min.css',
        'js'        => 'assets/js/scripts.' . $assets['assets/js/scripts.min.js']['hash'].'.min.js',
        'toc-css'   => 'assets/css/toc.' . $assets['assets/css/toc.min.css']['hash'].'.min.css',
        'toc-js'    => 'assets/js/toc.' . $assets['assets/js/toc.min.js']['hash'].'.min.js'
    );
}

$GLOBALS['css'] = $assets['css'];
$GLOBALS['js'] = $assets['js'];

$GLOBALS['toc-css'] = $assets['toc-css'];
$GLOBALS['toc-js'] = $assets['toc-js'];