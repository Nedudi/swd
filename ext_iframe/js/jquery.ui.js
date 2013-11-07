(function($) {
  var methods = {
    init: function(options) {
      return this.each(function() {
        var defaults = {
          expression:false

         // }
        };

        // var $that = $(this);
        // var that = {};
        // this.utSpin = that;
        // that.options = $.extend(defaults, options);


        // that.view = {};

        // that.show = function(){
        //   $(that.view.overlay).addClass('show');
        //   $(that.view.backoverlay).addClass('show');
        //   $(that.view.open).addClass('hide');
        // }

        // that.hide = function(){
        //   $(that.view.overlay).removeClass('show');
        //   $(that.view.backoverlay).removeClass('show');
        //   $(that.view.open).removeClass('hide');
        // }

        // that.view.open = $('<div>').addClass('swd_open').appendTo('body').on('click', function(){
        //   that.show();
        // });

        // that.view.overlay = document.createElement("div");
        // that.view.overlay.classList.add("swd_overlay");
        // document.body.appendChild(that.view.overlay);

        // that.view.backoverlay = document.createElement("div");
        // that.view.backoverlay.classList.add("swd_back_overlay");
        // document.body.appendChild(that.view.backoverlay);

        // that.view.audiocanvas = document.createElement("canvas");
        // that.view.audiocanvas.setAttribute("id", "swd_audio_canvas");
        // that.view.audiocanvas.classList.add("swd_audio_canvas");
        // that.view.audiocanvas.setAttribute("width", "710px");
        // that.view.audiocanvas.setAttribute("height", "256px");
        // that.view.overlay.appendChild(that.view.audiocanvas);

        // that.view.webcam = document.createElement("video");
        // that.view.webcam.setAttribute("id", "swd_webcam");
        // that.view.webcam.classList.add("swd_webcam");
        // that.view.webcam.setAttribute("width", "640px");
        // that.view.webcam.setAttribute("height", "480px");
        // that.view.webcam.style.display = "none";
        // that.view.overlay.appendChild(that.view.webcam);

        // that.view.videocanvas = document.createElement("canvas");
        // that.view.videocanvas.setAttribute("id", "swd_video_canvas");
        // that.view.videocanvas.classList.add("swd_video_canvas");
        // that.view.videocanvas.setAttribute("width", "640px");
        // that.view.videocanvas.setAttribute("height", "480px");

        // that.view.overlay.appendChild(that.view.videocanvas);

        // that.view.audiocanvas = $(that.view.audiocanvas);
        // that.view.webcam = $(that.view.webcam);
        // that.view.videocanvas = $(that.view.videocanvas);

        // $(that.view.overlay).on('click', function(){
        //   that.hide();
        // });

        // that.view.overlay = $(that.view.overlay);
        // that.view.backoverlay = $(that.view.backoverlay);



//        that.view.overlay = $('<div>').addClass('swd_overlay');
//        that.view.audiocanvas = $('<canvas>',{width:'100%', height: 160, id:'swd_audio_canvas'}).addClass('swd_audio_canvas');
//        that.view.webcam = $('<video>',{width:640, height: 480, id:'swd_webcam'}).addClass('swd_webcam');
//        that.view.videocanvas = $('<canvas>',{width:640, height: 480, id:'swd_video_canvas'}).addClass('swd_video_canvas');

        //that.view.close = $('<div>').addClass('swd_close').appendTo('body');


//        $('body').append(that.view.overlay);
//        that.view.overlay.append(that.view.audiocanvas);
//        that.view.overlay.append(that.view.webcam);
//        that.view.overlay.append(that.view.videocanvas);
        //that.view.overlay.append(that.view.close);
        //that.view.overlay.append(that.view.open);

        //that.view.helpPopup = $('<div>').addClass('swd_helppopup').html('<div class="swd_helppopup_a">STOP</div><div class="swd_helppopup_b">WEB</div><div class="swd_helppopup_c">DISABILITY</div>').appendTo(that.view.overlay);

        // that.hide = function(){
        //   $that.hide();
        // };

        // that.show = function(){
        //   $that.show();
        // };
      });
    },

    hide: function() {
      this.each(function() {
        if(this.utSpin) {
          this.utSpin.hide();
        }
      });
      return this;
    },

    show: function() {
      this.each(function() {
        if(this.utSpin) {
          this.utSpin.show();
        }
      });
      return this;
    }
  };

  $.fn.ui = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on $.ui');
    }
    return this;
  };
})(window.jQuery);