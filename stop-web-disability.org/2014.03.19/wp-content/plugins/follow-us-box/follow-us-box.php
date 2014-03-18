<?php
/* Plugin Name: Follow Us Box
Plugin URI: http://www.deconf.com
Description: This is a frontend widget for Twitter, Google+ and Facebook
Version: 1.1.1
Author: Deconf.com
Author URI: http://www.deconf.com
*/
class FollowUsBox extends WP_Widget {
	function FollowUsBox() {
		$widget_ops = array('classname' => 'FollowUsBox', 'description' => 'This is a frontend widget for Twitter, Google+ and Facebook');
		$this->WP_Widget('FollowUsBox','Follow Us Box',$widget_ops);
	}
    function widget($args, $instance) { // widget sidebar output

		extract($args, EXTR_SKIP);
		$title = apply_filters('widget_title', $instance['fb_title']);
        echo $before_widget;
		if ($title){
			echo $before_title.$title.$after_title;
		}
		$locale=str_replace('-','_',get_bloginfo ( 'language' ));
		
		echo '<div id="followusbox">';		
		switch ($instance['fb_order']){
			default :	
						if($instance['gfb_enable'] AND $instance['gfb_id']){	
							require_once 'google.php';
						}
						if($instance['tfb_enable'] AND $instance['tfb_username']){	
							$fix_tdisplay='style="margin-bottom:15px"';
							require_once 'twitter.php';
						}	
						if($instance['ffb_enable'] AND $instance['ffb_url']){
							if (($instance['ffb_stream']==1) OR ($instance['ffb_faces']==1)){
								$fix_display='style="margin-left:0px"';
							}else{
								$fix_display='style="margin-left:-10px"';
							}
							require_once 'facebook.php';	
						}
						break;
			
			case 1 :	
						if($instance['gfb_enable'] AND $instance['gfb_id']){	
							require_once 'google.php';
						}
						if($instance['ffb_enable'] AND $instance['ffb_url']){
							if (($instance['ffb_stream']==1) OR ($instance['ffb_faces']==1)){
								$fix_display='style="margin-left:0px"';
							}else{
								$fix_display='style="margin-left:-10px"';
							}
							require_once 'facebook.php';	
						}
						if($instance['tfb_enable'] AND $instance['tfb_username']){	
							$fix_tdisplay='style="margin-bottom:15px"';
							require_once 'twitter.php';
						}
						break;

			case 2 :	
						if($instance['ffb_enable'] AND $instance['ffb_url']){
							if (($instance['ffb_stream']==1) OR ($instance['ffb_faces']==1)){
								$fix_display='style="margin-left:0px"';
							}else{
								$fix_display='style="margin-left:-10px"';
							}
							require_once 'facebook.php';	
						}						
						if($instance['gfb_enable'] AND $instance['gfb_id']){	
							require_once 'google.php';
						}
						if($instance['tfb_enable'] AND $instance['tfb_username']){	
							$fix_tdisplay='style="margin-bottom:15px"';
							require_once 'twitter.php';
						}
						break;
			case 3 :	
						if($instance['ffb_enable'] AND $instance['ffb_url']){
							if (($instance['ffb_stream']==1) OR ($instance['ffb_faces']==1)){
								$fix_display='style="margin-left:0px"';
							}else{
								$fix_display='style="margin-left:-10px"';
							}
							require_once 'facebook.php';	
						}						
						if($instance['tfb_enable'] AND $instance['tfb_username']){	
							$fix_tdisplay='style="margin-bottom:15px"';
							require_once 'twitter.php';
						}
						if($instance['gfb_enable'] AND $instance['gfb_id']){	
							require_once 'google.php';
						}
						break;
			case 4 :	
						if($instance['tfb_enable'] AND $instance['tfb_username']){
							$fix_tdisplay='style="margin-bottom:15px"';						
							require_once 'twitter.php';
						}
						if($instance['ffb_enable'] AND $instance['ffb_url']){
							if (($instance['ffb_stream']==1) OR ($instance['ffb_faces']==1)){
								$fix_display='style="margin-left:0px"';
							}else{
								$fix_display='style="margin-left:-10px"';
							}
							require_once 'facebook.php';	
						}						
						if($instance['gfb_enable'] AND $instance['gfb_id']){	
							require_once 'google.php';
						}
						break;
			case 5 :	
						if($instance['tfb_enable'] AND $instance['tfb_username']){	
							$fix_tdisplay='style="margin-bottom:15px"';
							require_once 'twitter.php';
						}
						if($instance['gfb_enable'] AND $instance['gfb_id']){	
							require_once 'google.php';
						}
						if($instance['ffb_enable'] AND $instance['ffb_url']){
							if (($instance['ffb_stream']==1) OR ($instance['ffb_faces']==1)){
								$fix_display='style="margin-left:0px"';
							}else{
								$fix_display='style="margin-left:-10px"';
							}
							require_once 'facebook.php';	
						}						
						break;						
		}	
		
		echo '</div>';
		
		echo $after_widget; // post-widget code from theme
    }

 public function form( $instance ) {
    $instance = wp_parse_args( (array) $instance, array( 'fb_title' => 'Follow Us Box', 'gfb_width' => '230', 'gfb_style' => 'light', 'gfb_id' => '', 'tfb_username' => '', 'tfb_count' => 'false', 'tfb_width' => 'large', 'ffb_url' => '', 'ffb_width' => '230', 'ffb_height' => '80', 'ffb_faces' => '0', 'ffb_stream' => '0', 'fb_offset' => '', 'gfb_enable' => '1', 'tfb_enable' => '1', 'ffb_enable' => '1', 'fb_order' => '0') );
    $fb_title = $instance['fb_title'];
    $gfb_width = $instance['gfb_width'];
	$gfb_style = $instance['gfb_style'];
	$gfb_id = $instance['gfb_id'];
	$tfb_username = $instance['tfb_username']; 
	$tfb_count = $instance['tfb_count']; 
	$tfb_width = $instance['tfb_width']; 
	$ffb_url = $instance['ffb_url']; 	
	$ffb_width = $instance['ffb_width'];
	$ffb_height = $instance['ffb_height'];
	$ffb_stream = $instance['ffb_stream'];
	$ffb_faces = $instance['ffb_faces'];
	$gfb_enable = $instance['gfb_enable'];	
	$tfb_enable = $instance['tfb_enable'];	
	$ffb_enable = $instance['ffb_enable'];
	$fb_order = $instance['fb_order'];	
    ?>
	<?php /*<div style="float:right;"><a href="http://www.deconf.com/en" target="_blank"><?php _e('Help', 'followusbox'); ?></a></div>
    <br />*/ ?>
	<p>
    <label for="<?php echo $this->get_field_id('fb_title'); ?>"><?php _e('Title:', 'followusbox'); ?></label>
    <input id="<?php echo $this->get_field_id( 'fb_title' ); ?>" name="<?php echo  $this->get_field_name( 'fb_title' ); ?>" type="text" class="widefat" value="<?php echo $fb_title ?>"   />
    </p>
	<p>
	<label for="<?php echo $this->get_field_id('fb_order'); ?>"><?php _e('Display Order:', 'followusbox'); ?></label>
	<select id="<?php echo $this->get_field_id('fb_order'); ?>"  class="widefat" name="<?php   echo $this->get_field_name( 'fb_order' ); ?>">
		<option value="0" <?php if ($fb_order=="0") echo "selected='yes'"; echo ">".__('Google, Twitter, Facebook', 'followusbox');?></option>
		<option value="1" <?php if ($fb_order=="1") echo "selected='yes'"; echo ">".__('Google, Facebook, Twitter', 'followusbox');?></option>
		<option value="2" <?php if ($fb_order=="2") echo "selected='yes'"; echo ">".__('Facebook, Google, Twitter', 'followusbox');?></option>
		<option value="3" <?php if ($fb_order=="3") echo "selected='yes'"; echo ">".__('Facebook, Twitter, Google', 'followusbox');?></option>
		<option value="4" <?php if ($fb_order=="4") echo "selected='yes'"; echo ">".__('Twitter, Facebook, Google', 'followusbox');?></option>
		<option value="5" <?php if ($fb_order=="5") echo "selected='yes'"; echo ">".__('Twitter, Google, Facebook', 'followusbox');?></option>		
	</select>
	</p>	
    <h4><input name="<?php echo  $this->get_field_name( 'gfb_enable' ); ?>" type="checkbox" id="<?php echo  $this->get_field_id( 'gfb_enable' ); ?>" value="1"<?php if ($gfb_enable) echo " checked='checked'"; ?>  /> <?php _e('Enable Google+', 'followusbox'); ?></h4>
	<p>
    <label for="<?php echo $this->get_field_id('gfb_id'); ?>"><?php _e('Page ID:', 'followusbox'); ?></label>
    <input id="<?php echo $this->get_field_id( 'gfb_id' ); ?>" name="<?php   echo $this->get_field_name( 'gfb_id' ); ?>" type="text"  class="widefat" value="<?php echo $gfb_id ?>" />
	</p>
	<p>
    <label for="<?php echo $this->get_field_id('gfb_width'); ?>"><?php _e('Width:', 'followusbox'); ?></label>
    <input id="<?php echo $this->get_field_id( 'gfb_width' ); ?>" name="<?php   echo $this->get_field_name( 'gfb_width' ); ?>" type="text" value="<?php echo $gfb_width ?>" style="width:40px;" />
	&nbsp;&nbsp;&nbsp;
	<label for="<?php echo $this->get_field_id('gfb_style'); ?>"><?php _e('Style:', 'followusbox'); ?></label>
	<select id="<?php echo $this->get_field_id('gfb_style'); ?>" name="<?php   echo $this->get_field_name( 'gfb_style' ); ?>">
		<option value="light" <?php if ($gfb_style=="light") echo "selected='yes'"; echo ">".__('Light', 'followusbox');?></option>
		<option value="dark" <?php if ($gfb_style=="dark") echo "selected='yes'"; echo ">".__('Dark', 'followusbox');?></option>
	</select>	
    </p>
    <h4><input name="<?php echo  $this->get_field_name( 'tfb_enable' ); ?>" type="checkbox" id="<?php echo  $this->get_field_id( 'tfb_enable' ); ?>" value="1"<?php if ($tfb_enable) echo " checked='checked'"; ?>  /> <?php _e('Enable Twitter', 'followusbox'); ?></h4>
	<p>
    <label for="<?php echo $this->get_field_id('tfb_username'); ?>"><?php _e('Username:', 'followusbox'); ?></label>
    <input id="<?php echo $this->get_field_id( 'tfb_username' ); ?>" name="<?php   echo $this->get_field_name( 'tfb_username' ); ?>" type="text"  class="widefat" value="<?php echo $tfb_username ?>" />
	</p>
	<p>
	<label for="<?php echo $this->get_field_id('tfb_width'); ?>"><?php _e('Width:', 'followusbox'); ?></label>	
	<select id="<?php echo $this->get_field_id('tfb_width'); ?>" name="<?php   echo $this->get_field_name( 'tfb_width' ); ?>">
		<option value="" <?php if ($tfb_width=="") echo "selected='yes'"; echo ">".__('Small', 'followusbox');?></option>
		<option value="large" <?php if ($tfb_width=="large") echo "selected='yes'"; echo ">".__('Large', 'followusbox');?></option>
	</select>
	&nbsp;&nbsp;&nbsp;
	<label for="<?php echo $this->get_field_id('tfb_count'); ?>"><?php _e('Count:', 'followusbox'); ?></label>	
	<select id="<?php echo $this->get_field_id('tfb_count'); ?>" name="<?php   echo $this->get_field_name( 'tfb_count' ); ?>">
		<option value="true" <?php if ($tfb_count=="true") echo "selected='yes'"; echo ">".__('Show', 'followusbox');?></option>
		<option value="false" <?php if ($tfb_count=="false") echo "selected='yes'"; echo ">".__('Hide', 'followusbox');?></option>
	</select>
	</p>
    <h4><input name="<?php echo  $this->get_field_name( 'ffb_enable' ); ?>" type="checkbox" id="<?php echo  $this->get_field_id( 'ffb_enable' ); ?>" value="1"<?php if ($ffb_enable) echo " checked='checked'"; ?>  /> <?php _e('Enable Facebook', 'followusbox'); ?></h4>
	<p>
    <label for="<?php echo $this->get_field_id('ffb_url'); ?>"><?php _e('Page URL:', 'followusbox'); ?></label>
    <input id="<?php echo $this->get_field_id( 'ffb_url' ); ?>" name="<?php   echo $this->get_field_name( 'ffb_url' ); ?>" type="text"  class="widefat" value="<?php echo $ffb_url ?>" />
	</p>
	<p>
    <label for="<?php echo $this->get_field_id('ffb_width'); ?>"><?php _e('Width:', 'followusbox'); ?></label>
    <input id="<?php echo $this->get_field_id( 'ffb_width' ); ?>" name="<?php   echo $this->get_field_name( 'ffb_width' ); ?>" type="text" value="<?php echo $ffb_width ?>" style="width:40px;" />
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<label for="<?php echo $this->get_field_id('ffb_faces'); ?>"><?php _e('Faces:', 'followusbox'); ?></label>	
	<select id="<?php echo $this->get_field_id('ffb_faces'); ?>" name="<?php   echo $this->get_field_name( 'ffb_faces' ); ?>">
		<option value="1" <?php if ($ffb_faces=="1") echo "selected='yes'"; echo ">".__('Show', 'followusbox');?></option>
		<option value="0" <?php if ($ffb_faces=="0") echo "selected='yes'"; echo ">".__('Hide', 'followusbox');?></option>
	</select>
	</p>
	<p>
    <label for="<?php echo $this->get_field_id('ffb_height'); ?>"><?php _e('Height:', 'followusbox'); ?></label>
    <input id="<?php echo $this->get_field_id( 'ffb_height' ); ?>" name="<?php   echo $this->get_field_name( 'ffb_height' ); ?>" type="text" value="<?php echo $ffb_height ?>" style="width:35px;" />
	&nbsp;&nbsp;&nbsp;
	<label for="<?php echo $this->get_field_id('ffb_stream'); ?>"><?php _e('Stream:', 'followusbox'); ?></label>	
	<select id="<?php echo $this->get_field_id('ffb_stream'); ?>" name="<?php   echo $this->get_field_name( 'ffb_stream' ); ?>">
		<option value="1" <?php if ($ffb_stream=="1") echo "selected='yes'"; echo ">".__('Show', 'followusbox');?></option>
		<option value="0" <?php if ($ffb_stream=="0") echo "selected='yes'"; echo ">".__('Hide', 'followusbox');?></option>
	</select>
	</p>
    <?php
  }

  public function update( $new_instance, $old_instance ) {

	$instance = array();
    $instance['fb_title'] = $new_instance['fb_title'];
    $instance['gfb_width'] = $new_instance['gfb_width'];
	$instance['gfb_style'] = $new_instance['gfb_style'];
	$instance['gfb_id'] = $new_instance['gfb_id'];
	$instance['tfb_username'] = $new_instance['tfb_username'];
	$instance['tfb_count'] = $new_instance['tfb_count'];	
	$instance['tfb_width'] = $new_instance['tfb_width'];
	$instance['ffb_url'] = $new_instance['ffb_url'];
    $instance['ffb_width'] = $new_instance['ffb_width'];
    $instance['ffb_height'] = $new_instance['ffb_height'];
    $instance['ffb_faces'] = $new_instance['ffb_faces'];
    $instance['ffb_stream'] = $new_instance['ffb_stream'];
    $instance['gfb_enable'] = $new_instance['gfb_enable'];
    $instance['ffb_enable'] = $new_instance['ffb_enable'];
    $instance['tfb_enable'] = $new_instance['tfb_enable'];
	$instance['fb_order'] = $new_instance['fb_order'];	

    return $instance;
  }  
	
}

add_action('widgets_init', create_function('','return register_widget("FollowUsBox");'));

?>