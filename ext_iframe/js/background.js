function addJsFileToHead(data) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.innerHTML = data;


  console.log(data)
  document.getElementsByTagName("head")[0].appendChild(script);
}

$.get(chrome.extension.getURL('js/swd.transfer.js'),
  function(data) {
    addJsFileToHead(data);
  }
);

$.get(chrome.extension.getURL('js/swd.cursorLayer.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

$.get(chrome.extension.getURL('js/swd.images.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

$.get(chrome.extension.getURL('js/main.js'),
  function(data) {
		addJsFileToHead(data);
    document.getElementsByTagName("body")[0].setAttribute("onLoad", "injected_main();");
  }
);