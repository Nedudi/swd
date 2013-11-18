
setInterval(function(argument) {

    chrome.tabs.query({}, function(tabs) {
        for (var i=0; i<tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {data:'!!!!!!!!!!!!!!!!!!! --------> hello tabs'});
        }
    });

},1000);


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
      if (request.cmd == "getTabs"){

        chrome.tabs.query({}, function(tabs) {
          sendResponse({data: tabs});
        });

      }
      return true;
    }
  );




