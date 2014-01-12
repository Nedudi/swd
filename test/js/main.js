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
    this.Brightness = 0;
    this.Contrast = 0;
    this.Intensity = 0;
    this.edges_density = 0.13;
    this.use_canny = false;
    this.min_scale = 2;
    this.scale_factor = 1.15;
  };

  window.swd.onLoad = function () {
    swd.params = new _paramData();
    var paramsObj = document.getElementById("parameters");
    var gui = new dat.GUI({autoPlace:false});
    paramsObj.appendChild(gui.domElement);

    var uiFilters = gui.addFolder('Face detect');
    uiFilters.open();
    uiFilters.add(window.swd.params, "Brightness", -128, 128);
    uiFilters.add(window.swd.params, "Contrast", -2, 2, 0.01);
    uiFilters.add(window.swd.params, "Intensity", -2, 2, 0.01);

    video = document.getElementById('webcam');
    layers.video = video;
    layers.camera = document.getElementById('canvas1');
    layers.motion = document.getElementById('canvas2');
    layers.face1 = document.getElementById('canvas3');
    layers.face2 = document.getElementById('canvas4');
    layers.face3 = document.getElementById('canvas5');
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


  window.swd.addEventListener("messageSettingsChanged", function(data) {
    console.log('>>>>>>>>>>>>>>> inside srv frame messageSettingsChanged ===>>>> ',data.key,data.value)
    switch(data.key){
      case 'show camera preview':{
        if(data.value === true){
          window.swd.displayProcessing = true;
          document.body.classList.add('swd-show');
        } else {
          window.swd.displayProcessing = false;
          document.body.classList.remove('swd-show');
        }
      };break;
      case 'enable face tracking':{
        if(data.value === true){
          window.swd.enableCamera();
        } else {
          window.swd.disableCamera();
        }
      };break;
      case 'use audio click':{
        window.swd.isUseAudioClick = data.value;
      };break;


    }
  });

})(window);
