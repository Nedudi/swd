/* global compatibility:true, jsfeat:true, swd:true */
(function(window){
  "use strict";

  window.swd = window.swd || {};

//  window.swd.getCursorMultiplier = function(inParam) {
//    return (1/inParam) / 2;
//  };



  window.swd.modMotion = null;
  window.swd.modFace = null;
  swd.displayProcessing = true;

  window.swd.cameraMotionDetection = function(layers) {
    var width = 640;
    var height = 480;

    swd.cameraCanvas = document.createElement("canvas");
    swd.cameraCanvas.width = width;
    swd.cameraCanvas.height = height;
    swd.modMotion = new swd.Mod_Motion();
    swd.modFace = new swd.Mod_Face();

    layers.camera = swd.cameraCanvas;

    var ctx_camera = swd.cameraCanvas.getContext("2d");

    var cursorPos = {"x":(1/2), "y":(1/2), "spdX":0, "spdY":0};
    var faceRects = [];
    var headRect = {};
    var globalParams = {
      centerRectColor: "rgb(0,0,255)",
      gridPointColor: "rgb(0,255,0)",
      maskSteps: 5,
      detectRectCount: 4
    };

    // currect state, can be: detect, motion
    var curWorkingState = "detect";
    var rect;
    var _disabled = false;

//    swd.video.addEventListener("timeupdate", function () {
//      tick();
//      var vTime = swd.video.currentTime;
//      console.log(vTime);
//    }, false);

    var ll = 0;
    function tick() {
      tickCounter++;
      //console.log(tickCounter)
      //console.log(ll - (new Date()).getTime());
      ll = (new Date()).getTime();
      if(_disabled) {
        return;
      }

      compatibility.requestAnimationFrame(tick);
      window.freeLog();
      if(swd.displayProcessing) {
        ctx_camera.drawImage(swd.video, 0, 0);
      }

      if(curWorkingState === "detect") {
        rect = swd.modFace.process(layers);
        if(rect) {
          faceRects.push(rect);
        }
        if(faceRects.length >= globalParams.detectRectCount) {
          if(faceRects.length > globalParams.detectRectCount) {
            faceRects.shift();
          }
          createNewPointForMotionDetect();
          activeCursor(true);
          curWorkingState = "motion";
        }
        if(rect && swd.displayProcessing) {
          ctx_camera.save();
          ctx_camera.strokeStyle = "#ff0000";
          ctx_camera.strokeRect(rect.x, rect.y, rect.width, rect.height);
          ctx_camera.restore();
        }
      } else if(curWorkingState === "motion") {
        swd.modMotion.process(layers);
        if(swd.modMotion.getActivePointCount() < (swd.modMotion.getPointCount()/3)) {
          resetMotionTracing();
          activeCursor(false);
          curWorkingState = "detect";
        } else {
          if(tickCounter >= 100){
            tickCounter = 0;
            resetParameters();
          } else {
            findMoveDelta();
            drawActiveMotionPoint();
            drawCursors();
          }

          // if(tickCounter === 49)console.log('==> 49',cursorPos.x,cursorPos.y);
          // if(tickCounter === 0) console.log('==> 0' ,cursorPos.x,cursorPos.y);
        }
      }
    }
    this.tick = tick();

    var maskSteps = globalParams.maskSteps;




    function resetCursorPosition() {
      cursorPos.x = 1/2;
      cursorPos.y = 1/2;
    }

    function resetParameters() {
      faceRects = [];
      swd.modMotion.removeAllPoints();
      headRect = {x:0,y:0,w:0,h:0};
      curWorkingState = "detect";
    }

    function resetMotionTracing() {
      resetParameters();
      resetCursorPosition();
      resetCursors();
    }

    activeCursor(false);
    resetMotionTracing();

    function updateRect() {
      var qq;
      var tmp = {x:0,y:0,w:0,h:0};
      for(qq = 0; qq < faceRects.length; ++qq) {
        tmp.x += faceRects[qq].x;
        tmp.y += faceRects[qq].y;
        tmp.w += faceRects[qq].width;
        tmp.h += faceRects[qq].height;
      }
      tmp.x /= faceRects.length;
      tmp.y /= faceRects.length;
      tmp.w /= faceRects.length;
      tmp.h /= faceRects.length;
      headRect = tmp;
    }


    // setInterval(function(){
    //   createNewPointForMotionDetect();
    //   console.log(1)
    // },2000)

    var tickCounter = 0;

    function createNewPointForMotionDetect() {
      var qq, ww;
      updateRect();

      cursorPos.spdX = headRect.w / 640;
      cursorPos.spdY = headRect.h / 480;
     // console.log(cursorPos.spdX, cursorPos.spdY);

      var sx = headRect.w*0.9/maskSteps;
      var sy = headRect.h*0.9/maskSteps;
      var cx = (headRect.x + headRect.w/2)|0;
      var cy = (headRect.y + headRect.h/2)|0;

      for(ww = 0; ww < maskSteps; ++ww) {
        for(qq = 0; qq < maskSteps; ++qq) {
          swd.modMotion.setPoint(ww * maskSteps + qq, cx-(qq-(maskSteps>>1))*sx, cy-(ww-(maskSteps>>1))*sy);
        }
      }
    }

    var lastDetectSuccess = false;
    function findMoveDelta() {
      //if(isReseted) return;
      var qq, nn = swd.modMotion.getPointCount();
      var pp, cnt = 0, pos = {x:0, y:0};
      for(qq = 0; qq < nn; ++qq) {
        pp = swd.modMotion.getPoint(qq);
        if(pp && pp.active && pp.live) {
          pos.x += pp.x - pp.ox;
          pos.y += pp.y - pp.oy;
          cnt++;
        }
      }
      if(cnt > maskSteps) {
        var limx = Math.abs(pos.x / cnt);
        var limy = Math.abs(pos.y / cnt);
        cnt = 0;

        pos = {x:0, y:0};
        for(qq = 0; qq < nn; ++qq) {
          pp = swd.modMotion.getPoint(qq);
          if(pp && pp.active && pp.live) {
            if(Math.abs(pp.x - pp.ox) < limx && Math.abs(pp.y - pp.oy) < limy) {
              pos.x += pp.x - pp.ox;
              pos.y += pp.y - pp.oy;
              cnt++;
            }
          }
        }

        if(cnt) {
          if(lastDetectSuccess) {
            cursorPos.x -= (pos.x / cnt) / width;// * swd.getCursorMultiplier(cursorPos.spdY);  //* globalParams.moveSpeed;
            cursorPos.y += (pos.y / cnt) / height;// * swd.getCursorMultiplier(cursorPos.spdY); //* globalParams.moveSpeed;// * (window.innerHeight/window.innerWidth); //window.innerWidth

            // TODO no limit on server side
//            if(cursorPos.x < 0) { cursorPos.x = 0; }
//            else if(cursorPos.x > 1) { cursorPos.x = 1; }
//            if(cursorPos.y < 0) { cursorPos.y = 0; }
//            else if(cursorPos.y > 1) { cursorPos.y = 1; }
          }
          lastDetectSuccess = true;
        }
      } else {
        lastDetectSuccess = false;
      }
      drawCursors();
    }

    /********************************************************************************
     * draw and send commands
     ********************************************************************************/

    function drawActiveMotionPoint() {
      if(!swd.displayProcessing) {
        return;
      }

      var draw_circle = function(ctx, x, y, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      var ctx = swd.modMotion._canvas.getContext("2d");
      var qq, dd, num = swd.modMotion.getPointCount();
      for(qq = 0; qq < num; ++qq) {
        dd = swd.modMotion.getPoint(qq);
        if(dd.active) {
          draw_circle(ctx, dd.x, dd.y, globalParams.gridPointColor);
        }
      }
    }

    function drawCursors() {
      // temporary disable scale head parameter because of re-detection each time cursorPos.spdX, cursorPos.spdY
      window.swd.sendMessage("swdCursorPosition", {"x":cursorPos.x, "y":cursorPos.y, "mx":0.5/*cursorPos.spdX*/, "my":0.5/*cursorPos.spdY*/});
      //console.log(cursorPos.x,cursorPos.y);

        // document.getElementById('test_cursor').style.top = cursorPos.y*3000-1000+'px';
        // document.getElementById('test_cursor').style.left = cursorPos.x*3000-1000+'px';
      //window.swd.ask("swdCursorPosition", {"x":cursorPos.x, "y":cursorPos.y});
    }

    function resetCursors() {
      window.swd.sendMessage("swdCursorReset", {"x":cursorPos.x, "y":cursorPos.y, "mx":cursorPos.spdX, "my":cursorPos.spdY});
    }

    function activeCursor(isActive) {
      if(isActive) {
        window.swd.sendMessage("swdCursorStyle", {"style":"arrow"});
      } else {
        window.swd.sendMessage("swdCursorStyle", {"style":"wait"});
      }
    }

    /********************************************************************************
     * start processing
     ********************************************************************************/

     window.swd.enableCamera = function() {
      if(!_disabled) {
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

          _disabled = false;
          if(window.swd.onMicReady){
            window.swd.onMicReady(stream);
          }
          swd.video.src = videoStream;
          swd.video.setAttribute('muted','true');
          swd.video.play();
          tick();
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

    window.swd.disableCamera =  function() {
      console.log('srv frame now disable stream');
      _disabled = true;
      if(window.swd.stream) {
        window.swd.stream.stop();
        window.swd.stream = null;
      }
      window.swd.video.pause();
      resetMotionTracing();
    };

    window.swd.addEventListener("refresh", function() {
      resetMotionTracing();
    });

    tick();
  };
})(window);
