<?php 
	include(locate_template('layouts/components/coverimage.php'));
?>
<div class="container" role="main"> 
	<article class="hentry">
		<?php if($image): ?>
		<header class="hentry-header hentry-cover">
			<div class="hc-image" style="background-image: url('<?php echo $image[0]; ?>');">
				<div class="hc-overlay"></div>
				<div class="hc-content">
					<div class="wrapper--header">
		<?php else: ?>
			<header class="hentry-header hentry-header--naked">
				<div class="wrapper--header">
		<?php endif; ?>
		<?php 

			$title  = get_the_title(); 
			$title_words = strlen($title);
			if ( $title_words <= 24 ):
				$titleClass .= ' entry-title--emphasis';
			endif;

		?>
					<h1 class="entry-title<?php echo (empty($titleClass)) ? '' :  ' '.$titleClass; ?>">
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
		<?php if($image): ?>
					</div>
				</div>
			</div>
		<?php else: ?>
			</div>
		<?php endif; ?>
		</header>
		<div class="entry-content">
			<div class="wrapper">
			<?php 

				the_content();

			?>
			</div>
		</div>
	</article>
</div>