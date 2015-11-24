<!DOCTYPE html>
<?php 
  if(isset($_COOKIE['fonts-loaded'])):
?>
<html class="no-js fonts-loaded" <?php language_attributes(); ?>>
<?php else: ?>
<html class="no-js" <?php language_attributes(); ?>>
<?php endif; ?>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><?php the_title(); ?></title>
		<meta name="format-detection" content="telephone=no">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<link rel="stylesheet" href="<?php echo $GLOBALS['css']; ?>">
	</head>