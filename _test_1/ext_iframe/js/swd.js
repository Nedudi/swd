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

    window.swd._port = chrome.runtime.connect({name: "swdImagePort"});
    window.swd._port.onMessage.addListener(function(msg) {
//      if (msg.question == "Who's there?")
//        port.postMessage({answer: "Madame"});
//      else if (msg.question == "Madame who?")
//        port.postMessage({answer: "Madame... Bovary"});
    });

    window.swd._requestAnimationFrame(window.swd.sendImage);
  };

  var qq, g_TmpArray = Array();
  window.swd.sendImage = function() {
    if(!window.swd._videoElement || !window.swd._videoElement.videoWidth || !window.swd._videoElement.videoHeight) {
      window.swd._requestAnimationFrame(window.swd.sendImage);
      return;
    }
    window.swd._cameraCanvasCtx.drawImage(window.swd._videoElement, 0, 0, window.swd._videoElement.videoWidth, window.swd._videoElement.videoHeight, 0, 0, window.swd._cameraCanvas.width, window.swd._cameraCanvas.height);
    var imageData = window.swd._cameraCanvasCtx.getImageData(0, 0, window.swd._cameraCanvas.width, window.swd._cameraCanvas.height);

    console.time("swd.sendImage");
//    chrome.runtime.sendMessage(window.swd.extensionId, {cmd:"swdCameraImage", data:imageData.data.buffer});
//    chrome.runtime.sendMessage(window.swd.extensionId, imageData.data.buffer);
    g_TmpArray.length = imageData.data.length;
    for(qq = 0; qq < imageData.data.length; ++qq) {
      g_TmpArray[qq] = imageData.data[qq];
    }
    try {
//      window.swd._port.postMessage(imageData.data.buffer);
//      window.swd._port.postMessage(imageData.data);
      window.swd._port.postMessage(g_TmpArray);
    }catch(e) {}
    console.timeEnd("swd.sendImage");

    window.swd._requestAnimationFrame(window.swd.sendImage);
  };

  setTimeout(function(){
    window.swd.newTab();
    window.swd.layout();
    window.swd.keyboard();
    window.swd.cursorLayer();
  },0);

  window.swd.addEventListener("swdVideoStreamUrl", function(data) {
//    window.swd.ask('swdVideoStreamUrl', data);
    window.swd._videoStreamUrl = data;
    window.swd.runCapture();
//    console.log('swdVideoStreamUrl', data);
  });

//  window.setInterval(function() {
//    if(!window.document || !window.document.body || !window.document.body.dataset || !window.document.body.dataset.imgData) {
//      return;
//    }
//    var arr = new window.Uint8ClampedArray(320000);
//    chrome.runtime.sendMessage({cmd:"testCommandWithImage", data:arr}, function(response) {
//      console.log("--!!-- sended");
//      callback(response);
//    });
//    console.log(window.document.body.dataset.imgData);
//  }, 1000);
})(window);

