var app = {};
app.cursor = {x:0,y:0};
function injected_main() {
  "use strict";
  $('body').ui();

  audioclick();

  cameraMotionDetection($('#swd_webcam')[0], $('#swd_video_canvas')[0]);
  cursorLayer();

  $('body').on("audioclick",function(){
  	app.clickOnItem(app.cursor.x,app.cursor.y);
  });

  app.clickOnItem = function(x,y){
    var o = document.createEvent('MouseEvents');
	var element = null;

    if(x && y){
    	element = document.elementFromPoint(x,y);
    }
    
    if(element){
	    o.initMouseEvent( 'click', true, true, window, 1, 100, 100, 100, 100, false, false, false, false, 0, null );
	    if(o){
	    	element.dispatchEvent(o);
		}
    }
  };
}