/* global compatibility:true, jsfeat:true, swd:true */
(function(window){
  "use strict";

  window.swd = window.swd || {};
  window.swd.cameraMotionDetection = function(layers) {
    var m_motion = new swd.Mod_Motion();
    var m_face = new swd.Mod_Face(layers);

    var ctx_camera = layers.camera.getContext("2d");
    var ctx_motion = layers.motion.getContext("2d");
    var width = layers.motion.width;
    var height = layers.motion.height;

    var cursorPos = {"x":(width/2), "y":(height/2)};
    var faceRects = [];
    var headRect = {};
    var globalParams = {
      centerRectColor: "rgb(0,0,255)",
      gridPointColor: "rgb(0,255,0)",
      maskSteps: 5,
      detectRectCount: 4,
      moveSpeed: 15
    };

    // currect state, can be: detect, motion
    var curWorkingState = "detect";
    var rect;

    function tick() {
      compatibility.requestAnimationFrame(tick);
      window.freeLog();
      ctx_camera.drawImage(layers.video, 0, 0);
      ctx_motion.drawImage(layers.camera, 0, 0);

      if(curWorkingState === "detect") {
        rect = m_face.process(layers);
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
        if(rect) {
          var ctx = ctx_camera;
          ctx.save();
          ctx.strokeStyle = "#ff0000";
          ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
          ctx.restore();
        }
      } else if(curWorkingState === "motion") {
        m_motion.process(layers);
        if(m_motion.getActivePointCount() < (m_motion.getPointCount()/3)) {
          reinitParams();
          activeCursor(false);
          curWorkingState = "detect";
        } else {
          findMoveDelta();
          drawActiveMotionPoint(ctx_motion);
          drawCursors();
        }
      }
    }

    var maskSteps = globalParams.maskSteps;

    function reinitParams() {
      faceRects = [];
      m_motion.removeAllPoints();
      cursorPos = {"x":window.innerWidth/2, "y":window.innerHeight/2};
      headRect = {x:0,y:0,w:0,h:0};
    }

    activeCursor(false);
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

    function createNewPointForMotionDetect() {
      var qq, ww;
      updateRect();

      var sx = headRect.w*0.9/maskSteps;
      var sy = headRect.h*0.9/maskSteps;
      var cx = (headRect.x + headRect.w/2)|0;
      var cy = (headRect.y + headRect.h/2)|0;

      for(ww = 0; ww < maskSteps; ++ww) {
        for(qq = 0; qq < maskSteps; ++qq) {
          m_motion.setPoint(ww * maskSteps + qq, cx-(qq-(maskSteps>>1))*sx, cy-(ww-(maskSteps>>1))*sy);
        }
      }
    }

    var lastDetectSuccess = false;
    function findMoveDelta() {
      var qq, nn = m_motion.getPointCount();
      var pp, cnt = 0, pos = {x:0, y:0};
      for(qq = 0; qq < nn; ++qq) {
        pp = m_motion.getPoint(qq);
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
          pp = m_motion.getPoint(qq);
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

    /********************************************************************************
     * draw and send commands
     ********************************************************************************/

    function drawActiveMotionPoint(ctx) {
      var qq, dd, num = m_motion.getPointCount();
      for(qq = 0; qq < num; ++qq) {
        dd = m_motion.getPoint(qq);
        if(dd.active) {
          draw_circle(ctx, dd.x, dd.y, globalParams.gridPointColor);
        }
      }
    }

    function drawCursors() {
      window.swd.sendMessage("swdCursorPosition", {"x":(cursorPos.x|0), "y":(cursorPos.y|0)});
    }

    function activeCursor(isActive) {
      if(isActive) {
        window.swd.sendMessage("swdCursorStyle", {"style":"arrow"});
      } else {
        window.swd.sendMessage("swdCursorStyle", {"style":"wait"});
      }
    }

    function draw_circle(ctx, x, y, color) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    /********************************************************************************
     * start processing
     ********************************************************************************/

    tick();
  };
})(window);
