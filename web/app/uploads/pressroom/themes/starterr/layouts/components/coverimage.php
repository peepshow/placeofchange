<?php

$image_id =  get_post_thumbnail_id();

if($image_id):
	$attached_image = wp_get_attachment_metadata($image_id);
	$image = wp_get_attachment_image_src($image_id, 'full');
	$titleClass = 'entry-title--cover';
else:
	$titleClass = '';
    $image = false;
endif;