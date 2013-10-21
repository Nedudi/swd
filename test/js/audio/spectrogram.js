audiocorrelator = function (options) {


function BufferLoader(context, urlList, callback) {
  console.log(1)
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  console.log(url)
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














  if(options.canvas){
    var ctx = options.canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.8;
  }

  var channels = [];
  var storedBuffer = [];
  var storedBufferR = [];

  var createChannel = function(index, source){
    channels[index] = {};//options.data[index];
    channels[index].avgArr = [];

    for (var i = 0; i < ctx.canvas.width; i++) {
       channels[index].avgArr[i] = 0;
    }

    channels[index].analyser  = context.createAnalyser();
    channels[index].analyser.smoothingTimeConstant = 0.1;
    channels[index].analyser.fftSize = 1024;

    channels[index].convolver = context.createConvolver();
    channels[index].convolver.connect(channels[index].analyser)

    channels[index].detector = context.createScriptProcessor(1024, 1, 1);
    // channels[index].splitter = context.createChannelSplitter();





    channels[index].detector.onaudioprocess = function() {

        window.webkitRequestAnimationFrame(function(){





                //
                //ctx.fillRect(i, ctx.canvas.height - (avaliableHeight*index) - channels[index].avgArr[i], 2, 2);
             // }
        })


  }










    // source.connect(channels[index].convolver);
    source.connect(channels[index].convolver);
    channels[index].convolver.connect(channels[index].analyser);
    channels[index].analyser.connect(channels[index].detector);
    // channels[index].detector.connect(channels[index]);

    //source.connect(channels[index].detector);
    channels[index].detector.connect(context.destination);
    channels[index].analyser.connect(context.destination);

  };





  var context, microphone;
  context = new window.webkitAudioContext();


function cloneAudioBuffer(audioBuffer){
    var channels = [],
        numChannels = audioBuffer.numberOfChannels;

    //clone the underlying Float32Arrays
    for (var i = 0; i < numChannels; i++){
        channels[i] = new Float32Array(audioBuffer.getChannelData(i));
    }

    //create the new AudioBuffer (assuming AudioContext variable is in scope)
    var newBuffer = context.createBuffer(
                        audioBuffer.numberOfChannels,
                        audioBuffer.length,
                        audioBuffer.sampleRate
                    );

    //copy the cloned arrays to the new AudioBuffer
    for (var i = 0; i < numChannels; i++){
        newBuffer.getChannelData(i).set(channels[i]);
    }

    return newBuffer;
}



   var onBuffersLoaded = function(bufferList){
    console.log('LAODED')
    for (var i = 0; i < bufferList.length; i++){

        storedBuffer[i] = bufferList[i]; // assign bufferList to globals
        storedBufferR[i] = cloneAudioBuffer(bufferList[i]);

        // attempt to reverse storedBufferR only ...
        Array.prototype.reverse.call( storedBufferR[i].getChannelData(0) );
        Array.prototype.reverse.call( storedBufferR[i].getChannelData(1) );


      // b[i] = b[i].getChannelData(0).reverce();
      // Array.prototype.reverse.call( b[i].getChannelData(1) );
      // console.log(b[i].getChannelData(0))
      channels[i].convolver.buffer = storedBufferR[i];

    }
   }


  var loader = new BufferLoader(context, [
    //"sound/1.m4a",
     //"sound/2.m4a",
     "sound/3.m4a",
  ], onBuffersLoaded);


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
    loader.load();
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
        ctx.moveTo((i-1 || 0), ctx.canvas.height - (avaliableHeight*index) - ((channels[index].avgArr[i-1]|| 0)) *3);
        ctx.lineTo(i, ctx.canvas.height - (avaliableHeight*index) - (channels[index].avgArr[i])*3);
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
      return average;
  }

};