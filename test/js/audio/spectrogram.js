'use strict';

Uint8Array.prototype.max = function() {
   return Math.max.apply(Math, this);
 };


window.spectrogram = function(context, options){

  var drawDencity = 1;
  //var avgNoiseLevel = 0;
  var flagBlockAnalyse = false;
  var blockAnalyseTimeout = 1000;
  var winLenght = 20;
  var frontDelay = 2;
  var captureArrray = [];

  var ctx = options.canvas.getContext('2d');
  var dataSnapshot = [];
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.8;

  var analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.1;
  analyser.fftSize = 1024;

  var detector = context.createScriptProcessor(2048, 1, 1);

  options.node.connect(analyser);
  options.node.connect(detector);
  detector.connect(context.destination);

  window.setInterval(function () {
    window.webkitRequestAnimationFrame(function () {
      redraw();
    });
  }, 20)

  detector.onaudioprocess = function () {

  }

  function getColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }

  var rowCounter = 0;


  var evauateArrays = function(arr1, arr2){
    var total = 0;
    for(var i = 0; i < arr1.length/2; i++){
      for(var j = 0; j < arr1[i]['array'].length/2; j++){
        total += ( arr1[i]['array'][j] - arr2[i]['array'][j])
      }
    }
    console.log('TOTALE!!!!',total);
  }

  var redraw = function () {
    if (rowCounter > ctx.canvas.width) {
      rowCounter = 0;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    var obj = {
      array:array,
      max: array.max()
    }





    dataSnapshot.push(obj);
    if(dataSnapshot.length  > winLenght){
      dataSnapshot.shift();
    }

    if(dataSnapshot.length === winLenght){
      ctx.beginPath();

      ctx.strokeStyle = "rgba(0,150,50,1)";
      ctx.moveTo((rowCounter-drawDencity || 0), dataSnapshot[winLenght-2].max);
      ctx.lineTo((rowCounter || 0), dataSnapshot[winLenght-1].max);
      ctx.closePath();
      ctx.stroke();
      //console.log(dataSnapshot[18].max)

      var asum = 0;
      for(var a=0; a < winLenght; a++){
        asum += dataSnapshot[a].max;
      }
      var avgNoiseLevel = asum/winLenght;


      ctx.fillStyle = "rgba(255,0,0,1)";
      ctx.fillRect(rowCounter, avgNoiseLevel, drawDencity, 1);

      var frontDelta = dataSnapshot[winLenght-1].max - avgNoiseLevel;




      if(frontDelta > 50 && !flagBlockAnalyse){
        console.log(1)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.rect((rowCounter-drawDencity*frontDelay || 0), 0, winLenght*drawDencity, 256);
        ctx.stroke();

        flagBlockAnalyse = true;






        captureArrray = dataSnapshot.splice(winLenght-frontDelay,frontDelay);
        //console.log(captureArrray.length,frontDelay)






        setTimeout(function(){
          flagBlockAnalyse = false;
          captureArrray = [];
        },blockAnalyseTimeout);
      } else {
        if(captureArrray[0]){
          captureArrray.push(obj);
          if(captureArrray.length >= winLenght){
            var captureArrrayToSave = captureArrray.slice(0);

            $('<a>').html(' -ONE- ').appendTo('body').data('array',captureArrrayToSave).on('mouseover', function(){
              localStorage.setItem('one', JSON.stringify(captureArrrayToSave));
              console.log('!!!!!')
            })


            evauateArrays(captureArrrayToSave, JSON.parse(localStorage.getItem('one')));





            //console.log(captureArrray.length)
            captureArrray = [];
          }
          //console.log(captureArrray.length,frontDelay)
        }
      }




      //avgNoiseLevel = (obj.max + avgNoiseLevel)/2
      //console.log(obj.max)




      //if(avgNoiseLevel)


    }



    // console.log(dataSnapshot.length)





    for (var i = 0; i < array.length; i++) {
      var v = array[i] * 2 / ctx.canvas.height;
      ctx.fillStyle = getColor(v);
      ctx.fillRect(rowCounter, i, drawDencity, 1);
    }

    rowCounter += drawDencity;

  }

  redraw();

};