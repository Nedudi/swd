<?php 
/**
Plugin name: WP Open Graph
Plugin URI: http://wordpress.org/plugins/wp-open-graph/
Description: WP Open Graph allows custom input open graph meta data to any content type. (Or use data from All-In-One-Seo-Pack or Wordpress-Seo-By-Yoast)
Version: 1.5
Author: Nick Yurov
Author URI: http://nickyurov.com
*/
//Main Admin Setting
require_once 'main.admin.class.php';
NY_OG_Main_Admin::init();
//Taxonomy Admin Setting
//require_once 'taxonomy.admin.class.php';
//NY_OG_Taxonomy_Admin::init();
//Print og data
require_once 'output.class.php';
global $NY_OG_Output;
$NY_OG_Output = new NY_OG_Output();
//Admin 
require_once 'admin.class.php';
$NY_OG_Admin = new NY_OG_Admin();