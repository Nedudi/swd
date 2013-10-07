/* global compatibility:true, jsfeat:true */
(function(window){
  "use strict";

  window.swd = window.swd || {};
  window.swd.cameraMotionDetection = function(video, canvas) {

    // lets do some fun
    var camWatch = new window.swd.CamWatch();

    var ctx = canvas.getContext("2d");
    camWatch.init(ctx, video);
    camWatch.detectCamera();
    camWatch.onCameraReady = tick;
    var cursorPos = {"x":(canvas.width/2), "y":(canvas.height/2)};
    var faceRects = [];
    var headRect = {};
    var globalParams = {
      centerRectColor: "rgb(0,0,255)",
      gridPointColor: "rgb(0,255,0)",
      maskSteps: 5,
      detectRectCount: 20,
      moveSpeed: 15
    };

    var tmp = 0;
    function tick() {
      compatibility.requestAnimationFrame(tick);
      //if((++tmp)%2) return;
      camWatch.process();

      if(camWatch.getActivePointCount() < (camWatch.getPointCount()/3)) {
        reinitParams();
      }

      var rect = camWatch.findFace();
      if(rect) {
        faceRects.push(rect);
      }
      if(faceRects.length >= globalParams.detectRectCount) {
        if(faceRects.length > globalParams.detectRectCount) {
          faceRects.shift();
        }
        if(camWatch.getPointCount() === 0) {
          updatePoints();
        } else {
          findMoveDelta();
          activeCursor(true);
        }
      } else {
        drawCursors();
      }

      prune_oflow_points(ctx);
      if(rect) {
        draw_circle(ctx, rect.x + rect.width/2, rect.y + rect.height/2, globalParams.centerRectColor);
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      }
    }

    var maskSteps = globalParams.maskSteps;

    function reinitParams() {
      activeCursor(false);
      faceRects = [];
      camWatch.removeAllPoints();
      cursorPos = {"x":window.innerWidth/2, "y":window.innerHeight/2};
      headRect = {x:0,y:0,w:0,h:0};
    }
    reinitParams();

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

    function updatePoints() {
      var qq, ww;
      updateRect();

      var sx = headRect.w*0.9/maskSteps;
      var sy = headRect.h*0.9/maskSteps;
      var cx = (headRect.x + headRect.w/2)|0;
      var cy = (headRect.y + headRect.h/2)|0;

      for(ww = 0; ww < maskSteps; ++ww) {
        for(qq = 0; qq < maskSteps; ++qq) {
          camWatch.setPoint(ww * maskSteps + qq, cx-(qq-(maskSteps>>1))*sx, cy-(ww-(maskSteps>>1))*sy);
        }
      }
    }

    var lastDetectSuccess = false;
    function findMoveDelta() {
      var qq, nn = camWatch.getPointCount();
      var pp, cnt = 0, pos = {x:0, y:0};
      for(qq = 0; qq < nn; ++qq) {
        pp = camWatch.getPoint(qq);
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
          pp = camWatch.getPoint(qq);
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
            cursorPos.x -= pos.x / cnt * globalParams.moveSpeed;
            cursorPos.y += pos.y / cnt * globalParams.moveSpeed;// * (window.innerHeight/window.innerWidth);
            if(cursorPos.x < 0) { cursorPos.x = 0; }
            else if(cursorPos.x > window.innerWidth) { cursorPos.x = window.innerWidth; }
            if(cursorPos.y < 0) { cursorPos.y = 0; }
            else if(cursorPos.y > window.innerHeight) { cursorPos.y = window.innerHeight; }
          }
          lastDetectSuccess = true;
        }
      } else {
        lastDetectSuccess = false;
      }
      drawCursors();
    }

    function drawCursors() {
      moveCursor(cursorPos.x, cursorPos.y);
    }

    function activeCursor(isActive) {
      if(isActive) {
        window.swd.sendMessage({"type":"swdCursorStyle", "style":"arrow"});
      } else {
        window.swd.sendMessage({"type":"swdCursorStyle", "style":"wait"});
      }
    }

    function moveCursor(x,y) {
      window.swd.sendMessage({"type":"swdCursorPosition", "data":{"x":(x|0), "y":(y|0)}});
    }

    function draw_circle(ctx, x, y, color) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function prune_oflow_points(ctx) {
      var qq, dd, num = camWatch.getPointCount();
      for(qq = 0; qq < num; ++qq) {
        dd = camWatch.getPoint(qq);
        if(dd.active) {
          draw_circle(ctx, dd.x, dd.y, globalParams.gridPointColor);
        }
      }
    }
  };
})(window);
