<?php
/*
* Generates the comment header and comment form
*/

class SFWform {

    public function sfw_comment_form_header() {
		global $comment;

		// Comment form header start
		if ( post_password_required() ) {
			?>
			<p class="sfw-no-password">This post is password protected. Enter the password to view comments.</p>
			<?php
			return;
		}

		// if comments are open
		if ( have_comments() ) {
			?>
			<h2 id="sfw-comments-title">
			<?php
				printf( _n( 'One comment on &ldquo;%2$s&rdquo;', '%1$s comments on &ldquo;%2$s&rdquo;', get_comments_number() ),
				number_format_i18n( get_comments_number() ), '<span>' . get_the_title() . '</span>' );
			?>
			</h2>
			<?php

			// Generates the list of comments
			?>
			<ol class="sfw-commentlist">
			<?php
				wp_list_comments( array( 'callback' => array( $this, 'SFWlist_comments' ) ) );
			?>
			</ol>
			<?php

			// if comments are paginated (broken into pages) provides link to next and previous page
			if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) { // are there comments to navigate through
				?>
				<div id="sfw-comment-nav-above">
					<div class="sfw-nav-previous">
					<?php
						previous_comments_link( '&larr; Older Comments' );
					?>
					</div>
					<div class="sfw-nav-next">
					<?php
						next_comments_link( 'Newer Comments &rarr;' );
					?>
					</div>
				</div>
				<?php
			}
		} elseif ( ! comments_open() && ! is_page() && post_type_supports( get_post_type(), 'comments' ) ) {

			?>
			<p class="sfw-nocomments">Comments are closed.</p>
			<?php
		} // Comment form header end

		// Call the comment form template
		$this->sfw_comment_form();
	}

	// callback function for wp_list_comments
	public function SFWlist_comments( $comment, $args, $depth ) {

		$GLOBALS['comment'] = $comment;

		switch ( $comment->comment_type ) :
			case 'pingback' :
			case 'trackback' :
		?>
				<li class="post sfw-pingback">
					<p>Pingback: <?php comment_author_link(); ?><?php edit_comment_link( 'Edit', '<span class="sfw-edit-link"> ', '</span>' ); ?></p>
		<?php
			break;
			default :
		?>

		<li <?php comment_class( 'sfw-comment' ); ?> id="li-comment-<?php comment_ID(); ?>">
				<div id="comment-<?php comment_ID(); ?>" class="sfw-comment">
					<div class="sfw-comment-meta">
						<div class="sfw-comment-author vcard">
							<?php
								$avatar_size = 68;
								if ( '0' != $comment->comment_parent )
									$avatar_size = 39;

								echo get_avatar( $comment, $avatar_size );

								/* translators: 1: comment author, 2: date and time */
								printf( __( '%1$s on %2$s <span class="says">said:</span>' ),
									sprintf( '<span class="sfw-fn">%s</span>', get_comment_author_link() ),
									sprintf( '<a href="%1$s"><time pubdate datetime="%2$s">%3$s</time></a>',
										esc_url( get_comment_link( $comment->comment_ID ) ),
										get_comment_time( 'c' ),
										/* translators: 1: date, 2: time */
										sprintf( '%1$s at %2$s', get_comment_date(), get_comment_time() )
									)
								);
							?>

							<?php edit_comment_link( 'Edit', '<span class="sfw-edit-link">', '</span>' ); ?>
						</div><!-- .comment-author .vcard -->

						<?php if ( $comment->comment_approved == '0' ) { ?>
							<em class="sfw-comment-awaiting-moderation">Your comment is awaiting moderation.</em>
							<br />
						<?php } ?>

					</div>

					<div class="sfw-comment-content"><?php comment_text(); ?></div>

					<div class="sfw-reply">
						<?php comment_reply_link( array_merge( $args, array( 'respond_id' => 'sfw-respond', 'reply_text' => 'Reply <span>&darr;</span>', 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
					</div><!-- .reply -->
				</div><!-- #comment-## -->
		<?php // Note the lack of a trailing </li>. WordPress will add it itself once it's done listing any children and whatnot.
			break;
			endswitch;

	}

	// Comment form template
	public function sfw_comment_form( $args = array(), $post_id = null ) {
		global $id;

		if ( null === $post_id )
			$post_id = $id;
		else
			$id = $post_id;

		$commenter = wp_get_current_commenter();
		$user = wp_get_current_user();
		$user_identity = ! empty( $user->ID ) ? $user->display_name : '';

		$req = get_option( 'require_name_email' );
		$aria_req = ( $req ? " aria-required='true'" : '' );
		$req_field = ( $req ? ' required' : '' );
		$fields =  array(
			'author' => '<p class="sfw-comment-form-author">' . '<label for="author">' . __( 'Name' ) . '</label> ' . ( $req ? '<span class="sfw-required">*</span>' : '' ) .
						'<input id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . $req_field . ' /></p>',
			'email'  => '<p class="sfw-comment-form-email"><label for="email">' . __( 'Email' ) . '</label> ' . ( $req ? '<span class="sfw-required">*</span>' : '' ) .
						'<input id="email" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) . '" size="30"' . $aria_req . $req_field . ' /></p>',
			'url'    => '<p class="sfw-comment-form-url"><label for="url">' . __( 'Website' ) . '</label>' .
						'<input id="url" name="url" type="text" value="' . esc_attr( $commenter['comment_author_url'] ) . '" size="30" /></p>',
		);

		$required_text = sprintf( ' ' . __('Required fields are marked %s'), '<span class="sfw-required">*</span>' );
		$defaults = array(
			'fields'               => apply_filters( 'comment_form_default_fields', $fields ),
			'comment_field'        => '<p class="sfw-comment-form-comment"><label for="comment">' . _x( 'Comment', 'noun' ) . '</label><textarea id="comment" name="comment" cols="45" rows="8" aria-required="true" required></textarea></p>',
			'must_log_in'          => '<p class="sfw-must-log-in">' .  sprintf( __( 'You must be <a href="%s">logged in</a> to post a comment.' ), wp_login_url( apply_filters( 'the_permalink', get_permalink( $post_id ) ) ) ) . '</p>',
			'logged_in_as'         => '<p class="sfw-logged-in-as">' . sprintf( __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out of this account">Log out?</a>' ), admin_url( 'profile.php' ), $user_identity, wp_logout_url( apply_filters( 'the_permalink', get_permalink( $post_id ) ) ) ) . '</p>',
			'comment_notes_before' => '<p class="sfw-comment-notes">' . __( 'Your email address will not be published.' ) . ( $req ? $required_text : '' ) . '</p>',
			'comment_notes_after'  => '<p class="sfw-form-allowed-tags">' . sprintf( __( 'You may use these <abbr title="HyperText Markup Language">HTML</abbr> tags and attributes: %s' ), ' <code>' . allowed_tags() . '</code>' ) . '</p>',
			'id_form'              => 'commentform',
			'id_submit'            => 'submit',
			'title_reply'          => __( 'Leave a Reply' ),
			'title_reply_to'       => __( 'Leave a Reply to %s' ),
			'cancel_reply_link'    => __( 'Cancel reply' ),
			'label_submit'         => __( 'Post Comment' ),
		);

		$args = wp_parse_args( $args, apply_filters( 'comment_form_defaults', $defaults ) );

		?>
			<?php if ( comments_open() ) : ?>
				<?php do_action( 'comment_form_before' ); ?>
				<div id="sfw-respond">
					<h3 id="sfw-reply-title"><?php comment_form_title( $args['title_reply'], $args['title_reply_to'] ); ?> <small><?php cancel_comment_reply_link( $args['cancel_reply_link'] ); ?></small></h3>
					<?php if ( get_option( 'comment_registration' ) && !is_user_logged_in() ) : ?>
						<?php echo $args['must_log_in']; ?>
						<?php do_action( 'comment_form_must_log_in_after' ); ?>
					<?php else : ?>
						<form action="<?php echo site_url( '/wp-comments-post.php' ); ?>" method="post" id="<?php echo esc_attr( $args['id_form'] ); ?>">
							<?php do_action( 'comment_form_top' ); ?>
							<?php if ( is_user_logged_in() ) : ?>
								<?php echo apply_filters( 'comment_form_logged_in', $args['logged_in_as'], $commenter, $user_identity ); ?>
								<?php do_action( 'comment_form_logged_in_after', $commenter, $user_identity ); ?>
							<?php else : ?>
								<?php echo $args['comment_notes_before']; ?>
								<?php
								do_action( 'comment_form_before_fields' );
								foreach ( (array) $args['fields'] as $name => $field ) {
									echo apply_filters( "comment_form_field_{$name}", $field ) . "\n";
								}
								do_action( 'comment_form_after_fields' );
								?>
							<?php endif; ?>
							<?php echo apply_filters( 'comment_form_field_comment', $args['comment_field'] ); ?>
							<?php echo $args['comment_notes_after']; ?>
							<p class="sfw-form-submit">
								<input name="submit" type="submit" id="<?php echo esc_attr( $args['id_submit'] ); ?>" value="<?php echo esc_attr( $args['label_submit'] ); ?>" />
								<?php comment_id_fields( $post_id ); ?>
							</p>
							<?php do_action( 'comment_form', $post_id ); ?>
						</form>
					<?php endif; ?>
				</div><!-- #respond -->
				<?php do_action( 'comment_form_after' ); ?>
			<?php else : ?>
				<?php do_action( 'comment_form_comments_closed' ); ?>
			<?php endif; ?>
		<?php
	}
}

$sfwform = new SFWform();
