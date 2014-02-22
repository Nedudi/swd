<h1>WP Open Graph</h1>
<p>Facebook Open Graph Protocol main settings.</p>
<h2>Basic Settings</h2>
<form method="post" name="wpog_options">
<table>
	<tr>
		<td style="width:190px;"><label for="og_image">Default image URL:</label></td>
		<td>
			<input type="text" style="width:510px;" id="og_image" name="wpog_options[image]" value="<?php echo NY_OG_Main_Admin::option('image'); ?>" size="90" />
		</td>
	</tr>
	<tr>
		<td><label for="og_fb_app_id">Facebook App ID:</label></td>
		<td>
			<input type="text" style="width:510px;" id="og_fb_app_id" name="wpog_options[fb_app_id]" value="<?php echo NY_OG_Main_Admin::option('fb_app_id'); ?>" size="90" />
		</td>
	</tr>
	<tr>
		<td><label for="og_fb_app_id">Facebook Admin ID:</label></td>
		<td>
			<input type="text" style="width:510px;" id="og_fb_admin" name="wpog_options[fb_admin]" value="<?php echo NY_OG_Main_Admin::option('fb_admin'); ?>" size="90" />
		</td>
	</tr>
</table>
<h2>Home Page Settings</h2>
<p>Settings for your static home page(front page)</p>
<table>
	<tr>
		<td style="width:190px;"><label for="og_home_title">Title:</label></td>
		<td>
			<input type="text" style="width:510px;" id="og_home_title" name="wpog_options[home_title]" value="<?php echo stripslashes(NY_OG_Main_Admin::option('home_title')); ?>" size="90" />
		</td>
	</tr>
	<td><label for="og_home_description">Description:</label></td>
	<td>
		<textarea rows="3" style="width:510px;" cols="72" id="og_home_description" name="wpog_options[home_description]"><?php echo stripslashes(NY_OG_Main_Admin::option('home_description')); ?></textarea>
	</td>
	<tr>
		<td>
			<label for="og_blog_type">Type:</label><br />
			<em>(article / blog / website etc.)</em>
		</td>
		<td>
			<input type="text" style="width:510px;" id="og_home_type" name="wpog_options[home_type]" value="<?php echo NY_OG_Main_Admin::option('home_type'); ?>" size="90" />
		</td>
	</tr>
	<tr>
		<td><label for="og_home_image">Image URL:</label></td>
		<td>
			<input type="text" style="width:510px;" id="og_home_image" name="wpog_options[home_image]" value="<?php echo NY_OG_Main_Admin::option('home_image'); ?>" size="90" />
		</td>
	</tr>
</table>
<h2>Blog Home Settings</h2>
<p>Settings for your blog page with posts (ie: yoursite.com/blog)</p>
<table>
	<tr>
		<td style="width:190px;"><label for="og_blog_title">Title:</label></td>
		<td>
			<input type="text" style="width:510px;" id="og_blog_title" name="wpog_options[blog_title]" value="<?php echo stripslashes(NY_OG_Main_Admin::option('blog_title')); ?>" size="90" />
		</td>
	</tr>
	<td><label for="og_blog_description">Description:</label></td>
	<td>
		<textarea rows="3" style="width:510px;" style="width:510px;" cols="72" id="og_blog_description" name="wpog_options[blog_description]"><?php echo stripslashes(NY_OG_Main_Admin::option('blog_description')); ?></textarea>
	</td>
	<tr>
		<td>
			<label for="og_blog_type">Type:</label><br />
			<em>(article / blog / website etc.)</em>
		</td>
		<td>
			<input type="text" style="width:510px;" id="og_blog_type" name="wpog_options[blog_type]" value="<?php echo NY_OG_Main_Admin::option('blog_type'); ?>" size="90" />
		</td>
	</tr>
	<tr>
		<td><label for="og_blog_image">Image URL:</label></td>
		<td>
			<input type="text" style="width:510px;" id="og_blog_image" name="wpog_options[blog_image]" value="<?php echo NY_OG_Main_Admin::option('blog_image'); ?>" size="90" />
		</td>
	</tr>
</table>
<p class="submit">
      <input type="submit" class="button-primary" value="<?php _e('Submit') ?>" />
</p>
</form>