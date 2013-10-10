audiocorrelator = function (options) {


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response


    console.log('decoded')
    loader.context.decodeAudioData(

      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};










      var loader = new BufferLoader(context, [
        "sound/1.m4a",
        "sound/2.m4a",
        "sound/3.m4a",
        "sound/4.m4a",
        "sound/5.m4a"
      ], onBuffersLoaded);




   var onBuffersLoaded = function(b){
    console.log('LAODED')
    for (var i = 0; i < b.length; i++){
      //Array.prototype.reverse.call( buffer.getChannelData(0) );
      //Array.prototype.reverse.call( buffer.getChannelData(1) );
      channels.convolver.buffer = b[i];
    }
   }








  if(options.canvas){
    var ctx = options.canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.8;
  }

  var channels = [];

  var createChannel = function(index, source){
    channels[index] = {};//options.data[index];
    channels[index].avgArr = [];

    for (var i = 0; i < ctx.canvas.width; i++) {
       channels[index].avgArr[i] = 0;
    }

    channels[index].analyser  = context.createAnalyser();
    channels[index].analyser.smoothingTimeConstant = 0.5;
    channels[index].analyser.fftSize = 1024;

    // channels[index].convolver = context.createConvolver();
    // channels[index].convolver.connect(channels[index].analyser)

    channels[index].detector = context.createScriptProcessor(2048, 1, 1);
    // channels[index].splitter = context.createChannelSplitter();





    channels[index].detector.onaudioprocess = function() {

        window.webkitRequestAnimationFrame(function(){





                //
                //ctx.fillRect(i, ctx.canvas.height - (avaliableHeight*index) - channels[index].avgArr[i], 2, 2);
             // }
        })


  }










    // source.connect(channels[index].convolver);
    source.connect(channels[index].analyser);
    source.connect(channels[index].detector);
    channels[index].detector.connect(context.destination);

  };





  var context, microphone;
  context = new window.webkitAudioContext();

  navigator.webkitGetUserMedia({
    audio: true
  }, function (stream) {
    microphone = context.createMediaStreamSource(stream);
    options.data.map(function(v,i){
      createChannel(i,microphone);
    });
    console.log(channels)
    // analyser = context.createAnalyser();
    // microphone.connect(analyser);
    redraw();
  }, function () {});

  var redraw = function () {
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var avaliableHeight = ctx.canvas.height/options.data.length;
    for(var index = 0; index < options.data.length; index ++){
      var array =  new Uint8Array(channels[index].analyser.frequencyBinCount);
      channels[index].analyser.getByteFrequencyData(array);
      var avg = getAverageVolume(array)

      channels[index].avgArr.splice(0,1);
      channels[index].avgArr.push(avg);
      for (var i = 0; i < channels[index].avgArr.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.strokeStyle = "#ff0000";
        ctx.moveTo((i-1 || 0), ctx.canvas.height - (avaliableHeight*index) - (channels[index].avgArr[i-1]|| 0)/channels.length );
        ctx.lineTo(i, ctx.canvas.height - (avaliableHeight*index) - channels[index].avgArr[i]/channels.length);
        ctx.closePath();
        ctx.stroke();

        //ctx.fillRect(i, ctx.canvas.height - (avaliableHeight*index) - channels[index].avgArr[i]/channels.length,1,1);
      }
    }
    window.webkitRequestAnimationFrame(redraw);
  }







    function getAverageVolume(array) {
        var values = 0;
        var average;
        var max = 0;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i]
            if(array[i] > max) max = array[i];
        }

        average = values / length;
        return max;//average;
    }









  // var visualize = function () {
  //   //if(!) = [];

  //   var index = 0;
  //   var times = new Uint8Array(channels[index].analyser.frequencyBinCount);
  //   channels[index].analyser.getByteTimeDomainData(times);
  //   var sum = 0;
  //   var avg = 0;




  //   console.log(times)

  //   for (var i = 0; i < times.length; i++) {
  //     sum+=Math.abs(times[i]);
  //     // var percent = value / 256;
  //     // var height = canvas.height * percent;
  //     // var offset = canvas.height - height  - 1;
  //     // var barWidth = this.WIDTH / times.length;

  //   }

  //   avg = sum/times.length;

  //   channels[index].avgArr.push(avg);

  //   console.log(avg)

  //   for (var i = 0; i < channels[index].avgArr.length; i++) {
  //     ctx.fillStyle = 'red';
  //     ctx.fillRect(i, channels[index].avgArr[i], 1, 1);
  //   }




  // };




  // function calcSpectrum() {
  //   var data = new Uint8Array(analyser.frequencyBinCount);
  //   analyser.getByteFrequencyData(data);
  //   drawSpectrum(data);
  // }

  // function clearCanvas() {
  //   //console.log(ctx)
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // }

    // function drawSpectrum(data) {
    //   var sum = 0,
    //     avg;

    //   var dataslight = [];

    //   for (var i = 0; i < canvas.width; ++i) {
    //     dataslight[i] = ((data[i + 2] || data[i]) + (data[i + 1] || data[i]) + (data[i - 1] || data[i]) + (data[i - 2] || data[i]) + data[i]) / 5;
    //   }

    //   data = dataslight;

    //   var wins = [{
    //       min: 35,
    //       max: 55,
    //       pick: 0
    //     },
    //     //{min:180, max:230},
    //   ];

    //   ctx.fillStyle = PICKCOLOR;
    //   ctx.fillRect(wins[0].min, 0, wins[0].max - wins[0].min, canvas.height);

    //   for (var i = 0; i < canvas.width; ++i) {
    //     ctx.fillStyle = VISUALIZECOLOR;
    //     var magnitude = data[i];
    //     ctx.fillRect(i, canvas.height, 1, -magnitude);
    //   }

    //   for (var i = 15; i < 65; ++i) {
    //     for (var w = 0; w < wins.length; w++) {
    //       if (i > wins[w].min && i < wins[w].max) {
    //         ctx.fillStyle = 'white';
    //         ctx.fillRect(i, canvas.height, 1, -data[i]);
    //         if (wins[w].pick < data[i]) {
    //           wins[w].pick = data[i];
    //         }
    //       }
    //       sum += data[i];
    //     }
    //   }

    //   avg = sum / 50;
    //   var b = 180; //* avg * 0.0;
    //  // if (b < 170) b = 250;

    //   //console.log(b)

    //   ctx.fillStyle = AVGCOLOR;
    //   ctx.fillRect(0, canvas.height - b, canvas.width, 3);

    //   ctx.fillStyle = PICKCOLOR;
    //   ctx.fillRect(0, canvas.height - wins[0].pick, canvas.width, 3);

    //   if (wins[0].pick > b) {
    //     if (!locker) {
    //       $('body').trigger('audioclick');

    //       console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    //       locker = true;

    //       $('#swd_audio_canvas').css('background', BGPICKCOLOR);
    //       setTimeout(function () {
    //         $('#swd_audio_canvas').css('background', 'white');
    //         locker = false;
    //       }, 600);
    //     }
    //   }
    // }
  //});
};