function closeLbox(){window.parent.WysijaPopup.close()}function unset(e){window.parent.removeImage(e)}function insert(e){window.parent.addImage(e),"undefined"!=typeof filesToAdd&&(filesToAdd>1?filesToAdd--:jQuery("#overlay").hide())}function hideShowOverlay(){if(window.parent.ajaxOver)formsubmit||jQuery("#overlay").hide();else if(formsubmit)return jQuery("#wysija-browse-form").submit(),formsubmit=!1,!1}var formsubmit=!1;jQuery(function(e){e(".wysija-thumb").click(function(){return e(this).hasClass("selected")?(e(this).removeClass("selected"),unset("wp-"+e(this).find("span.identifier").html())):(e(this).addClass("selected"),insert({identifier:"wp-"+e(this).find("span.identifier").html(),width:e(this).find("span.width").html(),height:e(this).find("span.height").html(),url:e(this).find("span.url").html(),thumb_url:e(this).find("span.thumb_url").html()})),!0}),e("#wysija-close, #close-pop-alt").click(function(){return closeLbox(),!1}),e(".del-attachment").click(function(i){return i.stopPropagation(),confirm(wysijatrans.deleteimg)&&(e("#wysija-browse-form").append('<input type="hidden" name="subaction" value="delete" /><input type="hidden" name="imgid" value="'+parseInt(e(this).html())+'" />'),formsubmit=!0,unset("wp-"+e(this).html()),jQuery("#overlay").show(),window.parent.ajaxOver=!1,hideShowOverlay()),!1})});