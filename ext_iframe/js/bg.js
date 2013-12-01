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

  chrome.tabs.onRemoved.addListener(function(v){
    ex.ask('messageTabsChanged');
    console.log('==>tab removed',v.tabId);
  });

  chrome.tabs.onCreated.addListener(function(v){
    ex.ask('messageTabsChanged');
    console.log('==>tab created',v.tabId);
  });

  chrome.tabs.onUpdated.addListener(function(tabid, changeinfo, tab){
    var url = tab.url;
    if (url !== undefined && changeinfo.status == "complete") {
      ex.ask('messageTabsChanged');
      console.log('==>tab updated',tabid, changeinfo, tab);
    }
  });

  chrome.tabs.onMoved.addListener(function(v){
    ex.ask('messageTabsChanged');
    console.log('==>tab moved',v.tabId);
  });

  chrome.tabs.onActivated.addListener(function(v){
    ex.ask('messageTabActivated',{tabId:v.tabId, windowId:v.windowId});
    console.log('==>tab activated',v.tabId);
  });




  ex.on('messageSetActiveTab', function(request, sender, sendResponse){
    chrome.tabs.update(request.data.tabId, {active: true});
  });

  ex.on('messageGetTabs', function(request, sender, sendResponse){
    chrome.tabs.query({}, function(tabs) {
      sendResponse({data:tabs});
    });
  });

  ex.on('messageGetMyTabId', function(request, sender, sendResponse){
    if(sender && sender.tab && sender.tab.id){
      chrome.tabs.query({}, function(tabs) {
        console.log('messageGetMyTabId',sender.tab.id)
        sendResponse({
          data:{
            tabId: sender.tab.id
          }
        });
      });
    }

  });



  ex.on('messageGetMostVisitedPages', function(request, sender, sendResponse){
    chrome.topSites.get(function(pages) {
      sendResponse({data:pages});
    });
  });






