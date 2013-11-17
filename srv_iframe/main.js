/* global dat:true, swd:true, compatibility:true */
(function(window) {
  "use strict";

  var video = null;
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

  window.swd.onLoad = function () {
    //window.swd.cursorLayer();

    video = document.getElementById('webcam');
    layers.video = video;
    layers.camera = document.getElementById('canvas1');
    layers.motion = document.getElementById('canvas2');
    layers.face1 = document.getElementById('canvas3');
    layers.face2 = document.getElementById('canvas4');
    layers.face3 = document.getElementById('canvas5');
    swd.connectCamera();
  };

  window.swd.connectCamera = function() {
    var that = this;
    try {
      compatibility.getUserMedia({video: true}, function(stream) {
        var videoStream = null;
        try {
          videoStream = compatibility.URL.createObjectURL(stream);
        } catch (error) {
          videoStream = stream;
        }
        if(window.swd.onCameraReady) {
          window.swd.onCameraReady(videoStream);
        }
      }, function (error) {
        if(window.swd.onCameraError) {
          window.swd.onCameraError();
        }
      });
    } catch (error) {
      if(window.swd.onCameraError) {
        window.swd.onCameraError();
      }
    }
  };

  window.swd.onCameraReady = function(streamUrl) {
    video.src = streamUrl;
    video.play();
    swd.cameraMotionDetection(layers);
  };

  window.swd.onCameraError = function() {
    console.log();
  };

  window.swd.onUnload = function () {
    var video = document.getElementById('webcam');
    video.pause();
    video.src=null;
  };
})(window);
