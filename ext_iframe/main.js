/* global swd:true */
(function(window) {
  "use strict";

  var app = {};
  app.cursor = {x:0,y:0};

  window.injected_main = function() {
    console.log("injected_main");
    swd.cursorLayer();

    var frame = document.createElement("iframe");
    frame.style.position = "absolute";
    frame.style.width = "100px";
    frame.style.height = "100px";
    frame.style.left = "0px";
    frame.style.top = "0px";
    frame.style.zIndex = 100;
    document.body.appendChild(frame);
    frame.src = "http://bytiger.webdoc.com/swd/ext_iframe/cc.html";

    var $body = $('body');
    $body.ui();

//    audioclick();

    window.swd.addEventListener("swdCursorPosition", function(data) {
      if(data && typeof(data.x) !== "undefined" && typeof(data.y) !== "undefined") {
        app.cursor.x = data.x;
        app.cursor.y = data.y;
      }
    });

    $body.on("audioclick",function(){
      app.clickOnItem(app.cursor.x,app.cursor.y);
    });

    app.clickOnItem = function(x,y){
      var o = document.createEvent('MouseEvents');
      var element = null;

      if(x && y){
        element = document.elementFromPoint(x,y);
      }

      if(element){
        o.initMouseEvent('click', true, true, window, 1, 100, 100, 100, 100, false, false, false, false, 0, null);
        if(o){
          element.dispatchEvent(o);
        }
      }
    };
  };
})(window);