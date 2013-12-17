var defaultSettings = {};
defaultSettings['cursor speed horizontal'] = 3;
defaultSettings['cursor speed vertical'] = 2;
defaultSettings['use audio click'] = false;
defaultSettings['reset settings'] = function() {
  chrome.storage.sync.set({'settings': null}, function() {
    //console.log('!!!!!!!!! we just reset all settings');
    window.location.href=window.location.href;
  });
};
//defaultSettings['some text'] = 'ololo';

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get("settings", function(savedSettings) {
    console.log('defaultSettings=',defaultSettings,',savedSettings=', savedSettings);
    var settings = $.extend({}, defaultSettings, savedSettings.settings);
    init(settings);
  })
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

  chrome.storage.sync.get("settings", function(data) {
    var settings = data.settings || {};
    settings[key] = value;
    chrome.storage.sync.set({'settings': settings}, function(savedData) {
      console.log('Settings saved',savedData);
    });
  });
};

var controlCallback = function(value){
  settingsChanged(this.property,value);
};

var init = function(defaultSettings){

  var gui = new dat.GUI({ autoPlace: false, width: 500 });
  gui.remember(defaultSettings);
  document.getElementById('main_form').appendChild(gui.domElement);

  // cursor speed horizontal
  var cursorSpeedHorizontal = gui.add(defaultSettings, 'cursor speed horizontal', 1, 10);
  cursorSpeedHorizontal.onChange(function(value) {});
  cursorSpeedHorizontal.onFinishChange(controlCallback);

  // cursor speed vertical
  var cursorSpeedVertical = gui.add(defaultSettings, 'cursor speed vertical', 1, 10);
  cursorSpeedVertical.onChange(function(value) {});
  cursorSpeedVertical.onFinishChange(controlCallback);

  // use audio click
  var useAudioClick  = gui.add(defaultSettings, 'use audio click');
  useAudioClick.onChange(function(value) {});
  useAudioClick.onFinishChange(controlCallback);

  var someButton    = gui.add(defaultSettings, 'reset settings');

  // add handlers here and ololo :)
  //var someText      = gui.add(defaultSettings, 'some text');
};