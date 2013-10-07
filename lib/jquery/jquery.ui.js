(function($) {
  var methods = {
    init: function(options) {
      return this.each(function() {
        var defaults = {
          expression:false

         // }
        };

        var $that = $(this);
        var that = {};
        this.utSpin = that;
        that.options = $.extend(defaults, options);


















        that.view = {};
        that.view.overlay = $('<div>').addClass('swd_overlay');
        that.view.audiocanvas = $('<canvas>',{width:'100%', height: 120, id:'swd_audio_canvas'}).addClass('swd_audio_canvas');
        that.view.videocanvas = $('<canvas>',{width:640, height: 480, id:'swd_video_canvas'}).addClass('swd_video_canvas');
        that.view.close = $('<div>').addClass('swd_close');
        that.view.open = $('<div>').addClass('swd_open');
        $('body').append(that.view.overlay);
        that.view.overlay.append(that.view.audiocanvas);
        that.view.overlay.append(that.view.videocanvas);



        that.view.helpPopup = $('<div>').addClass('swd_helppopup').html('<div class="swd_helppopup_a">STOP</div><div class="swd_helppopup_b">WEB</div><div class="swd_helppopup_c">DISABILITY</div>').appendTo(that.view.overlay);

        // setTimeout(function(){
        //   that.view.overlay.addClass('show');
        // },1000);






















        that.hide = function(){
          $that.hide();
        };

        that.show = function(){
          $that.show();
        };
      });
    },

    hide: function() {
      this.each(function() {
        if(this.utSpin) this.utSpin.hide();
      });
      return this;
    },

    show: function() {
      this.each(function() {
        if(this.utSpin) this.utSpin.show();
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