<?php
//Hook Widget
add_action( 'widgets_init', 'google_ads_master_widget' );
//Register Widget
function google_ads_master_widget() {
register_widget( 'google_ads_master_widget' );
}

class google_ads_master_widget extends WP_Widget {
	function google_ads_master_widget() {
	$widget_ops = array( 'classname' => 'Google Ads Master', 'description' => __('Google Ads Master for wordpress is the professional plugin you need to generate income with your website. ', 'google_ads_master') );
	$control_ops = array( 'width' => 300, 'height' => 350, 'id_base' => 'google_ads_master_widget' );
	$this->WP_Widget( 'google_ads_master_widget', __('Google Ads Master', 'google_ads_master'), $widget_ops, $control_ops );
	}
	
	function widget( $args, $instance ) {
		extract( $args );
		//Our variables from the widget settings.
		$name = "Google Ads Master";
		$title = isset( $instance['title'] ) ? $instance['title'] :false;
		$googleadsspacer ="'";
		$show_googleads = isset( $instance['show_googleads'] ) ? $instance['show_googleads'] :false;
		$googleads_code = $instance['googleads_code'];
		echo $before_widget;
		
		// Display the widget title
	if ( $title )
		echo $before_title . $name . $after_title;
	//Display Google Ads
	if ( $show_googleads )
		echo $googleads_code;
	echo $after_widget;
	}
	//Update the widget
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		//Strip tags from title and name to remove HTML
		$instance['down_link_google_ads'] = $new_instance['down_link_google_ads'];
		update_option('down_link_google_ads', $new_instance['down_link_google_ads']);
		$instance['name'] = strip_tags( $new_instance['name'] );
		$instance['title'] = strip_tags( $new_instance['title'] );
		$instance['show_googleads'] = $new_instance['show_googleads'];
		$instance['googleads_code'] = $new_instance['googleads_code'];
		return $instance;
	}
	function form( $instance ) {
	//Set up some default widget settings.
	$defaults = array( 'name' => __('Google Ads Master', 'google_ads_master'), 'title' => true, 'show_googleads' => false, 'googleads_code' => false );
	$instance = wp_parse_args( (array) $instance, $defaults );
	?>
		<br>
		<b>Check the buttons to be displayed:</b>
	<p>
	<img src="<?php echo plugins_url('../images/techgasp-minilogo-16.png', __FILE__); ?>" style="float:left; height:16px; vertical-align:middle;" />
	&nbsp;
	<input type="checkbox" <?php checked( (bool) $instance['title'], true ); ?> id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" />
	<label for="<?php echo $this->get_field_id( 'title' ); ?>"><b><?php _e('Display Widget Title', 'google_ads_master'); ?></b></label>
	</p>
<div style="background: url(<?php echo plugins_url('../images/techgasp-hr.png', __FILE__); ?>) repeat-x; height: 10px"></div>
	<p>
	<img src="<?php echo plugins_url('../images/techgasp-minilogo-16.png', __FILE__); ?>" style="float:left; height:16px; vertical-align:middle;" />
	&nbsp;
	<input type="checkbox" <?php checked( (bool) $instance['show_googleads'], true ); ?> id="<?php echo $this->get_field_id( 'show_googleads' ); ?>" name="<?php echo $this->get_field_name( 'show_googleads' ); ?>" />
	<label for="<?php echo $this->get_field_id( 'show_googleads' ); ?>"><b><?php _e('Display Google Ads', 'google_ads_master'); ?></b></label>
	</p>
	<p>
	<label for="<?php echo $this->get_field_id( 'googleads_code' ); ?>"><?php _e('insert Google Ad Code:', 'google_ads_master'); ?></label></br>
	<textarea cols="35" rows="5" id="<?php echo $this->get_field_id( 'googleads_code' ); ?>" name="<?php echo $this->get_field_name( 'googleads_code' ); ?>" ><?php echo stripslashes ($instance['googleads_code']); ?></textarea>
	</p>
	<div class="description">Copy and Paste your google ad script code from Google AdSense website.</div>
	<br>
<div style="background: url(<?php echo plugins_url('../images/techgasp-hr.png', __FILE__); ?>) repeat-x; height: 10px"></div>
	<p>
	<img src="<?php echo plugins_url('../images/techgasp-minilogo-16.png', __FILE__); ?>" style="float:left; width:16px; vertical-align:middle;" />
	&nbsp;
	<b>Shortcode Framework</b>
	</p>
	<div class="description">The shortcode framework allows you to insert Google Ads inside Pages & Posts without the need of extra plugins or gimmicks. Fast page load times and top SEO. Only available in advanced version.</div>
	<br>
<div style="background: url(<?php echo plugins_url('../images/techgasp-hr.png', __FILE__); ?>) repeat-x; height: 10px"></div>
	<p>
	<img src="<?php echo plugins_url('../images/techgasp-minilogo-16.png', __FILE__); ?>" style="float:left; width:16px; vertical-align:middle;" />
	&nbsp;
	<b>Google Ads Master Website</b>
	</p>
	<p><a class="button-secondary" href="http://wordpress.techgasp.com/google-ads-master/" target="_blank" title="Google Ads Master Info Page">Info Page</a> <a class="button-secondary" href="http://wordpress.techgasp.com/google-ads-master-documentation/" target="_blank" title="Google Ads Master Documentation">Documentation</a> <a class="button-primary" href="http://wordpress.org/plugins/google-ads-master/" target="_blank" title="Google Ads Master Wordpress">RATE US *****</a></p>
<div style="background: url(<?php echo plugins_url('../images/techgasp-hr.png', __FILE__); ?>) repeat-x; height: 10px"></div>
	<p>
	<img src="<?php echo plugins_url('../images/techgasp-minilogo-16.png', __FILE__); ?>" style="float:left; width:16px; vertical-align:middle;" />
	&nbsp;
	<b>Advanced Version Updater:</b>
	</p>
	<div class="description">The advanced version updater allows to automatically update your advanced plugin. Only available in advanced version.</div>
	<br>
	<?php
	}
 }
?>