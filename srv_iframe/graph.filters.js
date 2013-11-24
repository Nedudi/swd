(function(window){
  "use strict";

  var _filters = {
    grayscaleModified: function(src, dst) {
      var srcLength = src.length|0;
      var qq, tmp, j = 0;
      var coeff_r = 4899, coeff_g = 9617, coeff_b = 1868;
      for(qq = 0; qq <= srcLength; qq += 4) {
        tmp = (src[qq] * coeff_r + src[qq+1] * coeff_g + src[qq+2] * coeff_b + 8192) >> 14;
        dst[qq] = dst[qq+1] = dst[qq+2] = tmp;
      }
    },

    grayscale: function(src, dst) {
      var srcLength = src.length|0;
      var qq, tmp, j = 0;
      var coeff_r = 0.2126, coeff_g = 0.7152, coeff_b = 0.0722;
      for(qq = 0; qq <= srcLength; qq += 4) {
        tmp = src[qq] * coeff_r + src[qq+1] * coeff_g + src[qq+2] * coeff_b;
        dst[qq] = dst[qq+1] = dst[qq+2] = tmp < 0 ? 0 : (tmp > 255 ? 255 : tmp);
      }
    },

    r_chanel: function(src, dst) {
      var srcLength = src.length|0;
      var qq;
      for(qq = 0; qq <= srcLength; qq += 4) {
        dst[qq] = dst[qq+1] = dst[qq+2] = src[qq];
      }
    },

    g_chanel: function(src, dst) {
      var srcLength = src.length|0;
      var qq;
      for(qq = 0; qq <= srcLength; qq += 4) {
        dst[qq] = dst[qq+1] = dst[qq+2] = src[qq+1];
      }
    },

    b_chanel: function(src, dst) {
      var srcLength = src.length|0;
      var qq;
      for(qq = 0; qq <= srcLength; qq += 4) {
        dst[qq] = dst[qq+1] = dst[qq+2] = src[qq+2];
      }
    },

    rg_chanel: function(src, dst) {
      var srcLength = src.length|0;
      var qq;
      for(qq = 0; qq <= srcLength; qq += 4) {
        var tmp = src[qq]*0.5 + src[qq]*0.5;
        dst[qq] = dst[qq+1] = dst[qq+2] = tmp < 0 ? 0 : (tmp > 255 ? 255 : tmp);
      }
    },

    brightnesAndContrast: function(src, dst, brightness, contrast, intensity) {
      var srcLength = src.length|0;
      var i, r, g, b, BaseY = 127;
      for (i = 0; i < srcLength; i += 4) {
        var Y = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
        var U = (src[i + 2] - Y) / 2.03;
        var V = (src[i] - Y) / 1.44;
        //brightness
        if (brightness) {
          Y += brightness;
        }
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
        r = Y + 1.44 * V;
        g = Y - 0.37 - 0.73 * V;
        b = Y + 2.03 * U;
        dst[i] = r < 0 ? 0 : (r > 255 ? 255 : Math.floor(r));
        dst[i + 1] = g < 0 ? 0 : (g > 255 ? 255 : Math.floor(g));
        dst[i + 2] = b < 0 ? 0 : (b > 255 ? 255 : Math.floor(b));
      }
    }
  };

  window.graph = window.graph || {};
  window.graph.filters = _filters;
})(window);