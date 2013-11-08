/* global swd_base64CursorArrow:true, swd_base64CursorWait:true */
(function(window){
  "use strict";



  window.swd = window.swd || {};

  window.swd.layout = function() {
    //alert(1)




   // chrome.extension.tabs

    var that = this;
    that.view = {};
    var html = document.getElementsByTagName('html')[0];
    var body = document.getElementsByTagName('body')[0];
    html.classList.add('swd');
    // html.style.width = "calc(100% - 100px)";
    //body.style['-webkit-transform'] = 'translateY(10px)';
    window.dispatchEvent(new Event('resize'));



    var createBlock = function(options){
      var block = document.createElement(options.tagName);
      options.classList.map(function(v,i){
        block.classList.add(v);
      });
      if(options.type && options.type == 'vertical'){
        block.style.height = document.documentElement.clientHeight-100+'px';
      }
      if(options.type && options.type == 'horizontal'){
        //block.style.width = document.documentElement.clientWidth+'px';
      }
      if(options.html){
        block.innerHTML = options.html;
      }
      options.container.appendChild(block);
      return block;
    };


    that.view.top = createBlock({
      container:body,
      type:'horizontal',
      tagName: 'aside',
      classList: ['swd_top','swd_aside']
    });

    that.view.left = createBlock({
      container:body,
      type:'vertical',
      tagName: 'aside',
       classList: ['swd_left','swd_aside']
    });

    that.view.right = createBlock({
      container:body,
      type:'vertical',
      tagName: 'aside',
      classList: ['swd_right','swd_aside']
    });


    that.view.buttonScrollUp = createBlock({
      container:that.view.right,
      tagName: 'a',
      classList: ['swd_button','swd_button_scroll_up','icon-arrow-up3']
    });

    that.view.buttonScrollUp.addEventListener('click', function(){
      body.scrollTop-=document.documentElement.clientHeight/4;
    }, false);

    that.view.buttonScrollDown = createBlock({
      container:that.view.right,
      tagName: 'a',
      classList: ['swd_button','swd_button_scroll_down','icon-arrow-down3']
    });

    that.view.buttonScrollDown.addEventListener('click', function(){
      body.scrollTop+=document.documentElement.clientHeight/4;
    }, false);


    // history
    that.view.historyBlock = createBlock({
      container:that.view.top,
      tagName: 'div',
      classList: ['swd_history_block']
    });
    that.view.buttonSettings = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_settings','icon-settings']
    });
    that.view.buttonBack = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_back','icon-arrow-left-thick']
    });
    that.view.buttonBack = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_next','icon-arrow-right-thick']
    });
    that.view.buttonBack = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_refresh','icon-repeat']
    });


    // tabs
    that.view.tabsBlock = createBlock({
      container:that.view.top,
      tagName: 'div',
      classList: ['swd_tabs_block']
    });

    that.view.buttonAddTab = createBlock({
      container:that.view.top,
      tagName: 'a',
      classList: ['swd_button','swd_button_add_tab','icon-plus']
    });





    window.onscroll = function (oEvent) {
      var scrollTop = body.scrollTop;
      var scrollLeft = body.scrollLeft;

      console.log(scrollTop,scrollLeft)
      that.view.top.style.top = scrollTop+'px';
      that.view.left.style.top = scrollTop+100+'px';
      that.view.right.style.top = scrollTop+100+'px';

      // that.view.top.style.left = scrollLeft-100+'px';
      // that.view.left.style.left = scrollLeft+'px';
      // that.view.right.style.left = scrollLeft+document.documentElement.clientHeight-199+'px';
    }


    that.renderTab = function(tab){
      console.log('render tab', tab);
      var tabLayout = createBlock({
        container:that.view.tabsBlock,
        tagName: 'a',
        classList: ['swd_tab'],
        html:(tab.favIconUrl?'<img src="'+tab.favIconUrl+'">':'')+
             (tab.title?'<span class="swd_tab_title">'+tab.title+'</span>':'')+
             (tab.url?'<span class="swd_tab_url">'+tab.url+'</span>':'')
      });
    }

    that.renderAllTabs = function(tabs){
      for (var i = 0; i < tabs.length; i++) {
        that.renderTab(tabs[i]);
      }
    }

    that.getAllTabs = function(callback){
      chrome.runtime.sendMessage({cmd: "getTabs"}, function(response) {
        callback(response.data);
      });
    }


    that.getAllTabs(that.renderAllTabs);


//},1000);






    //alert(1)
    // var cursor = document.createElement("div");
    // cursor.setAttribute("id", "swd-cursor-pointer");
    // console.log(window.innerWidth, window.innerHeight);

    // cursor.style.position = "fixed";
    // cursor.style.left = "0";
    // cursor.style.top = "0";
    // cursor.style.width = "32px";
    // cursor.style.height = "32px";
    // cursor.style.display = "block";
    // cursor.style.zIndex = "999999999999999999999";
    // cursor.style.left = ((window.innerWidth/2)|0) + "px";
    // cursor.style.top = ((window.innerHeight/2)|0) + "px";
    // cursor.style.backgroundSize = "100% 100%";
    // cursor.style.backgroundPosition = "50% 50%";
    // cursor.style.pointerEvents = "none";
    // document.body.appendChild(cursor);

    // var lastCursorStyle = "";

    // function setCursorStyle(data) {
    //   if(data.style === lastCursorStyle) {
    //     return;
    //   }
    //   if(data.style === "arrow") {
    //     cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorArrow + ")";
    //   } else if(data.style === "wait") {
    //     cursor.style.backgroundImage = "url(data:image/png;base64," + window.swd.base64CursorWait + ")";
    //   }
    // }

    // function setCursorPosition(data) {
    //   if(data.x && data.y) {
    //     cursor.style.left = (data.x|0) + "px";
    //     cursor.style.top = (data.y|0) + "px";
    //   }
    // }

    // window.swd.addEventListener("swdCursorPosition", function(data) {
    //   setCursorPosition(data);
    // });

    // window.swd.addEventListener("swdCursorStyle", function(data) {
    //   setCursorStyle(data);
    // });

    // setCursorStyle({"style":"wait"});
  };
  window.swd.layout();
})(window);
