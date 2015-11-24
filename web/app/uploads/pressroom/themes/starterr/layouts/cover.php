<?php

/* ==========================================================================
   COVER TEMPLATE 
   ========================================================================== */

    $posts = pr_get_edition_posts( $edition, true );
    $layout = 'cover';

    include(locate_template('layouts/components/coverimage.php'));

    if($image) {
        $layout .= ' cover--photo';
        $cover_style = 'style="background-image: url(\''.$image[0].'\');"';
    }

?>
<!DOCTYPE html>
    <?php
        include(locate_template('layouts/partials/head.php'));
    ?>
    <body class="<?php echo $layout.' '.$post->post_name; ?>">
    <?php 

        if($image): 
           echo '<div class="cover-wrapper" '. $cover_style .' >';
        else: 
            echo '<div class="cover-wrapper">';
        endif; 

    ?>
    <?php

        include(locate_template('layouts/partials/header.php'));

        include(locate_template('layouts/partials/cover/content.php'));

        include(locate_template('layouts/partials/cover/footer.php'));

    ?>
        </div>
    </body>
</html>