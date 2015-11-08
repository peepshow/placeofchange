<?php
/**
 * @package sbone
 */
?>

<article id="post-<?php the_ID(); ?>" class="post">
	<header class="entry-header">
		<?php the_title( sprintf( '<h1 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h1>' ); ?>

		<?php if ( 'post' == get_post_type() ) : ?>
			<div class="entry-meta">
				<span class="posted-on">
					<?php esc_html_e( 'Posted on', 'sbone' ); ?>

					<time class="entry-date published">
						<?php echo get_the_date( 'n/j/Y' ); ?>
					</time>
				</span>
				<span class="byline">
					<?php esc_html_e( 'by', 'sbone' ); ?>

					<span class="author vcard">
						<a class="url fn n" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
							<?php echo esc_html( get_the_author() ); ?>
						</a>
					</span>
				</span>
			</div><!-- .entry-meta -->
		<?php endif; ?>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php the_content(); ?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php if ( 'post' == get_post_type() ) : // Hide category and tag text for pages on Search ?>
			<?php
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( esc_html__( ', ', 'sbone' ) );
			if ( $categories_list && sbone_categorized_blog() ) :
				?>
				<span class="cat-links">
					<?php printf( esc_html__( 'Posted in %1$s', 'sbone' ), $categories_list ); ?>
				</span>
			<?php endif; // End if categories ?>

			<?php
			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html__( ', ', 'sbone' ) );
			if ( $tags_list ) :
				?>
				<span class="tags-links">
					<?php printf( esc_html__( 'Tagged %1$s', 'sbone' ), $tags_list ); ?>
				</span>
			<?php endif; // End if $tags_list ?>
		<?php endif; // End if 'post' == get_post_type() ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->