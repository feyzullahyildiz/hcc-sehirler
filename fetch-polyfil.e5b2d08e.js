parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"MhiC":[function(require,module,exports) {
var define;
var global = arguments[3];
var t,n=arguments[3];function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function(n,o){"object"==("undefined"==typeof exports?"undefined":e(exports))&&"undefined"!=typeof module?o():"function"==typeof t&&t.amd?t(o):o()}(0,function(){"use strict";function t(t){var n=this.constructor;return this.then(function(e){return n.resolve(t()).then(function(){return e})},function(e){return n.resolve(t()).then(function(){return n.reject(e)})})}function o(){}function r(t){if(!(this instanceof r))throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(t,this)}function i(t,n){for(;3===t._state;)t=t._value;0!==t._state?(t._handled=!0,r._immediateFn(function(){var e=1===t._state?n.onFulfilled:n.onRejected;if(null!==e){var o;try{o=e(t._value)}catch(c){return void u(n.promise,c)}f(n.promise,o)}else(1===t._state?f:u)(n.promise,t._value)})):t._deferreds.push(n)}function f(t,n){try{if(n===t)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==e(n)||"function"==typeof n)){var o=n.then;if(n instanceof r)return t._state=3,t._value=n,void c(t);if("function"==typeof o)return void l(function(t,n){return function(){t.apply(n,arguments)}}(o,n),t)}t._state=1,t._value=n,c(t)}catch(f){u(t,f)}}function u(t,n){t._state=2,t._value=n,c(t)}function c(t){2===t._state&&0===t._deferreds.length&&r._immediateFn(function(){t._handled||r._unhandledRejectionFn(t._value)});for(var n=0,e=t._deferreds.length;e>n;n++)i(t,t._deferreds[n]);t._deferreds=null}function l(t,n){var e=!1;try{t(function(t){e||(e=!0,f(n,t))},function(t){e||(e=!0,u(n,t))})}catch(i){if(e)return;e=!0,u(n,i)}}var s=setTimeout;r.prototype.catch=function(t){return this.then(null,t)},r.prototype.then=function(t,n){var e=new this.constructor(o);return i(this,new function(t,n,e){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof n?n:null,this.promise=e}(t,n,e)),e},r.prototype.finally=t,r.all=function(t){return new r(function(n,o){function r(t,u){try{if(u&&("object"==e(u)||"function"==typeof u)){var c=u.then;if("function"==typeof c)return void c.call(u,function(n){r(t,n)},o)}i[t]=u,0==--f&&n(i)}catch(s){o(s)}}if(!t||void 0===t.length)throw new TypeError("Promise.all accepts an array");var i=Array.prototype.slice.call(t);if(0===i.length)return n([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u])})},r.resolve=function(t){return t&&"object"==e(t)&&t.constructor===r?t:new r(function(n){n(t)})},r.reject=function(t){return new r(function(n,e){e(t)})},r.race=function(t){return new r(function(n,e){for(var o=0,r=t.length;r>o;o++)t[o].then(n,e)})},r._immediateFn="function"==typeof setImmediate&&function(t){setImmediate(t)}||function(t){s(t,0)},r._unhandledRejectionFn=function(t){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)};var a=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n)return n;throw Error("unable to locate global object")}();"Promise"in a?a.Promise.prototype.finally||(a.Promise.prototype.finally=t):a.Promise=r});
},{}]},{},["MhiC"], null)
//# sourceMappingURL=/hcc-sehirler/fetch-polyfil.e5b2d08e.map