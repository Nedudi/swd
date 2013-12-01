/* global dat:true, swd:true, compatibility:true */
(function(window) {
  "use strict";

  var layers = {};

  window.freeLog = function(txt) {
    var tmp = document.getElementById("log");
    tmp.innerHTML = "";
  };
  window.log = function(txt) {
    var tmp = document.getElementById("log");
    tmp.innerHTML = tmp.innerHTML + "<br>" + txt;
  };
  window.timeStart = function() {
    window.__timeStart = (new Date()).getTime();
  };
  window.timeEnd = function(txt) {
    var dd = (new Date()).getTime() - window.__timeStart;
    window.log(txt + " " + dd);
  };

  window.swd = window.swd || {};

  window.swd.displayProcessing = true;

  window.swd.onLoad = function () {
    if(swd.cursorLayer) {
      swd.cursorLayer();
    }
    swd.video = document.getElementById('webcam');
    swd.connectCamera();
  };

  window.swd.connectCamera = function() {
    try {
      compatibility.getUserMedia({video: true, audio: !!swd.audioClick}, function(stream) {
        window.swd.stream = stream;
        var videoStream = null;
        try {
          videoStream = compatibility.URL.createObjectURL(stream);
        } catch (error) {
          videoStream = stream;
        }

        if(window.swd.onMicReady){
          window.swd.onMicReady(stream);
        }
        if(window.swd.onCameraReady) {
          window.swd.onCameraReady(videoStream);
        }
      }, function (error) {
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

  window.swd.onCameraReady = function(streamUrl) {
    swd.video.src = streamUrl;
    swd.video.setAttribute('muted','true');
    swd.video.play();
    swd.cameraMotionDetection(layers);
    if(swd.cameraCanvas) {
      document.getElementById('canvas1').appendChild(swd.cameraCanvas);
    }
    if(swd.modMotion._canvas) {
      document.getElementById('canvas2').appendChild(swd.modMotion._canvas);
    }
    if(swd.modFace._canvas) {
      document.getElementById('canvas3').appendChild(swd.modFace._canvas);
    }
    if(swd.modFace._canvas2) {
      document.getElementById('canvas4').appendChild(swd.modFace._canvas2);
    }
  };

  window.swd.onCameraError = function() {
    console.error('can not get stream from the camera');
  };

  window.swd.onMicReady = function(stream) {
    if(swd.audioClick) {
      swd.audioClick(stream);
    }
  };

  window.swd.onMicError = function() {
    console.error('can not get stream from the microphone');
  };

  window.swd.onUnload = function () {
    if(swd.video) {
      swd.video.pause();
      swd.video.src = null;
    }
  };
})(window);
