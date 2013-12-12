(function(window) {
  "use strict";
  window.swd = window.swd || {};
  window.swd._listeners = {};
  window.swd._messagePrefix = "stop_web_disability_message_";

  window.swd.sendMessage = function(type, data)  {
    var msg = window.swd._messagePrefix + JSON.stringify({"type":type, "data":data});
    window.postMessage(msg, "*");
    // if(window.parent) {
    //   window.parent.postMessage(msg, "*");
    // }
    // var tmp = document.querySelector(".swd-iframe");
    // if(tmp && tmp.contentWindow) {
    //   tmp.contentWindow.postMessage(msg, "*");
    // }
  };

  /**
   * attach callback for event
   * @param event -- event name
   * @param func -- ref to function
   * @returns {*}
   */
  window.swd.addEventListener = function(event, func) {
    if(!window.swd._listeners[event]) {
      window.swd._listeners[event] = [];
    }
    window.swd._listeners[event].push(func);
    return this;
  };

  /**
   * detach callback for event
   * @param event -- event name
   * @param func -- ref to function, if not set -- remove all callback functions
   * @returns {*}
   */
  window.swd.removeEventListener = function(event, func) {
    if(!window.swd._listeners[event]) {
      return this;
    }
    if(!func) {
      window.swd._listeners[event] = null;
      delete window.swd._listeners[event];
      return this;
    }
    var qq;
    for(qq = 0; qq < window.swd._listeners[event].length; ++qq) {
      if(window.swd._listeners[event][qq] === func) {
        window.swd._listeners[event].splice(qq, 1);
        --qq;
      }
      if(this._listeners[event].length <= 0) {
        delete this._listeners[event];
      }
    }
    return this;
  };

  window.addEventListener("message", function(data) {
    //console.log('swg.org window got the message = ', data);
    if(!data || typeof(data.data) !== "string") {
      return;
    }
    var str = data.data;
    if(str.substr(0, window.swd._messagePrefix.length) !== window.swd._messagePrefix) {
      return;
    }
    var json = JSON.parse(str.substr(window.swd._messagePrefix.length));
    if(window.swd._listeners[json.type]) {
      var that = this;
      window.swd._listeners[json.type].each(function(item) {
        item.call(that, json.data);
      });
    }
  });

  /**
   * call function for each element in array (!only)
   * @param func -- callback function
   */
  Array.prototype.each = function(func) {
    if(!func) { return; }
    var qq;
    for(qq = 0; qq < this.length; ++qq) {
      func.call(this, this[qq]);
    }
  };

})(window);