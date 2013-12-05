/* global swd:true */
(function(window) {
  "use strict";

  window.swd = window.swd || {};



  // window.swd.addEventListener("swdCursorPosition", function(data) {
  //   //setCursorPosition(data);
  // });



  window.swd.addEventListener("swdCursorPosition", function(data) {
    //console.log('====',data)
    window.swd.ask('swdCursorPosition',data);
  });

  window.swd.addEventListener("swdCursorStyle", function(data) {
    window.swd.ask('swdCursorStyle',data);
  });

  window.swd.addEventListener("swdAudioClick", function(data) {
     window.swd.ask('swdAudioClick',data);
  });

  // window.swd.on('swdCursorPosition', function(data){
  //   console.log('==>swdCursorPosition',data)
  // });

  // function addJsFileToHead(data) {
  //   var script = document.createElement("script");
  //   script.setAttribute("type", "text/javascript");
  //   script.innerHTML = data;
  //   document.getElementsByTagName("head")[0].appendChild(script);
  // }

  // $.get(chrome.extension.getURL('js/main.js'),
  //   function(data) {
  //     addJsFileToHead(data);
  //     document.getElementsByTagName("body")[0].setAttribute("onLoad", "injected_main();");
  //   }
  // );




  // Lesha hello, options change can be detected like this
    swd.on('messageSettingsChanged', function(request){
      console.log('!!!!!!==== messageSettingsChanged ====>>>>',request);
    });



  document.addEventListener('webkitvisibilitychange', function(){
    // if(document.webkitHidden){
    //   console.log('disable srv frame')
    //   window.swd.sendMessage("disable");
    // } else {
    //   console.log('enable srv frame')
    //   window.swd.sendMessage("enable");
    // }
  }, false);


  setTimeout(function(){
    window.swd.newTab();
    window.swd.layout();
    window.swd.keyboard();
    window.swd.cursorLayer();
  },0)

})(window);

