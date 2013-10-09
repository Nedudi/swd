/* global compatibility:true, jsfeat:true */
(function(window){
  "use strict";
  window.swd = window.swd || {};

//  function WatchParams() {
//    this.win_size = 15;
//    this.max_iterations = 100;
//    this.epsilon = 0.01;
//    this.min_eigen = 0.001;
//  }

  function Mod_Face() {
    this.width = 640;
    this.height = 480;
    this.max_work_size = 80;
//    this.videoStream = null;
//    this.canvas = null;
//    this.video = null;
//    this.options = null;
//
//    this.onCameraReady = null;
//    this.onCameraError = null;
//
//    this._ctx = null;
//
//    this._curr_img_pyr = null;
//    this._prev_img_pyr = null;
//
//    this._point_count = 0;
//    this._point_status = null;
//    this._prev_xy = null;
//    this._curr_xy = null;

//    this._faceCanvas = null;
//    this._faceCtx = null;
    this._img_u8 = null;
    this._initParameters();
  }
  window.swd.Mod_Face = Mod_Face;

//  CamWatch.prototype.init = function(context, video) {
//    if(this.canvas) {
//      if(this.canvas.parentNode) {
//        this.canvas.parentNode.removeChild(this.canvas);
//      }
//      this.canvas = null;
//      this._ctx = null;
//    }
//    if(this.video) {
//      if(this.video.parentNode) {
//        this.video.parentNode.removeChild(this.video);
//      }
//      this.video.src = null;
//      this.video = null;
//    }
//
//    if(!context) {
//      this.canvas = document.createElement("canvas");
//      this.canvas.width = 640;
//      this.canvas.height = 480;
//      document.body.appendChild(this.canvas);
//      this._ctx = this.canvas.getContext("2d");
//    } else {
//      this._ctx = context;
//      this.canvas = this._ctx.canvas;
//    }
//
//    if(!video) {
//      this.video = document.createElement("video");
//      this.video.width = 640;
//      this.video.height = 480;
//      this.video.style.display = "none";
//      document.body.appendChild(this.video);
//    } else {
//      this.video = video;
//    }
//  };

//  Mod_Face.prototype.detectCamera = function() {
//    var that = this;
//    try {
//      compatibility.getUserMedia({video: true}, function(stream) {
//        try {
//          that.videoStream = compatibility.URL.createObjectURL(stream);
//        } catch (error) {
//          that.videoStream = stream;
//        }
//        if(that.video) {
//          that.video.src = that.videoStream;
//        }
//        setTimeout(function() {
//          that.video.play();
//          that._initParameters();
//          if(that.onCameraReady) {
//            that.onCameraReady();
//          }
//        }, 500);
//      }, function (error) {
//        that.videoStream = null;
//        if(that.onCameraError) {
//          that.onCameraError();
//        }
//      });
//    } catch (error) {
//      that.videoStream = null;
//      if(that.onCameraError) {
//        that.onCameraError();
//      }
//    }
//  };

  Mod_Face.prototype._initParameters = function() {
//    this._ctx = this.canvas.getContext('2d');

//    this._curr_img_pyr = new jsfeat.pyramid_t(3);
//    this._prev_img_pyr = new jsfeat.pyramid_t(3);
//    this._curr_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);
//    this._prev_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);

//    this._point_count = 0;
//    this._point_statusOld = new Uint8Array(100);
//    this._point_status = new Uint8Array(100);
//    this._prev_xy = new Float32Array(100*2);
//    this._curr_xy = new Float32Array(100*2);

//    this.options = new WatchParams();

    /* face detect */
    var scale = Math.min(this.max_work_size/this.width, this.max_work_size/this.height);
    var w = (this.width*scale)|0;
    var h = (this.height*scale)|0;

    this._img_u8 = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);
//    this._faceCanvas = document.createElement("canvas");
//    this._faceCanvas.width = w;
//    this._faceCanvas.height = h;
//    this._faceCtx = this._faceCanvas.getContext("2d");

    jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade);
  };

//  Mod_Face.prototype.process = function() {
//    var that = this;

//    if(that.video.readyState === that.video.HAVE_ENOUGH_DATA) {
//      that._ctx.drawImage(that.video, 0, 0, 640, 480);
//      var imageData = that._ctx.getImageData(0, 0, 640, 480);

      // swap flow data
//      var _pt_xy = that._prev_xy;
//      that._prev_xy = that._curr_xy;
//      that._curr_xy = _pt_xy;
//      var _pyr = that._prev_img_pyr;
//      that._prev_img_pyr = that._curr_img_pyr;
//      that._curr_img_pyr = _pyr;

//      var qq;
//      for(qq = 0; qq < this._point_count; ++qq) {
//        this._point_statusOld[qq] = this._point_status[qq];
//      }

//      console.time("time1");
//      jsfeat.imgproc.grayscale(imageData.data, that._curr_img_pyr.data[0].data);
//      console.timeEnd("time1");
//      console.time("time2");
//      that._curr_img_pyr.build(that._curr_img_pyr.data[0], true);
//      console.timeEnd("time2");
//      console.time("time3");
//      jsfeat.optical_flow_lk.track(that._prev_img_pyr, that._curr_img_pyr, that._prev_xy, that._curr_xy, that._point_count, that.options.win_size|0, that.options.max_iterations|0, that._point_status, that.options.epsilon, that.options.min_eigen);
//      console.timeEnd("time3");
//    }
//  };

//  CamWatch.prototype.reinitPoints = function() {
//    this._curr_img_pyr = new jsfeat.pyramid_t(3);
//    this._prev_img_pyr = new jsfeat.pyramid_t(3);
//    this._curr_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);
//    this._prev_img_pyr.allocate(640, 480, jsfeat.U8_t|jsfeat.C1_t);
//  };

//  CamWatch.prototype.getPointCount = function(){
//    return this._point_count;
//  };

//  CamWatch.prototype.addPoint = function(x, y) {
//    this._curr_xy[this._point_count<<1] = x|0;
//    this._curr_xy[(this._point_count<<1)+1] = y|0;
//    this._point_count++;
//  };

//  CamWatch.prototype.setPoint = function(num, x, y) {
//    this._curr_xy[num<<1] = x|0;
//    this._curr_xy[(num<<1)+1] = y|0;
//    this._point_count = Math.max(num+1, this._point_count);
//  };

//  CamWatch.prototype.removeAllPoints = function() {
//    this._point_count = 0;
//  };

//  CamWatch.prototype.getActivePointCount = function() {
//    var qq, res = 0;
//    for(qq = 0; qq < this._point_count; ++qq) {
//      if(this._point_status[qq] == 1) { res++; }
//    }
//    return res;
//  };

//  CamWatch.prototype.getPoint = function(num) {
//    if(num < 0) {
//      num = 0;
//    } else if(num >= this._point_count) {
//      num = this._point_count - 1;
//    }
//    return {
//      "active":(this._point_status[num] === 1),
//      "x":this._curr_xy[num<<1],
//      "y":this._curr_xy[(num<<1)+1],
//      "live":(this._point_statusOld[num] === 1),
//      "ox":this._prev_xy[num<<1],
//      "oy":this._prev_xy[(num<<1)+1]
//    };
//  };

  Mod_Face.prototype.process = function(layers) {
    var context = layers.face.getContext("2d");
    var imageData = context.getImageData(0, 0, this.width, this.height);

    window.timeStart();
    jsfeat.imgproc.grayscale(imageData.data, this._img_u8.data);
    window.timeEnd("grayscale");

    // possible options
//    jsfeat.imgproc.equalize_histogram(this._img_u8, this._img_u8);

    window.timeStart();
    var pyr = jsfeat.bbf.build_pyramid(this._img_u8, 24*2, 24*2, 4);
    window.timeEnd("build_pyramid");
    window.timeStart();
    var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
    window.timeEnd("detect");
    window.timeStart();
    rects = jsfeat.bbf.group_rectangles(rects, 1);
    window.timeEnd("group_rectangles");

    var on = rects.length;
    if(on) {
      jsfeat.math.qsort(rects, 0, on-1, function(a,b){ return (b.confidence<a.confidence); });
    }
    var n = 1 || on;
    var sc = this.width/this._img_u8.cols;

    var r = rects[0];
    if(!r) { return null; }
    return { "x":(r.x*sc)|0, "y":(r.y*sc)|0, "width":(r.width*sc)|0, "height":(r.height*sc)|0 };
  };
})(window);
