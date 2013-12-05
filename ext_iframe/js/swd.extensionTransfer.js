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
    //window.swd.sendMessage(request.cmd, request, sender, sendResponse); // send message to iframe
    return true; // important true!!!
  });

})(window);