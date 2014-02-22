 <?
//  error_reporting(E_ALL);
//error_reporting(E_ALL & ~E_NOTICE | E_STRICT); // Warns on good coding standards
  //ini_set("display_errors", "1");
  ini_set("display_errors", false);
?>
<?php the_post() ?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<?php wp_print_scripts('jquery') ?>
<title><?php the_title() ?></title>
<?php xacd_the_head() ?>
<!-- ---------------- THIS IS NOT THE PART OF DEMO (START)----------------------- -->
<script>if (window==window.top) { /* I'm in a frame! */
  jQuery(function(){jQuery('<a class="fleft" href="<?php bloginfo("url") ?>">"<?php the_title() ?>"  <br>  >>>> венрнуться на <?php bloginfo("name") ?></a>').prependTo('body');});
}</script>
<!-- ---------------- THIS IS NOT THE PART OF DEMO (END)  ----------------------- -->

</head>
<body>
<?php xacd_the_body() ?>
</body>
</html>