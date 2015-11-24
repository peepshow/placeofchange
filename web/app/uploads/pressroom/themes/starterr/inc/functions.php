<?php

/* ==========================================================================
   LOCAL INCLUDE
   ========================================================================== */

include(locate_template('inc/pr_scripts.php'));


/* ==========================================================================
   Remove Empty <p>
   ========================================================================== */

add_filter('the_content', 'remove_empty_p', 20, 1);

function remove_empty_p($content) {
    $content = force_balance_tags($content);
    return preg_replace('#<p>\s*+(<br\s*/*>)?\s*</p>#i', '', $content);
}

/* ==========================================================================
   Stop wrapping <img> in <p> tags
   ========================================================================== */

function filter_p_on_images($content){
  return preg_replace('/<p>\s*(<a .*>)?\s*(<img .* \/>)\s*(<\/a>)?\s*<\/p>/iU', '\1\2\3', $content);
}

add_filter('the_content', 'filter_p_on_images');
/* ==========================================================================
   IMAGE WITH CAPTION CLEAN UP
   ========================================================================== */

add_filter('img_caption_shortcode', 'clean_caption', 10, 3);

function clean_caption($output, $attr, $content) {
    if (is_feed()) {
        return $output;
    }

    $defaults = array(
        'id'      => '',
        'align'   => 'alignnone',
        'width'   => '',
        'caption' => ''
    );

    $attr = shortcode_atts($defaults, $attr);

    // If the width is less than 1 or there is no caption, return the content wrapped between the [caption] tags
    if ($attr['width'] < 1 || empty($attr['caption'])) {
        return $content;
    }

    // Set up the attributes for the caption <figure>
    $attributes  = (!empty($attr['id']) ? ' id="' . esc_attr($attr['id']) . '"' : '' );
    $attributes .= ' class="thumbnail wp-caption ' . esc_attr($attr['align']) . '"';
    // $attributes .= ' style="width: ' . esc_attr($attr['width']) . 'px"';

    $output  = '<figure' . $attributes .'>';
    $output .= do_shortcode($content);
    $output .= '<figcaption class="caption wp-caption-text">' . esc_attr($attr['caption']) . '</figcaption>';
    $output .= '</figure>';

    return $output;
}


/* ==========================================================================
   CUSTOM GALLERY SHORTCODE OUTPUT
   ========================================================================== */

function pr_gallery($attr) {
    $post = get_post();

    static $instance = 0;
    $instance++;

    if (!empty($attr['ids'])) {
        if (empty($attr['orderby'])) {
            $attr['orderby'] = 'post__in';
        }
        $attr['include'] = $attr['ids'];
    }

    $output = apply_filters('post_gallery', '', $attr);

    if ($output != '') {
        return $output;
    }

    if (isset($attr['orderby'])) {
        $attr['orderby'] = sanitize_sql_orderby($attr['orderby']);
        if (!$attr['orderby']) {
            unset($attr['orderby']);
        }
    }

    extract(shortcode_atts(array(
        'order'      => 'ASC',
        'orderby'    => 'menu_order ID',
        'id'         => $post->ID,
        'itemtag'    => '',
        'icontag'    => '',
        'captiontag' => '',
        'columns'    => 4,
        'size'       => 'thumbnail',
        'include'    => '',
        'exclude'    => '',
        'link'       => ''
    ), $attr));

    $id = intval($id);
    // $columns = (12 % $columns == 0) ? $columns: 4;
    // $grid = sprintf('col-sm-%1$s col-lg-%1$s', 12/$columns);

    if ($order === 'RAND') {
        $orderby = 'none';
    }

    if (!empty($include)) {
        $_attachments = get_posts(array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby));

        $attachments = array();
        foreach ($_attachments as $key => $val) {
            $attachments[$val->ID] = $_attachments[$key];
        }
    } elseif (!empty($exclude)) {
        $attachments = get_children(array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby));
    } else {
        $attachments = get_children(array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby));
    }

    if (empty($attachments)) {
        return '';
    }

    if (is_feed()) {
        $output = "\n";
        foreach ($attachments as $att_id => $attachment) {
            $output .= wp_get_attachment_link($att_id, $size, true) . "\n";
        }
        return $output;
    }

    $unique = (get_query_var('page')) ? $instance . '-p' . get_query_var('page'): $instance;
    $output = '<div class="gallery gallery-' . $id . '-' . $unique . ' gallery--grid gallery--grid-'. $columns .'">';

    foreach ($attachments as $id => $attachment) {

        $image_url_wide = wp_get_attachment_image_src( $id, 'full');
        // $image_url_large = wp_get_attachment_image_src( $id, 'large');
        // $image_url_medium = wp_get_attachment_image_src( $id, 'medium');
        $image_url_small = wp_get_attachment_image_src( $id, 'thumbnail');

        $output .= '<div class="grid-item"><img class="" src="'.$image_url_small[0].'" width="'.$image_url_small[1].'" height="'.$image_url_small[2].'" alt="'.sanitize_text_field(trim($attachment->post_excerpt)).'" /></div>';
    }

    $output .= '</div>';

    return $output;
}

remove_shortcode('gallery');
add_shortcode('gallery', 'pr_gallery');
add_filter('use_default_gallery_style', '__return_null');



/* ==========================================================================
   WRAP OEMBED
   ========================================================================== */

add_filter('oembed_dataparse','oembed_youtube_add_wrapper',10,3);

function oembed_youtube_add_wrapper($return, $data, $url) {
        return "<div class='entry-content-asset entry-content-asset--{$data->provider_name}'>{$return}</div>";
}