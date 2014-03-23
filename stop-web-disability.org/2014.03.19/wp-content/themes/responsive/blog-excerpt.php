<?php

// Exit if accessed directly
if ( !defined('ABSPATH')) exit;

/**
 * Blog Template
 *
   Template Name: Blog Excerpt (summary)
 *
 * @file           blog-excerpt.php
 * @package        Responsive
 * @author         Emil Uzelac
 * @copyright      2003 - 2012 ThemeID
 * @license        license.txt
 * @version        Release: 1.0
 * @filesource     wp-content/themes/responsive/blog-excerpt.php
 * @link           http://codex.wordpress.org/Templates
 * @since          available since Release 1.0
 */
?>
<?php get_header(); ?>

        <div id="content-blog" class="grid col-620">
<?php
    if ( get_query_var('paged') )
	    $paged = get_query_var('paged');
	elseif ( get_query_var('page') )
	    $paged = get_query_var('page');
	else
		$paged = 1;
		query_posts("post_type=post&paged=$paged");
?>

<?php if (have_posts()) : ?>

		<?php while (have_posts()) : the_post(); ?>

            <div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>



                <div class="post-entry">

                    <a  class="archive-post-title" href="<?php the_permalink() ?>" rel="bookmark" title="<?php printf(__( 'Permanent Link to %s', 'responsive' ), the_title_attribute( 'echo=0' )); ?>"><?php the_title(); ?></a>



                    <?php if ( has_post_thumbnail()) : ?>
                        <a class="post-expert-thumb" href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>" >
                    <?php the_post_thumbnail(); ?>
                        </a>
                    <?php endif; ?>

                    <?php the_excerpt(); ?>
                    <?php wp_link_pages(array('before' => '<div class="pagination">' . __('Pages:', 'responsive'), 'after' => '</div>')); ?>
                </div><!-- end of .post-entry -->

                <div class="post-data">
                    <div  class="post-data-dope">
				       <?php the_tags(__('Tagged with:', 'responsive') . ' ', ', ', '<br />'); ?>
                    </div>

                </div><!-- end of .post-data -->

            <div class="post-edit"><?php edit_post_link(__('Edit', 'responsive')); ?></div>
            </div><!-- end of #post-<?php the_ID(); ?> -->

        <?php endwhile; ?>

        <?php if (  $wp_query->max_num_pages > 1 ) : ?>
        <div class="navigation">
			<div class="previous"><?php next_posts_link( __( '&#8249; Older posts', 'responsive' ) ); ?></div>
            <div class="next"><?php previous_posts_link( __( 'Newer posts &#8250;', 'responsive' ) ); ?></div>
		</div><!-- end of .navigation -->
        <?php endif; ?>

	    <?php else : ?>

        <h1 class="title-404"><?php _e('404 &#8212; Fancy meeting you here!', 'responsive'); ?></h1>
        <p><?php _e('Don&#39;t panic, we&#39;ll get through this together. Let&#39;s explore our options here.', 'responsive'); ?></p>
        <h6><?php _e( 'You can return', 'responsive' ); ?> <a href="<?php echo home_url(); ?>/" title="<?php esc_attr_e( 'Home', 'responsive' ); ?>"><?php _e( '&larr; Home', 'responsive' ); ?></a> <?php _e( 'or search for the page you were looking for', 'responsive' ); ?></h6>
        <?php get_search_form(); ?>

<?php endif; ?>

        </div><!-- end of #content-blog -->

<?php get_sidebar('right'); ?>
<?php get_footer(); ?>
