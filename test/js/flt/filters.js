function FilterTool() {

	this.applyFilters = function(pixels, options, callback) {

		if (!options || !options.length) {
			callback(pixels);
			return;
		}

		var that = this;
		var data = null, count = 0, prev = true;

		var interval = setInterval(function() {

			if (!prev) return;

			prev = false;

			if (count == options.length) {
				clearInterval(interval);
				callback(data);
			}

			for (var j in options[count]) {
				var args = [data || pixels];
				for (var qq = 0; qq < options[count][j].length; qq++) {
					args.push(options[count][j][qq]);
				}
				args.push(complete);
				that[j].apply(that, args);
			}

		}, 200);

		function complete(pixels) {
			data = pixels;
			prev = true;
			count++;
		}
	};

  var rgbaSum = function(c2, c1){
    var a = c1.a + c2.a*(1-c1.a);
    return {
      r: (c1.r * c1.a  + c2.r * c2.a * (1 - c1.a)) / a,
      g: (c1.g * c1.a  + c2.g * c2.a * (1 - c1.a)) / a,
      b: (c1.b * c1.a  + c2.b * c2.a * (1 - c1.a)) / a,
      a: a
    }
  };

  this.blendImage = function(pixels, url, blendAlpha, callback) {
    var img = new Image();
    img.src = url;
    img.onload = function() {

      var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');

      canvas.width = pixels.width;
      canvas.height = pixels.height;

      ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, pixels.width, pixels.height);
      var viewFinderImageData = ctx.getImageData(0, 0, pixels.width, pixels.height);

      for (var a = 0; a < pixels.data.length; a += 4) {
        var rr = rgbaSum({
          r:pixels.data[a+0]/255,
          g:pixels.data[a+1]/255,
          b:pixels.data[a+2]/255,
          a:pixels.data[a+3]/255
        },{
          r:viewFinderImageData.data[a+0]/255,
          g:viewFinderImageData.data[a+1]/255,
          b:viewFinderImageData.data[a+2]/255,
          a:viewFinderImageData.data[a+3]/255*blendAlpha
        });
        pixels.data[a    ] = rr.r*255;
        pixels.data[a + 1] = rr.g*255;
        pixels.data[a + 2] = rr.b*255;
        pixels.data[a + 3] = rr.a*255;

//				//red channel
//				var red = ( pixels.data[a] * viewFinderImageData.data[a]) / 255;
//				pixels.data[a  ] = red > 255 ? 255 : red < 0 ? 0 : red;
//				//green channel
//				var green = ( pixels.data[a + 1] * viewFinderImageData.data[a + 1]) / 255;
//				pixels.data[a + 1] = green > 255 ? green : green < 0 ? 0 : green;
//				//blue channel
//				var blue = ( pixels.data[a + 2] * viewFinderImageData.data[a + 2]) / 255;
//				pixels.data[a + 2] = blue > 255 ? 255 : blue < 0 ? 0 : blue;
      }
      callback(pixels);
    }
  };

	this.viewfinder = function(pixels, url, callback) {
		var img = new Image();
		img.src = url;
		img.onload = function() {

			var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');

			canvas.width = pixels.width;
			canvas.height = pixels.height;

			ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, pixels.width, pixels.height);
			var viewFinderImageData = ctx.getImageData(0, 0, pixels.width, pixels.height);

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
			callback(pixels);
		}
	};

	this.vignette = function(pixels, black, white, callback) {
		var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
		// set the dimensions
		ctx.width = canvas.width = pixels.width;
		ctx.height = canvas.height = pixels.height;

		var gradient;
		var outerRadius = Math.sqrt(Math.pow(pixels.width / 2, 2) + Math.pow(pixels.height / 2, 2));

		ctx.putImageData(pixels, 0, 0);

		ctx.globalCompositeOperation = 'source-over';
		gradient = ctx.createRadialGradient(pixels.width / 2, pixels.height / 2, 0, pixels.width / 2, pixels.height / 2, outerRadius);
		gradient.addColorStop(0, 'rgba(0,0,0,0)');
		gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
		gradient.addColorStop(1, 'rgba(0,0,0,' + black + ')');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, pixels.width, pixels.height);

		ctx.globalCompositeOperation = 'lighter';
		gradient = ctx.createRadialGradient(pixels.width / 2, pixels.height / 2, 0, pixels.width / 2, pixels.height / 2, outerRadius);
		gradient.addColorStop(0, 'rgba(255,255,255,' + white + ')');
		gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
		gradient.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, pixels.width, pixels.height);

		var data = ctx.getImageData(0, 0, canvas.width, canvas.height);

		if (callback) {
			callback(data);
		} else {
			return data;
		}
	};

	this.blur = function(pixels, amount, callback) {
		var width = pixels.width, width4 = width << 2, height = pixels.height;

		if (pixels) {
			var data = pixels.data;

			// compute coefficients as a function of amount
			var q;
			if (amount < 0.0) {
				amount = 0.0;
			}
			if (amount >= 2.5) {
				q = 0.98711 * amount - 0.96330;
			} else if (amount >= 0.5) {
				q = 3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * amount);
			} else {
				q = 2 * amount * (3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * 0.5));
			}

			//compute b0, b1, b2, and b3
			var qq = q * q;
			var qqq = qq * q;
			var b0 = 1.57825 + (2.44413 * q) + (1.4281 * qq ) + (0.422205 * qqq);
			var b1 = ((2.44413 * q) + (2.85619 * qq) + (1.26661 * qqq)) / b0;
			var b2 = (-((1.4281 * qq) + (1.26661 * qqq))) / b0;
			var b3 = (0.422205 * qqq) / b0;
			var bigB = 1.0 - (b1 + b2 + b3);

			// horizontal
			for (var c = 0; c < 3; c++) {
				for (var y = 0; y < height; y++) {
					// forward
					var index = y * width4 + c;
					var indexLast = y * width4 + ((width - 1) << 2) + c;
					var pixel = data[index];
					var ppixel = pixel;
					var pppixel = ppixel;
					var ppppixel = pppixel;
					for (; index <= indexLast; index += 4) {
						pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
						data[index] = pixel;
						ppppixel = pppixel;
						pppixel = ppixel;
						ppixel = pixel;
					}
					// backward
					index = y * width4 + ((width - 1) << 2) + c;
					indexLast = y * width4 + c;
					pixel = data[index];
					ppixel = pixel;
					pppixel = ppixel;
					ppppixel = pppixel;
					for (; index >= indexLast; index -= 4) {
						pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
						data[index] = pixel;
						ppppixel = pppixel;
						pppixel = ppixel;
						ppixel = pixel;
					}
				}
			}

			// vertical
			for (var c = 0; c < 3; c++) {
				for (var x = 0; x < width; x++) {
					// forward
					var index = (x << 2) + c;
					var indexLast = (height - 1) * width4 + (x << 2) + c;
					var pixel = data[index];
					var ppixel = pixel;
					var pppixel = ppixel;
					var ppppixel = pppixel;
					for (; index <= indexLast; index += width4) {
						pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
						data[index] = pixel;
						ppppixel = pppixel;
						pppixel = ppixel;
						ppixel = pixel;
					}
					// backward
					index = (height - 1) * width4 + (x << 2) + c;
					indexLast = (x << 2) + c;
					pixel = data[index];
					ppixel = pixel;
					pppixel = ppixel;
					ppppixel = pppixel;
					for (; index >= indexLast; index -= width4) {
						pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
						data[index] = pixel;
						ppppixel = pppixel;
						pppixel = ppixel;
						ppixel = pixel;
					}
				}

			}
			if (callback) {
				callback(pixels);
			} else {
				return pixels;
			}
		}
	};

	this.grayscale = function(pixels, opacity, callback) {
		var data = pixels.data;
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i], g = data[i + 1], b = data[i + 2];
			var val = (r * 0.21) + (g * 0.71) + (b * 0.07);
			data = setRGB(data, i, findColorDifference(opacity, val, r), findColorDifference(opacity, val, g), findColorDifference(opacity, val, b));
		}
		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.noise = function(pixels, amount, type, callback) {
		var data = pixels.data;
		for (var i = 0; i < data.length; i += 4) {
			var val = noise(amount);
			var r = data[i], g = data[i + 1], b = data[i + 2];
			if (type == "mono") {
				data = setRGB(data, i, checkRGBBoundary(r + val), checkRGBBoundary(g + val), checkRGBBoundary(b + val));
			} else {
				data = setRGB(data, i, checkRGBBoundary(r + noise(amount)), checkRGBBoundary(g + noise(amount)), checkRGBBoundary(b + noise(amount)));
			}
		}

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.posterize = function(pixels, amount, opacity, callback) {
		var posterizeAreas = 256 / amount, posterizeValues = 255 / (amount - 1);
		var data = pixels.data;
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i], g = data[i + 1], b = data[i + 2];
			data = setRGB(data, i, findColorDifference(opacity, parseInt(posterizeValues * parseInt(r / posterizeAreas)), r), findColorDifference(opacity, parseInt(posterizeValues * parseInt(g / posterizeAreas)), g), findColorDifference(opacity, parseInt(posterizeValues * parseInt(b / posterizeAreas)), b));
		}
		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.sepia = function(pixels, opacity, callback) {
		var data = pixels.data;
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i], g = data[i + 1], b = data[i + 2];
			data = setRGB(data, i, findColorDifference(opacity, (r * 0.393) + (g * 0.769) + (b * 0.189), r), findColorDifference(opacity, (r * 0.349) + (g * 0.686) + (b * 0.168), g), findColorDifference(opacity, (r * 0.272) + (g * 0.534) + (b * 0.131), b));
		}
		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.sharpen = function(pixels, amount, callback) {
		var matrix = [
			-1, -1, -1, -1, 9, -1, -1, -1, -1
		];
		var data = applyMatrix(pixels, matrix, amount);

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.tint = function(pixels, color, opacity, callback) {
		var data = pixels.data;
		var src = parseInt(createColor(color), 16), dest = {r: ((src & 0xFF0000) >> 16), g: ((src & 0x00FF00) >> 8), b: (src & 0x0000FF)};

		for (var i = 0; i < data.length; i += 4) {
			var r = data[i], g = data[i + 1], b = data[i + 2];

			data = setRGB(data, i, findColorDifference(opacity, dest.r, r), findColorDifference(opacity, dest.g, g), findColorDifference(opacity, dest.b, b));
		}

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.mosaic = function(pixels, opacity, size, callback) {
		var data = pixels.data;
		for (var i = 0; i < data.length; i += 4) {
			var pos = i >> 2;
			var stepY = Math.floor(pos / pixels.width);
			var stepY1 = stepY % size;
			var stepX = pos - (stepY * pixels.width);
			var stepX1 = stepX % size;

			if (stepY1) pos -= stepY1 * pixels.width;
			if (stepX1) pos -= stepX1;
			pos = pos << 2;

			var r = data[i], g = data[i + 1], b = data[i + 2];

			data = setRGB(data, i, findColorDifference(opacity, data[pos], r), findColorDifference(opacity, data[pos + 1], g), findColorDifference(opacity, data[pos + 2], b));
		}
		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.emboss = function(pixels, amount, callback) {
		var matrix = [
			-2, -1, 0, -1, 1, 1, 0, 1, 2
		];
		var data = applyMatrix(pixels, matrix, amount);

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.threshold = function(pixels, high, low, callback) {
		var threshold = 130;

		if (high == null) high = 255;
		if (low == null) low = 0;
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i + 1];
			var b = d[i + 2];
			var v = (0.3 * r + 0.59 * g + 0.11 * b >= threshold) ? high : low;
			d[i] = d[i + 1] = d[i + 2] = v;
			d[i + 3] = d[i + 3];
		}
		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.invert = function(pixels, callback) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			d[i] = 255 - d[i];
			d[i + 1] = 255 - d[i + 1];
			d[i + 2] = 255 - d[i + 2];
			d[i + 3] = d[i + 3];
		}

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.brightnes = function(pixels, brightness, contrast, intensity, callback) {
		var pix = pixels.data;
		var BaseY = 127;
		for (var i = 0; i < pix.length; i += 4) {
			var Y = 0.299 * pix[i] + 0.587 * pix[i + 1] + 0.114 * pix[i + 2];
			var U = (pix[i + 2] - Y) / 2.03;
			var V = (pix[i] - Y) / 1.44;
			//brightness
			if (brightness) Y += brightness;
			//contrast
			if (contrast) {
				Y = (Y - BaseY) * contrast + BaseY;
				U = U * contrast;
				V = V * contrast;
			}
			//intensity
			if (intensity) {
				U = U * intensity;
				V = V * intensity;
			}
			pix[i] = Y + 1.44 * V;
			pix[i + 1] = Y - 0.37 - 0.73 * V;
			pix[i + 2] = Y + 2.03 * U;
			pix[i] = pix[i] < 0 ? 0 : (pix[i] > 255 ? 255 : Math.floor(pix[i]));
			pix[i + 1] = pix[i + 1] < 0 ? 0 : (pix[i + 1] > 255 ? 255 : Math.floor(pix[i + 1]));
			pix[i + 2] = pix[i + 2] < 0 ? 0 : (pix[i + 2] > 255 ? 255 : Math.floor(pix[i + 2]));
		}
		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.highcontrast = function(pixels, callback) {
		var pix = pixels.data;
		var pixCount = 0;
		var i;
		var sum = 0;
		var autoContrast = [];
		for (i = 0; i < pix.length; i += 4) {
			sum += pix[i] + pix[i + 1] + pix[i + 2];
			var l = Math.floor(0.299 * pix[i] + 0.587 * pix[i + 1] + 0.114 * pix[i + 2]);
			if (!autoContrast[l]) autoContrast[l] = 0;
			autoContrast[l]++;
			pixCount++;
		}

		var st, en;
		for (st = 0; st < 255; st++) {
			if ((autoContrast[st] && autoContrast[st + 1]) || autoContrast[st] > 5)  break;
		}
		for (en = 255; en > 0; en--) {
			if ((autoContrast[en] && autoContrast[en - 1]) || autoContrast[en] > 5) break;
		}
		var gst = 95;
		var gen = 160;

		var porog = sum / pixCount;

		for (i = 0; i < pix.length; i += 4) {
			// auto contrast
			var brgt = 0.299 * pix[i] + 0.587 * pix[i + 1] + 0.114 * pix[i + 2];
			var a1 = (brgt - st);
			if (a1 < 0) a1 = 0;
			a1 /= (en - st) / 255;
			if (a1 > 255) a1 = 255;

			a1 = (a1 - gst);
			if (a1 < 0) a1 = 0;
			a1 /= (gen - gst) / 255;
			if (a1 > 255) a1 = 255;

			/*pix[i  ] = 0; // red
			 pix[i+1] = 0; // green
			 pix[i+2] = 0; // blue*/
			pix[i + 3] = 255 - a1;
		}

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.rgb_correction = function(pixels, r, g, b, callback) {

		var data = pixels.data;

		for (var i = 0; i < data.length; i+=4) {
			data[i] *= r;
			data[i+1] *= g;
			data[i+2] *= b;
		}

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.brightness = function(pixels, brightness, callback) {
		var contrast = 1;
		var lut = brightnessContrastLUT(brightness, contrast);
		var data = applyLUT(pixels, {r:lut, g:lut, b:lut, a:identityLUT()});

		if (callback) {
			callback(data);
		} else {
			return data;
		}
	};

	this.contrast = function(pixels, contrast, callback) {
		var brightness = 0;
		var lut = brightnessContrastLUT(brightness, contrast);
		var data = applyLUT(pixels, {r:lut, g:lut, b:lut, a:identityLUT()});

		if (callback) {
			callback(data);
		} else {
			return data;
		}
	};

  this.artfilter = function(imgd, blur, grsize, type, colors, callback) {
    grsize = grsize * 1;

    /*function getIndex(value, count) {
     var index = 0, step = 1/count, cur = 0;

     while(true) {

     if (value >= cur && value <= cur + step) {
     break;
     } else {
     cur += step;
     }

     index++;
     }

     return index;
     }

     if (!colors || !colors.length) {
     if (callback) {
     callback(imgd);
     return false;
     } else {
     return imgd;
     }
     }

     this.grayscale(imgd, 1);
     this.blur(imgd, blur);

     var pix = imgd.data;
     for (var i = 0, n = pix.length; i < n; i += 4) {

     var r = pix[i] / 255,
     g = pix[i + 1] / 255,
     b = pix[i + 2] / 255,
     hsv = RGB_to_HSV(r, g, b),
     index = getIndex(hsv.v, colors.length);


     if (hsv.v >= (1/colors.length * (index + 1)) - grsize && hsv.v <= (1/colors.length * (index + 1)) + grsize) {
     var cc = this.GetColorFromGradient(colors[index], colors[index + 1] || colors[index], (hsv.v - 1 / colors.length * (index + 1) + grsize) / grsize * 2);
     pix[i] = cc.r;
     pix[i + 1] = cc.g;
     pix[i + 2] = cc.b;
     //pix[i + 3] = cc.a;
     } else {
     pix[i] = colors[index].r;
     pix[i + 1] = colors[index].g;
     pix[i + 2] = colors[index].b;
     //pix[i + 3] = colors[index].a;
     }
     }*/

    function getIndex(value, count) {
      var index = 0, step = 1/count, cur = 0;

      while(true) {

        if (value >= cur && value <= cur + step) {
          break;
        } else {
          cur += step;
        }

        index++;
      }

      return index;
    }

    if (!colors || !colors.length) {
      if (callback) {
        callback(imgd);
        return false;
      } else {
        return imgd;
      }
    }

    if (type == "rgb") {
      this.grayscale(imgd, 1);
    }

    this.blur(imgd, blur);

    var pix = imgd.data;
    for (var i = 0, n = pix.length; i < n; i += 4) {

      var r = pix[i] / 255,
        g = pix[i + 1] / 255,
        b = pix[i + 2] / 255,
      //hsv = RGB_to_HSV(r, g, b),
        index = getIndex(r, colors.length),
        val = null;

      if (type == 'rgb') {
        val = RGB_to_HSV(r, g, b).v;
      } else if (type == 'r') {
        val = r;
      } else if (type == 'g') {
        val = g;
      } else if (type == 'b') {
        val = b;
      }


      if (val >= (1/colors.length * (index + 1)) - grsize && val <= (1/colors.length * (index + 1)) + grsize) {
        var cc = this.GetColorFromGradient(colors[index], colors[index + 1] || colors[index], (val - 1 / colors.length * (index + 1) + grsize) / (grsize * 2));

        var res = this.rgbaSum(cc, {r: pix[i], g: pix[i + 1], b: pix[i + 2], a: pix[i + 3] / 255});

        pix[i] = res.r;
        pix[i + 1] = res.g;
        pix[i + 2] = res.b;
        pix[i + 3] = res.a * 255;

      } else {
        var res = this.rgbaSum(
          colors[index],
          {r: pix[i], g: pix[i + 1], b: pix[i + 2], a: pix[i + 3] / 255}
        );

        pix[i] = res.r;
        pix[i + 1] = res.g;
        pix[i + 2] = res.b;
        pix[i + 3] = res.a * 255;
      }
    }

    if (callback) {
      callback(imgd);
    } else {
      return imgd;
    }
  };

  this.rgbaSum = function(c1, c2){
    var a = c1.a + c2.a*(1-c1.a);
    return {
      r: (c1.r * c1.a  + c2.r * c2.a * (1 - c1.a)) / a,
      g: (c1.g * c1.a  + c2.g * c2.a * (1 - c1.a)) / a,
      b: (c1.b * c1.a  + c2.b * c2.a * (1 - c1.a)) / a,
      a: a
    }
  };

  this.GetColorFromGradient = function(start, end, pos) {
    var nr = (end.r - start.r) * pos + start.r,
      ng = (end.g - start.g) * pos + start.g,
      nb = (end.b - start.b) * pos + start.b,
      na = (end.a - start.a) * pos + start.a;
    return { "r":nr, "g":ng, "b": nb, "a":na };
  };

	this.mcfly = function(pixels, callback) {
		var pix = pixels.data;

		var pixCount = 0;
		var i;
		var sum = 0;
		var autoContrast = [];
		for (i = 0; i < pix.length; i += 4) {
			sum += pix[i] + pix[i+1] + pix[i+2];
			var l = Math.floor(0.299*pix[i] + 0.587*pix[i+1] + 0.114*pix[i+2]);
			if(!autoContrast[l]) autoContrast[l] = 0;
			autoContrast[l]++;
			pixCount++;
		}

		var st, en;
		for(st = 0; st < 255; st++) {
			if((autoContrast[st] && autoContrast[st+1]) || autoContrast[st] > 5)  break;
		}
		for(en=255; en > 0; en--) {
			if((autoContrast[en] && autoContrast[en-1]) || autoContrast[en] > 5) break;
		}
		var gst = 95;
		var gen = 160;

		var porog = sum/pixCount;

		for (i = 0; i < pix.length; i += 4) {
			// auto contrast
			var brgt = 0.299*pix[i] + 0.587*pix[i+1] + 0.114*pix[i+2];
			var a1 = (brgt - st);
			if(a1 < 0) a1 = 0;
			a1 /= (en-st)/255;
			if(a1 > 255) a1 = 255;

			// apply Guillaume's curves
			a1 = (a1 - gst);
			if(a1 < 0) a1 = 0;
			a1 /= (gen-gst)/255;
			if(a1 > 255) a1 = 255;

			pix[i  ] = 0; // red
			pix[i+1] = 0; // green
			pix[i+2] = 0; // blue
			pix[i+3] = 255 - a1;
		}

		if (callback) {
			callback(pixels);
		} else {
			return pixels;
		}
	};

	this.distortion = function(pixels, mode, x, y, r, callback) {

		var imageO = pixels;

		var tmp = document.createElement('canvas'), ctx = tmp.getContext('2d');

		tmp.width = ctx.width = pixels.width;
		tmp.height = ctx.height = pixels.height;

		ctx.putImageData(pixels, 0, 0);

		var imageR = ctx.getImageData(0, 0, tmp.width, tmp.height);

		var imageOD = imageO.data, imageRD = imageR.data;

		var centerX = hPercents2Px(x), centerY = vPercents2Px(y);

		var radius = dPercents2Px(r);

		var modes = {
			'zoomin': function(pix, radius) {
				var newPix = {};
				newPix.offsetD = pix.offsetD * ((+Math.cos(pix.offsetD / radius * Math.PI) + 1) / 4 + 1);
				newPix.angle = grad2rad(pix.angle);
				newPix.offsetX = Math.sin(newPix.angle) * newPix.offsetD;
				newPix.offsetY = Math.cos(newPix.angle) * newPix.offsetD;
				return newPix;
			},
			'zoomout': function(pix, radius) {
				var newPix = {};
				newPix.offsetD = pix.offsetD * ((-Math.cos(pix.offsetD / radius * Math.PI) - 1) / 4 + 1);
				newPix.angle = grad2rad(pix.angle);
				newPix.offsetX = Math.sin(newPix.angle) * newPix.offsetD;
				newPix.offsetY = Math.cos(newPix.angle) * newPix.offsetD;
				return newPix;
			},
			'twistright': function(pix, radius) {
				var newPix = {};
				newPix.offsetD = pix.offsetD;
				newPix.angle = grad2rad(pix.angle + (radius - pix.offsetD) / 1);
				newPix.offsetX = Math.sin(newPix.angle) * newPix.offsetD;
				newPix.offsetY = Math.cos(newPix.angle) * newPix.offsetD;
				return newPix;
			},
			'twistleft': function(pix, radius) {
				var newPix = {};
				newPix.offsetD = pix.offsetD;
				newPix.angle = grad2rad(pix.angle - (radius - pix.offsetD) / 1);
				newPix.offsetX = Math.sin(newPix.angle) * newPix.offsetD;
				newPix.offsetY = Math.cos(newPix.angle) * newPix.offsetD;
				return newPix;
			}
		};

		for (var pixY = 0; pixY < pixels.height; pixY++) {
			for (var pixX = 0; pixX < pixels.width; pixX++) {
				var pix = {};
				pix.offsetX = (pixX - centerX);
				pix.offsetY = (pixY - centerY);
				pix.offsetD = Math.abs(Math.sqrt(Math.abs(pix.offsetX * pix.offsetX) + Math.abs(pix.offsetY * pix.offsetY)));
				pix.angle = getAngle(pix.offsetX, pix.offsetY);

				if (pix.offsetD > 0 && pix.offsetD < radius) {
					var newPix = modes[mode](pix, radius);
					var z = (pixY * pixels.width + pixX) * 4;
					var nz = ((Math.round(centerY + newPix.offsetY) * pixels.width + Math.round(centerX + newPix.offsetX))) * 4;
				} else {
					var z = (pixY * pixels.width + pixX) * 4;
					var nz = (pixY * pixels.width + pixX) * 4;
				}
				imageRD[z] = imageOD[nz] || 0; 	// red
				imageRD[z + 1] = imageOD[nz + 1] || 0; 	// green
				imageRD[z + 2] = imageOD[nz + 2] || 0; 	// blue
			}
		}

		function rad2grad(rad) {
			return rad * 180 / Math.PI;
		}

		function grad2rad(grad) {
			return grad * Math.PI / 180;
		}

		function getAngle(a, b) {
			var c = Math.sqrt(a * a + b * b);
			var nw = rad2grad(Math.asin(a / c));
			if (a < 0 && b < 0) {
				nw = -nw - 180;
			} else if (b < 0) {
				nw = 180 - nw;
			}
			return nw;
		}

		function vPercents2Px(per) {
			return Math.ceil((pixels.height / 100) * per);
		}

		function hPercents2Px(per) {
			return Math.ceil((pixels.width / 100) * per);
		}

		function dPercents2Px(per) { // dagonal
			var w = pixels.width;
			var h = pixels.height;
			return Math.ceil((Math.sqrt(w * w + h * h) / 100) * per);
		}

		function vPx2Percents(px) {
			return Math.ceil(px * 100 / pixels.height);
		}

		function hPx2Percents(px) {
			return Math.ceil(px * 100 / pixels.width);
		}

		function dPx2Percents(px) { // dagonal
			var w = pixels.width;
			var h = pixels.height;
			return Math.ceil(px * 100 / Math.sqrt(w * w + h * h));
		}

		if (callback) {
			callback(imageR);
		} else {
			return imageR;
		}
	};

	function applyLUT(pixels, lut) {
		var tmp = document.createElement('canvas'), ctx = tmp.getContext('2d');

		tmp.width = ctx.width = pixels.width;
		tmp.height = ctx.height = pixels.height;

		ctx.putImageData(pixels, 0, 0);

		var output = ctx.getImageData(0, 0, tmp.width, tmp.height);
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
	}

	function brightnessContrastLUT(brightness, contrast) {
		var lut = getUint8Array(256);
		var contrastAdjust = -128 * contrast + 128;
		var brightnessAdjust = 255 * brightness;
		var adjust = contrastAdjust + brightnessAdjust;
		for (var i = 0; i < lut.length; i++) {
			var c = i * contrast + adjust;
			lut[i] = c < 0 ? 0 : (c > 255 ? 255 : c);
		}
		return lut;
	}

	function identityLUT() {
		var lut = getUint8Array(256);
		for (var i = 0; i < lut.length; i++) {
			lut[i] = i;
		}
		return lut;
	}

	function getUint8Array(len) {
		if (len.length) {
			return len.slice(0);
		}
		return new Array(len);
	}

	// apply a convolution matrix
	function applyMatrix(pixels, matrix, amount) {

		// create a second buffer to hold matrix results
		var buffer2 = document.createElement("canvas");
		// get the canvas context
		var c2 = buffer2.getContext('2d');

		// set the dimensions
		c2.width = buffer2.width = pixels.width;
		c2.height = buffer2.height = pixels.height;

		// draw the image to the new buffer
		c2.putImageData(pixels, 0, 0);
		var bufferedPixels = c2.getImageData(0, 0, pixels.width, pixels.height);

		// speed up access
		var data = pixels.data, bufferedData = bufferedPixels.data, imgWidth = pixels.width;

		// make sure the matrix adds up to 1
		/* 		matrix = normalizeMatrix(matrix); */

		// calculate the size of the matrix
		var matrixSize = Math.sqrt(matrix.length);
		// also store the size of the kernel radius (half the size of the matrix)
		var kernelRadius = Math.floor(matrixSize / 2);

		// loop through every pixel
		for (var i = 1; i < imgWidth - 1; i++) {
			for (var j = 1; j < pixels.height - 1; j++) {

				// temporary holders for matrix results
				var sumR = sumG = sumB = 0;

				// loop through the matrix itself
				for (var h = 0; h < matrixSize; h++) {
					for (var w = 0; w < matrixSize; w++) {

						// get a refence to a pixel position in the matrix
						var r = convertCoordinates(i + w - kernelRadius, j + h - kernelRadius, imgWidth) << 2;

						// find RGB values for that pixel
						var currentPixel = {
							r: bufferedData[r],
							g: bufferedData[r + 1],
							b: bufferedData[r + 2]
						};

						// apply the value from the current matrix position
						sumR += currentPixel.r * matrix[w + h * matrixSize];
						sumG += currentPixel.g * matrix[w + h * matrixSize];
						sumB += currentPixel.b * matrix[w + h * matrixSize];
					}
				}

				// get a reference for the final pixel
				var ref = convertCoordinates(i, j, imgWidth) << 2;
				var thisPixel = {
					r: data[ref],
					g: data[ref + 1],
					b: data[ref + 2]
				};

				// finally, apply the adjusted values
				data = setRGB(data, ref, findColorDifference(amount, sumR, thisPixel.r), findColorDifference(amount, sumG, thisPixel.g), findColorDifference(amount, sumB, thisPixel.b));
			}
		}

		delete buffer2;
		return pixels;
	}

	// ensure that values in a matrix add up to 1
	function normalizeMatrix(matrix) {
		var j = 0;
		for (var i = 0; i < matrix.length; i++) {
			j += matrix[i];
		}
		for (var i = 0; i < matrix.length; i++) {
			matrix[i] /= j;
		}
		return matrix;
	}


	// convert x/y coordinates to pixel index reference
	function convertCoordinates(x, y, w) {
		return x + (y * w);
	}

	// calculate random noise. different every time!
	function noise(noiseValue) {
		return Math.floor((noiseValue >> 1) - (Math.random() * noiseValue));
	}

	// ensure an RGB value isn't negative / over 255
	function checkRGBBoundary(val) {
		if (val < 0) {
			return 0;
		} else if (val > 255) {
			return 255;
		} else {
			return val;
		}
	}

	// parse a shorthand or longhand hex string, with or without the leading '#', into something usable
	function createColor(src) {
		// strip the leading #, if it exists
		src = src.replace(/^#/, '');
		// if it's shorthand, expand the values
		if (src.length == 3) {
			src = src.replace(/(.)/g, '$1$1');
		}
		return src;
	}

	// find a specified distance between two colours
	function findColorDifference(dif, dest, src) {
		return (dif * dest + (1 - dif) * src);
	}

	// throw three new RGB values into the pixels object at a specific spot
	function setRGB(data, index, r, g, b) {
		data[index] = r;
		data[index + 1] = g;
		data[index + 2] = b;
		return data;
	}

  function HSV_to_RGB(h, s, v) {
    if (h === null) {
      return [ v, v, v ];
    }
    var i = Math.floor(h);
    var f = i % 2 ? h - i : 1 - (h - i);
    var m = v * (1 - s);
    var n = v * (1 - s * f);
    switch (i) {
      case 6:
      case 0:
        return [v, n, m];
      case 1:
        return [n, v, m];
      case 2:
        return [m, v, n];
      case 3:
        return [m, n, v];
      case 4:
        return [n, m, v];
      case 5:
        return [v, m, n];
    }
  }

  function RGB_to_HSV(r, g, b) {
    r < 0 && (r = 0) || r > 1 && (r = 1);
    g < 0 && (g = 0) || g > 1 && (g = 1);
    b < 0 && (b = 0) || b > 1 && (b = 1);
    var n = Math.min(Math.min(r, g), b);
    var v = Math.max(Math.max(r, g), b);
    var m = v - n;
    if (m === 0) {
      return {h:null, s:0, v:v };
    }
    var h = r === n ? 3 + (b - g) / m : (g === n ? 5 + (r - b) / m : 1 + (g - r) / m);
    return { h:h === 6 ? 0 : h, s:m / v, v:v };
  }
}
