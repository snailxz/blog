(function() {
  var requestUrl = '//dig.zufangzi.com/t.gif'
  var env = 'origin'
  if(window.__UDL_CONFIG && window.__UDL_CONFIG.env) {
    if (window.__UDL_CONFIG.env === 'test') {
      // 20190827上线新的埋点测试服务地址。
      requestUrl = '//test.dig.lianjia.com/bigc.gif'
      // 20190515重新启动平台埋点测试服务。
      // requestUrl = '//test.dig.lianjia.com/t.gif'
      // 20190515注释租赁平台埋点地址，之前目的在于自动化测试埋点，目前已废弃
      // requestUrl = '//proxy.test.zufangzi.com/t.gif'
      env = 'test'
    }
    if (window.__UDL_CONFIG.env === 'lianjia') {
      requestUrl = '//dig.lianjia.com/t.gif'
      env = 'lianjia'
    }
    if (window.__UDL_CONFIG.env === 'dac') {
      requestUrl = '//dig.lianjia.com/bigc.gif'
      env = 'dac'
    }
  }
  var img = new Image();
  img.onload = img.onerror = function() {
    (function(udlConfig) {
      // prevent duplicate
      if ((window.$ULOG) && (window.$ULOG.state === 1)) {
        return;
      }

      /**
       * Event and Util
       */
      var _evt = {
        add: function(eventTarget, eventName, eventHandler) {
          if (eventTarget.addEventListener) {
            eventTarget.addEventListener(eventName, eventHandler, false);
          } else if (eventTarget.attachEvent) {
            eventTarget.attachEvent('on' + eventName, eventHandler);
          } else if (eventTarget['on' + eventName] === null) {
            eventTarget['on' + eventName] = eventHandler;
          }
        },

        remove: function(eventTarget, eventName, eventHandler) {
          if (eventTarget.removeEventListener) {
            eventTarget.removeEventListener(eventName, eventHandler, false);
          } else if (eventTarget.dispatchEvent) {
            eventTarget.detachEvent('on' + eventName, eventHandler);
          } else {
            eventTarget['on' + eventName] = null;
          }
        }
      };

      var _util = {
        extend: function(from, to) {
          if (from == null || typeof from != 'object') {
            return from
          }
          if (from.constructor != Object && from.constructor != Array) {
            return from
          }
          if (from.constructor == Date ||
            from.constructor == RegExp ||
            from.constructor == Function ||
            from.constructor == String ||
            from.constructor == Number ||
            from.constructor == Boolean) {
            return new from.constructor(from);
          }

          to = to || new from.constructor();

          for (var name in from) {
            if (from.hasOwnProperty(name)) {
              to[name] = typeof to[name] == 'undefined' ? _util.extend(from[name], null) : to[name];
            }
          }
          return to;
        },

        getIndex: function(element, context) {
          if (!context.indexOf) {
            for (var i = 0, j = context.length; i < j; i++) {
              if (context[i] === element) {
                return i;
              }
            }
            return -1;
          } else {
            return context.indexOf(element);
          }
        },

        getCookie: function(c_name) {
          if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + '=');
            if (c_start != -1) {
              c_start = c_start + c_name.length + 1;
              var c_end = document.cookie.indexOf(';', c_start);
              if (c_end == -1) {
                c_end = document.cookie.length;
              }
              return decodeURIComponent(document.cookie.substring(c_start, c_end));
            }
          }
          return '';
        }
      };

      /**
       * UserDataLog Core
       */
      var _udlCore = {
        send: function(params) {
          var requestImg = new Image();
          var paramsArr = [];
          var imgUrl = requestUrl;

          try {
            params = encodeURIComponent(JSON.stringify(params));
          } catch (e) {}

          if (!!params) {
            paramsArr.push(('r=' + (+new Date())));
            paramsArr.push(('d=' + (params)));
          }

          imgUrl += ('?' + paramsArr.join('&'));

          requestImg.onload = requestImg.onerror = function() {
            requestImg = null;
          };
          requestImg.src = imgUrl;
        },

        makeParam: function(param) {
          var sendParam = {};
          sendParam = _util.extend(param, sendParam);
          sendParam = _util.extend(udlConfig, sendParam);
          sendParam = _util.extend({
            key: window.location.href,
            uuid: (env === 'lianjia' || env === 'dac') ? (_util.getCookie('lianjia_uuid') || _util.getCookie('zf_uuid')) : (_util.getCookie('zf_uuid') || _util.getCookie('lianjia_uuid')),
            ssid: (env === 'lianjia' || env === 'dac') ? (_util.getCookie('lianjia_ssid') || _util.getCookie('zf_ssid')) : (_util.getCookie('zf_ssid') || _util.getCookie('lianjia_ssid'))
          }, sendParam);

          return sendParam;
        },

        parseElement: function(targetElement) {
          var tagname = (targetElement.tagName).toLowerCase(),
            classname = targetElement.className.replace(/ /g, ''),
            eleid = targetElement.id;

          classname = (classname.length == 0) ? ('') : ('.' + classname.replace(/ /g, '.'));
          eleid = (eleid.length == 0) ? ('') : ('#' + eleid);

          var eleSelector = tagname + eleid + classname;
          var eleIndex = (targetElement.parentElement === null) ? (0) : (_util.getIndex(targetElement, Array.prototype.slice.apply(targetElement.parentElement.querySelectorAll(eleSelector))));

          return {
            'selector': eleSelector,
            'index': eleIndex
          };
        },

        loadTime: (new Date()).getTime(),

        buffer: []
      };


      /**
       * Export Global $ULOG
       */
      if ((window.$ULOG) && (window.$ULOG.state === undefined) && (window.$ULOG.buffer) && (window.$ULOG.buffer.length > 0)) {
        _udlCore.buffer = _util.extend(window.$ULOG.buffer, []);
      }

      window.$ULOG = {
        send: function(evt, param) {
          param = param || {};
          param.evt = (evt + '');

          var sendParam = _udlCore.makeParam(param);

          switch (param.evt) {
            // native pv/uv event
            case '1':
              _udlCore.send(
                _util.extend({
                  'f': (document.referrer || ''),
                  'cid': _util.getCookie('current_city') || (window.config && window.config.cur_city_id) || _util.getCookie('select_city') || ''
                }, sendParam)
              );
              break;

              // native uv event
            case '2':
              var stayTime = Math.round(((new Date()).getTime() - _udlCore.loadTime) / 1000);
              _udlCore.send(
                _util.extend({
                  'f': (document.referrer || ''),
                  'cid': _util.getCookie('current_city') || (window.config && window.config.cur_city_id) || _util.getCookie('select_city') || '',
                  'stt': stayTime
                }, sendParam)
              );
              break;

              // native route event
            case '3':
              _udlCore.send(
                _util.extend({
                  'f': (document.referrer || ''),
                  'cid': _util.getCookie('current_city') || (window.config && window.config.cur_city_id) || _util.getCookie('select_city') || ''
                }, sendParam)
              );
              break;

              // native click event
            case '4':
              /* no click log *
               // get DOM link
               var domDepth   = [],
               targetNode = e.target;

               while (targetNode !== document.documentElement) {
               var currentEleObj = _udlCore.parseElement(targetNode);
               domDepth.push(currentEleObj.selector + ':nth-child(' + currentEleObj.index + ')');
               targetNode = targetNode.parentElement;
               }

              _udlCore.send(
                  _util.extend({
                      'pid': udlConfig.pid,
                      'key': window.location.href,
                      'uuid': _util.getCookie('lianjia_uuid'),
                      'ssid': _util.getCookie('lianjia_ssid'),
                      'cx': e.pageX,
                      'cy': e.pageY,
                      'wx': document.documentElement.offsetWidth,
                      'wy': document.documentElement.offsetHeight,
                      'dp': domDepth.join(','),
                      'evt': '4'
                  }, sendParam)
              );
              */
              break;

              // native load(pv/uv & route) event
            case '1,3':
              _udlCore.send(
                _util.extend({
                  'f': (document.referrer || ''),
                  'cid': _util.getCookie('current_city') || (window.config && window.config.cur_city_id) || _util.getCookie('select_city') || ''
                }, sendParam)
              );
              break;

              // custom event
            default:
              _udlCore.send(
                _util.extend({
                  'f': (document.referrer || ''),
                  'cid': _util.getCookie('current_city') || (window.config && window.config.cur_city_id) || _util.getCookie('select_city') || ''
                }, sendParam)
              );
              break;
          }
        },

        update: function(config) {
          for (var key in config) {
            if (config.hasOwnProperty(key)) {
              udlConfig[key] = config[key];
            }
          }
        },

        state: 1
      };

      /**
       * Init Log
       */
      // send buffer log
      for (var index in _udlCore.buffer) {
        if (_udlCore.buffer.hasOwnProperty(index)) {
          var targetLog = _udlCore.buffer[index];

          if (typeof targetLog === 'string') {
            window.$ULOG.send(targetLog);
          } else {
            window.$ULOG.send(targetLog[0], targetLog[1]);
          }
        }
      }

      // send pv&uv
      window.$ULOG.send('1,3');

      // send stay time
      _evt.add(window, 'beforeunload', function() {
        window.$ULOG.send('2');
      });

      // send click
      _evt.add(document.documentElement, 'mousedown', function(e) {
        window.$ULOG.send('4');
      });


    })(window.__UDL_CONFIG || {});
  };
  img.src = requestUrl + '?_=' + +new Date;
})();