/* global swd:true */
(function(window) {
  "use strict";

  window.swd = window.swd || {};
  window.swd.extensionId = "ihgchdhjanpfnokicmjkjnmelgjlfaae";

  window.__swd_global_transfer_func = function() {};

//  window.swd.addEventListener("swdCameraImage", function(data) {
//    window.swd.ask('swdCameraImage', data);
//  });

  window.swd.addEventListener("swdCursorPosition", function(data) {
    window.swd.ask('swdCursorPosition', data);
  });

  window.swd.addEventListener("swdCursorReset", function(data) {
    window.swd.ask('swdCursorReset', data);
  });

  window.swd.addEventListener("swdCursorStyle", function(data) {
    window.swd.ask('swdCursorStyle', data);
  });

  window.swd.addEventListener("swdAudioClick", function(data) {
     console.log('!!!!!!!!!!!!AAAAAAAA');
     window.swd.ask('swdAudioClick', data);
  });


  // Lesha hello, options change can be detected like this
  swd.on('messageSettingsChanged', function(request) {
    console.log('!!!!!!==== messageSettingsChanged ====>>>>', request);
    //window.swd.sendMessage(request.cmd, request.data);
    window.swd.sendMessage('messageSettingsChanged', request.data);
  });

  swd.on('swdWindowFocusChanged', function(request){
    //
  });

  var lastTime = 0;
  window.swd._requestAnimationFrame = function(callback, element) {
    var requestAnimationFrame =
      window.requestAnimationFrame        ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||
        function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
    return requestAnimationFrame.call(window, callback, element);
  };

  window.swd.runCapture = function() {
    if(window.swd._videoElement) {
      window.swd._videoElement.stop();
      window.swd._videoElement = null;
    }

    window.swd._cameraCanvasCtx = null;
    window.swd._cameraCanvas = null;

    window.swd._videoElement = document.createElement("video");
    window.swd._videoElement.width = 320;
    window.swd._videoElement.height = 240;
    window.swd._videoElement.src = window.swd._videoStreamUrl;
    window.swd._videoElement.setAttribute('muted','true');
    window.swd._videoElement.play();

    window.swd._cameraCanvas = document.createElement("canvas");
    window.swd._cameraCanvas.width = 320;
    window.swd._cameraCanvas.height = 240;
    window.swd._cameraCanvasCtx = window.swd._cameraCanvas.getContext("2d");

//    window.swd._port = chrome.runtime.connect({name: "swdImagePort"});
//    window.swd._port.onMessage.addListener(function(msg) {});

//    window.swd._requestAnimationFrame(window.swd.sendImage);
    ex.nacl.loadNacl();
  };

//  var qq, g_TmpArray = Array();
  window.swd.sendImage = function() {
    if(!window.swd._videoElement || !window.swd._videoElement.videoWidth || !window.swd._videoElement.videoHeight) {
      window.swd._requestAnimationFrame(window.swd.sendImage);
      return;
    }
    window.swd._cameraCanvasCtx.drawImage(window.swd._videoElement, 0, 0, window.swd._videoElement.videoWidth, window.swd._videoElement.videoHeight, 0, 0, window.swd._cameraCanvas.width, window.swd._cameraCanvas.height);
    var imageData = window.swd._cameraCanvasCtx.getImageData(0, 0, window.swd._cameraCanvas.width, window.swd._cameraCanvas.height);
    ex.nacl.processImage(imageData.data);

//    console.time("swd.sendImage");
//    g_TmpArray.length = imageData.data.length;
//    for(qq = 0; qq < imageData.data.length; ++qq) {
//      g_TmpArray[qq] = imageData.data[qq];
//    }
//    try {
//      window.swd._port.postMessage(g_TmpArray);
//    }catch(e) {}
//    console.timeEnd("swd.sendImage");

    window.swd._requestAnimationFrame(window.swd.sendImage);
  };

  setTimeout(function(){
    window.swd.newTab();
    window.swd.layout();
    window.swd.keyboard();
    window.swd.cursorLayer();
  },0);

  window.swd.addEventListener("swdVideoStreamUrl", function(data) {
    window.swd._videoStreamUrl = data;
    window.swd.runCapture();
  });


  var ex = {};

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

    var nmfUrl = chrome.extension.getURL("glibc/Release/facedetect.nmf");

    ex.nacl._naclModule = document.createElement("embed");
    ex.nacl._naclModule.setAttribute("name", "nacl_module");
    ex.nacl._naclModule.setAttribute("id", "test");
    ex.nacl._naclModule.setAttribute("width", "0");
    ex.nacl._naclModule.setAttribute("height", "0");
    ex.nacl._naclModule.setAttribute("type", "application/x-nacl");
    ex.nacl._naclModule.setAttribute("src", nmfUrl);
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

    window.swd._requestAnimationFrame(window.swd.sendImage);
  };

  ex.nacl.processImage = function(data) {
    if(!ex.nacl._naclReady || !ex.nacl._naclIdle) {
      return;
    }

    ex.nacl._naclIdle = false;
    ex.nacl._naclModule.postMessage(data.buffer);
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
    window.swd.sendMessage("swdCursorPosition", {
      "x":  ex.nacl._cursorPos.x,
      "y":  ex.nacl._cursorPos.y,
      "mx": 1/*ex.nacl._cursorPos.spdX*/,
      "my": 1/*ex.nacl._cursorPos.spdY*/
    });
  };

  ex.nacl.resetCursors = function() {
    window.swd.sendMessage("swdCursorReset", {
      "x":  ex.nacl._cursorPos.x,
      "y":  ex.nacl._cursorPos.y,
      "mx": ex.nacl._cursorPos.spdX,
      "my": ex.nacl._cursorPos.spdY
    });
  };

  ex.nacl.activeCursor = function(isActive) {
    ex.nacl._isCursorActive = isActive;
    if(isActive) {
      window.swd.sendMessage("swdCursorStyle", {"style":"arrow"});
    } else {
      window.swd.sendMessage("swdCursorStyle", {"style":"wait"});
    }
  };

})(window);

