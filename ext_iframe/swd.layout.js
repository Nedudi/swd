/* global swd_base64CursorArrow:true, swd_base64CursorWait:true */
(function(window){
  "use strict";
  window.swd = window.swd || {};

  window.swd.layout = function() {
    var html = document.getElementsByTagName('html')[0];
    var body = document.getElementsByTagName('body')[0];
    html.classList.add('swd');
    // html.style.width = "calc(100% - 100px)";
    //body.style['-webkit-transform'] = 'translateY(10px)';
    window.dispatchEvent(new Event('resize'));

    var createBlock = function(options){
      var block = document.createElement(options.tagName);
      options.classList.map(function(v,i){
        block.classList.add(v);
      });
      if(options.type && options.type == 'vertical'){
        block.style.height = document.documentElement.clientHeight+'px';
      }
      if(options.type && options.type == 'horizontal'){
        block.style.width = document.documentElement.clientWidth+'px';
      }
      body.appendChild(block);
      return block;
    };


    createBlock({
      type:'horizontal',
      tagName: 'aside',
      classList: ['swd_top','swd_aside']
    });

    createBlock({
      type:'vertical',
      tagName: 'aside',
       classList: ['swd_left','swd_aside']
    });

    createBlock({
      type:'vertical',
      tagName: 'aside',
      classList: ['swd_right','swd_aside']
    });


    //alert(1)
    // var cursor = document.createElement("div");
    // cursor.setAttribute("id", "swd-cursor-pointer");
    // console.log(window.innerWidth, window.innerHeight);

    // cursor.style.position = "fixed";
    // cursor.style.left = "0";
    // cursor.style.top = "0";
    // cursor.style.width = "32px";
    // cursor.style.height = "32px";
    // cursor.style.display = "block";
    // cursor.style.zIndex = "999999999999999999999";
    // cursor.style.left = ((window.innerWidth/2)|0) + "px";
    // cursor.style.top = ((window.innerHeight/2)|0) + "px";
    // cursor.style.backgroundSize = "100% 100%";
    // cursor.style.backgroundPosition = "50% 50%";
    // cursor.style.pointerEvents = "none";
    // document.body.appendChild(cursor);

    // var lastCursorStyle = "";

    // function setCursorStyle(data) {
    //   if(data.style === lastCursorStyle) {
    //     return;
    //   }
    //   if(data.style === "arrow") {
    //     cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorArrow + ")";
    //   } else if(data.style === "wait") {
    //     cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorWait + ")";
    //   }
    // }

    // function setCursorPosition(data) {
    //   if(data.x && data.y) {
    //     cursor.style.left = (data.x|0) + "px";
    //     cursor.style.top = (data.y|0) + "px";
    //   }
    // }

    // window.swd.addEventListener("swdCursorPosition", function(data) {
    //   setCursorPosition(data);
    // });

    // window.swd.addEventListener("swdCursorStyle", function(data) {
    //   setCursorStyle(data);
    // });

    // setCursorStyle({"style":"wait"});
  };
})(window);
