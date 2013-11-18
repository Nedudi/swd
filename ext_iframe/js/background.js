function addJsFileToHead(data) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.innerHTML = data;
  document.getElementsByTagName("head")[0].appendChild(script);
}

$.get(chrome.extension.getURL('js/main.js'),
  function(data) {
		addJsFileToHead(data);
    document.getElementsByTagName("body")[0].setAttribute("onLoad", "injected_main();");
  }
);