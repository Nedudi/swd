document.addEventListener('DOMContentLoaded', function () {
  init();
});


var sendMessageToAllTabs = function(message){
  chrome.tabs.query({}, function(tabs) {
    console.log(message,tabs);
    for (var i=0; i<tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, message);
    }
  });
};

var settingsChanged = function(key,value){
  sendMessageToAllTabs({
    cmd:'messageSettingsChanged',
    data:{
      key: key,
      value: value
    }
  });
};

var controlCallback = function(value){
  settingsChanged(this.property,value);
};

var swdControls = function() {
  this['cursor speed horizontal'] = 3;
  this['cursor speed vertical'] = 2;
  this['some text'] = 'ololo';
  this['some checkbox'] = false;
  this['some button'] = function() {
    console.log('ololo')
  };
};

var init = function(){
  var SWDC = new swdControls();
  var gui = new dat.GUI({ autoPlace: false, width: 500 });
  gui.remember(SWDC);
  document.getElementById('main_form').appendChild(gui.domElement);


  // cursor speed horizontal
  var cursorSpeedHorizontal = gui.add(SWDC, 'cursor speed horizontal', 1, 10);
  cursorSpeedHorizontal.onChange(function(value) {});
  cursorSpeedHorizontal.onFinishChange(controlCallback);

  // cursor speed vertical
  var cursorSpeedVertical = gui.add(SWDC, 'cursor speed vertical', 1, 10);
  cursorSpeedVertical.onChange(function(value) {});
  cursorSpeedVertical.onFinishChange(controlCallback);


  // add handlers here and ololo :)
  var someText      = gui.add(SWDC, 'some text');
  var someCheckbox  = gui.add(SWDC, 'some checkbox');
  var someButton    = gui.add(SWDC, 'some button');


};