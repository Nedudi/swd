/* global compatibility:true, jsfeat:true */
(function(window){
  "use strict";
  window.swd = window.swd || {};

  function Mod_Face(layers) {
    this.width = 640;
    this.height = 480;
    this._img_u8 = null;
    this._edg = null;
    this._ii_sum = null;
    this._ii_sqsum = null;
    this._ii_tilted = null;
    this._ii_canny = null;

    // sizes for canvas to detect face
    this._maxFaceCanvasSize = 160;
    this._detectFaceWidth = 0;
    this._detectFaceHeight = 0;
//    this._classifier = jsfeat.haar.eye;
    this._classifier = jsfeat.haar.frontalface;

    this._initParameters(layers);
  }
  window.swd.Mod_Face = Mod_Face;

  Mod_Face.prototype._initParameters = function(layers) {
    /* face detect */
    var scale = Math.min(this._maxFaceCanvasSize/this.width, this._maxFaceCanvasSize/this.height);
    this._detectFaceWidth = (this.width*scale)|0;
    this._detectFaceHeight = (this.height*scale)|0;

    layers.face1.height = layers.face2.height = layers.face3.height = this._detectFaceHeight;
    layers.face1.width = layers.face2.width = layers.face3.width = this._detectFaceWidth;

    this._img_u8 = new jsfeat.matrix_t(this._detectFaceWidth, this._detectFaceHeight, jsfeat.U8_t | jsfeat.C1_t);
    jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade);

    this._edg = new jsfeat.matrix_t(this._detectFaceWidth, this._detectFaceHeight, jsfeat.U8_t | jsfeat.C1_t);
    this._ii_sum = new Int32Array((this._detectFaceWidth+1)*(this._detectFaceHeight+1));
    this._ii_sqsum = new Int32Array((this._detectFaceWidth+1)*(this._detectFaceHeight+1));
    this._ii_tilted = new Int32Array((this._detectFaceWidth+1)*(this._detectFaceHeight+1));
    this._ii_canny = new Int32Array((this._detectFaceWidth+1)*(this._detectFaceHeight+1));
    //    jsfeat.bbf.prepare_cascade(jsfeat.haar.eye);
  };

  Mod_Face.prototype.process = function(layers) {

    var context1 = layers.face1.getContext("2d");
    var context2 = layers.face2.getContext("2d");
    context1.drawImage(layers.camera, 0, 0, this._detectFaceWidth, this._detectFaceHeight);
    var imageData = context1.getImageData(0, 0, this._detectFaceWidth, this._detectFaceHeight);

    window.timeStart();
    window.graph.filters.grayscaleModified(imageData.data, imageData.data);
    window.graph.filters.brightnesAndContrast(
      imageData.data,
      imageData.data,
      window.swd.params.Brightness,
      window.swd.params.Contrast,
      window.swd.params.Intensity
    );
    context2.putImageData(imageData, 0, 0);

    jsfeat.imgproc.grayscaleRGBAToByte(imageData.data, this._img_u8.data);
    window.timeEnd("grayscale");

    var rects;
    /* bbf */
//    window.timeStart();
//    var pyr = jsfeat.bbf.build_pyramid(this._img_u8, 24*2, 24*2, 4);
//    window.timeEnd("build_pyramid");
//    window.timeStart();
//    rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
//    window.timeEnd("detect");
//    window.timeStart();
//    rects = jsfeat.bbf.group_rectangles(rects, 1);
//    window.timeEnd("group_rectangles");
//
//    var on = rects.length;
//    if(on) {
//      jsfeat.math.qsort(rects, 0, on-1, function(a,b){ return (b.confidence<a.confidence); });
//    }
//    var n = 1 || on;

    /* haaf */
    jsfeat.imgproc.compute_integral_image(this._img_u8, this._ii_sum, this._ii_sqsum, this._classifier.tilted ? ii_tilted : null);
//    if(options.use_canny) {
//      jsfeat.imgproc.canny(img_u8, edg, 10, 50);
//      jsfeat.imgproc.compute_integral_image(edg, ii_canny, null, null);
//    }
    jsfeat.haar.edges_density = swd.params.edges_density;
    rects = jsfeat.haar.detect_multi_scale(this._ii_sum, this._ii_sqsum, this._ii_tilted, swd.params.use_canny ? this._ii_canny : null, this._img_u8.cols, this._img_u8.rows, this._classifier, swd.params.scale_factor, swd.params.min_scale);
    rects = jsfeat.haar.group_rectangles(rects, 1);


    var r = rects[0];
    if(!r) { return null; }

    var ctx = context2;
    ctx.save();
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(r.x, r.y, r.width, r.height);
    ctx.restore();

    var sc = this.width/this._img_u8.cols;
    return { "x":(r.x*sc)|0, "y":(r.y*sc)|0, "width":(r.width*sc)|0, "height":(r.height*sc)|0 };
  };
})(window);
