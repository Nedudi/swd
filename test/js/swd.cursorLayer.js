/* global swd_base64CursorArrow:true, swd_base64CursorWait:true */
(function(window){
  "use strict";
  window.swd = window.swd || {};

  window.swd.cursorLayer = function() {
    var cursor = document.createElement("div");
    cursor.setAttribute("id", "swd-cursor-pointer");

    cursor.style.position = "fixed";
    cursor.style.left = "0";
    cursor.style.top = "0";
    cursor.style.width = "32px";
    cursor.style.height = "32px";
    cursor.style.display = "block";
    cursor.style.zIndex = "999999999999999999999";
    cursor.style.left = (window.innerWidth/2)|0;
    cursor.style.top = (window.innerHeight/2)|0;
    cursor.style.backgroundSize = "100% 100%";
    cursor.style.backgroundPosition = "50% 50%";
    document.body.appendChild(cursor);

    var lastCursorStyle = "";

    function setCursorStyle(data) {
      if(data.style === lastCursorStyle) {
        return;
      }
      if(data.style === "arrow") {
        cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorArrow + ")";
      } else if(data.style === "wait") {
        cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorWait + ")";
      }
    }

    function setCursorPosition(data) {
      if(data.x && data.y) {
        cursor.style.left = (data.x|0) + "px";
        cursor.style.top = (data.y|0) + "px";
      }
    }

    window.swd.addEventListener("swdCursorPosition", function(data) {
      setCursorPosition(data);
    });

    window.swd.addEventListener("swdCursorStyle", function(data) {
      setCursorStyle(data);
    });

    setCursorStyle({"style":"wait"});
  };
})(window);
