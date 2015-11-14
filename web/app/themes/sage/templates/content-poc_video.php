<section class="full--video">
  <?php
    // create a variable named $video that contains the text inside of your field named 'video' that was created by pods
    $video_URL = get_post_meta($post->ID, 'video', true);
    if($video_URL != '') {
      //run the $video variable through the magical 'wp_oembed_get' function to automagically generate an embed frame and set the width
      // $embed_code = wp_oembed_get($video_URL, array('width'=>1010));
      // echo ($embed_code);
      ?>
    <video
      id="vid1"
      class="video-js vjs-default-skin"
      controls
      autoplay
      width="auto"
      height="auto"
      data-setup='{ "techOrder": ["youtube"],
        "sources": [{ "type": "video/youtube", "src": "<?php echo($video_URL); ?>"}] }'
    >
    </video>
  <?php } ?>

  <?php the_content(); ?>
  <footer>
    <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
  </footer>

</section>
