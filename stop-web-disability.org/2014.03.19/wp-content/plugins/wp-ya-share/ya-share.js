function yashare_js_default_options() {
	document.getElementById("ya_share_to_default").value= "1";
	document.getElementById("ya_share_form").submit();
}

function yashare_list_none(key) {
	jQuery("[name='ya_share["+key+"][]']").not("#"+key+"_none").removeAttr("checked");
}