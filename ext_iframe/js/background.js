function addJsFileToHead(data) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.innerHTML = data;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.greeting == "hello")
//       sendResponse({farewell: "goodbye"});
//   });


// var port = chrome.runtime.connect({name: "knockknock"});
// // port.postMessage({joke: "Knock knock"});
// // port.onMessage.addListener(function(msg) {
// //   console.log('_____MESSAGE FROM POPUP')
// //   if (msg.question == "Who's there?")
// //     port.postMessage({answer: "Madame"});
// //   else if (msg.question == "Madame who?")
// //     port.postMessage({answer: "Madame... Bovary"});
// // });

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "knockknock");
//   port.onMessage.addListener(function(msg) {
//     console.log('_____MESSAGE FROM POPUP')
//     if (msg.joke == "Knock knock")
//       port.postMessage({question: "Who's there?"});
//     else if (msg.answer == "Madame")
//       port.postMessage({question: "Madame who?"});
//     else if (msg.answer == "Madame... Bovary")
//       port.postMessage({question: "I don't get it."});
//   });
// });




// $.get(chrome.extension.getURL('js/jquery.js'),
//   function(data) {
// 		addJsFileToHead(data);
//   }
// );

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


// $.get(chrome.extension.getURL('js/swd.layout.js'),
//   function(data) {
//     addJsFileToHead(data);
//   }
// );

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
