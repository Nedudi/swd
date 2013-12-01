/* global compatibility:true, jsfeat:true */
(function(window){
  "use strict";
  window.swd = window.swd || {};

  function Mod_Face() {
    this.width = 640;
    this.height = 480;
    this._img_u8 = null;
    this._canvas = null;
    this._canvas2 = null;

    // sizes for canvas to detect face
    this._maxFaceCanvasSize = 160;
    this._detectFaceWidth = 0;
    this._detectFaceHeight = 0;

    this._initParameters();
  }
  window.swd.Mod_Face = Mod_Face;

  Mod_Face.prototype._initParameters = function() {
    /* face detect */
    var scale = Math.min(this._maxFaceCanvasSize/this.width, this._maxFaceCanvasSize/this.height);
    this._detectFaceWidth = (this.width*scale)|0;
    this._detectFaceHeight = (this.height*scale)|0;

    this._canvas = document.createElement("canvas");
    this._canvas.width = this._detectFaceWidth;
    this._canvas.height = this._detectFaceHeight;

    this._canvas2 = document.createElement("canvas");
    this._canvas2.width = this._detectFaceWidth;
    this._canvas2.height = this._detectFaceHeight;

    this._img_u8 = new jsfeat.matrix_t(this._detectFaceWidth, this._detectFaceHeight, jsfeat.U8_t | jsfeat.C1_t);
    jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade);
  };

  Mod_Face.prototype.process = function(layers) {
    this._context = this._canvas.getContext("2d");
    if(window.swd.displayProcessing) {
      this._context2 = this._canvas2.getContext("2d");
    }
    this._context.drawImage(window.swd.video, 0, 0, this._detectFaceWidth, this._detectFaceHeight);
    var imageData = this._context.getImageData(0, 0, this._detectFaceWidth, this._detectFaceHeight);

    window.timeStart();
    window.graph.filters.rg_chanel(imageData.data, imageData.data);

    if(window.swd.displayProcessing) {
      this._context2.putImageData(imageData, 0, 0);
    }

    window.graph.filters.getRChannelAsByteArray(imageData.data, this._img_u8.data);
    window.timeEnd("grayscale");

    var rects;
    /* bbf */
    window.timeStart();
    var pyr = jsfeat.bbf.build_pyramid(this._img_u8, 24*2, 24*2, 4);
    window.timeEnd("build_pyramid");
    window.timeStart();
    rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
    window.timeEnd("detect");
    window.timeStart();
    rects = jsfeat.bbf.group_rectangles(rects, 1);
    window.timeEnd("group_rectangles");

    var on = rects.length;
    if(on) {
      jsfeat.math.qsort(rects, 0, on-1, function(a,b){ return (b.confidence<a.confidence); });
    }
    var n = 1 || on;

    var r = rects[0];
    if(!r) { return null; }

    if(window.swd.displayProcessing) {
      this._context2.save();
      this._context2.strokeStyle = "#ff0000";
      this._context2.strokeRect(r.x, r.y, r.width, r.height);
      this._context2.restore();
    }

    var sc = this.width/this._img_u8.cols;
    return { "x":(r.x*sc)|0, "y":(r.y*sc)|0, "width":(r.width*sc)|0, "height":(r.height*sc)|0 };
  };
})(window);
