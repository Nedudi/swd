/* global swd_base64CursorArrow:true, swd_base64CursorWait:true */
(function(window){
  "use strict";

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
      if(options.html){
        block.innerHTML = options.html;
      }
      if(options.id){
        block.setAttribute('id', options.id);
      }
      options.container.appendChild(block);
      return block;
    };


    that.view.top = createBlock({
      container:body,
      tagName: 'aside',
      classList: ['swd_top','swd_aside']
    });

    that.view.left = createBlock({
      container:body,
      tagName: 'aside',
       classList: ['swd_left','swd_aside']
    });

    that.view.right = createBlock({
      container:body,
      tagName: 'aside',
      classList: ['swd_right','swd_aside']
    });

    that.view.buttonScrollUp = createBlock({
      container:that.view.right,
      tagName: 'a',
      classList: ['swd_button','swd_button_scroll_up','icon-arrow-up3']
    });

    that.view.buttonScrollUp.addEventListener('click', function(){
      $('html, body').animate({scrollTop: body.scrollTop - document.documentElement.clientHeight/3}, 200);
    }, false);

    that.view.buttonScrollDown = createBlock({
      container:that.view.right,
      tagName: 'a',
      classList: ['swd_button','swd_button_scroll_down','icon-arrow-down3']
    });

    that.view.buttonScrollDown.addEventListener('click', function(){
      $('html, body').animate({scrollTop: body.scrollTop + document.documentElement.clientHeight/3}, 200);
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

    that.view.buttonBack.addEventListener('click', function(){
      history.back();
    });

    that.view.buttonNext = createBlock({
      container:that.view.historyBlock,
      tagName: 'a',
      classList: ['swd_button','swd_button_next','icon-arrow-right-thick']
    });

    that.view.buttonNext.addEventListener('click', function(){
      history.forward();
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

    that.view.buttonAddTab.addEventListener('click', function(){
      window.swd.openNewTabScreen();
    });


    window.onscroll = function (oEvent) {
      var scrollTop = body.scrollTop;
      var scrollLeft = body.scrollLeft;
      // do something
    }


    // ------------------------------------------------------------------------
    // handle tabs
    // ------------------------------------------------------------------------


    that.renderTab = function(tab){
      console.log('render tab', tab);
      if(tab.url.indexOf('http') === -1) return;
      var tabLayout = createBlock({
        container:that.view.tabsBlock,
        tagName: 'a',
        id: "swd_tab_"+tab.id,
        classList: ['swd_tab'],
        html:(tab.favIconUrl?'<img src="'+tab.favIconUrl+'">':'')+
             (tab.title?'<span class="swd_tab_title">'+tab.title+'</span>':'')+
             (tab.url?'<span class="swd_tab_url">'+tab.url+'</span>':'')
      });
      tabLayout.addEventListener('click', function(){
        that.setActiveTab(tab.id);
      }, false)
    }

    that.renderAllTabs = function(tabs){
      that.view.tabsBlock.innerHTML = '';
      console.log('that.renderAllTabs!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      var length = tabs.length;//>5?5:tabs.length;
      for (var i = 0; i < length; i++) {
        that.renderTab(tabs[i]);
      }
      if(!swd.currentTabId){
        that.getMyTabId(function(tabId){
          swd.currentTabId = tabId;
          that.highlightActiveTab();
          console.log('MY TAB ID IS = swd.currentTabId = ',tabId);
        });
      } else {
        that.highlightActiveTab();
      }
    }

    that.highlightActiveTab = function(){
      document.querySelector('#swd_tab_'+swd.currentTabId).classList.add('swd_active_tab');
    }

    that.getAllTabs = function(callback){
      window.swd.ask('messageGetTabs', false, function(response){
        callback(response.data);
      });
    };

    that.setActiveTab = function(id){
      window.swd.ask('messageSetActiveTab',{tabId:id});
    };

    that.getMyTabId = function(callback){
      window.swd.ask('messageGetMyTabId',false, function(response){
        callback(response.data.tabId);
      });
    };

    // ------------------------------------------------------------------------
    // listen for commands from extension
    // ------------------------------------------------------------------------

    swd.on('messageTabsChanged', function(request){
      that.getAllTabs(that.renderAllTabs);
    });

    swd.on('messageTabActivated', function(request){
      //that.highlightActiveTab(request.data.tabId);
    });

  };
})(window);
