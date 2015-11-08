<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package sbone
 */

if ( ! function_exists( 'sbone_post_nav' ) ) :
/**
 * Display navigation to next/previous post when applicable.
 */
function sbone_post_nav() {
	// Don't print empty markup if there's nowhere to navigate.
	$previous = ( is_attachment() ) ? get_post( get_post()->post_parent ) : get_adjacent_post( false, '', true );
	$next     = get_adjacent_post( false, '', false );

	if ( ! $next && ! $previous ) {
		return;
	}
	?>
	<nav class="navigation post-navigation" role="navigation">
		<h1 class="screen-reader-text"><?php esc_html_e( 'Post navigation', 'sbone' ); ?></h1>
		<div class="nav-links">
			<?php
				previous_post_link( '<div class="nav-previous">%link</div>', _x( '<span class="meta-nav">&larr;</span>&nbsp;%title', 'Previous post link', 'sbone' ) );
				next_post_link(     '<div class="nav-next">%link</div>',     _x( '%title&nbsp;<span class="meta-nav">&rarr;</span>', 'Next post link',     'sbone' ) );
			?>
		</div><!-- .nav-links -->
	</nav><!-- .navigation -->
	<?php
}
endif;

/**
 * Returns true if a blog has more than 1 category.
 *
 * @return bool
 */
function sbone_categorized_blog() {
	if ( false === ( $all_the_cool_cats = get_transient( 'sbone_categories' ) ) ) {
		// Create an array of all the categories that are attached to posts.
		$all_the_cool_cats = get_categories( array(
			'fields'     => 'ids',
			'hide_empty' => 1,

			// We only need to know if there is more than one category.
			'number'     => 2,
		) );

		// Count the number of categories that are attached to the posts.
		$all_the_cool_cats = count( $all_the_cool_cats );

		set_transient( 'sbone_categories', $all_the_cool_cats );
	}

	if ( $all_the_cool_cats > 1 ) {
		// This blog has more than 1 category so sbone_categorized_blog should return true.
		return true;
	} else {
		// This blog has only 1 category so sbone_categorized_blog should return false.
		return false;
	}
}

/**
 * Flush out the transients used in sbone_categorized_blog.
 */
function sbone_category_transient_flusher() {
	// Like, beat it. Dig?
	delete_transient( 'sbone_categories' );
}
add_action( 'edit_category', 'sbone_category_transient_flusher' );
add_action( 'save_post',     'sbone_category_transient_flusher' );
