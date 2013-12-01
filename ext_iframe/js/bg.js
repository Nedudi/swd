  var ex = {};

  ex.on = function(command, callback){
    if(!ex.callStack) ex.callStack = {};
    if(!ex.callStack[command]) ex.callStack[command] = [];
    ex.callStack[command].push(callback);
  };

  ex.trigger = function(command, request, sender, sendResponse){
    if(ex.callStack && ex.callStack[command]){
      for(var i=0; i<ex.callStack[command].length;i++){
        ex.callStack[command][i](request, sender, sendResponse)
      }
    }
  };

  ex.ask = function(command, data, callback){
    // ASK ALL TABS
    chrome.tabs.query({}, function(tabs) {
      var message = {cmd:command, data:data}
      for (var i=0; i<tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, message);
      }
    });
  };

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    ex.trigger(request.cmd, request, sender, sendResponse);
    return true; // fucking important true
  });

  chrome.tabs.onRemoved.addListener(function(){
    ex.ask('messageTabsChanged');
  });

  chrome.tabs.onCreated.addListener(function(){
    ex.ask('messageTabsChanged');
  });

  chrome.tabs.onUpdated.addListener(function(){
    ex.ask('messageTabsChanged');
  });

  chrome.tabs.onMoved.addListener(function(){
    ex.ask('messageTabsChanged');
  });

  chrome.tabs.onActivated.addListener(function(v){
    ex.ask('messageTabActivated',{tabId:v.tabId, windowId:v.windowId});
  });




  ex.on('messageSetActiveTab', function(request, sender, sendResponse){
    chrome.tabs.update(request.data.tabId, {active: true});
  });

  ex.on('messageGetTabs', function(request, sender, sendResponse){
    chrome.tabs.query({}, function(tabs) {
      sendResponse({data:tabs});
    });
  });

  ex.on('messageGetMostVisitedPages', function(request, sender, sendResponse){
    chrome.topSites.get(function(pages) {
      sendResponse({data:pages});
    });
  });





