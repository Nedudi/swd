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
    //region|regionX|regionY
    naclModule.postMessage("region|0.4|0.5");
    //recognize|scaleFactor|minNeighbors|sizeW|sizeH
    naclModule.postMessage("recognize|1.1|2|65|65");
    //motion|pyr_scale|levels|winsize|iterations|poly_n|poly_sigma|flags
    naclModule.postMessage("motion|0.5|3|8|10|5|1.1|0");
    runLoop();
  };











  var naclModule = null;
  var statusText = 'NO-STATUS';
  var ts = 0;
  var tc = 0;
  var tt = 0;
  var rects = null;

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
    naclModule.postMessage("size|" + imageData.width + "|" + imageData.height);
    naclModule.postMessage(imageData.data.buffer);
  };

  window.handleMessage = function(message_event) {
    if(message_event.data.substr(0,1) !== "[") {
      console.log(message_event.data);
      return;
    }

    var td = (new Date()).getTime() - tt;
    ts += td;
    tc ++;
    updateStatus(td + " - " + Math.floor(ts/tc));

    var tmp = null;
    try {
      tmp = JSON.parse(message_event.data);
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
