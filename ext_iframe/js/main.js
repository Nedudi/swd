/* global swd:true */
(function(window) {
  "use strict";

  var app = {};
  app.cursor = {x:0,y:0};

  window.injected_main = function() {
    console.log("injected_main");
    //swd.layout();
    swd.cursorLayer();

    var frame = document.createElement("iframe");
    frame.style.position = "absolute";
    frame.style.width = "100%";
    frame.style.height = "100%";
    frame.style.left = "0px";
    frame.style.top = "0px";
    frame.style.zIndex = 100;
    frame.style.overflow = "hidden";
    frame.style.opacity = "0.5";
    frame.style.pointerEvents = "none";

    //frame.style.display = "none";

    document.body.appendChild(frame);
    frame.contentType = "text/html";
    frame.src = "https://stop-web-disability.org";

    // window.swd.addEventListener("swdCursorPosition", function(data) {
    //   if(data && typeof(data.x) !== "undefined" && typeof(data.y) !== "undefined") {
    //     app.cursor.x = data.x;
    //     app.cursor.y = data.y;
    //   }
    // });



  };
})(window);