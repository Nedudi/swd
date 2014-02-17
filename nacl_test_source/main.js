/* global dat:true, swd:true, compatibility:true */
(function(window) {
  "use strict";

  window.swd = window.swd || {};

  window.swd.onLoad = function () {
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

    swd.canvas = document.getElementById("myCanvas");
    swd.canvas.setAttribute("width", (swd.canvas.width = swd.video.width) + "px");
    swd.canvas.setAttribute("height", (swd.canvas.height = swd.video.height) + "px");
    swd.ctx = swd.canvas.getContext("2d");

    swd.cameraMotionDetection();
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

  window.swd.cameraMotionDetection = function() {
//    function tick() {
//      compatibility.requestAnimationFrame(tick);
//      var ctx = swd.canvas.getContext("2d");
//      ctx.drawImage(swd.video, 0, 0);
//      imageData = ctx.getImageData(0, 0, swd.canvas.width, swd.canvas.height);
//      ctx = null;
      runLoop();
//    }
//    compatibility.requestAnimationFrame(tick);
  };











  var naclModule = null;  // Global application object.
  var statusText = 'NO-STATUS';
//  var img;
  var ts = 0;
  var tc = 0;
//  var imageData = null;

  // 1230 -- default time for face2.jpg

//  window.runLoop = function() {
//    var img = new Image();
//    img.onload = function() {
//      var canvas = document.getElementById("myCanvas");
//      canvas.setAttribute("width", (canvas.width = this.width) + "px");
//      canvas.setAttribute("height", (canvas.height = this.height) + "px");
//      var ctx = canvas.getContext("2d");
//      ctx.drawImage(this, 0, 0);
//      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//      ctx = null;
//      canvas = null;
//      runLoop2();
//    };
//    img.src = "face2.jpg";
//  };

  var tt = 0;
  var rects = null;
//  window.runLoop2 = function() {
//    tt = (new Date()).getTime();
//    console.log("send data: ",imageData.width, imageData.height, imageData.data.length);
//    naclModule.postMessage(imageData.width + '|' + imageData.height);
//    naclModule.postMessage(imageData.data.buffer);
//  };

  window.runLoop = function() {
    swd.ctx.drawImage(swd.video, 0, 0, swd.video.videoWidth, swd.video.videoHeight, 0, 0, swd.canvas.width, swd.canvas.height);
    var imageData = swd.ctx.getImageData(0, 0, swd.canvas.width, swd.canvas.height);

    var i;
    if(rects) {
      swd.ctx.save();
      swd.ctx.beginPath();
      swd.ctx.strokeStyle = "#FF0000";
      swd.ctx.moveTo(rects.x, rects.y);
      swd.ctx.lineTo(rects.x + rects.width, rects.y);
      swd.ctx.lineTo(rects.x + rects.width, rects.y+rects.height);
      swd.ctx.lineTo(rects.x, rects.y+rects.height);
      swd.ctx.lineTo(rects.x, rects.y);
      swd.ctx.closePath();
      swd.ctx.stroke();
      swd.ctx.restore();
    }

    tt = (new Date()).getTime();
    naclModule.postMessage(imageData.width + '|' + imageData.height);
    naclModule.postMessage(imageData.data.buffer);
  };

  window.handleMessage = function(message_event) {
    if(message_event.data.substr(0,1) !== "[") {
      return;
    }

    var td = (new Date()).getTime() - tt;
    ts += td;
    tc ++;
    updateStatus(td + " - " + Math.floor(ts/tc));

    try {
      var tmp = JSON.parse(message_event.data);
    }catch(e) {
      console.log(message_event.data);
      runLoop();
    }

    if(tmp && tmp[0] && tmp[0].x && tmp[0].y && tmp[0].width && tmp[0].height) {
      rects = tmp[0];
    }

    if(tmp && tmp[0] && tmp[0].dx && tmp[0].dy) {
      var obj = document.getElementById("motion_data");
      if(obj) {
        obj.innerText = tmp[0].dx.toFixed(4) + ":" + tmp[0].dy.toFixed(4);
      }
    }

    runLoop();
  };

  // Indicate load success.
  window.moduleDidLoad = function() {
    naclModule = document.getElementById('test');
    updateStatus('SUCCESS');
    window.swd.onLoad();
//    runLoop();
  };

  window.pageDidLoad = function() {
    if (naclModule == null) {
      updateStatus('LOADING...');
    } else {
      // It's possible that the Native Client module onload event fired
      // before the page's onload event.  In this case, the status message
      // will reflect 'SUCCESS', but won't be displayed.  This call will
      // display the current message.
      updateStatus();
    }
  };

  window.updateStatus = function(opt_message) {
    if(opt_message) {
      statusText = opt_message;
    }
    var statusField = document.getElementById('status_field');
    if (statusField) {
      statusField.innerHTML = statusText;
    }
  };
})(window);
