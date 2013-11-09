audioclick = function () {
  // var WIDTH = 512;
  // var HEIGHT = 256;
  var VISUALIZECOLOR = 'rgba(14,145,195,1)';
  var AVGCOLOR = 'rgb(33,187,166)';
  var PICKCOLOR = 'rgb(242,121,53)';
  var BGPICKCOLOR = 'rgb(33,187,166)';
  // var BGPICKCOLOR = 'rgba(14,145,195,1)';


     // gridPointColor: "rgb(242,121,53)",
     //  rectColor: "rgb(33,187,166)",
  var locker;
  var canvas = document.getElementById('swd_audio_canvas');
  // canvas.width = WIDTH;
  // canvas.height = HEIGHT;
  var ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.8;

  $(function () {
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

    var context, microphone, analyser;
    context = new window.webkitAudioContext();

    navigator.webkitGetUserMedia({
      audio: true
    }, function (stream) {
      microphone = context.createMediaStreamSource(stream);
      analyser = context.createAnalyser();
      microphone.connect(analyser);
      requestAnimFrame(redraw);
    }, function () {});

    var redraw = function () {
      clearCanvas();
      visualize();
      calcSpectrum();
      requestAnimFrame(redraw);
    }

    var visualize = function () {
      var times = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(times);
      for (var i = 0; i < times.length; i++) {
        var value = times[i];
        var percent = value / 256;
        var height = canvas.height * percent;
        var offset = canvas.height - height  - 1;
        var barWidth = this.WIDTH / times.length;
        ctx.fillStyle = VISUALIZECOLOR;
        ctx.fillRect(i * barWidth, offset, 1, 1);
      }
    };




    function calcSpectrum() {
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      drawSpectrum(data);
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawSpectrum(data) {
      var sum = 0,
        avg;

      var dataslight = [];

      for (var i = 0; i < canvas.width; ++i) {
        dataslight[i] = ((data[i + 2] || data[i]) + (data[i + 1] || data[i]) + (data[i - 1] || data[i]) + (data[i - 2] || data[i]) + data[i]) / 5;
      }

      data = dataslight;

      var wins = [{
          min: 35,
          max: 55,
          pick: 0
        },
        //{min:180, max:230},
      ];

      ctx.fillStyle = PICKCOLOR;
      ctx.fillRect(wins[0].min, 0, wins[0].max - wins[0].min, canvas.height);

      for (var i = 0; i < canvas.width; ++i) {
        ctx.fillStyle = VISUALIZECOLOR;
        var magnitude = data[i];
        ctx.fillRect(i, canvas.height, 1, -magnitude);
      }

      for (var i = 15; i < 65; ++i) {
        for (var w = 0; w < wins.length; w++) {
          if (i > wins[w].min && i < wins[w].max) {
            ctx.fillStyle = 'white';
            ctx.fillRect(i, canvas.height, 1, -data[i]);
            if (wins[w].pick < data[i]) {
              wins[w].pick = data[i];
            }
          }
          sum += data[i];
        }
      }

      avg = sum / 50;
      var b = 200; //* avg * 0.0;
     // if (b < 170) b = 250;

      //console.log(b)

      ctx.fillStyle = AVGCOLOR;
      ctx.fillRect(0, canvas.height - b, canvas.width, 3);

      ctx.fillStyle = PICKCOLOR;
      ctx.fillRect(0, canvas.height - wins[0].pick, canvas.width, 3);

      if (wins[0].pick > b) {
        if (!locker) {
          $('body').trigger('audioclick');

          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          locker = true;

          $('#swd_audio_canvas').css('background', BGPICKCOLOR);
          setTimeout(function () {
            $('#swd_audio_canvas').css('background', 'white');
            locker = false;
          }, 600);
        }
      }
    }
  });
};