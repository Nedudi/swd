/* global swd:true */
(function(window) {
  "use strict";

  window.swd = window.swd || {};

  window.swd.on = function(command, callback){
    if(!swd.callStack) swd.callStack = {};
    if(!swd.callStack[command]) swd.callStack[command] = [];
    swd.callStack[command].push(callback);
  };

  window.swd.trigger = function(command, request, sender, sendResponse){
    if(swd.callStack && swd.callStack[command]){
      for(var i=0; i<swd.callStack[command].length;i++){
        swd.callStack[command][i](request, sender, sendResponse)
      }
    }
  };

  window.swd.ask = function(command, data, callback){
    chrome.runtime.sendMessage({cmd:command, data:data}, function(response) {
      callback(response);
    });
  };

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    swd.trigger(request.cmd, request, sender, sendResponse);
    window.swd.sendMessage(request.cmd, request, sender, sendResponse); // send message to iframe
    return true; // important true!!!
  });

  function addJsFileToHead(data) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = data;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  $.get(chrome.extension.getURL('js/main.js'),
    function(data) {
      addJsFileToHead(data);
      document.getElementsByTagName("body")[0].setAttribute("onLoad", "injected_main();");
    }
  );




  // Lesha hello, options change can be detected like this
    swd.on('messageSettingsChanged', function(request){
      console.log('!!!!!!==== messageSettingsChanged ====>>>>',request);
    });






  setTimeout(function(){
    window.swd.newTab();
    window.swd.layout();
    window.swd.cursorLayer();
  },0)

})(window);

