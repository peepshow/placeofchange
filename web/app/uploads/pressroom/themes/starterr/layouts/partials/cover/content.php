<div class="container" role="main"> 
	<article class="hentry hentry--cover">
		<header class="hentry-header hentry-header--naked">
			<div class="wrapper--header">
				<?php 

					$title  = $edition->post_title; 
					$title_words = strlen($title);
					if ( $title_words <= 24 ):
						$titleClass = ' edition-title--emphasis';
					endif;

				?>
				<h1 class="edition-title <?php echo (empty($titleClass)) ? '' :  ' '.$titleClass; ?>">
				<?php 
					
					// echo $edition->title;
					echo $title;

				?>
				</h1>
				<div class="edition-meta">
					<p class="byline publisher vcard">
					<?php 

						echo $edition->post_excerpt;

					?>
					</p>
				</div>
			</div>
		</header>
	</article>
</div>