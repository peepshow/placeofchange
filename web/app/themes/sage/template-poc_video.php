<?php
/**
 * Template Name: POC Video
 */
?>
<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header'); ?>
  <?php get_template_part('templates/content', 'poc_video'); ?>
<?php endwhile; ?>
