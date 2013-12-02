/* global swd_base64CursorArrow:true, swd_base64CursorWait:true, swd:true */
(function(window){
  "use strict";

  window.swd.keyboard = function() {

    var that = {};
    that.view = {};
    that.view.container = $('<aside>',{'class':'swd_keyboard_panel swd_aside'}).appendTo('body');
    that.view.keyboard = $('<div>',{'class':'swd_keyboard',id:'swd_keyboard'}).appendTo(that.view.container);
    that.view.hideKeyboard1 = $('<a>',{'class':'swd_hide_keyboard swd_hide_keyboard1 icon-arrow-down3'}).appendTo(that.view.container);
    that.view.hideKeyboard2 = $('<a>',{'class':'swd_hide_keyboard swd_hide_keyboard2 icon-arrow-down3'}).appendTo(that.view.container);


    that.view.hideKeyboard1.add(that.view.hideKeyboard2).on('click', function(){
      that.view.container.removeClass('swd_keyboard_panel_show');
    });

    document.getElementsByTagName('body')[0].addEventListener('focus', function(e){
      that.view.container.addClass('swd_keyboard_panel_show');
      if(e.target.nodeName.toLowerCase() === 'input' || e.target.nodeName.toLowerCase() === 'textarea'){
        VirtualKeyboard.attachInput(e.target);
        VirtualKeyboard.show('text','swd_keyboard');
      }
    }, true);
  };
})(window);
