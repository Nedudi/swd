var $ = jQuery.noConflict();

$(document).ready(function() {
	$('<a class="viewsource_btn fright" href="#">View Source</a>').appendTo('.codedemo').click(function() {
		var ds = $('<div class="doctype"></div>').text($('.codedemo #doctype_source').val());
		var hs = $('<div class="head"></div>').text($('.codedemo #head_source').val());
		var bs = $('<div class="body"></div>').text($('.codedemo #body_source').val());
		var close_btn = $('<p class="close">Close X</p>').click(function() {
			$('div.viewsource').remove();
		});
		
		$('<div class="viewsource"></div>')
			.appendTo('body')
			.append(close_btn)
			.append('<h1>DOCTYPE</h1>')
			.append(ds)
			.append('<h1>&lt;head&gt; contents</h1>')
			.append(hs)
			.append('<h1>&lt;body&gt; contents</h1>')
			.append(bs);
	});
});