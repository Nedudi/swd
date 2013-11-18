/* global swd_base64CursorArrow:true, swd_base64CursorWait:true */
(function(window){
  "use strict";

  window.swd = window.swd || {};

  window.swd.layout = function() {
    var that = this;
    that.view = {};
    var html = document.getElementsByTagName('html')[0];
    var body = document.getElementsByTagName('body')[0];
    html.classList.add('swd');
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

    that.view.buttonSettings.addEventListener('click', function(){
      var iframe = document.getElementsByClassName('swd-iframe')[0];
      iframe.classList.toggle('swd-none');
    });

    that.view.buttonBack = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_back','icon-arrow-left-thick']
    });
    that.view.buttonNext = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_next','icon-arrow-right-thick']
    });

    that.view.buttonRefresh = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_refresh','icon-repeat']
    });
    that.view.buttonRefresh.addEventListener('click', function(){
      window.location.reload(true);
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
      that.view.top.style.top = scrollTop+'px';
      that.view.left.style.top = scrollTop+100+'px';
      that.view.right.style.top = scrollTop+100+'px';
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
      var length = tabs.length>3?3:tabs.length;
      for (var i = 0; i < length; i++) {
        that.renderTab(tabs[i]);
      }
    }

    that.getAllTabs = function(callback){
      chrome.runtime.sendMessage({cmd: "getTabs"}, function(response) {
        callback(response.data);
      });
    }


    that.getAllTabs(that.renderAllTabs);
  };
  window.swd.layout();
})(window);
