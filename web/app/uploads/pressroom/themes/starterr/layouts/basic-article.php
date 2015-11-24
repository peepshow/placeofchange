<!DOCTYPE html>
	<?php
        include(locate_template('layouts/partials/head.php'));
	?>
	<body class="<?php echo $post->post_name; ?>">
	<?php

        include(locate_template('layouts/partials/header.php'));

        include(locate_template('layouts/partials/content.php'));

        include(locate_template('layouts/partials/footer.php'));
    ?>
	</body>
</html>