<?php

// Make sure that we are uninstalling
if ( !defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit();
}

// Removes all Spam Free Wordpress data from the database
delete_option( 'spam_free_wordpress' );
//delete_option( 'sfw_spam_hits' );
delete_option( 'sfw_version' );
delete_option( 'sfw_close_pings_once' );
delete_option( 'sfw_run_once' );
delete_option( 'sfw_stats_reminder' );
delete_option( 'sfwp_july_coupon' );
delete_option( 'sfw_new_install' );
delete_option( 'sfw_new_install2_2' );
delete_option( 'sfw_new_install2_3' );


// Delete postmeta meta_key sfw_comment_form_password database entries, since we don't use them anymore
$sfw_allposts = get_posts( 'numberposts=-1&post_type=post&post_status=any' );

foreach( $sfw_allposts as $sfw_postinfo ) {
	delete_post_meta( $sfw_postinfo->ID, 'sfw_comment_form_password' );
}

// Remove Cron Jobs
$sfw_remove_spam_cron = wp_next_scheduled( 'sfw_clean_spam' );
wp_unschedule_event( $sfw_remove_spam_cron, 'sfw_clean_spam' );
$sfw_remove_trackback_cron = wp_next_scheduled( 'sfw_clean_trackbacks' );
wp_unschedule_event( $sfw_remove_trackback_cron, 'sfw_clean_trackbacks' );
$sfw_remove_unapproved_cron = wp_next_scheduled( 'sfw_clean_unapproved' );
wp_unschedule_event( $sfw_remove_unapproved_cron, 'sfw_clean_unapproved' );

sfw_delete_all_junk();

function sfw_delete_all_junk() {
	global $wpdb;

	$sql =
		"
		DELETE FROM $wpdb->postmeta
		WHERE meta_key
		LIKE %s
		";

	$wpdb->query( $wpdb->prepare( $sql, 'sfw_pwd' ) );
}
