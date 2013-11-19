/* global swd_base64CursorArrow:true, swd_base64CursorWait:true */
(function(window){
  "use strict";
  window.swd = window.swd || {};



  window.swd.cursorLayer = function() {
    console.log('-- CURSOR LAYER INITED');
    var fifoX = [];
    var fifoY = [];
    var fifoSize = 10;
    var moveSpeed = 20000;
    var cursor = document.createElement("div");
    cursor.setAttribute("id", "swd-cursor");
    cursor.setAttribute("class", "swd-cursor");
    //console.log(window.innerWidth, window.innerHeight);

    cursor.style.left = ((window.innerWidth/2)|0) + "px";
    cursor.style.top = ((window.innerHeight/2)|0) + "px";

    document.body.appendChild(cursor);

    var lastCursorStyle = "";

    swd.currentHoverElement = false;

    function setCursorStyle(data) {
      if(data.style === lastCursorStyle) {
        return;
      }
      if(data.style === "arrow") {
        cursor.classList.add('icon-pointer');
        //cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorArrow + ")";
      } else if(data.style === "wait") {
        //cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorWait + ")";
      }
    }

    function setCursorPosition(data) {
      if(data.x && data.y) {

        var x = window.innerWidth/2  - 100 + ((data.x - 0.5) * moveSpeed);
        var y = window.innerHeight/2 - 100 + ((data.y - 0.5) * moveSpeed);// * (window.innerHeight/window.innerWidth); //window.innerWidth

        fifoX.push(x);
        fifoY.push(y);

        var sumX = 0;
        var sumY = 0;

        for (var i = 0; i < fifoX.length; i++) {
          sumX+=fifoX[i];
          sumY+=fifoY[i];
        }

        x = sumX/fifoX.length;
        y = sumY/fifoY.length;

        if(fifoX.length >= fifoSize || fifoY.length >= fifoSize ){
          fifoX.splice(0,1);
          fifoY.splice(0,1);
        }

        var xs = x + document.body.scrollLeft;
        var ys = y + document.body.scrollTop;

        cursor.style.left = xs + "px";
        cursor.style.top = ys + "px";


        var o = document.createEvent('MouseEvents');
        var element = null;

        if(x && y){
          element = document.elementFromPoint(x+100,y+100);
        }

        if(element){
          if(swd.currentHoverElement){
            if((swd.currentHoverElement.dataset.swdoutline+'').length > 4){
              swd.currentHoverElement.style.boxShadow = swd.currentHoverElement.dataset.swdoutline;
            } else {
              swd.currentHoverElement.style.boxShadow = "0 0 0 0 transparent";
            }
          }

          if((element.nodeName.toLowerCase() === 'a' || element.nodeName.toLowerCase() === 'input')){
            element.dataset.swdoutline = window.getComputedStyle(element,null).getPropertyValue("boxShadow");
            element.style.boxShadow = "0 0 0 2px rgb(14, 145, 195) inset";
          }

          swd.currentHoverElement = element;

          o.initMouseEvent('mouseover', true, true, window, 1, 100, 100, 100, 100, false, false, false, false, 0, null);
          if(o){
             element.dispatchEvent(o);
          }
        }
      }
    }


    function clickOnItem() {
      var o = document.createEvent('MouseEvents');
      // var element = null;

      // if(x && y){
      //   element = document.elementFromPoint(x,y);
      // }

      if(swd.currentHoverElement){
        o.initMouseEvent('click', true, true, window, 1, 100, 100, 100, 100, false, false, false, false, 0, null);
        if(o){
          swd.currentHoverElement.dispatchEvent(o);
        }
      }
    };

    window.swd.addEventListener("swdCursorPosition", function(data) {
      setCursorPosition(data);
    });

    window.swd.addEventListener("swdCursorStyle", function(data) {
      setCursorStyle(data);
    });

    window.swd.addEventListener("swdAudioClick", function(data) {
      console.log('CLICK',swd.currentHoverElement)
      clickOnItem();
    });


    setCursorStyle({"style":"wait"});
  };
  window.swd.cursorLayer();
})(window);
