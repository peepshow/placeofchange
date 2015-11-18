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
      class="video-js vjs-16-9 vjs-sublime-skin"
      width="100%"
      height="auto"
      controls
      data-setup='{ "techOrder": ["youtube"],
        "sources": [{ "type": "video/youtube", "src": "<?php echo($video_URL); ?>"}] }'
    >
      <!-- <source src="http://vjs.zencdn.net/v/oceans.mp4" type='video/mp4'>
      <source src="http://vjs.zencdn.net/v/oceans.webm" type='video/webm'> -->
    </video>
  <?php } ?>
  <div class="welcome">
    <h1>Place of Change</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <a href="#" class="btn">Begin</a>
  </div>
</section>
<section class="home-1">
  <?php the_content(); ?>
  <footer>
    <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
  </footer>

</section>
