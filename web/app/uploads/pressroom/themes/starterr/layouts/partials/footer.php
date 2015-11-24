<footer class="content-info" role="contentinfo">
    <div class="wrapper">
        <div class="container">
           <?php 

                $editionmeta = get_post_meta($edition->ID);
                $project = get_the_terms( $edition->ID, 'pr_editorial_project' );

            ?>
            <p>Sample article published on <strong><?php echo date('d F, Y', strtotime($editionmeta['_pr_date'][0])); ?>, <?php echo $project[0]->name.', '.$edition->post_title; ?></strong> via PressRoon <abbr><?php echo $editionmeta['pr_packager_type'][0]; ?></abbr> exporter. 
            </p>
            <div class="source-org vcard copyright">
                © 2015 <span class="org fn">PressRoom, Ltd.</span> Some Rights Reserved
            </div>
        </div>
    </div>
</footer>
<script type="text/javascript" src="<?php echo $GLOBALS['js']; ?>"></script>
<?php 

    include(locate_template('layouts/components/fontobserver.php'));
    
?>