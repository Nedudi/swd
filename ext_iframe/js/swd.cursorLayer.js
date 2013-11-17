/* global swd_base64CursorArrow:true, swd_base64CursorWait:true */
(function(window){
  "use strict";
  window.swd = window.swd || {};

  window.swd.cursorLayer = function() {
    var cursor = document.createElement("div");
    cursor.setAttribute("id", "swd-cursor-pointer");
    console.log(window.innerWidth, window.innerHeight);

    cursor.style.position = "fixed";
    cursor.style.left = "0";
    cursor.style.top = "0";
    cursor.style.width = "32px";
    cursor.style.height = "32px";
    cursor.style.display = "block";
    cursor.style.zIndex = "999999999999999999999";
    cursor.style.left = ((window.innerWidth/2)|0) + "px";
    cursor.style.top = ((window.innerHeight/2)|0) + "px";
    cursor.style.backgroundSize = "100% 100%";
    cursor.style.backgroundPosition = "50% 50%";
    cursor.style.pointerEvents = "none";
    document.body.appendChild(cursor);

    var lastCursorStyle = "";
    var moveSpeed = 20000;
    var currentHoverElement = false;

    // window.addEventListener('mouseout', function(e){
    //   console.log(1)
    //   e.target.style.background = "blue";
    // }, false);

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

        var x = window.innerWidth/2 - 100 + ((data.x - 0.5) * moveSpeed);
        var y = window.innerHeight/2 - 100 + ((data.y - 0.5) * moveSpeed);// * (window.innerHeight/window.innerWidth); //window.innerWidth

        cursor.style.left = x + "px";
        cursor.style.top = y + "px";


      var o = document.createEvent('MouseEvents');
      var element = null;

        if(x && y){
          element = document.elementFromPoint(x+100,y+100);
        }

        if(element){
          if(currentHoverElement){
            if((currentHoverElement.dataset.swdoutline+'').length > 4){
              currentHoverElement.style.boxShadow = currentHoverElement.dataset.swdoutline;
            } else {
              currentHoverElement.style.boxShadow = "0 0 0 0 transparent";
            }
          }

          if((element.nodeName.toLowerCase() === 'a' || element.nodeName.toLowerCase() === 'input')){
            element.dataset.swdoutline = window.getComputedStyle(element,null).getPropertyValue("boxShadow");
            element.style.boxShadow = "0 0 0 2px rgb(14, 145, 195) inset";
          }




          currentHoverElement = element;

          o.initMouseEvent('mouseover', true, true, window, 1, 100, 100, 100, 100, false, false, false, false, 0, null);
          if(o){
             element.dispatchEvent(o);
          }
        }



 // if( document.createEvent ) {
 //            var evObj = document.createEvent('MouseEvents');
 //            evObj.initEvent( 'mouseover', true, false );
 //            elem.dispatchEvent(evObj);
 //        } else if( document.createEventObject ) {
 //            elem.fireEvent('onmouseover');
 //        }






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
