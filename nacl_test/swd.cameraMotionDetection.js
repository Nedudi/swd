/* global compatibility:true, jsfeat:true, swd:true */
(function(window){
  "use strict";

  window.swd = window.swd || {};

  swd.displayProcessing = true;
  swd._naclModule = null;

  /********************************************************************************
   * NaCl
   ********************************************************************************/

  window.swd.nacl = {};
  window.swd.nacl._isCursorActive = false;
  window.swd.nacl._videoReady = false;
  window.swd.nacl._naclReady = false;
  window.swd.nacl._cursorPos = {"x":(1/2), "y":(1/2), "spdX":0, "spdY":0};
  window.swd.nacl._disabled = false;
  window.swd.nacl._faceRect = null;
  window.swd.nacl._width = 0;
  window.swd.nacl._height = 0;

  window.swd.nacl.updateStatus = function(txt) {
    console.log("updateStatus - ", txt);
  };

  window.swd.nacl.moduleDidLoad = function() {
    window.swd._naclModule = document.getElementById('test');
    window.swd.nacl.updateStatus('SUCCESS');
    window.swd.nacl._naclReady = true;
    if(window.swd.nacl._videoReady && window.swd.nacl._naclReady) {
      window.swd.nacl.activeCursor(false);
      window.swd.nacl.resetMotionTracing();
      window.swd.nacl.tick();
    }
  };

  window.swd.nacl.pageDidLoad = function() {
    var listener = document.getElementById('listener');
    listener.addEventListener('load', window.swd.nacl.moduleDidLoad, true);
    listener.addEventListener('message', window.swd.nacl.handleMessage, true);

    if(window.swd._naclModule === null) {
      window.swd.nacl.updateStatus('LOADING...');
    } else {
      window.swd.nacl.updateStatus();
    }
  };

  window.swd.nacl.tick = function() {
    swd.cameraCanvasCtx.drawImage(swd.video, 0, 0, swd.video.videoWidth, swd.video.videoHeight, 0, 0, swd.cameraCanvas.width, swd.cameraCanvas.height);
    var imageData = swd.cameraCanvasCtx.getImageData(0, 0, swd.cameraCanvas.width, swd.cameraCanvas.height);

    var faceRect = window.swd.nacl._faceRect;
    if(swd.displayProcessing && faceRect) {
      var ctx = swd.cameraCanvasCtx;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "#FF0000";
      ctx.moveTo(faceRect.x, faceRect.y);
      ctx.lineTo(faceRect.x + faceRect.width, faceRect.y);
      ctx.lineTo(faceRect.x + faceRect.width, faceRect.y + faceRect.height);
      ctx.lineTo(faceRect.x, faceRect.y + faceRect.height);
      ctx.lineTo(faceRect.x, faceRect.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    swd._naclModule.postMessage(imageData.width + '|' + imageData.height);
    swd._naclModule.postMessage(imageData.data.buffer);
  };

  window.swd.nacl.handleMessage = function(message_event) {
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
      window.swd.nacl._faceRect = tmp[0];
    }

    if(tmp && tmp[0] && tmp[0].dx && tmp[0].dy) {
      tmp[0].dx *= -1;
      window.swd.nacl.findMoveDelta(tmp[0]);
      window.swd.nacl.drawCursors();
      if(!window.swd.nacl._isCursorActive) {
        window.swd.nacl.activeCursor(false);
      }
    }

    window.swd.nacl.tick();
  };

  /********************************************************************************
   * Motion Detection
   ********************************************************************************/

  window.swd.cameraMotionDetection = function(layers) {
    window.swd.nacl._width = 320;
    window.swd.nacl._height = 240;

    swd.cameraCanvas = document.getElementById("canvas1");
    swd.cameraCanvasCtx = swd.cameraCanvas.getContext("2d");

    window.swd.nacl._videoReady = true;
    if(window.swd.nacl._videoReady && window.swd.nacl._naclReady) {
      window.swd.nacl.activeCursor(false);
      window.swd.nacl.resetMotionTracing();
      window.swd.nacl.tick();
    }
  };

  window.swd.nacl.resetCursorPosition = function () {
    window.swd.nacl._cursorPos.x = 1/2;
    window.swd.nacl._cursorPos.y = 1/2;
  };

  window.swd.nacl.resetParameters = function() {
    window.swd.nacl._faceRect = null;
  };

  window.swd.nacl.resetMotionTracing = function() {
    window.swd.nacl.resetParameters();
    window.swd.nacl.resetCursorPosition();
    window.swd.nacl.resetCursors();
  };

  window.swd.nacl.findMoveDelta = function(data) {
    var dx = Math.exp(1.5*Math.log(Math.abs(data.dx))) * (data.dx > 0 ? 1 : -1);
    var dy = Math.exp(1.5*Math.log(Math.abs(data.dy))) * (data.dy > 0 ? 1 : -1);
    window.swd.nacl._cursorPos.x -= dx / window.swd.nacl._width;
    window.swd.nacl._cursorPos.y += dy / window.swd.nacl._height;
    if(window.swd.nacl._cursorPos.x < 0) { window.swd.nacl._cursorPos.x = 0; }
    else if(window.swd.nacl._cursorPos.x > 1) { window.swd.nacl._cursorPos.x = 1; }
    if(window.swd.nacl._cursorPos.y < 0) { window.swd.nacl._cursorPos.y = 0; }
    else if(window.swd.nacl._cursorPos.y > 1) { window.swd.nacl._cursorPos.y = 1; }
  };

  /********************************************************************************
   * draw and send commands
   ********************************************************************************/

  window.swd.nacl.drawCursors = function() {
    window.swd.sendMessage("swdCursorPosition", {
      "x":  window.swd.nacl._cursorPos.x,
      "y":  window.swd.nacl._cursorPos.y,
      "mx": 1/*window.swd.nacl._cursorPos.spdX*/,
      "my": 1/*window.swd.nacl._cursorPos.spdY*/
    });
  };

  window.swd.nacl.resetCursors = function() {
    window.swd.sendMessage("swdCursorReset", {
      "x":  window.swd.nacl._cursorPos.x,
      "y":  window.swd.nacl._cursorPos.y,
      "mx": window.swd.nacl._cursorPos.spdX,
      "my": window.swd.nacl._cursorPos.spdY
    });
  };

  window.swd.nacl.activeCursor = function(isActive) {
    window.swd.nacl._isCursorActive = isActive;
    if(isActive) {
      window.swd.sendMessage("swdCursorStyle", {"style":"arrow"});
    } else {
      window.swd.sendMessage("swdCursorStyle", {"style":"wait"});
    }
  };

  /********************************************************************************
   * start processing
   ********************************************************************************/

  window.swd.enableCamera = function() {
    if(!window.swd.nacl._disabled) {
      return;
    }

    try {
      compatibility.getUserMedia({video: true, audio: !!swd.audioClick}, function(stream) {
        window.swd.stream = stream;

        var videoStream = null;
        try {
          videoStream = compatibility.URL.createObjectURL(stream);
        } catch (error) {
          videoStream = stream;
        }

        window.swd.nacl._disabled = false;
        if(window.swd.onMicReady){
          window.swd.onMicReady(stream);
        }
        swd.video.src = videoStream;
        swd.video.setAttribute('muted','true');
        swd.video.play();
        window.swd.nacl.tick();
      }, function(error) {
        if(window.swd.onCameraError) {
          window.swd.onCameraError();
        }
        if(window.swd.onMicError) {
          window.swd.onMicError();
        }
      });
    } catch (error) {
      if(window.swd.onCameraError) {
        window.swd.onCameraError();
      }
    }
  };

  window.swd.disableCamera =  function() {
    console.log('srv frame now disable stream');
    window.swd.nacl._disabled = true;
    if(window.swd.stream) {
      window.swd.stream.stop();
      window.swd.stream = null;
    }
    window.swd.video.pause();
    window.swd.nacl.resetMotionTracing();
  };

//    window.swd.addEventListener("refresh", function() {
//    resetMotionTracing();
//    });

  window.addEventListener("load", window.swd.nacl.pageDidLoad, false);
//  (document.documentElement || document.body).addEventListener("load", window.swd.nacl.pageDidLoad, false);
})(window);
