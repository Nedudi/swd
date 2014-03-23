<?php
class NY_OG_Admin{

	public function __construct(){
		add_action( 'add_meta_boxes', array($this, 'add_og_custom_box') );
		add_action( 'save_post', array($this, '_save_postdata') );			
	}

	public function add_og_custom_box(){
		add_meta_box(
			'ny_open_graph',
			'Open Graph Data', 
			array($this, 'og_custom_box'),
			'',
			'advanced',
			'default'
		);
	}

	public function og_custom_box( $post ){
		$metatitle = get_post_meta($post->ID, '_og_title', TRUE);
		$metadescription = get_post_meta($post->ID, '_og_description', TRUE);
		$metatype = get_post_meta($post->ID, '_og_type', TRUE);
		?>		
		<table>
			<tr>
				<td>
					<label for="ny_og_title">Facebook snippet preview:</label>
				</td>
				<td>
					<?php echo $this->_fb_snippet() ?>
				</td>
			</tr>
			<tr>
				<td>
					<label for="ny_og_title">Open Graph Title:</label>
				</td>
				<td>
					<input type="text" style="width:510px;" id="ny_og_title" name="ny_og_title" value="<?php if ($metatitle!=FALSE) echo $metatitle; ?>" size="90" />
				</td>
			</tr>
			<tr>
				<td>
					<label for="ny_og_description">Open Graph Description:</label>
				</td>
				<td>
					<textarea rows="3" style="width:510px;" cols="72" id="ny_og_description" name="ny_og_description"><?php if ($metadescription!=FALSE) echo $metadescription; ?></textarea>
				</td> 
			</tr>
			<tr>
				<td>
					<label for="ny_og_type">Open Graph Type(default type: 'article'):</label>
				</td>
				<td>
					<input type="text" style="width:510px;" id="ny_og_type" name="ny_og_type" value="<?php if ($metatype!=FALSE) echo $metatype; ?>" size="70" />
				</td> 
			</tr>
		</table>
	<?php
	}

	public function _save_postdata( $post_id ){
		$title = $_POST['ny_og_title'];
		$description = $_POST['ny_og_description'];
		$type = $_POST['ny_og_type'];

		$allpostmeta=get_post_custom($post_id);
		if (array_key_exists('_og_title', $allpostmeta)){
			update_post_meta($post_id, '_og_title', $title);
		}
		else {
			add_post_meta($post_id, '_og_title', $title, TRUE);
		}
		if (array_key_exists('_og_type', $allpostmeta)){
			update_post_meta($post_id, '_og_type', $type);
		}
		else {
			add_post_meta($post_id, '_og_type', $type, TRUE);
		}
		if (array_key_exists('_og_description', $allpostmeta)){
			update_post_meta($post_id, '_og_description', $description);
		}
		else {
			add_post_meta($post_id, '_og_description', $description, TRUE);
		}
	}

	function _fb_snippet() {
		if (isset($_GET['post'])) {
			$post_id = (int) $_GET['post'];
		}
		
		global $NY_OG_Output;
		$content = '<div id="wp_og_snippet" style="background-color: #fff;border: 2px solid #283e6c;width:488px;padding: 10px;">';
		$content .= '<div style="height: 100px;float: left; margin-right:10px">'.$NY_OG_Output->_add_image(true) . '</div>' ;
		$content .= '<div><span style="color: #333;font-weight: bold;font-size: 14px;">' . $NY_OG_Output->_get_title() . '</span><br />';
		$content .= '<a href="' . get_permalink($post_id) . '" target="_blank" style="font-size: 12px;color: #808080; text-decoration:none;" class="url">' . get_permalink($post_id) . '</a>';
		$content .= '<p class="desc" style="width:420px;margin-top: 5px; font-size: 13px; color: #333;">' . $NY_OG_Output->_get_description() . '</p></div>';
		$content .= '</div>';

		return $content;
	}

}