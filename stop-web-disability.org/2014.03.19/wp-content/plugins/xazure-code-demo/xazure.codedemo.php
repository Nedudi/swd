<?php
/*
Plugin Name: Xazure Code Demo
Plugin URI: http://xazure.net/
Description: Allows you to create example pages with code which you can easily share without having to upload anything.
Version: 0.9
Author: Christian Snodgrass
Author URI: http://xazure.net
License: GPLv2
*/
class Xazure_CodeDemo {
	const PLUGIN_ID = 'xazure_codedemo';
	const CODEDEMO_TYPE = 'xazure_codedemo';
	
	const META_NAME = 'xa_codedemo_meta';
	const META_DOCTYPE = 'doctype';
	const META_HEAD = 'head_content';
	const META_BODY = 'body_content';
	
	public function __construct() {
		register_activation_hook(__FILE__, array($this, 'activate'));
		register_deactivation_hook(__FILE__, array($this, 'deactivate'));
		register_uninstall_hook(__FILE__, array($this, 'uninstall'));
		
		$actions = array(
			'init' =>				array($this, 'init'),
			'add_meta_boxes' =>		array($this, 'addMetaBoxes'),
			'edit_post' =>			array(array($this, 'editPost'), 1, 1)
		);
		
		$filters = array(
			'template_include' =>	array($this, 'templateInclude')
		);
		
		foreach($actions as $action => $values)
			if(is_array($values[0]))
				call_user_func_array('add_action', array_merge((array)$action, $values));
			else
				add_action($action, $values);
				
		foreach($filters as $filter => $values)
			if(is_array($values[0]))
				call_user_func_array('add_filter', array_merge((array)$filter, $values));
			else
				add_action($filter, $values);
	}
	
	//===================================
	// Actions
	//===================================
	public function activate() {
		global $wp_rewrite;
		
		$demo_structure = '/demo/%codedemo%';
		$wp_rewrite->add_rewrite_tag("%codedemo%", '([^/]+)', self::CODEDEMO_TYPE . "=");
		$wp_rewrite->add_permastruct(self::CODEDEMO_TYPE, $demo_structure, false);
		
		$wp_rewrite->flush_rules();
	}
	
	public function deactivate() {
		global $wp_rewrite;
		
		$wp_rewrite->flush_rules();
	}
	
	public function uninstall() {
		global $wp_rewrite;
		
		$wp_rewrite->flush_rules();
	}
	
	public function init() {		
		$this->registerCodeDemo();
	}
	
	public function addMetaBoxes() {
		add_meta_box(self::PLUGIN_ID . '_box', 'Xazure Code Demo', array($this, 'addDemoBox'), self::CODEDEMO_TYPE);
	}
	
	public function editPost($post_id) {
		$post = get_post($post_id);
		
		if($post->post_type != self::CODEDEMO_TYPE)
			return;
		
		if(empty($_POST) || !wp_verify_nonce($_POST[self::PLUGIN_ID], plugin_basename( __FILE__ ))) {
			echo 'Unable to verify nonce.';
			exit();
		}
		
		if($_POST['post_type'] != self::CODEDEMO_TYPE)
			return;
	
		update_post_meta($post_id, self::META_NAME, $_POST[self::META_NAME]);
	}
	
	//===================================
	// Filters
	//===================================
	public function templateInclude($template) {
		if(get_query_var('post_type') == self::CODEDEMO_TYPE) {
			if(file_exists(TEMPLATEDIR . '/codedemo.php'))
				return TEMPLATEDIR . '/codedemo.php';
			return dirname(__FILE__) . '/xazure.codedemo.template.php';
		}
		return $template;
	}
	
	//===================================
	// Protected Methods
	//===================================
	protected function registerCodeDemo() {
		register_post_type(self::CODEDEMO_TYPE, array(
			'labels' => array(
					'name' => _x('Xazure Code Demos', 'post type general name'),
					'singular_name' => _x('Xazure Code Demo', 'post type singular name'),
					'add_new' => _x('Add New', 'codedemo'),
					'add_new_item' => __('Add New Code Demo'),
					'edit_item' => __('Edit Code Demo'),
					'new_item' => __('New Code Demo'),
					'view_item' => __('View Code Demo'),
					'search_items' => __('Search Code Demos'),
					'not_found' =>  __('No code demos found'),
					'not_found_in_trash' => __('No code demos found in Trash'), 
					'parent_item_colon' => '',
					'menu_name' => 'Code Demos'
				),
			'public' => true,
			'publicly_queryable' => true,
			'show_ui' => true, 
			'show_in_menu' => true, 
			'query_var' => true,
			'rewrite' => array('in_front' => false, 'slug' => 'demo'),
			'capability_type' => 'post',
			'has_archive' => true, 
			'hierarchical' => false,
			'menu_position' => null,
			'supports' => array('title')
		));
	}
	
	public function addDemoBox() {
		global $post;
		
		$meta = get_post_meta($post->ID, self::META_NAME, true);
		$doctypes = array();
		$doctypes['HTML 4.01 Strict'] = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
		$doctypes['HTML 4.01 Transitional'] = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
		$doctypes['HTML 4.01 Frameset'] = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">';
		$doctypes['XHTML 1.0 Strict'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
		$doctypes['XHTML 1.0 Transitional'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		$doctypes['XHTML 1.0 Frameset'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">';
		$doctypes['XHTML 1.1'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
		$doctypes['XHTML 1.1 Basic'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">';
		$doctypes['HTML 5'] = '<!DOCTYPE html>';
		$doctypes['MathML 2.0'] = '<!DOCTYPE math PUBLIC "-//W3C//DTD MathML 2.0//EN" "http://www.w3.org/TR/MathML2/dtd/mathml2.dtd">';
		$doctypes['MathML 1.01'] = '<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">';
		$doctypes['XHTML + MathML + SVG'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">';
		$doctypes['XHTML + MathML + SVG Profile (XHTML as the host language)'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">';
		$doctypes['XHTML + MathML + SVG Profile (Using SVG as the host)'] = '<!DOCTYPE svg:svg PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">';
		$doctypes['SVG 1.1 Full'] = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
		$doctypes['SVG 1.0'] = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">';
		$doctypes['SVG 1.1 Basic'] = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Basic//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd">';
		$doctypes['SVG 1.1 Tiny'] = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">';
		$doctypes['HTML 2.0'] = '<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">';
		$doctypes['HTML 3.2'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">';
		$doctypes['XHTML Basic 1.0'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.0//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd">';
		
		wp_nonce_field(plugin_basename( __FILE__ ), self::PLUGIN_ID);
?>
		<lable for="<?php echo self::PLUGIN_ID . '_' . self::META_DOCTYPE ?>">DOCTYPE</label>
		<select name="<?php echo self::META_NAME . '[' . self::META_DOCTYPE . ']' ?>" id="<?php echo self::PLUGIN_ID . '_' . self::META_DOCTYPE ?>"><?php
			foreach($doctypes as $label => $doctype) : ?>
			<option value="<?php echo htmlentities($doctype)?>"<?php echo $doctype == $meta[self::META_DOCTYPE] ? ' selected' : '' ?>><?php echo $label ?></option>
			<?php endforeach;
		?></select><br /><br />
		<label for="<?php echo self::PLUGIN_ID . '_' . self::META_HEAD ?>">&lt;head&gt; Content</label>
		<textarea class="numbered" style="width: 100%; display: block" name="<?php echo self::META_NAME . '[' . self::META_HEAD . ']' ?>" id="<?php echo self::PLUGIN_ID . '_' . self::META_HEAD ?>" rows="8" cols="40"><?php
			echo $meta[self::META_HEAD];
		?></textarea>
		<br /><br />
		<label for="<?php echo self::PLUGIN_ID . '_' . self::META_BODY ?>">&lt;body&gt; Content</label>
		<textarea class="numbered" style="width: 100%; display: block" name="<?php echo self::META_NAME . '[' . self::META_BODY . ']' ?>" id="<?php echo self::PLUGIN_ID . '_' . self::META_BODY ?>" rows="20" cols="40"><?php
			echo $meta[self::META_BODY];
		?></textarea>
<?php
	}
	
	
	//=================================
	// Public Methods
	//=================================
	public function GetMeta($post_id = false, $name = '') {
		if(!$post_id) {
			global $post;
			$post_id = $post->ID;
		}
			
		$meta = get_post_meta($post_id, self::META_NAME, true);

		if(empty($name))
			return $meta;
		return $meta[$name];
	}
}

function xacd_get_the_doctype($post_id = false) { 
	global $xa_codedemo;
	
	return $xa_codedemo->GetMeta($post_id, Xazure_CodeDemo::META_DOCTYPE);
}

function xacd_get_the_head($post_id = false) {
	global $xa_codedemo;
	
	return $xa_codedemo->GetMeta($post_id, Xazure_CodeDemo::META_HEAD);
}

function xacd_get_the_body($post_id = false) {
	global $xa_codedemo;
	
	return $xa_codedemo->GetMeta($post_id, Xazure_CodeDemo::META_BODY);
}

function xacd_the_doctype($post_id = false) { 
	global $xa_codedemo;
	
	echo $xa_codedemo->GetMeta($post_id, Xazure_CodeDemo::META_DOCTYPE);
}

function xacd_the_head($post_id = false) {
	global $xa_codedemo;
	
	echo $xa_codedemo->GetMeta($post_id, Xazure_CodeDemo::META_HEAD);
}

function xacd_the_body($post_id = false) {
	global $xa_codedemo;
	
	echo $xa_codedemo->GetMeta($post_id, Xazure_CodeDemo::META_BODY);
}

$xa_codedemo = new Xazure_CodeDemo();