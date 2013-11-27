  var sendMessageToAllTabs = function(message){
    chrome.tabs.query({}, function(tabs) {
      console.log(message,tabs);
      for (var i=0; i<tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, message);
        console.log(tabs[i].id);
      }
    });
  };


  chrome.tabs.onRemoved.addListener(function(){
    sendMessageToAllTabs({cmd:'tabsChanged'});
  });

  chrome.tabs.onCreated.addListener(function(){
    sendMessageToAllTabs({cmd:'tabsChanged'});
  });

  chrome.tabs.onUpdated.addListener(function(){
    sendMessageToAllTabs({cmd:'tabsChanged'});
  });

  chrome.tabs.onMoved.addListener(function(){
    sendMessageToAllTabs({cmd:'tabsChanged'});
  });

  chrome.tabs.onActivated.addListener(function(v){
    sendMessageToAllTabs({cmd:'tabActivated',tabId:v.tabId, windowId:v.windowId});
  });



  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
      if (request.cmd == "getTabs"){
        chrome.tabs.query({}, function(tabs) {
          sendResponse({data: tabs});
        });
      }

      if(request.cmd == 'setActiveTab'){
        chrome.tabs.update(request.data.tabId, {active: true});
      }

      return true;
    }
  );




