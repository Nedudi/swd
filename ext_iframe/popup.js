document.addEventListener('DOMContentLoaded', function () {
  console.log('--')
  init();
});

var init = function(){

  document.getElementById('enable').addEventListener('change',function(){
    // chrome.management.setEnabled(chrome.runtime.id, this.checked, function(){
    //   console.log('-- Extension ' + this.checked?'enabled':'disabled');
    // });

    if(this.checked){
      chrome.windows.getCurrent(function(win){
        chrome.windows.update(win.id, { state: "fullscreen" })
        window.close();
          // chrome.tabs.getAllInWindow(win.id, function(tabs)
          // {
          //     // Should output an array of tab objects to your dev console.
          //     console.debug(tabs);
          // });
      });
    };




    ///console.log();
  },false);

// console.log(chrome.management)
// console.log()




  // console.log('!!!!!!!!',chrome.tabs)

//   chrome.tabs.query({}, function(tabs) {
//       for (var i = 0; i < tabs.length; i++) {
//       // chrome.tabs.sendRequest(tabs[i].id, { action: "xxx" });
//       console.log('!!!!!!!!',tabs[i])
//       }
//   } );




// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "knockknock");
//   port.onMessage.addListener(function(msg) {
//     console.log('_____MESSAGE FROM CONTENT')
//     if (msg.joke == "Knock knock")
//       port.postMessage({question: "Who's there?"});
//     else if (msg.answer == "Madame")
//       port.postMessage({question: "Madame who?"});
//     else if (msg.answer == "Madame... Bovary")
//       port.postMessage({question: "I don't get it."});
//   });
// });


  // port.postMessage({joke: "Knock knock"});
  // port.onMessage.addListener(function(msg) {

  //   console.log('_____MESSAGE FROM CONTENT')
  //   if (msg.question == "Who's there?")
  //     port.postMessage({answer: "Madame"});
  //   else if (msg.question == "Madame who?")
  //     port.postMessage({answer: "Madame... Bovary"});
  // });

  // chrome.runtime.onMessage.addListener(
  //   function(request, sender, sendResponse) {
  //     console.log(sender.tab ?
  //                 "from a content script:" + sender.tab.url :
  //                 "from the extension");
  //     if (request.greeting == "hello")
  //       sendResponse({farewell: "goodbye"});
  //   });
  // );


  // chrome.tabs.query({}, function(tabs) {
  //     for (var i=0; i<tabs.length; ++i) {
  //         chrome.tabs.sendMessage(tabs[i].id, {a:'!!!!!!!!!!!!!!!!!!! --------> hello tabs'});
  //     }
  // });



};