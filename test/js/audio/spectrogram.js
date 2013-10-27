'use strict';




var mathUtils = {};

mathUtils.getPearsonsCorrelation = function(x, y)
{
  var shortestArrayLength = 0;
  if(x.length == y.length)
  {
    shortestArrayLength = x.length;
  }
  else if(x.length > y.length)
  {
    shortestArrayLength = y.length;
    console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
  }
  else
  {
    shortestArrayLength = x.length;
    console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
  }

  var xy = [];
  var x2 = [];
  var y2 = [];

  for(var i=0; i<shortestArrayLength; i++)
  {
    xy.push(x[i] * y[i]);
    x2.push(x[i] * x[i]);
    y2.push(y[i] * y[i]);
  }

  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_x2 = 0;
  var sum_y2 = 0;

  for(var i=0; i<shortestArrayLength; i++)
  {
    sum_x += x[i];
    sum_y += y[i];
    sum_xy += xy[i];
    sum_x2 += x2[i];
    sum_y2 += y2[i];
  }

  var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
  var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
  var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
  var step4 = Math.sqrt(step2 * step3);
  var answer = step1 / step4;

  return answer;
}

window.spectrogram = function(context, options){
  var visual = 1;
  var drawDencity = 1;
  //var avgNoiseLevel = 0;
  var flagBlockAnalyse = false;
  var blockAnalyseTimeout = 1000;
  var winLenght = 17;
  var frontDelay = 1;
  var captureArrray = [];
  var ethalon1 = JSON.parse(localStorage.getItem('one'));

  var ctx = options.canvas.getContext('2d');
  var dataSnapshot = [];
  var dataSnapshotMaximums = [];
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
    //window.webkitRequestAnimationFrame(function () {
      redraw();
    //});
  }, 15)

  detector.onaudioprocess = function () {

  }

  function getColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }

  var rowCounter = 0;

  var arrayRowCol = function(arr1){
    var arr1m = [];
    for(var i = 0; i < arr1[0].length; i++){
      arr1m[i] = [];
      for(var j = 0; j < arr1.length; j++){
        arr1m[i][j] = arr1[j][i]*1;
      }
    }
    return arr1m;
  }


  var evauateArrays = function(arr1, arr2){


    var arr1normal = [];
    var arr2normal = [];

    var total = 0;
    for(var i = 0; i < arr1.length; i++){
      arr1normal[i] = [];
      arr2normal[i] = [];
      for(var j = 0; j < arr1[i].length; j++){


   //     if(arr1[i][j] > 10){
          arr1normal[i][j] = arr1[i][j];
        // } else {
        //   arr1normal[i][j] = 0;
        // }

       // if(arr2[i][j] > 10){
          arr2normal[i][j] = arr2[i][j];
        // } else {
        //   arr2normal[i][j] = 0;
        // }


        if(visual){
          var v1 = arr1normal[i][j] * 2 / (ctx.canvas.height/2);
          ctx.fillStyle = getColor(v1);
          ctx.fillRect(i, ctx.canvas.height/2 + j, drawDencity, 1);

          var v2 = arr2normal[i][j] * 2 / (ctx.canvas.height/2);
          ctx.fillStyle = getColor(v2);
          ctx.fillRect(i+100, ctx.canvas.height/2 + j, drawDencity, 1);
        }





      }
    }

      var arr1m = arrayRowCol(arr1normal);
      var arr2m = arrayRowCol(arr2normal);

    // var arr1m = arr1normal;
    // var arr2m = arr2normal;

    //console.log(arr1m[10])

    var correlationArr = [];

    var sum = 0;
    var count = 0;

    for(var i = 0; i < arr1m.length; i++){
      correlationArr[i] = mathUtils.getPearsonsCorrelation(arr1m[i], arr2m[i]);
      if(correlationArr[i] > 0.5) count++;
      sum += (correlationArr[i] || 0);
    }

    console.log('=======>>>',sum/(arr1m.length),count);

    //if()
  }

  var redraw = function () {
    if (rowCounter > ctx.canvas.width) {
      rowCounter = 0;
      if(visual){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height/2);
      }
    }

    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    dataSnapshot.push(array);
    dataSnapshotMaximums.push(Math.max.apply(Math, array));



    if(dataSnapshot.length  > winLenght){
      dataSnapshot.shift();
    }


    if(dataSnapshotMaximums.length  > winLenght){
      dataSnapshotMaximums.shift();
    }

    if(dataSnapshot.length === winLenght){
      if(visual){
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,150,50,1)";
        ctx.moveTo((rowCounter-drawDencity || 0), dataSnapshotMaximums[winLenght-2]);
        ctx.lineTo((rowCounter || 0), dataSnapshotMaximums[winLenght-1]);
        ctx.closePath();
        ctx.stroke();
      }

      var asum = 0;
      for(var a=0; a < winLenght; a++){
        asum += dataSnapshotMaximums[a];
      }
      var avgNoiseLevel = asum/winLenght;

      if(visual){
        ctx.fillStyle = "rgba(255,0,0,1)";
        ctx.fillRect(rowCounter, avgNoiseLevel, drawDencity, 1);
      }

      var frontDelta = dataSnapshotMaximums[winLenght-1] - avgNoiseLevel;

      if(frontDelta > 50 && !flagBlockAnalyse){
        if(visual){
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.fillStyle = "transparent";
          ctx.strokeStyle = "rgb(0,0,0)";
          ctx.rect((rowCounter-drawDencity*frontDelay || 0), 0, winLenght*drawDencity, 256);
          ctx.stroke();
        }

        flagBlockAnalyse = true;
        captureArrray = dataSnapshot.splice(winLenght-frontDelay,frontDelay);

        if(visual){
          for(var i = 0; i < captureArrray.length; i++){
            for(var j = 0; j < captureArrray[i].length; j++){
              var v1 = captureArrray[i][j] * 2 / (ctx.canvas.height/2);
              ctx.fillStyle = getColor(v1);
              ctx.fillRect(i+200, ctx.canvas.height/2 + j, drawDencity, 1);
            }
          }
        }


        setTimeout(function(){
          flagBlockAnalyse = false;
          captureArrray = [];
        },blockAnalyseTimeout);

      } else {

        if(captureArrray[0]){
          captureArrray.push(dataSnapshot[dataSnapshot.length-frontDelay]);
          if(captureArrray.length >= winLenght){
            var captureArrrayToSave = captureArrray.slice(0);

            $('<a>').html(' -ONE- ').appendTo('body').data('array',captureArrrayToSave).on('mouseover', function(){
              localStorage.setItem('one', JSON.stringify(captureArrrayToSave));
              ethalon1 = captureArrrayToSave;
              console.log('!!!!!',captureArrrayToSave)
            })

            //console.log('Evaluate',JSON.parse(localStorage.getItem('one')).length)
            evauateArrays(captureArrrayToSave, ethalon1);

            captureArrray = [];
          }
        }
      }
    }




    for (var i = 0; i < array.length; i++) {
      if(visual){
        var v = array[i] *2 / (ctx.canvas.height/2);
        ctx.fillStyle = getColor(v);
        ctx.fillRect(rowCounter, i, drawDencity, 1);
      }
    }

    rowCounter += drawDencity;

  }

  redraw();

};