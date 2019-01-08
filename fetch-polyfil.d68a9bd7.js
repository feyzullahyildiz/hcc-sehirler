// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"fetch-polyfil.js":[function(require,module,exports) {
var define;
var global = arguments[3];
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e, n) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? n() : "function" == typeof define && define.amd ? define(n) : n();
}(0, function () {
  "use strict";

  function e(e) {
    var n = this.constructor;
    return this.then(function (t) {
      return n.resolve(e()).then(function () {
        return t;
      });
    }, function (t) {
      return n.resolve(e()).then(function () {
        return n.reject(t);
      });
    });
  }

  function n() {}

  function t(e) {
    if (!(this instanceof t)) throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    this._state = 0, this._handled = !1, this._value = undefined, this._deferreds = [], u(e, this);
  }

  function o(e, n) {
    for (; 3 === e._state;) {
      e = e._value;
    }

    0 !== e._state ? (e._handled = !0, t._immediateFn(function () {
      var t = 1 === e._state ? n.onFulfilled : n.onRejected;

      if (null !== t) {
        var o;

        try {
          o = t(e._value);
        } catch (f) {
          return void i(n.promise, f);
        }

        r(n.promise, o);
      } else (1 === e._state ? r : i)(n.promise, e._value);
    })) : e._deferreds.push(n);
  }

  function r(e, n) {
    try {
      if (n === e) throw new TypeError("A promise cannot be resolved with itself.");

      if (n && ("object" == _typeof(n) || "function" == typeof n)) {
        var o = n.then;
        if (n instanceof t) return e._state = 3, e._value = n, void f(e);
        if ("function" == typeof o) return void u(function (e, n) {
          return function () {
            e.apply(n, arguments);
          };
        }(o, n), e);
      }

      e._state = 1, e._value = n, f(e);
    } catch (r) {
      i(e, r);
    }
  }

  function i(e, n) {
    e._state = 2, e._value = n, f(e);
  }

  function f(e) {
    2 === e._state && 0 === e._deferreds.length && t._immediateFn(function () {
      e._handled || t._unhandledRejectionFn(e._value);
    });

    for (var n = 0, r = e._deferreds.length; r > n; n++) {
      o(e, e._deferreds[n]);
    }

    e._deferreds = null;
  }

  function u(e, n) {
    var t = !1;

    try {
      e(function (e) {
        t || (t = !0, r(n, e));
      }, function (e) {
        t || (t = !0, i(n, e));
      });
    } catch (o) {
      if (t) return;
      t = !0, i(n, o);
    }
  }

  var c = setTimeout;
  t.prototype["catch"] = function (e) {
    return this.then(null, e);
  }, t.prototype.then = function (e, t) {
    var r = new this.constructor(n);
    return o(this, new function (e, n, t) {
      this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof n ? n : null, this.promise = t;
    }(e, t, r)), r;
  }, t.prototype["finally"] = e, t.all = function (e) {
    return new t(function (n, t) {
      function o(e, f) {
        try {
          if (f && ("object" == _typeof(f) || "function" == typeof f)) {
            var u = f.then;
            if ("function" == typeof u) return void u.call(f, function (n) {
              o(e, n);
            }, t);
          }

          r[e] = f, 0 == --i && n(r);
        } catch (c) {
          t(c);
        }
      }

      if (!e || "undefined" == typeof e.length) throw new TypeError("Promise.all accepts an array");
      var r = Array.prototype.slice.call(e);
      if (0 === r.length) return n([]);

      for (var i = r.length, f = 0; r.length > f; f++) {
        o(f, r[f]);
      }
    });
  }, t.resolve = function (e) {
    return e && "object" == _typeof(e) && e.constructor === t ? e : new t(function (n) {
      n(e);
    });
  }, t.reject = function (e) {
    return new t(function (n, t) {
      t(e);
    });
  }, t.race = function (e) {
    return new t(function (n, t) {
      for (var o = 0, r = e.length; r > o; o++) {
        e[o].then(n, t);
      }
    });
  }, t._immediateFn = "function" == typeof setImmediate && function (e) {
    setImmediate(e);
  } || function (e) {
    c(e, 0);
  }, t._unhandledRejectionFn = function (e) {
    void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", e);
  };

  var l = function () {
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    if ("undefined" != typeof global) return global;
    throw Error("unable to locate global object");
  }();

  "Promise" in l ? l.Promise.prototype["finally"] || (l.Promise.prototype["finally"] = e) : l.Promise = t;
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49205" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","fetch-polyfil.js"], null)
//# sourceMappingURL=/fetch-polyfil.d68a9bd7.map