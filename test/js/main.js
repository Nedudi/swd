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
  window.swd.params = null;
  var _paramData = function() {
    this.grayscale = true;
    this.param1 = 0.5;
    this.param2 = 0.5;
  };

  window.swd.onLoad = function () {
    swd.params = new _paramData();
    var paramsObj = document.getElementById("parameters");
    var gui = new dat.GUI({autoPlace:false});
    paramsObj.appendChild(gui.domElement);

    var uiFilters = gui.addFolder('Filters');
    uiFilters.open();
    uiFilters.add(window.swd.params, "grayscale");
    uiFilters.add(window.swd.params, "param1", 0, 1);
    uiFilters.add(window.swd.params, "param2", 0, 1);

    video = document.getElementById('webcam');
    layers.video = video;
    layers.camera = document.getElementById('canvas1');
    layers.motion = document.getElementById('canvas2');
    layers.face = document.getElementById('canvas4');
    layers.free1 = document.getElementById('canvas3');
    layers.free2 = document.getElementById('canvas5');
    swd.connectCamera();
    swd.cursorLayer();
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
