<?php
/*
Plugin Name: WP Ya.Share
Version: 1.5
Description: Adds the Yandex 'Share in social networks' block into posts or widget to simplify saving URLs of your blog pages into social networks.
Requires at least: 2.8.6
Tested up to: 3.8.1
Plugin URI: http://andrey.eto-ya.com/wordpress/my-plugins/wp-ya-share
Author: Andrey K.
Author URI: http://andrey.eto-ya.com/
Stable tag: 1.5
License: GPL2
*/

/*
		Copyright 2011 - 2014 Andrey K. (URL: http://andrey.eto-ya.com/, email: andrey271@bigmir.net)

		This program is free software; you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation; either version 2 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program; if not, write to the Free Software
		Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/

load_plugin_textdomain('ya_share', false, basename(dirname(__FILE__)). '/lang' );

function ya_share_admin_init() {
	register_setting('ya-share-settings', 'ya_share', 'ya_share_sanitize');
}

add_action('admin_init', 'ya_share_admin_init');

function ya_share_sanitize($arr) {

	if ( !empty($arr['to_default']) ) {
		$arr= array();
	}

	$ya_share_default= array(
		'where' => 'content',
		'list' =>  array('vkontakte', 'lj', 'facebook', 'twitter', 'odnoklassniki', 'gplus', 'yaru'),
		'popup_list' => array('blogger', 'digg', 'evernote', 'delicious', 'diary', 'friendfeed',
		'juick', 'liveinternet', 'linkedin', 'moikrug', 'moimir', 'myspace', 'tutby', 'yazakladki', 'surfingbird',),
		'type' => 'button',
		'align' => 'left',
		'lang' => 'default',
		'in_post' => 'after',
		'txt'=> '',
		'popup_txt' => '',
		'copy_paste' => 'No',
		'theme' => 'default',
	);

	$ya_share_allowed= array(
		'where' => array('content', 'multiple', 'widget', 'selectively'),
		'type'  => array('button', 'icon', 'link', 'none'),
		'align' => array('left', 'right', 'center'),
		'lang' => array('default', 'ru', 'en', 'be', 'kk', 'tt', 'uk'),
		'in_post' => array('before', 'after'),
		'copy_paste' => array('No', 'Yes'),
		'theme' => array('default', 'dark', 'counter'),
	);

	$all_services= array('none', 'blogger', 'digg', 'evernote', 'delicious', 'diary', 'facebook', 'friendfeed', 'gplus',
			'juick', 'liveinternet', 'linkedin', 'lj',	'moikrug', 'moimir', 'myspace', 'odnoklassniki', 'twitter', 'tutby',
			'vkontakte', 'yaru', 'yazakladki', 'surfingbird',);

	foreach( array_keys($ya_share_allowed) as $key ) {
		if ( empty($arr[$key]) || !in_array($arr[$key], $ya_share_allowed[$key]) ) {
			$new_ya_share[$key] = $ya_share_default[$key];
		}
		else {
			$new_ya_share[$key]= $arr[$key];
		}
	}

	foreach( array("list","popup_list" ) as $key ) {
		if ( empty($arr[$key]) ) {
			$new_ya_share[$key]= $ya_share_default[$key];
		}
		else {
			$new_ya_share[$key]= array_intersect((array)$arr[$key], $all_services);
		}
		if ( in_array('none', $new_ya_share[$key]) ) {
			$new_ya_share[$key] = array('none');
		}
	}

	$new_ya_share['txt']= empty($arr['txt'])? '' : htmlspecialchars(trim($arr['txt'], ENT_QUOTES));
	$new_ya_share['popup_txt'] =  empty($arr['popup_txt'])? '' : htmlspecialchars(trim($arr['popup_txt'], ENT_QUOTES));

	return $new_ya_share;
}

function ya_share_out() {
	static $div;
	if ( !isset($div) ) {
		$div = 0;
	}
	$ya_share= ya_share_sanitize(get_option('ya_share'));

	$link= (in_array($ya_share['where'], array('multiple', 'selectively'))?('link: "'
		. get_permalink(). '", title: "' . get_the_title() . '",') : '');
	$ya_share_div= '<!--WP Ya.share--><div class="wp_ya_share" style="text-align:' . $ya_share['align']. ';">
	<div id="yashare' . (++$div) . '"></div>
	<script type="text/javascript">
		<!--
		Ya.share({
			element: "yashare' . $div. '",
				' . $link. '
				l10n: "' . $ya_share['lang']. '",
				theme: "' . $ya_share['theme']. '",
				elementStyle: {
						type: "' . $ya_share['type']. '", '
						. ( $ya_share['txt'] ?  'text: "' . $ya_share['txt'] . '",' : '')
						. ' quickServices: [\'' . implode("', '", $ya_share['list']) . '\']
				},
				popupStyle: {' . (('Yes'==$ya_share['copy_paste'])?'copyPasteField:true,':'') . '
					blocks: {\'' . $ya_share['popup_txt'] . '\': [\'' . implode("', '", $ya_share['popup_list']). '\']}
				}
								});
		//-->
	</script></div><!--/WP Ya.share-->';
	return $ya_share_div;
}

function ya_share_scripts() {
	wp_enqueue_script('ya-share', '//yandex.st/share/share.js');
}

add_action('wp_enqueue_scripts', 'ya_share_scripts');

function ya_share_post($str) {
	$ya_share= get_option('ya_share');
	if ( !isset($ya_share['where']) ) {
		 $ya_share['where']= 'content';
	}
	if ( 'selectively' == $ya_share['where'] ) {
		return str_replace('[ya_share]', ya_share_out(), $str);
	}
	elseif ( is_feed() || 'widget' == $ya_share['where'] || $ya_share['where'] != 'multiple' && !is_single() && !is_page() ) {
		return $str;
	}
	if ( !isset($ya_share['in_post']) ) {
		 $ya_share['in_post']= 'after';
	}
	if ( 'before' == $ya_share['in_post'] ) {
		return ya_share_out() . $str;
	}
	else {
		return $str . ya_share_out();
	}
}

add_filter('the_content', 'ya_share_post');

function ya_share_options() {
	$ya_share= ya_share_sanitize(get_option('ya_share'));
?>
<div class="wrap">
<div id="icon-options-general" class="icon32"><br /></div>
<h2><?php _e('Ya.Share Plugin Options', 'ya_share'); ?></h2>
<form method="post" action="options.php" name="ya_share_form" id="ya_share_form">
<?php settings_fields( 'ya-share-settings' ); ?>
<table class="form-table">
<tr>
<th><?php _e('Locate ya.share block', 'ya_share'); ?></th>
<td>
<p><input type="radio" value="content" name="ya_share[where]" <?php if ( 'content' == $ya_share['where'] ) echo 'checked="checked"'; ?> /> <?php _e('add into posts content', 'ya_share'); ?></p>
<p><input type="radio" value="multiple" name="ya_share[where]" <?php if ( 'multiple' == $ya_share['where'] ) echo 'checked="checked"'; ?> /> <?php _e('also in any post on archive/category pages', 'ya_share'); ?></p>
<p><input type="radio" value="selectively" name="ya_share[where]" <?php if ( 'selectively' == $ya_share['where'] ) echo 'checked="checked"'; ?> /> <?php _e('selectively, via <code>[ya_share]</code> shortcode', 'ya_share'); ?></p>
<p><input type="radio" value="widget" name="ya_share[where]" <?php if ( 'widget' == $ya_share['where'] ) echo 'checked="checked"'; ?> /> <?php _e('create a widget', 'ya_share'); ?></p>
</td>
</tr>

<tr>
<th><?php _e('Quick buttons of social networks to be in Ya.share block', 'ya_share'); ?></th>
<td><?php
$services= array (
	'none'=> __('none', 'ya_share'),
	'blogger' => 'Blogger', 'digg' => 'Digg', 'evernote' => 'Evernote', 'delicious' => 'Delicious', 'diary' => 'Diary',
	'facebook' => 'Facebook', 'friendfeed' => 'FriendFeed', 'gplus' => 'Google+', 'juick' => 'Juick',
	'liveinternet' => 'LiveInternet', 'linkedin' => 'LinkedIn', 'lj' => 'LiveJournal',	'moikrug' => 'MoiKrug',
	'moimir' => 'MoiMir', 'myspace' => 'MySpace', 'odnoklassniki' => 'Odnoklassniki', 'twitter' => 'Twitter',
	'tutby' => 'Tutby', 'vkontakte' => 'VKontakte', 'yaru' => 'Yaru', 'yazakladki' => 'YandexZakladki',
  'surfingbird' => 'Surfingbird',
);

foreach ( $services as $item => $title ) {
	echo '<input type="checkbox" ' .('none'==$item?'id="list_none" onclick="yashare_list_none(\'list\')"':''). ' name="ya_share[list][]" value="' . $item. '" ' . ( in_array($item, $ya_share['list'])? 'checked="checked" ':'' ) . '/>' . $title. ' &nbsp; ';
} ?>
<br /><small><?php _e("Default: vkontakte, lj, facebook, twitter, odnoklassniki, gplus, yaru. Check &quot;none&quot; for no quick buttons.", 'ya_share');
?></small></td>
</tr>

<tr>
<th><?php _e('Pop-up list of services', 'ya_share'); ?></th>
<td><?php
foreach ( $services as $item => $title ) {
	echo '<input type="checkbox" ' . ('none' == $item ?
		'id="popup_list_none" onclick="yashare_list_none(\'popup_list\')"' : '')
		. ' name="ya_share[popup_list][]" value="' . $item . '" '
		. ( in_array($item, $ya_share['popup_list'])? 'checked="checked" ' : '' )
		. '/>' . $title. ' &nbsp; ';
} ?>
</td>
</tr>

<tr>
<th><?php _e('Pop-up control type', 'ya_share'); ?></th>
<td><?php
foreach ( array('button', 'icon', 'link', 'none') as $item ) {
	echo '<input type="radio" name="ya_share[type]" value="' . $item. '" '
		. (( $item == $ya_share['type'] ) ? 'checked="checked" ' : '') . '/>'
		. __($item, 'ya_share'). ' &nbsp; ';
} ?></td>
</tr>

<tr>
<th><?php _e('Alignment', 'ya_share'); ?></th>
<td><?php
foreach ( array('left', 'right', 'center') as $item ) {
	echo '<input type="radio" name="ya_share[align]" value="' . $item
		. '" ' . (( $item == $ya_share['align'] )?'checked="checked" ':'')
		. '/>' . __($item, 'ya_share'). ' &nbsp; ';
} ?></td>
</tr>

<tr>
<th><?php _e('Before or after content', 'ya_share'); ?></th>
<td><?php
foreach ( array('before', 'after') as $item ) {
	echo '<input type="radio" name="ya_share[in_post]" value="' . $item. '" '
	. (( $item == $ya_share['in_post'] )?'checked="checked" ':'') . '/>'
	. __($item, 'ya_share'). ' &nbsp; ';
} ?></td>
</tr>

<tr>
<th><?php _e('Force Language', 'ya_share'); ?></th>
<td><?php

$langs= array ( 'default'=> __('default', 'ya_share'), 'ru' => 'Russian', 'uk' => 'Ukrainian', 'kk' => 'Kazakh', 'tt' => 'Tatar', 'be' => 'Byelorussian', 'en' => 'English' );

foreach ( $langs as $item => $title ) {
	echo '<input type="radio" name="ya_share[lang]" value="' . $item. '" '
		. (( $item == $ya_share['lang'] )?'checked="checked" ':'') . '/>' . $title. ' &nbsp; ';
} ?></td>
</tr>

<tr>
<th><?php _e('Theme', 'ya_share'); ?></th>
<td><?php
$themes = array ('default' => __('default', 'ya_share'), 'dark' => __('dark', 'ya_share'), 'counter' => __('counter', 'ya_share'));

foreach ( $themes as $item => $title ) {
	echo '<input type="radio" name="ya_share[theme]" value="' . $item . '" '
		. (( $item == $ya_share['theme'] ) ? 'checked="checked" ' : '') . '/>' . $title . ' &nbsp; ';
} ?></td>
</tr>

<tr>
<th><?php _e('Custom button/link text', 'ya_share'); ?></th>
<td><?php echo '<input type="text" name="ya_share[txt]" value="' . $ya_share['txt']. '" />'; ?></td>
</tr>

<tr>
<th><?php _e('Pop-up сustom title', 'ya_share'); ?></th>
<td><?php echo '<input type="text" name="ya_share[popup_txt]" value="' . $ya_share['popup_txt']. '" />';

$sample_popup_txt= array('en'=> 'Share with friends', 'ru'=> 'Поделитесь с друзьями', 'be'=> 'Падзяліцца з сябрамi',
	'kk'=> 'Достарымен бөлісу', 'tt'=> 'Дусларгыз белән бүлешегез', 'uk'=> 'Поділитися з друзями', );

echo ' &nbsp; ' .__('sample:', 'ya_share'). '<span class="description">' . ' ' . (array_key_exists($ya_share['lang'], $sample_popup_txt)? $sample_popup_txt[$ya_share['lang']] : $sample_popup_txt['en']). '</span>';
?>

</td>
</tr>

<tr>
<th><?php _e('Show copy-paste field in popup block?', 'ya_share'); ?></th>
<td><?php
foreach ( array('No', 'Yes') as $item ) {
	echo '<input type="radio" name="ya_share[copy_paste]" value="' . $item. '" ' . (( $item == $ya_share['copy_paste'] )?'checked="checked" ' : '') . '/>' . __($item). ' &nbsp; ';
} ?></td>
</tr>

</table>

<p style="margin-top:20px"> <input type="hidden" name="ya_share[to_default]" id="ya_share_to_default" value="" />
	<input type="submit" class="button-primary" value="<?php _e('Save Changes', 'ya_share'); ?>" />
	<input type="button" class="button-secondary" value="<?php _e('Default Options', 'ya_share'); ?>" onclick="yashare_js_default_options()" /></p>
</form>

<p>&nbsp;<br /><small><?php _e("<a href=\"http://andrey.eto-ya.com/wordpress/my-plugins/wp-ya-share\">The author</a> has no any relation to Yandex. The plugin simplifies the usage in wordpress the <a href=\"http://api.yandex.ru/share/\">Ya.Share API</a> (&quot;Share in social networks&quot;).", 'ya_share'); ?></small></p>

<?php
}

function ya_share_admin_menu() {
	add_options_page( __('Ya.Share Options', 'ya_share'), 'Ya.Share', 'manage_options', 'ya-share-settings', $func = 'ya_share_options' );
}

add_action('admin_menu', 'ya_share_admin_menu');


class WP_Widget_YaShare extends WP_Widget {

	function WP_Widget_YaShare() {
		$widget_ops = array('classname' => 'widget_ya_share', 'description' => __('Send current blog page to social networks') );
		$control_ops = array('width' => 250, 'height' => 250);
		$this->WP_Widget('ya_share', 'Ya.Share', $widget_ops, $control_ops);
	}

	function widget( $args, $instance ) {
		extract($args);
		$title = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title']);
		echo $before_widget;
		echo empty($title) ? '' : $before_title . $title . $after_title;
		echo ya_share_out();
		echo $after_widget;
	}

	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		return $instance;
	}

	function form( $instance ) {
		$instance = wp_parse_args( (array) $instance, array( 'title' => __('Send To', 'ya_share') ) );
		$title = strip_tags($instance['title']);
?>
		<p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>" /></p>
<?php
	}
}

function widget_ya_share_init() {
	$ya_share= get_option('ya_share');
	if ( 'widget' == $ya_share['where'] ) {
		register_widget('WP_Widget_YaShare');
	}
}

add_action('widgets_init', 'widget_ya_share_init');

add_action('admin_enqueue_scripts', 'ya_share_admin_scripts');

function ya_share_admin_scripts($hook) {
	if ('settings_page_ya-share-settings' == $hook) {
		wp_register_script('wp-ya-share', plugins_url('wp-ya-share/ya-share.js'), array(), null, true);
		wp_enqueue_style('wp-ya-share', plugins_url('wp-ya-share/ya-share.css'), array(), null);
	}
}
