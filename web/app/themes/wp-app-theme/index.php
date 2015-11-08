<?php
$angular = new WPAPP_THEME();

get_template_part('templates/page', 'header');

$app = 'wpApp';

?>

<div ng-app="<?php echo $app; ?>">
	<ng-view></ng-view>
</div>
