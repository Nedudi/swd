var ex = {};
ex.options = {
  url: "https://stop-web-disability.org/1.0.1"
  //url: "http://bytiger.webdoc.com/swd/srv_iframe/cam.html"
};

ex.status = {
  isSrvTabAlreadyCreated: false
};

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


/*****************************************************************************/

ex.activateTab = function(id){
  chrome.tabs.update(id, {active: true}, function(tab){
    chrome.windows.update(tab.windowId, {focused: true}, function(win){
      console.log('set active tab manualy',tab,win);
    })
  });
};

ex.getSrvTabId = function(callback){
  chrome.tabs.query({},function(tabs){
    for(var t=0; t<tabs.length; t++){
      if(tabs[t].url.indexOf(ex.options.url) !== -1){
        callback(tabs[t].id);
        return;
      }
    }
    callback(false);
    return false;
  });
}

ex.reloadAllTabs = function(){
  chrome.tabs.query({},function(tabs){
    for(var t=0; t<tabs.length; t++){
      if(tabs[t].url.indexOf(ex.options.url) === -1 && tabs[t].url.indexOf('chrome://') === -1 && tabs[t].url.indexOf('chrome-devtools://') === -1){
        console.log('-=-=-=-=-=url',tabs[t].url)
        chrome.tabs.reload(tabs[t].id);
      }
    }
  });
}

ex.recreateSrvTab = function(){
  console.log('== creating SRV FRAME ...');
  ex.getSrvTabId(function(id){
    if(id){
      chrome.tabs.remove(id, function(){});
    }
    ex.reloadAllTabs();
    chrome.windows.getLastFocused({}, function(win){
      var lastFocusedWinId = win.id;
      chrome.windows.create({
        focused: false,
        type: "popup",
        url:ex.options.url
      }, function(settingsWindow){
        chrome.windows.update(lastFocusedWinId,{focused:true});
      });
    });
  });
};

chrome.windows.onCreated.addListener(function(win){
  //console.log('===========!!!!!!!!!!!!!!!!!!!!!!!!!!!!',win)
});

chrome.windows.onFocusChanged.addListener(function(win){
  ex.ask('swdWindowFocusChanged',win);
  console.log('===========!!!!!!!!!!!!!!!!!!!!!!!!!!!!',win)
});
/*****************************************************************************/



ex.on('swdCursorPosition', function(data){
  //console.log(data.data)
  ex.ask('swdCursorPosition',data.data);
});

ex.on('swdCursorReset', function(data){
  ex.ask('swdCursorReset',data.data);
});

ex.on('swdCursorStyle', function(data){
  //console.log(data.data)
  ex.ask('swdCursorStyle',data.data);
});

ex.on('swdAudioClick', function(data){
  console.log('!!!!! AUDIOCLICK',data.data);
  ex.ask('swdAudioClick',data.data);
});

ex.on('messageSetActiveTab', function(request, sender, sendResponse){
  ex.activateTab(request.data.tabId);
});

ex.on('messageActivateSrvTab', function(request, sender, sendResponse){
  ex.getSrvTabId(function(id){
    ex.activateTab(id);
  })
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

/*****************************************************************************/



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


/*****************************************************************************/

ex.recreateSrvTab();

