<?php
// Adds password field to comment form and options to filter HTML from comments
function sfw_comment_form_additions() {
	global $sfw_options;

	// Calls the password form for comments.php if the comment_form function is outputting comment form fields
	add_action('comment_form_after_fields', 'sfw_comment_form_extra_fields', 1);
}

function sfw_comment_pass_exist_check() {
	global $post;

	$new_post_comment_pwd = wp_generate_password( 12, false );
	$sfw_pwd_exists_check = get_post_meta( $post->ID, 'sfw_pwd', true );

	if( empty( $sfw_pwd_exists_check ) || !$sfw_pwd_exists_check  && is_singular() && comments_open() ) {
		update_post_meta( $post->ID, 'sfw_pwd', $new_post_comment_pwd );
	}
}

// Creates a new comment form password each time a comment is saved in the database
function sfw_new_comment_pass() {
	global $post;

	$new_comment_pwd = wp_generate_password( 12, false );
	$old_password = get_post_meta( $post->ID, 'sfw_pwd', true );

	update_post_meta( $post->ID, 'sfw_pwd', $new_comment_pwd, $old_password );
}

// Function for comments.php file
function sfw_comment_form_extra_fields() {
	global $post, $sfw_options;

	$pwd = get_post_meta( $post->ID, 'sfw_pwd', true );

	// If the reader is logged in don't require password for comments.php
	if( !is_user_logged_in() ) {

		echo '<!-- ' . number_format_i18n( get_option( 'sfw_spam_hits' ) );
		_e( ' Spam Comments Blocked so far by ', 'spam-free-wordpress' );
		echo 'Spam Free Wordpress';
		_e( ' version ', 'spam-free-wordpress' );
		echo SFW_VERSION;
		_e( ' located at ', 'spam-free-wordpress' );
		echo "http://www.toddlahman.com/shop/simple-comments/ -->\n";

		if( $sfw_options['legacy_pwd'] == 'on' ) {
		// Reader must enter this password manually on the comment form
		echo "<p><input type='text' value='".$pwd."' onclick='this.select()' size='20' />
		<b>* Copy This Password *</b></p>";
		echo "<p><input type='text' name='passthis' id='passthis' value='' size='20' />
		<b>* Type Or Paste Password Here *</b></p>";
		}
	}

	if( $sfw_options['spam_stats'] == 'on' ) {
		echo '<p>' . number_format_i18n( get_option('sfw_spam_hits' ) );
		_e( ' Spam Comments Blocked so far by ', 'spam-free-wordpress' );
		echo '<a href="http://www.toddlahman.com/shop/simple-comments/" title="Spam Free Wordpress" target="_blank">Spam Free Wordpress</a></p>'."\n";
	}

}

// Function for wp-comments-post.php file located in the root Wordpress directory. The same directory as the wp-config.php file.
function sfw_comment_post_authentication() {
	global $post, $sfw_options;

	$pwd = get_post_meta( $post->ID, 'sfw_pwd', true );

	// If the reader is logged in don't require password for wp-comments-post.php
	if ( !is_user_logged_in() ) {

		// Compares current comment form password with current password for post
		if ( empty( $_POST['passthis'] ) || $_POST['passthis'] != $pwd)
			wp_die( __( 'Click back and type in the correct password. (Spam Free Wordpress)', sfw_spam_counter() ) );

	}
}

// Counts number of comment spam hits and stores in options database table
function sfw_spam_counter() {
	$s_hits = get_option('sfw_spam_hits');
	update_option('sfw_spam_hits', $s_hits+1);
}


// Adds settings link to plugin menu
function sfw_settings_link($links) {
	$links[] = '<a href="'.admin_url('options-general.php?page=sfw_dashboard').'">Settings</a>';
	return $links;
}

/*--------------------------------------------------------------------
* X-Autocomplete Comment Form Fields for Chrome 15 and above
* http://wiki.whatwg.org/wiki/Autocompletetype
* http://googlewebmastercentral.blogspot.com/2012/01/making-form-filling-faster-easier-and.html
---------------------------------------------------------------------*/

function sfw_add_x_autocompletetype( $fields ) {
	$fields['author'] = str_replace( '<input', '<input x-autocompletetype="name-full"', $fields['author'] );
	$fields['email'] = str_replace( '<input', '<input x-autocompletetype="email"', $fields['email'] );
	return $fields;
}

add_filter('comment_form_default_fields','sfw_add_x_autocompletetype');

// Added 1.9 Enqueue style file
function sfw_load_styles() {
	$css = SFW_URL . 'css/sfw-comment-style.css?' . filemtime( SFW_PATH . 'css/sfw-comment-style.css' );

	if ( !is_admin() ) {
		wp_register_style( 'sfw-comment-style', $css, array(), NULL, 'all' );
		wp_enqueue_style( 'sfw-comment-style' );
	}
}

function sfw_welcome() {
	// New install redirect to settings page
	if ( get_option( 'sfw_new_install2_3' ) ) {
		delete_option( 'sfw_new_install2_3' );
		wp_redirect( ( ( is_ssl() || force_ssl_admin() || force_ssl_login() ) ? str_replace( 'http:', 'https:', admin_url( 'options-general.php?page=sfw_dashboard' ) ) : str_replace( 'https:', 'http:', admin_url( 'options-general.php?page=sfw_dashboard' ) ) ) );
		exit;
	}
}


function sfw_coupon() {
	// Special offer
	if ( SFW_COUPON_TIME > time() && ! get_option( 'sfwp_july_coupon' ) ) {
		?>
		<div class="updated">
			<h3><?php _e( 'Simple Comments is the pro version replacement for Spam Free Wordpress.', 'spam-free-wordpress' ); ?></h3>
			<p><?php _e( 'Get bullet proof spam protection, more features, and support with <strong><a href="http://www.toddlahman.com/shop/simple-comments/" target="_blank">Simples Comments</a>.', 'spam-free-wordpress' ); ?></p>
			<p><?php _e( 'Until July 31 get <span style="border-bottom:2px solid red; padding:2px;">20% OFF</span> Simple Comments. Use COUPON CODE <span style="border:2px dashed red; padding:5px;">SFWPJUL</span>. <a href="http://www.toddlahman.com/shop/simple-comments/" target="_blank">Learn more</a>. <p style="text-align:right"><a href="options-general.php?page=sfw_dashboard&notice=1">hide</a></p>', 'spam-free-wordpress' ); ?></p>
		</div>
		<?php
	}
}
