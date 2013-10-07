/* global compatibility:true, jsfeat:true */
(function(window){
  "use strict";

  function watchParams() {
    this.win_size = 20;
    this.max_iterations = 100;
    this.epsilon = 0.01;
    this.min_eigen = 0.001;
  }

  function CamWatch() {
    this.videoStream = null;
    this.canvas = null;
    this.video = null;
    this.options = null;

    this.onCameraReady = null;
    this.onCameraError = null;

    this._ctx = null;

    this._curr_img_pyr = null;
    this._prev_img_pyr = null;

    this._point_count = 0;
    this._point_status = null;
    this._prev_xy = null;
    this._curr_xy = null;

    this._faceCanvas = null;
    this._faceCtx = null;
    this._img_u8 = null;
  }
  window.CamWatch = CamWatch;

  CamWatch.prototype.init = function(context, video) {
    if(this.canvas) {
      if(this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
      this.canvas = null;
      this._ctx = null;
    }
    if(this.video) {
      if(this.video.parentNode) {
        this.video.parentNode.removeChild(this.video);
      }
      this.video.src = null;
      this.video = null;
    }

    if(!context) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 640;
      this.canvas.height = 480;
      document.body.appendChild(this.canvas);
      this._ctx = this.canvas.getContext("2d");
    } else {
      this._ctx = context;
      this.canvas = this._ctx.canvas;
    }

    if(!video) {
      this.video = document.createElement("video");
      this.video.width = 640;
      this.video.height = 480;
      this.video.style.display = "none";
      document.body.appendChild(this.video);
    } else {
      this.video = video;
    }
  };

  CamWatch.prototype.detectCamera = function() {
    var that = this;
    try {
      compatibility.getUserMedia({video: true}, function(stream) {
        try {
          that.videoStream = compatibility.URL.createObjectURL(stream);
        } catch (error) {
          that.videoStream = stream;
        }
        if(that.video) {
          that.video.src = that.videoStream;
        }
        setTimeout(function() {
          that.video.play();
          that._initParameters();
          if(that.onCameraReady) {
            that.onCameraReady();
          }
        }, 500);
      }, function (error) {
        that.videoStream = null;
        if(that.onCameraError) {
          that.onCameraError();
        }
      });
    } catch (error) {
      that.videoStream = null;
      if(that.onCameraError) {
        that.onCameraError();
      }
    }
  };

  CamWatch.prototype._initParameters = function() {
//    this._ctx = this.canvas.getContext('2d');

    this._curr_img_pyr = new jsfeat.pyramid_t(3);
    this._prev_img_pyr = new jsfeat.pyramid_t(3);
    this._curr_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);
    this._prev_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);

    this._point_count = 0;
    this._point_statusOld = new Uint8Array(100);
    this._point_status = new Uint8Array(100);
    this._prev_xy = new Float32Array(100*2);
    this._curr_xy = new Float32Array(100*2);

    this.options = new watchParams();

    /* face detect */
    var scale = Math.min(max_work_size/this.video.videoWidth, max_work_size/this.video.videoHeight);
    var w = (this.video.videoWidth*scale)|0;
    var h = (this.video.videoHeight*scale)|0;

    this._img_u8 = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);
    this._faceCanvas = document.createElement("canvas");
    this._faceCanvas.width = w;
    this._faceCanvas.height = h;
    this._faceCtx = this._faceCanvas.getContext("2d");

    jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade);
  };

  CamWatch.prototype.process = function() {
    var that = this;

    if(that.video.readyState === that.video.HAVE_ENOUGH_DATA) {
      that._ctx.drawImage(that.video, 0, 0, 640, 480);
      var imageData = that._ctx.getImageData(0, 0, 640, 480);

      // swap flow data
      var _pt_xy = that._prev_xy;
      that._prev_xy = that._curr_xy;
      that._curr_xy = _pt_xy;
      var _pyr = that._prev_img_pyr;
      that._prev_img_pyr = that._curr_img_pyr;
      that._curr_img_pyr = _pyr;

      var qq;
      for(qq = 0; qq < this._point_count; ++qq) {
        this._point_statusOld[qq] = this._point_status[qq];
      }

      jsfeat.imgproc.grayscale(imageData.data, that._curr_img_pyr.data[0].data);
      that._curr_img_pyr.build(that._curr_img_pyr.data[0], true);
      jsfeat.optical_flow_lk.track(that._prev_img_pyr, that._curr_img_pyr, that._prev_xy, that._curr_xy, that._point_count, that.options.win_size|0, that.options.max_iterations|0, that._point_status, that.options.epsilon, that.options.min_eigen);
    }
  };

  CamWatch.prototype.reinitPoints = function() {
    this._curr_img_pyr = new jsfeat.pyramid_t(3);
    this._prev_img_pyr = new jsfeat.pyramid_t(3);
    this._curr_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);
    this._prev_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);
  };

  CamWatch.prototype.getPointCount = function(){
    return this._point_count;
  };

  CamWatch.prototype.addPoint = function(x, y) {
    this._curr_xy[this._point_count<<1] = x|0;
    this._curr_xy[(this._point_count<<1)+1] = y|0;
    this._point_count++;
  };

  CamWatch.prototype.setPoint = function(num, x, y) {
    this._curr_xy[num<<1] = x|0;
    this._curr_xy[(num<<1)+1] = y|0;
    this._point_count = Math.max(num+1, this._point_count);
  };

  CamWatch.prototype.removeAllPoints = function() {
    this._point_count = 0;
  };

  CamWatch.prototype.getActivePointCount = function() {
    var qq, res = 0;
    for(qq = 0; qq < this._point_count; ++qq) {
      if(this._point_status[qq] == 1) { res++; }
    }
    return res;
  };

  CamWatch.prototype.getPoint = function(num) {
    if(num < 0) {
      num = 0;
    } else if(num >= this._point_count) {
      num = this._point_count - 1;
    }
    return {
      "active":(this._point_status[num] == 1),
      "x":this._curr_xy[num<<1],
      "y":this._curr_xy[(num<<1)+1],
      "live":(this._point_statusOld[num] == 1),
      "ox":this._prev_xy[num<<1],
      "oy":this._prev_xy[(num<<1)+1]
    };
  };

  var max_work_size = 160;

  CamWatch.prototype.findFace = function() {
    this._faceCtx.drawImage(this.video, 0, 0, this._faceCanvas.width, this._faceCanvas.height);
    var imageData = this._faceCtx.getImageData(0, 0, this._faceCanvas.width, this._faceCanvas.height);
    jsfeat.imgproc.grayscale(imageData.data, this._img_u8.data);

    // possible options
//    jsfeat.imgproc.equalize_histogram(this._img_u8, this._img_u8);

    var pyr = jsfeat.bbf.build_pyramid(this._img_u8, 24*2, 24*2, 4);
    var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
    rects = jsfeat.bbf.group_rectangles(rects, 1);

    var on = rects.length;
    if(on) {
      jsfeat.math.qsort(rects, 0, on-1, function(a,b){ return (b.confidence<a.confidence); });
    }
    var n = 1 || on;
    var sc = this.canvas.width/this._img_u8.cols;

    var r = rects[0];
    if(!r) { return null; }
    return { "x":(r.x*sc)|0, "y":(r.y*sc)|0, "width":(r.width*sc)|0, "height":(r.height*sc)|0 };
  };
})(window);

(function(){
  /********************************************************************************
   *
   ********************************************************************************/
  function cameraMotionDetection(video, canvas) {

    // lets do some fun
    var camWatch = new CamWatch();

    var ctx = canvas.getContext("2d");
    camWatch.init(ctx, video);
    camWatch.detectCamera();
    camWatch.onCameraReady = tick;
    var cursorPos = {"x":(canvas.width/2), "y":(canvas.height/2)};
    var faceRects = [];
    var headRect = {};
    var globalParams = {
      centerRectColor: "rgb(0,0,255)",
      gridPointColor: "rgb(242,121,53)",
      rectColor: "rgb(33,187,166)",
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
//        draw_circle(ctx, rect.x + rect.width/2, rect.y + rect.height/2, globalParams.centerRectColor);
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = globalParams.rectColor;
        ctx.strokeRect((rect.x|0)+0.5, (rect.y|0)+0.5, (rect.width|0)+0.5, (rect.height|0)+0.5);
//        ctx.strokeStyle = globalParams.rectColor;
//        ctx.strokeRect((rect.x|0)-1.5, (rect.y|0)-1.5, (rect.width|0)+3.5, (rect.height|0)+3.5);
        ctx.restore();
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
//            if(pp.x > headRect.x && pp.y > headRect.y && pp.x < headRect.x + headRect.w && pp.y < headRect.y + headRect.h) {
          pos.x += pp.x - pp.ox;
          pos.y += pp.y - pp.oy;
          cnt++;
//            }
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
//              if(pp.x > headRect.x && pp.y > headRect.y && pp.x < headRect.x + headRect.w && pp.y < headRect.y + headRect.h) {
            if(Math.abs(pp.x - pp.ox) < limx && Math.abs(pp.y - pp.oy) < limy) {
              pos.x += pp.x - pp.ox;
              pos.y += pp.y - pp.oy;
              cnt++;
            }
//              }
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
//        document.getElementById("pos").innerHTML = cursorPos.x + "<br>" + cursorPos.y + "<br>" + (canvas.width/2) + "<br>" + (canvas.height/2);
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
        jQuery(window).trigger("swdCursorStyle", {"style":"arrow"});
//        document.getElementById("cursor").classList.add("active");
      } else {
        jQuery(window).trigger("swdCursorStyle", {"style":"wait"});
//        document.getElementById("cursor").classList.remove("active");
      }
    }

    function moveCursor(x,y) {
      jQuery(window).trigger("swdCursorPosition", {"x":(x|0), "y":(y|0)});
//      document.getElementById("cursor").style.left = (x|0) + "px";
//      document.getElementById("cursor").style.top = (y|0) + "px";
    }

//    function on_canvas_click(e) {
//      var coords = canvas.relMouseCoords(e);
//      if(coords.x > 0 & coords.y > 0 & coords.x < canvas.width & coords.y < canvas.height) {
//        camWatch.addPoint(coords.x, coords.y);
//      }
//    }
//    canvas.addEventListener('click', on_canvas_click, false);

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

    function prune_oflow_points(ctx) {
      var qq, dd, num = camWatch.getPointCount();
      for(qq = 0; qq < num; ++qq) {
        dd = camWatch.getPoint(qq);
        if(dd.active) {
          draw_circle(ctx, dd.x, dd.y, globalParams.gridPointColor);
        }
      }
    }
  }
  window.cameraMotionDetection = cameraMotionDetection;
})(window);

(function(window){
  "use strict";

  function cursorLayer() {
    var cursor = document.createElement("div");
    cursor.setAttribute("id", "swd-cursor-pointer");

//    cursor.style.position = "fixed";
//    cursor.style.left = "0";
//    cursor.style.top = "0";
//    cursor.style.width = "32px";
//    cursor.style.height = "32px";
//    cursor.style.display = "block";
//    cursor.style.zIndex = "999999999999999999999";
//    cursor.style.backgroundSize = "100% 100%";
//    cursor.style.backgroundPosition = "50% 50%";
    cursor.style.left = (window.innerWidth/2)|0;
    cursor.style.top = (window.innerHeight/2)|0;
    cursor.style.backgroundImage = "url(data:image/png;base64," + swd_base64CursorArrow + ")";
    document.body.appendChild(cursor);

    var lastCursorStyle = "";

    function setCursorStyle(data) {
      if(data.style === lastCursorStyle) {
        return;
      }
      if(data.style === "arrow") {
        cursor.classList.remove("wait");
        cursor.innerHTML = "";
//        cursor.style.backgroundImage = "url(data:image/png;base64," + swd_base64CursorArrow + ")";
      } else if(data.style === "wait") {
        cursor.classList.add("wait");
        cursor.innerHTML = "We are detecting your face";
//        cursor.style.backgroundImage = "url(data:image/png;base64," + swd_base64CursorWait + ")";
      }
    }

    function setCursorPosition(data) {
      if(data.x && data.y) {
        cursor.style.left = (data.x|0) + "px";
        cursor.style.top = (data.y|0) + "px";
        app.cursor.x = data.x;
        app.cursor.y = data.y;
      }
    }

    jQuery(window).bind("swdCursorPosition", function(event, data) {
      setCursorPosition(data);
    });

    jQuery(window).bind("swdCursorStyle", function(event, data) {
      setCursorStyle(data);
    });

    setCursorStyle({style:"wait"});
  }

  window.cursorLayer = cursorLayer;
})(window);
