filters = {
  1:function(canvas){
    var context = canvas.getContext("2d");
  	var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
  	var pix = imgd.data;
  	
  	var pixCount = 0;
  	var sum = 0;
    var i, n;
  	for (i = 0, n = pix.length; i < n; i += 4) {
    	pixCount ++;
    	sum += pix[i] * .3 + pix[i+1]* .59 + pix[i+2]* .11;
  	}
  	
  	var porog = sum/pixCount;
  	var mask = [];
  	for (i = 0, n = pix.length; i < n; i += 4) {
    	sum = pix[i]* .3 + pix[i+1]* .59 + pix[i+2]* .11;
  	  mask[i  ] = 0; // red
    	mask[i+1] = 0; // green
    	mask[i+2] = 0; // blue
    	if(        sum<porog*0.2){ mask[i] = 1; mask[i+1] = 0; mask[i+2] = 0; mask[i+3] = 0.50; // alpha    	
    	} else if (sum<porog*0.3){ mask[i] = 0; mask[i+1] = 1; mask[i+2] = 0; mask[i+3] = 0.50; // alpha       	
    	} else if (sum<porog*0.4){ mask[i] = 0; mask[i+1] = 0; mask[i+2] = 1; mask[i+3] = 0.50; // alpha 
    	} else if (sum<porog*0.5){ mask[i] = 1; mask[i+1] = 1; mask[i+2] = 0; mask[i+3] = 0.50; // alpha 
    	} else if (sum<porog*0.6){ mask[i] = 0; mask[i+1] = 1; mask[i+2] = 1; mask[i+3] = 0.50; // alpha  
    	} else if (sum<porog*0.7){ mask[i] = 1; mask[i+1] = 0; mask[i+2] = 1; mask[i+3] = 0.50; // alpha     	
    	} else if (sum<porog*0.8){ mask[i] = 1; mask[i+1] = 1; mask[i+2] = 0; mask[i+3] = 0.60; // alpha   
    	} else if (sum<porog*0.9){ mask[i] = 1; mask[i+1] = 0; mask[i+2] = 0; mask[i+3] = 0.75; // alpha    
    	} else if (sum<porog*0.10){ mask[i] = 0; mask[i+1] = 1; mask[i+2] = 0; mask[i+3] = 0.90; // alpha      	   	
    	} else {                    mask[i] = 0; mask[i+1] = 0; mask[i+2] = 1; mask[i+3] = 1.00; // alpha 
    	} 
  	}
  	

  	for (i = 0, n = pix.length; i < n; i += 4) {
    	var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
    	pix[i  ] = grayscale; 	// red
    	pix[i+1] = grayscale; 	// green
    	pix[i+2] = grayscale*1.2; 	// blue
  	}
  	
  	context.putImageData(imgd, 0, 0);

   // var img = new Image();  
   // img.onload = function(){  

      var w = 500;
      var h = 500;
       //context.drawImage(img, 0, 0,500,500);
        var imgd = context.getImageData(0,0,500,500);
        var pix = imgd.data;
      	for (var i = 0, n = pix.length; i < n; i += 4) {
        	if(mask[i+3] != 1){
        	  pix[i  ] = /* pix[i  ]* mask[i+3]* */ 255*mask[i]; // red
          	pix[i+1] = /* pix[i+1]* mask[i+3]* */ 255*mask[i+1]; // green
          	pix[i+2] = /* pix[i+2]* mask[i+3]* */ 255*mask[i+2]; // blue
        	  pix[i+3] = 255;
        	}
      	}      
      	context.putImageData(imgd, 0, 0);    
    
  },
  
  2:function(canvas){
    var context = canvas.getContext("2d");
  	var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
  	var pix = imgd.data;
  	
  	var minL = 255;
  	var maxL = 0;
  	
    for (i = 0, n = pix.length; i < n; i += 4) {
    	var l = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
    	//if(i>200 && i<100) console.log(l);
    	if (l > maxL) maxL = l;
    	if (l < minL) minL = l;
  	}
  	

  	minL*=1.1;
  	maxL/=1.1;

  	
  	for (i = 0, n = pix.length; i < n; i += 4) {
    	var rgbin = [pix[i]/255,pix[i+1]/255,pix[i+2]/255];
    	var hsv = RGB_to_HSV(rgbin[0],rgbin[1],rgbin[2]);
    	var lightness = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
    	lightness = (lightness-minL)/(maxL-minL);
  	  //if(i%2000==0) console.log(lightness)
  	  hsv[0] = Math.abs((lightness)*6-6);
  	  hsv[1] = 0.9;
  	  hsv[1] = 0.9;
  	  //if(hsv[1]>6) hsv[1] =6;
  	  //hsv[2] = 0.8;
    	var rgbout = HSV_to_RGB(hsv[0],hsv[1],hsv[2]);
    	pix[i  ] = rgbout[0]*255; 	// red
    	pix[i+1] = rgbout[1]*255; 	// green
    	pix[i+2] = rgbout[2]*255; 	// blue
  	}  	
  	context.putImageData(imgd, 0, 0);    
  },
  
  3:function(canvas){
/*
    var vintOpts = {
              vignette:{
                black:1,
                white:0.2
              },
              noise:20,
              screen:{
                red:220,
                green:75,
                blue:153,
                strength:0.2
              },
              desaturate:0.4,
              curves: true,
              viewFinder:'images/viewfinder_bw.jpg'
            };
*/
    $(canvas).applyFilter('grayscale'/* ,[] *//* [vintOpts] *//* , function(base64data){$('body').append('<img src="'+base64data+'" />')} */);   
  }
}


// neon

function neonLightEffect(canvas,text) {
  var ctx = canvas.getContext("2d");
	var text = text+' '+String.fromCharCode(0x2665)+" 1D";
	var font = "50px Helvetica, Arial, sans-serif";
	var jitter = 40; // the distance of the maximum jitter
	var offsetX = 30;
	var offsetY = 60;
	var blur = 100;//getBlurValue(100);
	ctx.save();
	ctx.font = font;
	ctx.save();
	ctx.fillStyle = "#fff";
	ctx.shadowColor = "rgba(0,0,0,1)";
	ctx.shadowOffsetX = 500;
	ctx.shadowOffsetY = 0;
	//ctx.shadowBlur = blur;
	ctx.fillText(text, offsetX, offsetY);
	ctx.restore();
	ctx.fillStyle = "rgba(255,255,255,0.8)";
	ctx.fillText(text, offsetX, offsetY);
	// created jittered stroke
	ctx.lineWidth = 0.80;
	ctx.strokeStyle = "rgba(255,255,255,0.2)";
	var i = 10; while(i--) { 
		var left = jitter / 2 - Math.random() * jitter;
		var top = jitter / 2 - Math.random() * jitter;
		ctx.strokeText(text, left+offsetX, top+offsetY);
	}	
	ctx.strokeStyle = "rgba(0,0,0,0.20)";
	ctx.strokeText(text, offsetX, offsetY);
	ctx.restore();
};


function HSV_to_RGB(h, s, v) {
  if(h === null) { return [ v, v, v ]; }
  var i = Math.floor(h);
  var f = i%2 ? h-i : 1-(h-i);
  var m = v * (1 - s);
  var n = v * (1 - s*f);
  switch(i) {
    case 6:
    case 0: return [v,n,m];
    case 1: return [n,v,m];
    case 2: return [m,v,n];
    case 3: return [m,n,v];
    case 4: return [n,m,v];
    case 5: return [v,m,n];
  }
}

function RGB_to_HSV(r,g,b) {
  r<0 && (r=0) || r>1 && (r=1);
  g<0 && (g=0) || g>1 && (g=1);
  b<0 && (b=0) || b>1 && (b=1);
  var n = Math.min(Math.min(r,g),b);
  var v = Math.max(Math.max(r,g),b);
  var m = v - n;
  if(m === 0) { return [ null, 0, v ]; }
  var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
  return [ h===6?0:h, m/v, v ];
};






/// lesh's library


(function ($) {
  $.fn.applyFilter = function (filtername, opts, callback) {

    if (!filtername || (filtername && typeof filtername != 'string')) return false;

    if (!(opts instanceof Array)) {
      opts = [];
    }

    if (!callback || (callback && typeof callback != 'function')) {
      callback = function (base64data) {
      };
    }

    return this.each(function () {
      var that = $(this);
      var ctx = that[0].getContext('2d');

      var Filters = {};

      if (typeof Float32Array == 'undefined') {
        Filters.getFloat32Array =
                Filters.getUint8Array = function (len) {
                  if (len.length) {
                    return len.slice(0);
                  }
                  return new Array(len);
                };
      } else {
        Filters.getFloat32Array = function (len) {
          return new Float32Array(len);
        };
        Filters.getUint8Array = function (len) {
          return new Uint8Array(len);
        };
      }

      Filters.getPixels = function () {
        return ctx.getImageData(0, 0, that[0].width, that[0].height);//that.width(), that.height());
      };

      Filters.createImageData = function (w, h) {
        return ctx.createImageData(w, h);
      };

      Filters.getCanvas = function (w, h) {
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
      };

      Filters.filterImage = function (filter, var_args, callback) {
        var args = [this.getPixels()];
        for (var i = 0; i < var_args.length; i++) {
          args.push(var_args[i]);
        }
        if (filtername == 'vintage') {
          args.push(function (pixels) {
            callback(pixels);
          });
          filter.apply(this, args);
        } else {
          return filter.apply(this, args);
        }
      };

      Filters.toCanvas = function (pixels) {
        var canvas = this.getCanvas(pixels.width, pixels.height);
        canvas.getContext('2d').putImageData(pixels, 0, 0);
        return canvas;
      };

      Filters.toImageData = function (pixels) {
        return this.identity(pixels);
      };

      function init() {
        if (filtername == 'vintage') {
          Filters.filterImage(Filters[filtername], opts, function (pixels) {
            ctx.putImageData(pixels, 0, 0);
            callback(that[0].toDataURL("image/jpg"));
          });

        } else {
          var res = Filters.filterImage(Filters[filtername], opts);
          ctx.putImageData(res, 0, 0);
          callback(that[0].toDataURL("image/jpg"));
        }

      }

      //all filters

      Filters.runPipeline = function (ds) {
        var res = null;
        res = this[ds[0].name].apply(this, ds[0].args);
        for (var i = 1; i < ds.length; i++) {
          var d = ds[i];
          var args = d.args.slice(0);
          args.unshift(res);
          res = this[d.name].apply(this, args);
        }
        return res;
      };

      Filters.createImageDataFloat32 = function (w, h) {
        return {width:w, height:h, data:this.getFloat32Array(w * h * 4)};
      };

      Filters.identity = function (pixels, args) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var dst = output.data;
        var d = pixels.data;
        for (var i = 0; i < d.length; i++) {
          dst[i] = d[i];
        }
        return output;
      };

      Filters.horizontalFlip = function (pixels) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var w = pixels.width;
        var h = pixels.height;
        var dst = output.data;
        var d = pixels.data;
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var off = (y * w + x) * 4;
            var dstOff = (y * w + (w - x - 1)) * 4;
            dst[dstOff] = d[off];
            dst[dstOff + 1] = d[off + 1];
            dst[dstOff + 2] = d[off + 2];
            dst[dstOff + 3] = d[off + 3];
          }
        }
        return output;
      };

      Filters.verticalFlip = function (pixels) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var w = pixels.width;
        var h = pixels.height;
        var dst = output.data;
        var d = pixels.data;
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var off = (y * w + x) * 4;
            var dstOff = ((h - y - 1) * w + x) * 4;
            dst[dstOff] = d[off];
            dst[dstOff + 1] = d[off + 1];
            dst[dstOff + 2] = d[off + 2];
            dst[dstOff + 3] = d[off + 3];
          }
        }
        return output;
      };

      Filters.luminance = function (pixels, args) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var dst = output.data;
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i];
          var g = d[i + 1];
          var b = d[i + 2];
          // CIE luminance for the RGB
          var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          dst[i] = dst[i + 1] = dst[i + 2] = v;
          dst[i + 3] = d[i + 3];
        }
        return output;
      };

      Filters.grayscale = function (pixels, args) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var dst = output.data;
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i];
          var g = d[i + 1];
          var b = d[i + 2];
          var v = 0.3 * r + 0.59 * g + 0.11 * b;
          dst[i] = dst[i + 1] = dst[i + 2] = v;
          dst[i + 3] = d[i + 3];
        }
        return output;
      };

      Filters.grayscaleAvg = function (pixels, args) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var dst = output.data;
        var d = pixels.data;
        var f = 1 / 3;
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i];
          var g = d[i + 1];
          var b = d[i + 2];
          var v = (r + g + b) * f;
          dst[i] = dst[i + 1] = dst[i + 2] = v;
          dst[i + 3] = d[i + 3];
        }
        return output;
      };

      Filters.threshold = function (pixels, threshold, high, low) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        if (high == null) high = 255;
        if (low == null) low = 0;
        var d = pixels.data;
        var dst = output.data;
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i];
          var g = d[i + 1];
          var b = d[i + 2];
          var v = (0.3 * r + 0.59 * g + 0.11 * b >= threshold) ? high : low;
          dst[i] = dst[i + 1] = dst[i + 2] = v;
          dst[i + 3] = d[i + 3];
        }
        return output;
      };

      Filters.invert = function (pixels) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var d = pixels.data;
        var dst = output.data;
        for (var i = 0; i < d.length; i += 4) {
          dst[i] = 255 - d[i];
          dst[i + 1] = 255 - d[i + 1];
          dst[i + 2] = 255 - d[i + 2];
          dst[i + 3] = d[i + 3];
        }
        return output;
      };

      Filters.brightnessContrast = function (pixels, brightness, contrast) {
        var lut = this.brightnessContrastLUT(brightness, contrast);
        return this.applyLUT(pixels, {r:lut, g:lut, b:lut, a:this.identityLUT()});
      };

      Filters.applyLUT = function (pixels, lut) {
        var output = Filters.createImageData(pixels.width, pixels.height);
        var d = pixels.data;
        var dst = output.data;
        var r = lut.r;
        var g = lut.g;
        var b = lut.b;
        var a = lut.a;
        for (var i = 0; i < d.length; i += 4) {
          dst[i] = r[d[i]];
          dst[i + 1] = g[d[i + 1]];
          dst[i + 2] = b[d[i + 2]];
          dst[i + 3] = a[d[i + 3]];
        }
        return output;
      };

      Filters.createLUTFromCurve = function (points) {
        var lut = this.getUint8Array(256);
        var p = [0, 0];
        for (var i = 0, j = 0; i < lut.length; i++) {
          while (j < points.length && points[j][0] < i) {
            p = points[j];
            j++;
          }
          lut[i] = p[1];
        }
        return lut;
      };

      Filters.identityLUT = function () {
        var lut = this.getUint8Array(256);
        for (var i = 0; i < lut.length; i++) {
          lut[i] = i;
        }
        return lut;
      };

      Filters.invertLUT = function () {
        var lut = this.getUint8Array(256);
        for (var i = 0; i < lut.length; i++) {
          lut[i] = 255 - i;
        }
        return lut;
      };

      Filters.brightnessContrastLUT = function (brightness, contrast) {
        var lut = this.getUint8Array(256);
        var contrastAdjust = -128 * contrast + 128;
        var brightnessAdjust = 255 * brightness;
        var adjust = contrastAdjust + brightnessAdjust;
        for (var i = 0; i < lut.length; i++) {
          var c = i * contrast + adjust;
          lut[i] = c < 0 ? 0 : (c > 255 ? 255 : c);
        }
        return lut;
      };

      Filters.convolve = function (pixels, weights, opaque) {
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);

        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;

        var w = sw;
        var h = sh;
        var output = Filters.createImageData(w, h);
        var dst = output.data;

        var alphaFac = opaque ? 1 : 0;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
              for (var cx = 0; cx < side; cx++) {
                var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                var srcOff = (scy * sw + scx) * 4;
                var wt = weights[cy * side + cx];
                r += src[srcOff] * wt;
                g += src[srcOff + 1] * wt;
                b += src[srcOff + 2] * wt;
                a += src[srcOff + 3] * wt;
              }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
          }
        }
        return output;
      };

      Filters.verticalConvolve = function (pixels, weightsVector, opaque) {
        var side = weightsVector.length;
        var halfSide = Math.floor(side / 2);

        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;

        var w = sw;
        var h = sh;
        var output = Filters.createImageData(w, h);
        var dst = output.data;

        var alphaFac = opaque ? 1 : 0;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
              var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
              var scx = sx;
              var srcOff = (scy * sw + scx) * 4;
              var wt = weightsVector[cy];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
          }
        }
        return output;
      };

      Filters.horizontalConvolve = function (pixels, weightsVector, opaque) {
        var side = weightsVector.length;
        var halfSide = Math.floor(side / 2);

        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;

        var w = sw;
        var h = sh;
        var output = Filters.createImageData(w, h);
        var dst = output.data;

        var alphaFac = opaque ? 1 : 0;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cx = 0; cx < side; cx++) {
              var scy = sy;
              var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
              var srcOff = (scy * sw + scx) * 4;
              var wt = weightsVector[cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
          }
        }
        return output;
      };

      Filters.separableConvolve = function (pixels, horizWeights, vertWeights, opaque) {
        return this.horizontalConvolve(
                this.verticalConvolveFloat32(pixels, vertWeights, opaque),
                horizWeights, opaque
        );
      };

      Filters.convolveFloat32 = function (pixels, weights, opaque) {
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);

        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;

        var w = sw;
        var h = sh;
        var output = Filters.createImageDataFloat32(w, h);
        var dst = output.data;

        var alphaFac = opaque ? 1 : 0;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
              for (var cx = 0; cx < side; cx++) {
                var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                var srcOff = (scy * sw + scx) * 4;
                var wt = weights[cy * side + cx];
                r += src[srcOff] * wt;
                g += src[srcOff + 1] * wt;
                b += src[srcOff + 2] * wt;
                a += src[srcOff + 3] * wt;
              }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
          }
        }
        return output;
      };


      Filters.verticalConvolveFloat32 = function (pixels, weightsVector, opaque) {
        var side = weightsVector.length;
        var halfSide = Math.floor(side / 2);

        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;

        var w = sw;
        var h = sh;
        var output = Filters.createImageDataFloat32(w, h);
        var dst = output.data;

        var alphaFac = opaque ? 1 : 0;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
              var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
              var scx = sx;
              var srcOff = (scy * sw + scx) * 4;
              var wt = weightsVector[cy];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
          }
        }
        return output;
      };

      Filters.horizontalConvolveFloat32 = function (pixels, weightsVector, opaque) {
        var side = weightsVector.length;
        var halfSide = Math.floor(side / 2);

        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;

        var w = sw;
        var h = sh;
        var output = Filters.createImageDataFloat32(w, h);
        var dst = output.data;

        var alphaFac = opaque ? 1 : 0;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            var r = 0, g = 0, b = 0, a = 0;
            for (var cx = 0; cx < side; cx++) {
              var scy = sy;
              var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
              var srcOff = (scy * sw + scx) * 4;
              var wt = weightsVector[cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
          }
        }
        return output;
      };

      Filters.separableConvolveFloat32 = function (pixels, horizWeights, vertWeights, opaque) {
        return this.horizontalConvolveFloat32(
                this.verticalConvolveFloat32(pixels, vertWeights, opaque),
                horizWeights, opaque
        );
      };

      Filters.gaussianBlur = function (pixels, diameter) {
        diameter = Math.abs(diameter);
        if (diameter <= 1) return Filters.identity(pixels);
        var radius = diameter / 2;
        var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2))
        var weights = this.getFloat32Array(len);
        var rho = (radius + 0.5) / 3;
        var rhoSq = rho * rho;
        var gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
        var rhoFactor = -1 / (2 * rho * rho)
        var wsum = 0;
        var middle = Math.floor(len / 2);
        for (var i = 0; i < len; i++) {
          var x = i - middle;
          var gx = gaussianFactor * Math.exp(x * x * rhoFactor);
          weights[i] = gx;
          wsum += gx;
        }
        for (var i = 0; i < weights.length; i++) {
          weights[i] /= wsum;
        }
        return Filters.separableConvolve(pixels, weights, weights, false);
      };

      Filters.laplaceKernel = Filters.getFloat32Array(
              [-1, -1, -1,
                -1, 8, -1,
                -1, -1, -1]);
      Filters.laplace = function (pixels) {
        return Filters.convolve(pixels, this.laplaceKernel, true);
      };

      Filters.sobelSignVector = Filters.getFloat32Array([-1, 0, 1]);
      Filters.sobelScaleVector = Filters.getFloat32Array([1, 2, 1]);

      Filters.sobelVerticalGradient = function (px) {
        return this.separableConvolveFloat32(px, this.sobelSignVector, this.sobelScaleVector);
      };

      Filters.sobelHorizontalGradient = function (px) {
        return this.separableConvolveFloat32(px, this.sobelScaleVector, this.sobelSignVector);
      };

      Filters.sobelVectors = function (px) {
        var vertical = this.sobelVerticalGradient(px);
        var horizontal = this.sobelHorizontalGradient(px);
        var id = {width:vertical.width, height:vertical.height,
          data:this.getFloat32Array(vertical.width * vertical.height * 8)};
        var vd = vertical.data;
        var hd = horizontal.data;
        var idd = id.data;
        for (var i = 0, j = 0; i < idd.length; i += 2, j++) {
          idd[i] = hd[j];
          idd[i + 1] = vd[j];
        }
        return id;
      };

      Filters.sobel = function (px) {
        px = this.grayscale(px);
        var vertical = this.sobelVerticalGradient(px);
        var horizontal = this.sobelHorizontalGradient(px);
        var id = this.createImageData(vertical.width, vertical.height);
        for (var i = 0; i < id.data.length; i += 4) {
          var v = Math.abs(vertical.data[i]);
          id.data[i] = v;
          var h = Math.abs(horizontal.data[i]);
          id.data[i + 1] = h;
          id.data[i + 2] = (v + h) / 4;
          id.data[i + 3] = 255;
        }
        return id;
      };

      Filters.bilinearSample = function (pixels, x, y, rgba) {
        var x1 = Math.floor(x);
        var x2 = Math.ceil(x);
        var y1 = Math.floor(y);
        var y2 = Math.ceil(y);
        var a = (x1 + pixels.width * y1) * 4;
        var b = (x2 + pixels.width * y1) * 4;
        var c = (x1 + pixels.width * y2) * 4;
        var d = (x2 + pixels.width * y2) * 4;
        var df = ((x - x1) + (y - y1));
        var cf = ((x2 - x) + (y - y1));
        var bf = ((x - x1) + (y2 - y));
        var af = ((x2 - x) + (y2 - y));
        var rsum = 1 / (af + bf + cf + df);
        af *= rsum;
        bf *= rsum;
        cf *= rsum;
        df *= rsum;
        var data = pixels.data;
        rgba[0] = data[a] * af + data[b] * bf + data[c] * cf + data[d] * df;
        rgba[1] = data[a + 1] * af + data[b + 1] * bf + data[c + 1] * cf + data[d + 1] * df;
        rgba[2] = data[a + 2] * af + data[b + 2] * bf + data[c + 2] * cf + data[d + 2] * df;
        rgba[3] = data[a + 3] * af + data[b + 3] * bf + data[c + 3] * cf + data[d + 3] * df;
        return rgba;
      };

      Filters.distortSine = function (pixels, amount, yamount) {
        if (amount == null) amount = 0.5;
        if (yamount == null) yamount = amount;
        var output = this.createImageData(pixels.width, pixels.height);
        var dst = output.data;
        var d = pixels.data;
        var px = this.createImageData(1, 1).data;
        for (var y = 0; y < output.height; y++) {
          var sy = -Math.sin(y / (output.height - 1) * Math.PI * 2);
          var srcY = y + sy * yamount * output.height / 4;
          srcY = Math.max(Math.min(srcY, output.height - 1), 0);

          for (var x = 0; x < output.width; x++) {
            var sx = -Math.sin(x / (output.width - 1) * Math.PI * 2);
            var srcX = x + sx * amount * output.width / 4;
            srcX = Math.max(Math.min(srcX, output.width - 1), 0);

            var rgba = this.bilinearSample(pixels, srcX, srcY, px);

            var off = (y * output.width + x) * 4;
            dst[off] = rgba[0];
            dst[off + 1] = rgba[1];
            dst[off + 2] = rgba[2];
            dst[off + 3] = rgba[3];
          }
        }
        return output;
      };

      Filters.darkenBlend = function (below, above) {
        var output = Filters.createImageData(below.width, below.height);
        var a = below.data;
        var b = above.data;
        var dst = output.data;
        var f = 1 / 255;
        for (var i = 0; i < a.length; i += 4) {
          dst[i] = a[i] < b[i] ? a[i] : b[i];
          dst[i + 1] = a[i + 1] < b[i + 1] ? a[i + 1] : b[i + 1];
          dst[i + 2] = a[i + 2] < b[i + 2] ? a[i + 2] : b[i + 2];
          dst[i + 3] = a[i + 3] + ((255 - a[i + 3]) * b[i + 3]) * f;
        }
        return output;
      };

      Filters.lightenBlend = function (below, above) {
        var output = Filters.createImageData(below.width, below.height);
        var a = below.data;
        var b = above.data;
        var dst = output.data;
        var f = 1 / 255;
        for (var i = 0; i < a.length; i += 4) {
          dst[i] = a[i] > b[i] ? a[i] : b[i];
          dst[i + 1] = a[i + 1] > b[i + 1] ? a[i + 1] : b[i + 1];
          dst[i + 2] = a[i + 2] > b[i + 2] ? a[i + 2] : b[i + 2];
          dst[i + 3] = a[i + 3] + ((255 - a[i + 3]) * b[i + 3]) * f;
        }
        return output;
      };

      Filters.multiplyBlend = function (below, above) {
        var output = Filters.createImageData(below.width, below.height);
        var a = below.data;
        var b = above.data;
        var dst = output.data;
        var f = 1 / 255;
        for (var i = 0; i < a.length; i += 4) {
          dst[i] = (a[i] * b[i]) * f;
          dst[i + 1] = (a[i + 1] * b[i + 1]) * f;
          dst[i + 2] = (a[i + 2] * b[i + 2]) * f;
          dst[i + 3] = a[i + 3] + ((255 - a[i + 3]) * b[i + 3]) * f;
        }
        return output;
      };

      Filters.screenBlend = function (below, above) {
        var output = Filters.createImageData(below.width, below.height);
        var a = below.data;
        var b = above.data;
        var dst = output.data;
        var f = 1 / 255;
        for (var i = 0; i < a.length; i += 4) {
          dst[i] = a[i] + b[i] - a[i] * b[i] * f;
          dst[i + 1] = a[i + 1] + b[i + 1] - a[i + 1] * b[i + 1] * f;
          dst[i + 2] = a[i + 2] + b[i + 2] - a[i + 2] * b[i + 2] * f;
          dst[i + 3] = a[i + 3] + ((255 - a[i + 3]) * b[i + 3]) * f;
        }
        return output;
      };

      Filters.addBlend = function (below, above) {
        var output = Filters.createImageData(below.width, below.height);
        var a = below.data;
        var b = above.data;
        var dst = output.data;
        var f = 1 / 255;
        for (var i = 0; i < a.length; i += 4) {
          dst[i] = (a[i] + b[i]);
          dst[i + 1] = (a[i + 1] + b[i + 1]);
          dst[i + 2] = (a[i + 2] + b[i + 2]);
          dst[i + 3] = a[i + 3] + ((255 - a[i + 3]) * b[i + 3]) * f;
        }
        return output;
      };

      Filters.subBlend = function (below, above) {
        var output = Filters.createImageData(below.width, below.height);
        var a = below.data;
        var b = above.data;
        var dst = output.data;
        var f = 1 / 255;
        for (var i = 0; i < a.length; i += 4) {
          dst[i] = (a[i] + b[i] - 255);
          dst[i + 1] = (a[i + 1] + b[i + 1] - 255);
          dst[i + 2] = (a[i + 2] + b[i + 2] - 255);
          dst[i + 3] = a[i + 3] + ((255 - a[i + 3]) * b[i + 3]) * f;
        }
        return output;
      };

      Filters.differenceBlend = function (below, above) {
        var output = Filters.createImageData(below.width, below.height);
        var a = below.data;
        var b = above.data;
        var dst = output.data;
        var f = 1 / 255;
        for (var i = 0; i < a.length; i += 4) {
          dst[i] = Math.abs(a[i] - b[i]);
          dst[i + 1] = Math.abs(a[i + 1] - b[i + 1]);
          dst[i + 2] = Math.abs(a[i + 2] - b[i + 2]);
          dst[i + 3] = a[i + 3] + ((255 - a[i + 3]) * b[i + 3]) * f;
        }
        return output;
      };

      Filters.vintage = function (pixels, options, returnPixels) {

        //RGB-Curves for vintage effect

        var r = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
                g = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
                b = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];


        if (options.screen) {
          for (var i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i  ] = 255 - ((255 - pixels.data[i  ]) * (255 - options.screen.red * options.screen.strength) / 255);
            pixels.data[i + 1] = 255 - ((255 - pixels.data[i + 1]) * (255 - options.screen.green * options.screen.strength) / 255);
            pixels.data[i + 2] = 255 - ((255 - pixels.data[i + 2]) * (255 - options.screen.blue * options.screen.strength) / 255);
          }
        }

        if (options.desaturate) {
          for (var i = 0; i < pixels.data.length; i += 4) {
            var average = ( pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2] ) / 3;

            pixels.data[i  ] += Math.round(( average - pixels.data[i  ] ) * options.desaturate);
            pixels.data[i + 1] += Math.round(( average - pixels.data[i + 1] ) * options.desaturate);
            pixels.data[i + 2] += Math.round(( average - pixels.data[i + 2] ) * options.desaturate);
          }
        }

        if (options.vignette) {
          var gradient;
          var outerRadius = Math.sqrt(Math.pow(that[0].width / 2, 2) + Math.pow(that[0].height / 2, 2));

          ctx.putImageData(pixels, 0, 0);

          ctx.globalCompositeOperation = 'source-over';
          gradient = ctx.createRadialGradient(that[0].width / 2, that[0].height / 2, 0, that[0].width / 2, that[0].height / 2, outerRadius);
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, 'rgba(0,0,0,' + options.vignette.black + ')');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, that[0].width, that[0].height);

          ctx.globalCompositeOperation = 'lighter';
          gradient = ctx.createRadialGradient(that[0].width / 2, that[0].height / 2, 0, that[0].width / 2, that[0].height / 2, outerRadius);
          gradient.addColorStop(0, 'rgba(255,255,255,' + options.vignette.white + ')');
          gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, that[0].width, that[0].height);

          pixels = ctx.getImageData(0, 0, that[0].width, that[0].height);
        }

        if (options.noise) {
          for (var i = 0; i < pixels.data.length; i += 4) {
            var noise = Math.round(options.noise - Math.random() * options.noise / 2);

            var dblHlp = 0;
            for (var k = 0; k < 3; k++) {
              dblHlp = noise + pixels.data[i + k];
              pixels.data[i + k] = ((dblHlp > 255) ? 255 : ((dblHlp < 0) ? 0 : dblHlp));
            }
          }
        }

        if (options.curves) {
          for (var i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i] = r[pixels.data[i]];
            pixels.data[i + 1] = g[pixels.data[i + 1]];
            pixels.data[i + 2] = b[pixels.data[i + 2]];
          }
        }

        if (options.viewFinder) {
          var img = new Image();
          img.src = options.viewFinder;
          img.onload = function () {

            var viewFinderCanvas = jQuery('<canvas></canvas>').get(0);
            var viewFinderCtx = viewFinderCanvas.getContext('2d');

            viewFinderCanvas.width = that[0].width;
            viewFinderCanvas.height = that[0].height;

            viewFinderCtx.drawImage(this, 0, 0, this.width, this.height, 0, 0, that[0].width, that[0].height);
            var viewFinderImageData = viewFinderCtx.getImageData(0, 0, that[0].width, that[0].height);

            for (var a = 0; a < pixels.data.length; a += 4) {
              //red channel
              var red = ( pixels.data[a] * viewFinderImageData.data[a]) / 255;
              pixels.data[a  ] = red > 255 ? 255 : red < 0 ? 0 : red;
              //green channel
              var green = ( pixels.data[a + 1] * viewFinderImageData.data[a + 1]) / 255;
              pixels.data[a + 1] = green > 255 ? green : green < 0 ? 0 : green;
              //blue channel
              var blue = ( pixels.data[a + 2] * viewFinderImageData.data[a + 2]) / 255;
              pixels.data[a + 2] = blue > 255 ? 255 : blue < 0 ? 0 : blue;
            }
            returnPixels(pixels);
          }
        } else {
          returnPixels(pixels);
        }
      };

      init();
    });


  }
})(jQuery);





