/* global swd_base64CursorArrow:true, swd_base64CursorWait:true, swd:true */
(function(window){
  "use strict";

  window.swd.cursorLayer = function() {
    console.log('-- CURSOR LAYER INITED');
    var fifoX = [];
    var fifoY = [];
    var fifoSize = 10;
    var moveSpeed = 20000;
    var cursor = document.createElement("div");
    cursor.setAttribute("id", "swd-cursor");
    cursor.setAttribute("class", "swd-cursor");

    cursor.style.left = ((window.innerWidth/2)|0) + "px";
    cursor.style.top = ((window.innerHeight/2)|0) + "px";

    var highlight = document.createElement("div");
    highlight.setAttribute("id", "swd-highlight");
    highlight.setAttribute("class", "swd-highlight");

    if(document.body) {
      document.body.appendChild(highlight);
      document.body.appendChild(cursor);
    } else {
      window.addEventListener("load", function() {
        document.body.appendChild(highlight);
        document.body.appendChild(cursor);
      });
    }

    var lastCursorStyle = "";

    swd.currentHoverElement = false;

    function setCursorStyle(data) {
      if(data.style === lastCursorStyle) {
        return;
      }
      cursor.classList.add('icon-pointer');
      if(data.style === "arrow") {

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

        var xs = x; //+ document.body.scrollLeft;
        var ys = y; //+ document.body.scrollTop;

        cursor.style.left = xs + "px";
        cursor.style.top = ys + "px";


        var o = document.createEvent('MouseEvents');
        var element = null;

        if(x && y){
          element = document.elementFromPoint(x/*+100*/,y/*+100*/);
        }

        if(element){


          var hElement = false;
          var clickableMatches = ['a','button','input','textarea'];

          if(isNodeName(element,clickableMatches)){
            hElement = element;
          } else if(element.parentNode && isNodeName(element.parentNode,clickableMatches)){
            hElement = element.parentNode;
          } else if(element.parentNode.parentNode && isNodeName(element.parentNode.parentNode,clickableMatches)){
            hElement = element.parentNode.parentNode;
          } else if(element.parentNode.parentNode.parentNode && isNodeName(element.parentNode.parentNode.parentNode,clickableMatches)){
            hElement = element.parentNode.parentNode.parentNode;
          }

          if(!hElement){
            return;
          }

          if(swd.currentHoverElement !== hElement) {
            var rect = hElement.getBoundingClientRect();
            highlight.style.display = 'block';
            highlight.style.height  = rect.height +20+'px';
            highlight.style.width   = rect.width  +20+'px';
            highlight.style.top     = rect.top    -10+'px';
            highlight.style.left    = rect.left   -10+'px';
            swd.currentHoverElement = hElement;
            console.log('CURRENT HOVER ELEMENT CHANGED = ',swd.currentHoverElement);
          }

          // o.initMouseEvent('mouseover', true, true, window, 1, 100, 100, 100, 100, false, false, false, false, 0, null);
          // if(o){
          //    element.dispatchEvent(o);
          // }
        }
      }
    }

    function clickOnItem() {
      if(swd.currentHoverElement){
        if(isNodeName(swd.currentHoverElement, ['input','textarea'])) {
          swd.currentHoverElement.focus();
        } else {
          var o = document.createEvent('MouseEvents');
          o.initMouseEvent('click', true, true, window, 1, 100, 100, 100, 100, false, false, false, false, 0, null);
          if(o){
            swd.currentHoverElement.dispatchEvent(o);
          }
        }
      }
    }

    function isNodeName(element,names){
      if(!names.length) names = [names];
      var nodeName = element.nodeName.toLowerCase();
      var isName = false;
      names.map(function(v,i){
        if(v.toLowerCase() === nodeName){
          isName = true;
        }
      });
      return isName;
    }

    window.swd.on("swdCursorPosition", function(request) {
      //console.log('!!!!!!!!!!!!!!!swdCursorPosition',data)
      setCursorPosition(request.data);
    });

     window.swd.on("swdCursorStyle", function(request) {
      setCursorStyle(request.data);
    });

     window.swd.on("swdAudioClick", function(request) {
      clickOnItem();
    });


    setCursorStyle({"style":"wait"});
  };
})(window);
