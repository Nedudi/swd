function addJsFileToHead(data){
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.innerHTML = data;
  document.getElementsByTagName("head")[0].appendChild(script);
}

$.get(chrome.extension.getURL('/jquery.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

//$.get(chrome.extension.getURL('/images.js'),
//  function(data) {
//		addJsFileToHead(data);
//  }
//);

$.get(chrome.extension.getURL('/jquery.ui.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

//$.get(chrome.extension.getURL('/jsfeat-min.js'),
//  function(data) {
//		addJsFileToHead(data);
//  }
//);

//$.get(chrome.extension.getURL('/compatibility.js'),
//  function(data) {
//		addJsFileToHead(data);
//  }
//);

//$.get(chrome.extension.getURL('/bbf_face.js'),
//  function(data) {
//		addJsFileToHead(data);
//  }
//);

//$.get(chrome.extension.getURL('/cam_watch.js'),
//  function(data) {
//		addJsFileToHead(data);
//  }
//);

//$.get(chrome.extension.getURL('/audioclick.js'),
//  function(data) {
//		addJsFileToHead(data);
//  }
//);

$.get(chrome.extension.getURL('/swd.transfer.js'),
  function(data) {
    addJsFileToHead(data);
  }
);

$.get(chrome.extension.getURL('/swd.cursorLayer.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

$.get(chrome.extension.getURL('/swd.images.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

$.get(chrome.extension.getURL('/main.js'),
  function(data) {
		addJsFileToHead(data);
    document.getElementsByTagName("body")[0].setAttribute("onLoad", "injected_main();");
  }
);

$.get(chrome.extension.getURL('/style.css'),
  function(data) {
    var style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = data;
    document.getElementsByTagName("head")[0].appendChild(style);
  }
);
