/* global ex:true, chrome:true */

var ex = {};
ex.options = {
  //url: "https://stop-web-disability.org"
  url: "http://local.bytiger.com/files/nacl/srv_iframe/cam.html"
};

ex.status = {
  isSrvTabAlreadyCreated: false
};

ex.on = function(command, callback) {
  if(!ex.callStack) {
    ex.callStack = {};
  }
  if(!ex.callStack[command]) {
    ex.callStack[command] = [];
  }
  ex.callStack[command].push(callback);
};

ex.trigger = function(command, request, sender, sendResponse) {
  if(ex.callStack && ex.callStack[command]) {
    for(var i=0; i<ex.callStack[command].length;i++) {
      ex.callStack[command][i](request, sender, sendResponse);
    }
  }
};

ex.ask = function(command, data, callback) {
  // ASK ALL TABS
  chrome.tabs.query({}, function(tabs) {
    var message = { cmd:command, data:data };
    for (var i=0; i<tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, message);
    }
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.cmd) {
    ex.trigger(request.cmd, request, sender, sendResponse);
  } else {
//    console.log("onMessage.addListener", request.toString());
  }
  return true; // fucking important true
});

/*****************************************************************************/

ex.activateTab = function(id) {
  chrome.tabs.update(id, {active: true}, function(tab) {
    chrome.windows.update(tab.windowId, {focused: true}, function(win) {
      console.log('set active tab manualy',tab,win);
    });
  });
};

ex.getSrvTabId = function(callback) {
  chrome.tabs.query({}, function(tabs) {
    for(var t=0; t<tabs.length; t++) {
      if(tabs[t].url.indexOf(ex.options.url) !== -1) {
        callback(tabs[t].id);
        return;
      }
    }
    callback(false);
    return false;
  });
};

ex.reloadAllTabs = function() {
  chrome.tabs.query({},function(tabs) {
    for(var t=0; t<tabs.length; t++){
      if(tabs[t].url.indexOf(ex.options.url) === -1 && tabs[t].url.indexOf('chrome://') === -1 && tabs[t].url.indexOf('chrome-devtools://') === -1) {
        console.log('-=-=-=-=-=url',tabs[t].url);
        chrome.tabs.reload(tabs[t].id);
      }
    }
  });
};

ex.recreateSrvTab = function() {
  console.log('== creating SRV FRAME ...');
  ex.getSrvTabId(function(id) {
    if(id){
      chrome.tabs.remove(id, function(){});
    }
    ex.reloadAllTabs();
    chrome.windows.getLastFocused({}, function(win) {
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

chrome.windows.onCreated.addListener(function(win) {
  //console.log('===========!!!!!!!!!!!!!!!!!!!!!!!!!!!!',win)
});

chrome.windows.onFocusChanged.addListener(function(win) {
  ex.ask('swdWindowFocusChanged', win);
  console.log('===========!!!!!!!!!!!!!!!!!!!!!!!!!!!!', win);
});

/*****************************************************************************/

//ex.on('swdCameraImage', function(event) {
//  if(!event.data) {
//    return;
//  }
//  ex.nacl.processImage(event.data);
//});

ex.on('swdCursorPosition', function(event) {
  //console.log(data.data)
  ex.ask('swdCursorPosition', event.data);
});

ex.on('swdCursorReset', function(event) {
  ex.ask('swdCursorReset', event.data);
});

ex.on('swdCursorStyle', function(event) {
  //console.log(data.data)
  ex.ask('swdCursorStyle', event.data);
});

ex.on('swdAudioClick', function(event) {
  console.log('!!!!! AUDIOCLICK', event.data);
  ex.ask('swdAudioClick', event.data);
});

ex.on('messageSetActiveTab', function(request, sender, sendResponse) {
  ex.activateTab(request.data.tabId);
});

ex.on('messageActivateSrvTab', function(request, sender, sendResponse) {
  ex.getSrvTabId(function(id){
    ex.activateTab(id);
  })
});

ex.on('messageGetTabs', function(request, sender, sendResponse) {
  chrome.tabs.query({}, function(tabs) {
    sendResponse({data:tabs});
  });
});

ex.on('messageGetMyTabId', function(request, sender, sendResponse) {
  if(sender && sender.tab && sender.tab.id) {
    chrome.tabs.query({}, function(tabs) {
      console.log('messageGetMyTabId',sender.tab.id);
      sendResponse({
        data:{
          tabId: sender.tab.id
        }
      });
    });
  }
});

ex.on('messageGetMostVisitedPages', function(request, sender, sendResponse) {
  chrome.topSites.get(function(pages) {
    sendResponse({data:pages});
  });
});

//ex.on('swdVideoStreamUrl', function(event) {
//  console.log("swdVideoStreamUrl", event.data);
//  ex.nacl.runCapture(event.data);
//});

/*****************************************************************************/

chrome.tabs.onRemoved.addListener(function(v) {
  ex.ask('messageTabsChanged');
  console.log('==>tab removed',v.tabId);
});

chrome.tabs.onCreated.addListener(function(v) {
  ex.ask('messageTabsChanged');
  console.log('==>tab created',v.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabid, changeinfo, tab) {
  var url = tab.url;
  if (url !== undefined && changeinfo.status == "complete") {
    ex.ask('messageTabsChanged');
    console.log('==>tab updated',tabid, changeinfo, tab);
  }
});

chrome.tabs.onMoved.addListener(function(v) {
  ex.ask('messageTabsChanged');
  console.log('==>tab moved',v.tabId);
});

chrome.tabs.onActivated.addListener(function(v) {
  ex.ask('messageTabActivated',{tabId:v.tabId, windowId:v.windowId});
  console.log('==>tab activated',v.tabId);
});

/*****************************************************************************/

chrome.runtime.onConnect.addListener(function(port) {
  if(port.name !== "swdImagePort") {
    return;
  }

  port.onMessage.addListener(function(msg) {
    ex.nacl.processImage(msg);
//    if (msg.joke == "Knock knock")
//      port.postMessage({question: "Who's there?"});
//    else if (msg.answer == "Madame")
//      port.postMessage({question: "Madame who?"});
//    else if (msg.answer == "Madame... Bovary")
//      port.postMessage({question: "I don't get it."});
  });
});

//ex.on("testCommandWithImage", function(request, sender, sendResponse) {
//  console.log("testCommandWithImage");
//});

ex.recreateSrvTab();

ex.nacl = {};

ex.nacl = {};
ex.nacl._isCursorActive = false;
ex.nacl._videoReady = false;
ex.nacl._naclReady = false;
ex.nacl._cursorPos = {"x":(1/2), "y":(1/2), "spdX":0, "spdY":0};
ex.nacl._disabled = false;
ex.nacl._faceRect = null;
ex.nacl._width = 320;
ex.nacl._height = 240;
ex.nacl._motionLimit = 0.25;
ex.nacl._naclModule = null;
ex.nacl._videoElement = null;
ex.nacl._cameraCanvas = null;
ex.nacl._cameraCanvasCtx = null;

//ex.nacl.runCapture = function(url) {
//  if(ex.nacl._videoElement) {
//    ex.nacl._videoElement.stop();
//    ex.nacl._videoElement = null;
//  }
//
//  ex.nacl._cameraCanvasCtx = null;
//  ex.nacl._cameraCanvas = null;
//
//  ex.nacl._videoElement = document.createElement("video");
//  ex.nacl._videoElement.width = 320;
//  ex.nacl._videoElement.height = 240;
//  ex.nacl._videoElement.src = url;
//  ex.nacl._videoElement.setAttribute('muted','true');
//  ex.nacl._videoElement.play();
//
//  ex.nacl._cameraCanvas = document.createElement("canvas");
//  ex.nacl._cameraCanvas.width = 320;
//  ex.nacl._cameraCanvas.height = 240;
//  ex.nacl._cameraCanvasCtx = ex.nacl._cameraCanvas.getContext("2d");
//};


ex.nacl.loadNacl = function() {
  var that = {};
  that.body = window.document.body;

  that.listenerDiv = document.createElement("div");
  that.listenerDiv.setAttribute("id", "listener");
//  that.listenerDiv.addEventListener('message', ex.nacl.handleMessage, true);
  that.body.appendChild(that.listenerDiv);

  ex.nacl._naclModule = document.createElement("embed");
  ex.nacl._naclModule.setAttribute("name", "nacl_module");
  ex.nacl._naclModule.setAttribute("id", "test");
  ex.nacl._naclModule.setAttribute("width", "0");
  ex.nacl._naclModule.setAttribute("height", "0");
  ex.nacl._naclModule.setAttribute("type", "application/x-nacl");
  ex.nacl._naclModule.setAttribute("src", "glibc/Release/facedetect.nmf");
  ex.nacl._naclModule.addEventListener('load', ex.nacl.moduleDidLoad, true);
  ex.nacl._naclModule.addEventListener('message', ex.nacl.handleMessage, true);
  that.body.appendChild(ex.nacl._naclModule);
};

ex.nacl.updateStatus = function(txt) {
//  window.alert("updateStatus - " + txt);
};

ex.nacl.moduleDidLoad = function() {
  ex.nacl.updateStatus('SUCCESS');
  ex.nacl._naclReady = true;

  ex.nacl._naclIdle = false;

  //region|regionX|regionY
  ex.nacl._naclModule.postMessage("region|0.4|0.5");
  //recognize|scaleFactor|minNeighbors|sizeW|sizeH
//  swd._naclModule.postMessage("recognize|1.1|2|65|65");
  //motion|pyr_scale|levels|winsize|iterations|poly_n|poly_sigma|flags
//  swd._naclModule.postMessage("motion|0.5|3|8|10|5|1.1|0");
//  if(swd.cameraCanvas && swd.cameraCanvas.width > 0 && swd.cameraCanvas.height > 0) {
  //size|width|height
  ex.nacl._naclModule.postMessage("size|"+ex.nacl._width+"|"+ex.nacl._height);
};

ex.nacl.processImage = function(data) {
  if(!ex.nacl._naclReady || !ex.nacl._naclIdle) {
    return;
  }
  var resImData = new Uint8ClampedArray(data);

//  var qq, resImData = new Uint8ClampedArray(307200);
//  for(qq = 0; typeof(data[qq]) !== "undefined"; ++qq) {
//    resImData[qq] = data[qq];
//  }

  ex.nacl._naclIdle = false;
  ex.nacl._naclModule.postMessage(resImData.buffer);
};

ex.nacl.handleMessage = function(message_event) {
  ex.nacl._naclIdle = true;

  if(message_event.data.substr(0,1) !== "[") {
    return;
  }

  var tmp = {dx:0, dy:0};
  try {
    tmp = JSON.parse(message_event.data);
  }catch(e) {
    console.error(message_event.data);
    tmp = {dx:0, dy:0};
  }
  if(tmp && tmp[0] && tmp[0].x && tmp[0].y && tmp[0].width && tmp[0].height) {
    ex.nacl._faceRect = tmp[0];
  }

  if(tmp && tmp[0] && tmp[0].dx && tmp[0].dy) {
    if((tmp[0].dx*tmp[0].dx + tmp[0].dy*tmp[0].dy) < ex.nacl._motionLimit) {
      tmp[0].dx = 0;
      tmp[0].dy = 0;
    }

    tmp[0].dx *= -1;
    ex.nacl.findMoveDelta(tmp[0]);
    ex.nacl.drawCursors();
    if(!ex.nacl._isCursorActive) {
      ex.nacl.activeCursor(false);
    }
  }
};

ex.nacl.findMoveDelta = function(data) {
  var dx = Math.exp(1.3*Math.log(Math.abs(data.dx))) * (data.dx > 0 ? 1 : -1);
  var dy = Math.exp(1.3*Math.log(Math.abs(data.dy))) * (data.dy > 0 ? 1 : -1);
  ex.nacl._cursorPos.x -= dx / ex.nacl._width;
  ex.nacl._cursorPos.y += dy / ex.nacl._height;
  if(ex.nacl._cursorPos.x < 0) { ex.nacl._cursorPos.x = 0; }
  else if(ex.nacl._cursorPos.x > 1) { ex.nacl._cursorPos.x = 1; }
  if(ex.nacl._cursorPos.y < 0) { ex.nacl._cursorPos.y = 0; }
  else if(ex.nacl._cursorPos.y > 1) { ex.nacl._cursorPos.y = 1; }
};

ex.nacl.drawCursors = function() {
//  window.swd.sendMessage("swdCursorPosition", {
  ex.ask('swdCursorPosition', {
    "x":  ex.nacl._cursorPos.x,
    "y":  ex.nacl._cursorPos.y,
    "mx": 1/*ex.nacl._cursorPos.spdX*/,
    "my": 1/*ex.nacl._cursorPos.spdY*/
  });
};

ex.nacl.resetCursors = function() {
//  window.swd.sendMessage("swdCursorReset", {
  ex.ask('swdCursorReset', {
    "x":  ex.nacl._cursorPos.x,
    "y":  ex.nacl._cursorPos.y,
    "mx": ex.nacl._cursorPos.spdX,
    "my": ex.nacl._cursorPos.spdY
  });
};

ex.nacl.activeCursor = function(isActive) {
  ex.nacl._isCursorActive = isActive;
  if(isActive) {
    ex.ask('swdCursorStyle', {"style":"arrow"});
//    window.swd.sendMessage("swdCursorStyle", {"style":"arrow"});
  } else {
    ex.ask('swdCursorStyle', {"style":"wait"});
//    window.swd.sendMessage("swdCursorStyle", {"style":"wait"});
  }
};


ex.nacl.loadNacl();
