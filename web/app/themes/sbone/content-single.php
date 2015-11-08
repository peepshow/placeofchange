<?php
/**
 * @package sbone
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

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
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php the_content(); ?>
		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'sbone' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php
			/* translators: used between list items, there is a space after the comma */
			$category_list = get_the_category_list( esc_html__( ', ', 'sbone' ) );

			/* translators: used between list items, there is a space after the comma */
			$tag_list = get_the_tag_list( '', esc_html__( ', ', 'sbone' ) );

			if ( ! sbone_categorized_blog() ) {
				// This blog only has 1 category so we just need to worry about tags in the meta text
				if ( '' != $tag_list ) {
					$meta_text = esc_html__( 'This entry was tagged %2$s. Bookmark the <a href="%3$s" rel="bookmark">permalink</a>.', 'sbone' );
				} else {
					$meta_text = esc_html__( 'Bookmark the <a href="%3$s" rel="bookmark">permalink</a>.', 'sbone' );
				}

			} else {
				// But this blog has loads of categories so we should probably display them here
				if ( '' != $tag_list ) {
					$meta_text = esc_html__( 'This entry was posted in %1$s and tagged %2$s. Bookmark the <a href="%3$s" rel="bookmark">permalink</a>.', 'sbone' );
				} else {
					$meta_text = esc_html__( 'This entry was posted in %1$s. Bookmark the <a href="%3$s" rel="bookmark">permalink</a>.', 'sbone' );
				}

			} // end check for categories on this blog

			printf(
				$meta_text,
				$category_list,
				$tag_list,
				get_permalink()
			);
		?>

		<?php edit_post_link( esc_html__( 'Edit', 'sbone' ), '<span class="edit-link">', '</span>' ); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
