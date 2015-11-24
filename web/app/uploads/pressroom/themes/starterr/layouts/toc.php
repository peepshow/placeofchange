<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Table of content</title>
        <meta name="format-detection" content="telephone=no">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="<?php echo $GLOBALS['toc-css']; ?>">
    </head>
    <body id="toc" class="">
        <div class="swiper-container" style="width: 100%">
            <div class="swiper-wrapper">
                <?php

                if ( $edition_posts->have_posts() ):
                    while ( $edition_posts->have_posts() ):

                        $tocItemBg = false;
                        $edition_posts->the_post();
                        $post_type = get_post_type( get_the_ID() );

                        if( $post_type != "pr_ad_bundle") :
                            $image_id =  get_post_thumbnail_id();
                            if($image_id):
                                $attached_image = wp_get_attachment_metadata($image_id);
                                $image = wp_get_attachment_image_src($image_id, 'full');
                                $tocItemBg = 'background-image: url('.$image[0].'); background-position:0 0; background-repeat:no-repeat; background-size:cover;';
                            else:
                                $tocItemBg = 'background-image: url(\''.$pr_theme_url.'assets/img/fallback.gif\'); background-position:0 0; background-repeat:no-repeat; background-size:cover;';
                            endif;

                ?>
                <div class="swiper-slide">
                    <article class="hentry hentry--toc hc-image" style="<?php echo ($tocItemBg ? $tocItemBg : ''); ?>">
                        <div class="hc-overlay"></div>
                        <header>
                            <a class="toc-link" href="<?php echo get_permalink(); ?>">
                            <?php 

                                $title  = get_the_title(); 
                                $titleClass = '';

                                $title_words = strlen($title);
                                if ( $title_words <= 24 ) {
                                    $titleClass .= ' h2';
                                } else {
                                   $titleClass .= ' h3'; 
                                }

                            ?>
                                <h1 class="entry-title entry-title--toc<?php echo (empty($titleClass)) ? '' :  ' '.$titleClass; ?>">
                                <?php

                                    // the_title();
                                    echo $title;

                                ?>
                                </h1>
                                <div class="entry-meta">
                                    <p class="byline author vcard">
                                    <?php _e( 'by', 'pr_straterr' ); ?>
                                    <?php 

                                        the_author(); 

                                    ?>
                                    </p>
                                </div>
                            </a>
                        </header>
                    </article>
                </div>
              <?php 

                        endif; 
                    endwhile; 
                    wp_reset_postdata(); 
                endif;

            ?>
            </div>
        </div>
        <script type="text/javascript" src="<?php echo $GLOBALS['toc-js']; ?>"></script>
    </body>
</html>