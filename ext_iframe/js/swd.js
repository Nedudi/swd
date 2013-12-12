/* global swd:true */
(function(window) {
  "use strict";

  window.swd = window.swd || {};

  window.swd.addEventListener("swdCursorPosition", function(data) {
    window.swd.ask('swdCursorPosition',data);
  });

  window.swd.addEventListener("swdCursorReset", function(data) {
    window.swd.ask('swdCursorReset',data);
  });

  window.swd.addEventListener("swdCursorStyle", function(data) {
    window.swd.ask('swdCursorStyle',data);
  });

  window.swd.addEventListener("swdAudioClick", function(data) {
     console.log('!!!!!!!!!!!!AAAAAAAA');
     window.swd.ask('swdAudioClick',data);
  });


  // Lesha hello, options change can be detected like this
  swd.on('messageSettingsChanged', function(request){
    console.log('!!!!!!==== messageSettingsChanged ====>>>>',request);
  });


  document.addEventListener('webkitvisibilitychange', function(){
    // if(document.webkitHidden){........
  }, false);


  setTimeout(function(){
    window.swd.newTab();
    window.swd.layout();
    window.swd.keyboard();
    window.swd.cursorLayer();
  },0);

})(window);

