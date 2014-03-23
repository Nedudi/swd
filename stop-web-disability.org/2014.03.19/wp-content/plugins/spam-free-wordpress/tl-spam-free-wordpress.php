<?php
/*
Plugin Name: Spam Free Wordpress
Plugin URI: http://www.toddlahman.com/shop/simple-comments/
Description: Comment spam blocking plugin that blocks automated spam with zero false positives.
Version: 2.2.3
Author: Todd Lahman, LLC
Author URI: http://www.toddlahman.com/
License: GPLv3

	Intellectual Property rights reserved by Todd Lahman, LLC as allowed by law incude,
	but are not limited to, the working concept, function, and behavior of this plugin,
	the logical code structure and expression as written. All WordPress functions, objects, and
	related items, remain the property of WordPress under GPLv2 (or later), and any WordPress core
	functions and objects in this plugin operate under the GPLv2 (or later) license.
*/


if ( !defined('SFW_VERSION') )
	define( 'SFW_VERSION', '2.2.3' );
if ( !defined('SFW_WP_REQUIRED') )
	define( 'SFW_WP_REQUIRED', '3.1' );
if (!defined('SFW_WP_REQUIRED_MSG'))
	define( 'SFW_WP_REQUIRED_MSG', 'Spam Free Wordpress' . __( ' requires at least WordPress 3.1. Sorry! Click back button to continue.', 'spam-free-wordpress' ) );
if (!defined('SFW_URL') )
	define( 'SFW_URL', plugin_dir_url(__FILE__) );
if (!defined('SFW_PATH') )
	define( 'SFW_PATH', plugin_dir_path(__FILE__) );
if (!defined('SFW_BASENAME') )
	define( 'SFW_BASENAME', plugin_basename( __FILE__ ) );
if(!defined( 'SFW_IS_ADMIN' ) )
    define( 'SFW_IS_ADMIN',  is_admin() );
if(!defined( 'SFW_HOME_URL' ) )
    define( 'SFW_HOME_URL',  'http://www.toddlahman.com/shop/simple-comments/' );
if(!defined( 'SFW_COUPON_TIME' ) )
    define( 'SFW_COUPON_TIME',  1375315199 ); // July 31, 2013

// Ready for translation
load_plugin_textdomain( 'spam-free-wordpress', false, dirname( plugin_basename( __FILE__ ) ) . '/translations' );

require_once( SFW_PATH . 'includes/db.php' );
require_once( SFW_PATH . 'includes/functions.php' );
require_once( SFW_PATH . 'includes/class-comment-form.php' );
require_once( SFW_PATH . 'includes/legacy.php' );

if ( SFW_IS_ADMIN ) {
	require_once( SFW_PATH . 'admin/class-menu.php' );
}

// Update version
if ( !get_option('sfw_version') ) {
	update_option( 'sfw_version', SFW_VERSION );
}

if ( get_option('sfw_version') && version_compare( get_option('sfw_version'), SFW_VERSION, '<' ) ) {
	update_option( 'sfw_version', SFW_VERSION );
}

/**
 * Set the default settings if not already set
 * Changed default database key
 * @since 2.2.1
 */
if( !get_option( 'spam_free_wp' ) ) {
	sfw_default();
	update_option( 'sfw_new_install2_3', true );
}

// Runs add_default_data function above when plugin activated
register_activation_hook( __FILE__, 'sfw_default' );

if( get_option('spam_free_wp') ) {
	$sfw_options = get_option('spam_free_wp');
}

/**
 * Remove old default settings before 2.0
 * @since 2.2.1
 */
if( get_option( 'spam_free_wordpress' ) ) {
	delete_option( 'spam_free_wordpress' );
}

// settings action link
add_filter('plugin_action_links_'.plugin_basename(__FILE__), 'sfw_settings_link', 10, 1);
// "network_admin_plugin_action_links_{$plugin_file}"

// plugin row links
add_filter('plugin_row_meta', 'sfw_donate_link', 10, 2);

function sfw_donate_link($links, $file) {
	if ($file == plugin_basename(__FILE__)) {
		$links[] = '<a href="'.admin_url('options-general.php?page=sfw_dashboard').'">'.__('Settings', 'spam-free-wordpress').'</a>';
		$links[] = '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SFVH6PCCC6TLG">'.__('Donate', 'spam-free-wordpress').'</a>';
	}
	return $links;
}


/*-----------------------------------------------------------------------------------------------------------------------
* Before the comment form can be automatically generated, make sure JetPack Comments module is not active
-------------------------------------------------------------------------------------------------------------------------*/
// Added 1.7.3
if ( class_exists( 'Jetpack' ) ) {
	if ( in_array( 'comments', Jetpack::get_active_modules() ) ) {
		Jetpack::deactivate_module( 'comments' );
	}
}

// automatically generate comment form - fixed in 1.7.8.1
function sfw_comment_form_init() {
	return dirname(__FILE__) . '/comments.php';
}

/*
 * Added 1.9
* Loads default comment list and comment form style for themes that do not use
* the comment_form function. Works with themes that do as well.
*/
if ( $sfw_options['comment_form'] == 'on' ) {
	add_action('wp_enqueue_scripts', 'sfw_load_styles');
	add_filter( 'comments_template', 'sfw_comment_form_init' );
}

// Calls the comment security, messages, and features
add_action('after_setup_theme', 'sfw_comment_form_additions', 1);

// Calls the wp-comments-post.php authentication
add_action('pre_comment_on_post', 'sfw_comment_post_authentication', 1);

// Checks that the comment form password exists on single page load
add_action('loop_start', 'sfw_comment_pass_exist_check', 1);

// Call the function to change password in custom fields when after each new comment is saved in the database.
add_action('comment_post', 'sfw_new_comment_pass', 1);

// For testing only
function sfw_delete() {
	global $wpdb;

	delete_option( 'spam_free_wordpress' );
	delete_option( 'spam_free_wp' );
	delete_option( 'sfw_close_pings_once' );
	delete_option( 'sfwp_july_coupon' );
	delete_option( 'sfw_new_install' );
	delete_option( 'sfw_new_install2_3' );

	// Remove Cron Jobs
	$sfw_remove_spam_cron = wp_next_scheduled( 'sfw_clean_spam' );
	wp_unschedule_event( $sfw_remove_spam_cron, 'sfw_clean_spam' );
	$sfw_remove_trackback_cron = wp_next_scheduled( 'sfw_clean_trackbacks' );
	wp_unschedule_event( $sfw_remove_trackback_cron, 'sfw_clean_trackbacks' );
	$sfw_remove_unapproved_cron = wp_next_scheduled( 'sfw_clean_unapproved' );
	wp_unschedule_event( $sfw_remove_unapproved_cron, 'sfw_clean_unapproved' );

	$sql =
		"
		DELETE FROM $wpdb->postmeta
		WHERE meta_key
		LIKE %s
		";

	$wpdb->query( $wpdb->prepare( $sql, 'sfw_pwd' ) );
}

register_deactivation_hook( __FILE__, 'sfw_delete' );

add_action( 'admin_init', 'sfw_welcome' );

if ( isset( $_GET['page'] ) == 'sfw_dashboard' ) {
	add_action( 'admin_notices', 'sfw_coupon' );
}
