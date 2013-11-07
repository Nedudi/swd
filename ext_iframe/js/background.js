function addJsFileToHead(data) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.innerHTML = data;
  document.getElementsByTagName("head")[0].appendChild(script);
}


$.get(chrome.extension.getURL('js/jquery.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

$.get(chrome.extension.getURL('js/jquery.ui.js'),
  function(data) {
		addJsFileToHead(data);
  }
);

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


$.get(chrome.extension.getURL('js/swd.layout.js'),
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
    // window.onload = function(){
    //   injected_main();
    // }
    document.getElementsByTagName("body")[0].setAttribute("onLoad", "injected_main();");
  }
);

// $.get(chrome.extension.getURL('/style.css'),
//   function(data) {
//     var style = document.createElement("style");
//     style.setAttribute("type", "text/css");
//     style.innerHTML = data;
//     document.getElementsByTagName("head")[0].appendChild(style);
//   }
// );
