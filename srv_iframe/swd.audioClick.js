(function(window){
  "use strict";

  window.swd = window.swd || {};

  window.swd.audioClick = function (stream) {
    var WIDTH = 512;
    var VISUALIZECOLOR = 'rgba(14,145,195,1)';
    var AVGCOLOR = 'rgb(33,187,166)';
    var PICKCOLOR = 'rgb(242,121,53)';
    var BGPICKCOLOR = 'rgb(33,187,166)';

    var locker;
    var canvas = document.getElementById('canvas6');
    var ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.8;

    window.requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
      };
    })();

    var redraw = function () {
      if(window.swd.displayProcessing) {
        clearCanvas();
      }
      calcSpectrum();
      requestAnimFrame(redraw);
    };

    function calcSpectrum() {
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      drawSpectrum(data);
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    var fifo = [];

    function drawSpectrum(data) {
      if(!window.swd.isUseAudioClick) return;

      var sum = 0;
      var avg, i, w, max=0;

      var wins = [{
          min: 10,
          max: 100,
          pick: 0
        }
      ];

      if(window.swd.displayProcessing) {
        ctx.fillStyle = PICKCOLOR;
        ctx.fillRect(wins[0].min, 0, wins[0].max - wins[0].min, canvas.height);

        for(i = 0; i < canvas.width; ++i) {
          ctx.fillStyle = VISUALIZECOLOR;
          var magnitude = data[i];
          ctx.fillRect(i, canvas.height, 1, -magnitude);
        }
      }

      for(w = wins[0].min; w < wins[0].max; w++) {

        if(window.swd.displayProcessing) {
          ctx.fillStyle = 'white';
          ctx.fillRect(w, canvas.height, 1, -data[w]);
        }
        if(data[w]>max) max = data[w];
      }

      fifo.push(max);
      if(fifo.length > 6) {
        fifo.splice(0,1);
      }

      var fifoLength = fifo.length, fifoSum=0, fifoAvg = 0;

      for(var i = 0; i < fifoLength; i ++){
        fifoSum += fifo[i];
      }

      fifoAvg = fifoSum/fifoLength;

      if(window.swd.displayProcessing) {
        ctx.fillStyle = AVGCOLOR;
        ctx.fillRect(0, canvas.height - max, canvas.width, 3);

        ctx.fillStyle = PICKCOLOR;
        ctx.fillRect(0, canvas.height - fifoAvg, canvas.width, 3);
      }

      var click = function(){
        window.swd.sendMessage("swdAudioClick", {});
      };

      var clickCoefficient = 1.25;

      if (max > fifoAvg*clickCoefficient) {
        if (!locker) {
          click();
          console.log('CLICK =>>>>>>>>> ' + (new Date().getTime()));
          locker = true;
          setTimeout(function () {
            locker = false;
          }, 1000);
        }
      }
    }

    var context, microphone, analyser;
    context = new window.webkitAudioContext();
    microphone = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    microphone.connect(analyser);
    window.requestAnimFrame(redraw);
  };
})(window);