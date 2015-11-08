<?php

use Roots\Sage\Setup;
use Roots\Sage\Wrapper;

?>

<!doctype html>
<html <?php language_attributes(); ?>>
<?php get_template_part('templates/head'); ?>
<body <?php body_class(); ?>>
  <div class="page-wrap">
    <div id="preloader" class="loading-overlay">
      <div id="dust">
      </div>
        <div class="preloader">
          <div class="text">
            <h1><span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span></h1>
          </div>
      </div>
    </div>
    <!--[if lt IE 9]>
      <div class="alert alert-warning">
        <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?>
      </div>
    <![endif]-->
          <?php
            do_action('get_header');
            get_template_part('templates/header');
          ?>
          <div class="wrap container-fluid" role="document">
            <div class="row">
              <main class="main">

                <div id="main" class="m-scene">
                  <div class="m-landing-layout">
                    <div class="scene_element scene_element--scaleUp">



                <?php include Wrapper\template_path(); ?>

              </div>
              </div>
              </div><!-- .m-scene -->



        </main><!-- /.main -->

      </div><!-- /.content -->
    </div><!-- /.wrap -->
    <?php if (Setup\display_sidebar()) : ?>
      <aside class="sidebar">
        <?php include Wrapper\sidebar_path(); ?>
      </aside><!-- /.sidebar -->
    <?php endif; ?>
    <?php
      do_action('get_footer');
      get_template_part('templates/footer');
      wp_footer();
    ?>
  </div>
</body>
</html>
