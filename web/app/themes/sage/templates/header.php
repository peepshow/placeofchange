<!-- <header class="banner">
  <div class="container">
    <a class="brand" href="<?= esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
    <nav class="nav-primary">
      <?php
      wp_nav_menu( array(
        'menu'              => 'primary_navigation',
        'theme_location'    => 'primary_navigation',
        'depth'             => 2,
        'menu_class'        => 'nav navbar-nav',
        'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
        'walker'            => new wp_bootstrap_navwalker())
      );
      ?>
      <?php
      // if (has_nav_menu('primary_navigation')) :
      //   wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']);
      // endif;
      ?>
    </nav>
  </div>
</header> -->



<header class="navbar navbar-dark bg-inverse navbar-static-top">
  <div class="container">
    <a class="navbar-brand" href="index.html">
      <!-- <span class="icon-logo"></span>
      <span class="sr-only">Land.io</span> -->
    </a>
    <a class="navbar-toggler hidden-md-up pull-right" data-toggle="collapse" href="#collapsingNavbarInverse" aria-expanded="false" aria-controls="collapsingNavbarInverse">
    &#9776;</a>
    <a class="navbar-toggler navbar-toggler-custom hidden-md-up pull-right" data-toggle="collapse" href="#collapsingMobileUserInverse" aria-expanded="false" aria-controls="collapsingMobileUserInverse">
      <span class="icon-user"></span>
    </a>
    <nav id="collapsingNavbarInverse" class="collapse navbar-toggleable-custom" role="tabpanel" aria-labelledby="collapsingNavbarInverse">

      <?php
      // wp_nav_menu( array(
      //   'menu'              => 'primary_navigation',
      //   'theme_location'    => 'primary_navigation',
      //   'depth'             => 2,
      //   'menu_class'        => 'nav navbar-nav',
      //   'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
      //   'walker'            => new wp_bootstrap_navwalker())
      // );
      ?>
      <?php
      if (has_nav_menu('primary_navigation')) :
        wp_nav_menu(['theme_location' => 'primary_navigation', 'walker' => new wp_bootstrap_navwalker(), 'menu_class' => 'nav navbar-nav']);
      endif;
      ?>

      <ul class="nav navbar-nav pull-right">
        <li class="nav-item nav-item-toggable">
          <a class="nav-link" href="http://tympanus.net/codrops/?p=25217">About Land.io</a>
        </li>
        <li class="nav-item nav-item-toggable active">
          <a class="nav-link" href="ui-elements.html">UI Kit <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item nav-item-toggable">
          <a class="nav-link" href="https://github.com/tatygrassini/landio-html" target="_blank">GitHub</a>
        </li>
        <li class="nav-item nav-item-toggable hidden-sm-up">
          <form class="navbar-form">
            <input class="form-control navbar-search-input" type="text" placeholder="Type your search &amp; hit Enter&hellip;">
          </form>
        </li>
        <li class="navbar-divider hidden-sm-down"></li>
        <li class="nav-item dropdown nav-dropdown-search hidden-sm-down">
          <a class="nav-link dropdown-toggle" id="dropdownMenuInverse1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="icon-search"></span>
          </a>
          <div class="dropdown-menu dropdown-menu-right dropdown-menu-search" aria-labelledby="dropdownMenuInverse1">
            <form class="navbar-form">
              <input class="form-control navbar-search-input" type="text" placeholder="Type your search &amp; hit Enter&hellip;">
            </form>
          </div>
        </li>
        <li class="nav-item dropdown hidden-sm-down">
          <a class="nav-link dropdown-toggle nav-dropdown-user dropdown-toggle" id="dropdownMenuInverse2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/dist/images/img/face5.jpg" height="40" width="40" alt="Avatar" class="img-circle"> <span class="icon-caret-down"></span>
          </a>
          <div class="dropdown-menu dropdown-menu-right dropdown-menu-user dropdown-menu-animated" aria-labelledby="dropdownMenuInverse2">
            <div class="media">
              <div class="media-left">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/dist/images/img/face5.jpg" height="60" width="60" alt="Avatar" class="img-circle">
              </div>
              <div class="media-body media-middle">
                <h5 class="media-heading">Joel Fisher</h5>
                <h6>hey@joelfisher.com</h6>
              </div>
            </div>
            <a href="#" class="dropdown-item text-uppercase">View posts</a>
            <a href="#" class="dropdown-item text-uppercase">Manage groups</a>
            <a href="#" class="dropdown-item text-uppercase">Subscription &amp; billing</a>
            <a href="#" class="dropdown-item text-uppercase text-muted">Log out</a>
            <a href="#" class="btn-circle has-gradient pull-right">
              <span class="sr-only">Edit</span>
              <span class="icon-edit"></span>
            </a>
          </div>
        </li>
      </ul>
    </nav>
    <nav id="collapsingMobileUserInverse" class="collapse navbar-toggleable-custom dropdown-menu-custom p-x hidden-md-up" role="tabpanel" aria-labelledby="collapsingMobileUserInverse">
      <div class="media m-t">
        <div class="media-left">
          <img src="<?php echo get_stylesheet_directory_uri(); ?>/dist/images/img/face5.jpg" height="60" width="60" alt="Avatar" class="img-circle">
        </div>
        <div class="media-body media-middle">
          <h5 class="media-heading">Joel Fisher</h5>
          <h6>hey@joelfisher.com</h6>
        </div>
      </div>
      <a href="#" class="dropdown-item text-uppercase">View posts</a>
      <a href="#" class="dropdown-item text-uppercase">Manage groups</a>
      <a href="#" class="dropdown-item text-uppercase">Subscription &amp; billing</a>
      <a href="#" class="dropdown-item text-uppercase text-muted">Log out</a>
      <a href="#" class="btn-circle has-gradient pull-right m-b">
        <span class="sr-only">Edit</span>
        <span class="icon-edit"></span>
      </a>
    </nav>
  </div>
</header>

<section class="lostrow">
  <div class="lostquarter">1</div>
  <div class="losthalf">2</div>
  <div class="lostquarter">3</div>
</section>
