<?php defined('ABSPATH') or die("Cannot access pages directly."); ?>

<div class="facebook-box" <?php echo $fix_display; ?>>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/<?php echo $locale; ?>/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<html xmlns:fb="http://ogp.me/ns/fb#">
<div class="fb-like-box" data-href="<?php echo $instance['ffb_url']; ?>" data-width="<?php echo $instance['ffb_width']; ?>" data-height="<?php echo $instance['ffb_height']; ?>" data-show-faces="<?php if ($instance['ffb_faces']) echo "true"; else echo "false";?>" data-stream="<?php if ($instance['ffb_stream']) echo "true"; else echo "false"; ?>" data-header="true"></div>
</div>