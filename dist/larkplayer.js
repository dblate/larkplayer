(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.larkplayer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file class Componet 所有 UI 的基类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yuhui06@baidu.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @date 2017/11/4
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @todo 支持 tap 事件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _guid = require('./utils/guid');

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _mergeOptions = require('./utils/merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

var _evented = require('./mixins/evented');

var _evented2 = _interopRequireDefault(_evented);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component(player, options, ready) {
        _classCallCheck(this, Component);

        if (!player && this.play) {
            this.player = player = this;
        } else {
            this.player = player;
        }

        // 避免覆盖 prototype.options
        this.options = (0, _mergeOptions2.default)({}, this.options);
        options = this.options = (0, _mergeOptions2.default)(this.options, options);
        this.id = options.id || options.el && options.el.id;
        if (!this.id) {
            var id = player && player.id || 'no_player';
            this.id = id + '_component_' + (0, _guid.newGUID)();
        }

        this.name = options.name || null;

        // Html5 中 options.el 为 video 标签
        if (options.el) {
            this.el = options.el;
            // 有时侯我们不希望在这里执行 createEl
        } else if (options.createEl !== false) {
            // 往往是执行子类的 createEl 方法
            this.el = this.createEl();
        }

        (0, _evented2.default)(this, { eventBusKey: this.el });

        // 子元素相关信息
        this.children = [];
        this.childNameIndex = {};

        if (options.initChildren !== false) {
            this.initChildren();
        }

        this.ready(ready);
    }

    // dispose 应该做到以下几方面
    // 1. remove Elements for memory
    // 2. remove Events for memory
    // 3. remove reference for GC


    _createClass(Component, [{
        key: 'dispose',
        value: function dispose() {
            this.trigger({ type: 'dispose', bubbles: false });

            if (this.el) {
                if (this.el.parentNode) {
                    this.el.parentNode.removeChild(this.el);
                }
                this.off();
                this.el = null;
            }

            if (this.children) {
                this.children.forEach(function (child) {
                    if (typeof child.dispose === 'function') {
                        child.dispose();
                    }
                });
                this.children = null;
                this.childNameIndex = null;
            }
        }
    }, {
        key: 'createEl',
        value: function createEl(tagName, properties, attributes) {
            return Dom.createEl(tagName, properties, attributes);
        }
    }, {
        key: 'createElement',
        value: function createElement(tagName, props) {
            var ComponentClass = Component.getComponent((0, _toTitleCase2.default)(tagName));

            for (var _len = arguments.length, child = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                child[_key - 2] = arguments[_key];
            }

            if (ComponentClass) {
                var instance = new ComponentClass(this.player, props);
                var instanceEl = instance.el;

                if (child) {
                    Dom.appendContent(instanceEl, child);
                }

                return instanceEl;
            } else {
                return Dom.createElement.apply(Dom, [tagName, props].concat(child));
            }
        }
    }, {
        key: 'appendChild',
        value: function appendChild(el, child) {}
    }, {
        key: 'contentEl',
        value: function contentEl() {
            return this.contentEl || this.el;
        }
    }, {
        key: 'getChild',
        value: function getChild(name) {

            if (!name) {
                return;
            }

            return this.childNameIndex[(0, _toTitleCase2.default)(name)];
        }
    }, {
        key: 'addChild',
        value: function addChild() {}
    }, {
        key: 'removeChild',
        value: function removeChild() {}
    }, {
        key: 'initChildren',
        value: function initChildren() {
            var _this = this;

            if (this.options.children && this.options.children.length) {
                // 目前只支持平行的就够了
                this.options.children.forEach(function (componentName) {
                    var ComponentClass = Component.getComponent((0, _toTitleCase2.default)(componentName));
                    // @todo 判断 ComponentClass 是否合法
                    if (ComponentClass) {
                        // @todo this.options 传到子元素里有什么用？
                        // this.options 里的 el 会跟子元素的 el 冲突
                        var _child = new ComponentClass(_this.player);

                        _this.children.push(_child);
                        _this.childNameIndex[componentName] = _child;

                        _this.el.appendChild(_child.el);
                    }
                });
            }
        }
    }, {
        key: 'ready',
        value: function ready(fn) {
            var _this2 = this;

            if (fn) {
                if (this.isReady) {
                    setTimeout(function () {
                        fn.call(_this2);
                    }, 1);
                } else {
                    this.readyQueue = this.readyQueue || [];
                    this.readyQueue.push(fn);
                }
            }
        }
    }, {
        key: 'triggerReady',
        value: function triggerReady() {
            var _this3 = this;

            this.isReady = true;

            setTimeout(function () {
                var readyQueue = _this3.readyQueue;
                _this3.readyQueue = [];
                if (readyQueue && readyQueue.length) {
                    readyQueue.forEach(function (fn) {
                        fn.call(_this3);
                    });
                }

                _this3.trigger('ready');
            }, 1);
        }
    }, {
        key: '$',
        value: function $(selector, context) {
            return Dom.$(selector, context || this.contentEl());
        }
    }, {
        key: '$$',
        value: function $$(selector, context) {
            return Dom.$$(selector, context || this.contentEl());
        }
    }, {
        key: 'hasClass',
        value: function hasClass(classToCheck) {
            return Dom.hasClass(this.el, classToCheck);
        }
    }, {
        key: 'addClass',
        value: function addClass(classToAdd) {
            return Dom.addClass(this.el, classToAdd);
        }
    }, {
        key: 'removeClass',
        value: function removeClass(classToRemove) {
            return Dom.removeClass(this.el, classToRemove);
        }
    }, {
        key: 'toggleClass',
        value: function toggleClass(classToToggle) {
            return Dom.toggleClass(this.el, classToToggle);
        }
    }, {
        key: 'show',
        value: function show() {
            this.removeClass('lark-hidden');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.addClass('lark-hidden');
        }
    }, {
        key: 'lockShowing',
        value: function lockShowing() {
            this.addClass('lark-lock-showing');
        }
    }, {
        key: 'unlockShowing',
        value: function unlockShowing() {
            this.removeClass('lark-lock-showing');
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(attribute) {
            return Dom.getAttribute(this.el, attribute);
        }
    }, {
        key: 'setAttribute',
        value: function setAttribute(attribute, value) {
            return Dom.setAttribute(attribute, value);
        }
    }, {
        key: 'removeAttribute',
        value: function removeAttribute(attribute) {
            return Dom.removeAttribute(this.el, attribute);
        }
    }, {
        key: 'width',
        value: function width() {}
    }, {
        key: 'height',
        value: function height() {}
    }, {
        key: 'focus',
        value: function focus() {
            this.el.focus();
        }
    }, {
        key: 'blur',
        value: function blur() {
            this.el.blur();
        }
    }], [{
        key: 'registerComponent',
        value: function registerComponent(name, component) {
            // 静态方法，this 是指 Component 这个类而不是他的实例
            if (!this.components) {
                this.components = {};
            }

            this.components[name] = component;
        }
    }, {
        key: 'getComponent',
        value: function getComponent(name) {
            return this.components[name];
        }
    }]);

    return Component;
}();

exports.default = Component;

},{"./mixins/evented":4,"./utils/dom":27,"./utils/guid":31,"./utils/merge-options":33,"./utils/to-title-case":39}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _normalizeSource = require('./utils/normalize-source');

var _normalizeSource2 = _interopRequireDefault(_normalizeSource);

var _obj = require('./utils/obj');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file html5 video api proxy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06(yuhui06@baidu.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://html.spec.whatwg.org/#event-media-emptied
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-src
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var document = window.document;

var Html5 = function (_Component) {
    _inherits(Html5, _Component);

    function Html5(player, options, ready) {
        _classCallCheck(this, Html5);

        // @todo 处理有 source 的情况

        var _this = _possibleConstructorReturn(this, (Html5.__proto__ || Object.getPrototypeOf(Html5)).call(this, player, options, ready));

        _this.proxyWebkitFullscreen();
        return _this;
    }

    _createClass(Html5, [{
        key: 'dispose',
        value: function dispose() {
            Html5.disposeMediaElement(this.el);
            _get(Html5.prototype.__proto__ || Object.getPrototypeOf(Html5.prototype), 'dispose', this).call(this);
        }
    }, {
        key: 'setCurrentTime',
        value: function setCurrentTime(seconds) {
            try {
                this.el.currentTime = seconds;
            } catch (ex) {
                /* eslint-disable no-console */
                console.log(ex, 'Video is not ready');
                /* eslint-enbale no-console */
            }
        }
    }, {
        key: 'width',
        value: function width() {
            return this.el.offsetWidth;
        }
    }, {
        key: 'height',
        value: function height() {
            return this.el.offsetHeight;
        }
    }, {
        key: 'proxyWebkitFullscreen',
        value: function proxyWebkitFullscreen() {
            var _this2 = this;

            if (!('webkitDisplayingFullscreen' in this.el)) {
                return;
            }

            var endFn = function endFn() {
                this.trigger('fullscreenchange', { isFullscreen: false });
            };

            var beginFn = function beginFn() {
                if ('webkitPresentationMode' in this.el && this.el.webkitPresentationMode !== 'picture-in-picture') {

                    this.one('webkitendfullscreen', endFn);
                    this.trigger('fullscreenchange', { isFullscreen: true });
                }
            };

            // @todo 改变执行事件时的 this
            beginFn = beginFn.bind(this);
            endFn = endFn.bind(this);

            this.on('webkitbeginfullscreen', beginFn);
            this.on('dispose', function () {
                _this2.off('webkitbeginfullscreen', beginFn);
                _this2.off('webkitendfullscreen', endFn);
            });
        }
    }, {
        key: 'supportsFullScreen',
        value: function supportsFullScreen() {
            // return this.el.webkitSupportsFullscreen;

            if (typeof this.el.webkitEnterFullScreen === 'function') {
                var userAgent = window.navigator && window.navigator.userAgent || '';

                // Seems to be broken in Chromium/Chrome && Safari in Leopard
                if (/Android/.test(userAgent) || !/Chrome|Mac OS X 10.5/.test(userAgent)) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'enterFullScreen',
        value: function enterFullScreen() {
            if (typeof this.el.webkitEnterFullScreen === 'function') {
                this.el.webkitEnterFullScreen();
            }
        }
    }, {
        key: 'exitFullScreen',
        value: function exitFullScreen() {
            if (typeof this.el.webkitExitFullScreen === 'function') {
                // @test
                this.player.removeClass('lark-fullscreen');

                this.el.webkitExitFullScreen();
            }
        }
    }, {
        key: 'src',
        value: function src(_src) {
            if (_src === undefined) {
                return this.el.currentSrc || this.el.src;
            }

            this.setSrc(_src);
        }
    }, {
        key: 'source',
        value: function source(_source) {
            if (_source === undefined) {
                var sourceNodeList = Dom.$$('source', this.el);
                var sourceArray = Array.from(sourceNodeList);
                return sourceArray.map(function (value) {
                    return {
                        src: value.src,
                        type: value.type
                    };
                });
            } else {
                _source = (0, _normalizeSource2.default)(_source);

                var docFragment = document.createDocumentFragment();
                _source.forEach(function (value) {
                    var sourceElem = Dom.createElement('source', {
                        src: value.src,
                        type: value.type
                    });
                    docFragment.appendChild(sourceElem);
                });
                this.el.appendChild(docFragment);
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            Html5.resetMediaElement(this.el);
        }
    }, {
        key: 'currentSrc',
        value: function currentSrc() {
            if (this.currentSource) {
                return this.currentSource.src;
            }

            return this.el.currentSrc;
        }
    }, {
        key: 'setControls',
        value: function setControls(val) {
            this.el.controls = !!val;
        }
    }, {
        key: 'getVideoPlaybackQuality',
        value: function getVideoPlaybackQuality() {}
    }]);

    return Html5;
}(_component2.default);

// HTML5 Support Testing


Html5.TEST_VID = document.createElement('video');

/**
 * 检查是否支持 HTML5 video
 *
 * @return {boolean} 是否支持 HTML5 video
 */
Html5.isSupported = function () {
    try {
        Html5.TEST_VID.volume = 0.5;
    } catch (ex) {
        return false;
    }

    return !!(Html5.TEST_VID && Html5.TEST_VID.canPlayType);
};

/**
 * 检查是否支持指定类型的视频
 *
 * HTML5 api proxy
 *
 * @param {string} type 要检查的类型(mimetype)
 * @return {boolean} 是否支持
 */
Html5.canPlayType = function (type) {
    return Html5.TEST_VID.canPlayType(type);
};

Html5.canPlaySource = function (srcObj, options) {
    return Html5.canPlayType(srcObj.type);
};

/**
 * 检查是否可以改变播放器的声音大小（许多移动端的浏览器没法改变声音大小，比如 ios）
 *
 * @return {boolean} 是否可以改变声音大小
 */
Html5.canControlVolume = function () {
    // IE will error if Windows Media Player not installed #3315
    try {
        var volume = Html5.TEST_VID.volume;

        Html5.TEST_VID.volume = volume / 2 + 0.1;
        return volume !== Html5.TEST_VID.volume;
    } catch (ex) {
        return false;
    }
};

/**
 * 检查能否改变视频播放速度
 *
 * @return {boolean} 是否可以改变视频播放速度
 */
Html5.canControlPlaybackRate = function () {
    // Playback rate API is implemented in Android Chrome, but doesn't do anything
    // https://github.com/videojs/video.js/issues/3180
    // if (browser.IS_ANDROID && browser.IS_CHROME && browser.CHROME_VERSION < 58) {
    //     return false;
    // }

    try {
        var playbackRate = Html5.TEST_VID.playbackRate;
        Html5.TEST_VID.playbackRate = playbackRate / 2 + 0.1;
        return playbackRate !== Html5.TEST_VID.playbackRate;
    } catch (ex) {
        return false;
    }
};

// HTML5 video 事件
Html5.Events = ['loadstart', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing', 'waiting', 'seeking', 'seeked', 'ended', 'durationchange', 'timeupdate', 'progress', 'play', 'pause', 'ratechange', 'resize', 'volumechange'];

Html5.prototype.featuresVolumeControl = Html5.canControlVolume();

Html5.prototype.featuresPlaybackRate = Html5.canControlPlaybackRate();

// @todo
// Html5.prototype.movingMediaElementInDOM = !browser.IS_IOS;

// 表明进入全屏时，播放器是否自动改变视频大小
Html5.prototype.featuresFullscreenResize = true;

// 表明是否支持 progress 事件
Html5.prototype.featuresProgressEvents = true;

// 表明是否支持 timeupdate 事件
Html5.prototype.featuresTimeupdateEvents = true;

// @todo patchCanPlayType


Html5.disposeMediaElement = function (el) {
    if (!el) {
        return;
    }

    if (el.parentNode) {
        el.parentNode.removeChild(el);
    }

    while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }

    // 移除 src 属性，而不是设置 src=''（在 firefox 下会有问题）
    el.removeAttribute('src');

    // force the media element to update its loading state by calling load()
    // however IE on Windows 7N has a bug that throws an error so need a try/catch (#793)
    if (typeof el.load === 'function') {
        // wrapping in an iife so it's not deoptimized (#1060#discussion_r10324473)
        (function () {
            try {
                el.load();
            } catch (ex) {
                /* eslint-disable no-console */
                console.log(ex);
                /* eslint-enbale no-console */
            }
        })();
    }
};

Html5.resetMediaElement = function (el) {
    if (!el) {
        return;
    }

    var sources = el.querySelectorAll('source');
    var i = sources.length;

    while (i--) {
        el.removeChild(sources[i]);
    }

    el.removeAttribute('src');

    if (typeof el.load === 'function') {
        // wrapping in an iife so it's not deoptimized (#1060#discussion_r10324473)
        (function () {
            try {
                el.load();
            } catch (e) {
                // satisfy linter
            }
        })();
    }
};

Html5.mediaSourceHandler = [];

Html5.validateMediaSourceHandler = function (handler) {
    if ((0, _obj.isPlain)(handler) && typeof handler.canHandleSource === 'function' && typeof handler.handleSource === 'function') {
        return true;
    } else {
        return false;
    }
};

Html5.registerMediaSourceHandler = function (handler) {
    if (Html5.validateMediaSourceHandler(handler)) {
        Html5.mediaSourceHandler.push(handler);
    } else {
        /* eslint-disable no-console */
        console.error('Invalid mediaSourceHandler');
        /* eslint-enbale no-console */
    }
};

Html5.selectMediaSourceHandler = function (source) {
    return Html5.mediaSourceHandler.find(function (handler) {
        return handler.canHandleSource(source);
    });
};

// HTML5 video attributes proxy
// 获取对应属性的值
// muted defaultMuted autoplay controls loop playsinline
['muted', 'defaultMuted', 'autoplay', 'controls', 'loop', 'playsinline'].forEach(function (attr) {
    Html5.prototype[attr] = function () {
        return this.el[attr] || this.el.hasAttribute(attr);
    };
});

// HTML5 video attributes proxy
// 设置对应属性的值
// setMuted, setDefaultMuted, setAutoPlay, setLoop, setPlaysinline
// setControls 算是特例
['muted', 'defaultMuted', 'autoplay', 'loop', 'playsinline'].forEach(function (attr) {
    Html5.prototype['set' + (0, _toTitleCase2.default)(attr)] = function (value) {
        this.el[attr] = value;

        if (value) {
            this.el.setAttribute(attr, attr);
        } else {
            this.el.removeAttribute(attr);
        }
    };
});

// Wrap HTML5 video properties with a getter
// paused, currentTime, duration, buffered, volume, poster, preload, error, seeking
// seekable, ended, palybackRate, defaultPlaybackRate, played, networkState,
// readyState, videoWidth, videoHeight
['paused', 'currentTime', 'duration', 'buffered', 'volume', 'poster', 'preload', 'error', 'seeking', 'seekable', 'ended', 'playbackRate', 'defaultPlaybackRate', 'played', 'networkState', 'readyState', 'videoWidth', 'videoHeight'].forEach(function (prop) {
    Html5.prototype[prop] = function () {
        return this.el[prop];
    };
});

// Wrap HTML5 video properties with a setter in the following format:
// set + toTitleCase(propName)
// setVolume, setSrc, setPoster, setPreload, setPlaybackRate, setDefaultPlaybackRate
['volume', 'src', 'poster', 'preload', 'playbackRate', 'defaultPlaybackRate'].forEach(function (prop) {
    Html5.prototype['set' + (0, _toTitleCase2.default)(prop)] = function (value) {
        this.el[prop] = value;
    };
});

// Wrap native functions with a function
// pause, load, play
['pause', 'load', 'play'].forEach(function (prop) {
    Html5.prototype[prop] = function () {
        return this.el[prop]();
    };
});

exports.default = Html5;

},{"./component":1,"./utils/dom":27,"./utils/normalize-source":35,"./utils/obj":36,"./utils/to-title-case":39}],3:[function(require,module,exports){
'use strict';

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('./utils/events');

var Events = _interopRequireWildcard(_events);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _plugin = require('./utils/plugin');

var Plugin = _interopRequireWildcard(_plugin);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _html = require('./html5');

var _html2 = _interopRequireDefault(_html);

require('./shim/third_party/shim.min.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function normalize(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var readyFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    if (typeof el === 'string') {
        if (el.charAt(0) !== '#') {
            el = '#' + el;
        }

        el = Dom.$(el);
    }

    // 默认添加 playsinline 属性
    if (options.playsinline === undefined) {
        options.playsinline = true;
    }

    return { el: el, options: options, readyFn: readyFn };
}

// 包含所有兼容 es6 的代码
// @todo 有没有更好的解决方案，目前看 babel-plugin-transform-runtime 不会解决在原型上的方法
// @see https://www.zhihu.com/question/49382420/answer/115692473
/**
 * @file larkplayer.js larkplayer 入口函数
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

function larkplayer(el, options, readyFn) {
    var _normalize = normalize(el, options, readyFn);
    // () 避免 {} 在行首造成语法错误


    el = _normalize.el;
    options = _normalize.options;
    readyFn = _normalize.readyFn;


    var player = new _player2.default(el, options, readyFn);

    return player;
}

larkplayer.Html5 = _html2.default;

larkplayer.dom = Dom;

// events
larkplayer.on = Events.on;
larkplayer.one = Events.one;
larkplayer.off = Events.off;
larkplayer.trigger = Events.trigger;

larkplayer.log = _log2.default;

// plugin
larkplayer.registerPlugin = Plugin.registerPlugin;
larkplayer.deregisterPlugin = Plugin.deregisterPlugin;

// export default larkplayer;
// for babel es6
// @see https://github.com/babel/babel/issues/2724
module.exports = larkplayer;

},{"./html5":2,"./player":5,"./shim/third_party/shim.min.js":6,"./utils/dom":27,"./utils/events":28,"./utils/log":32,"./utils/plugin":37}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = evented;

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 使一个对象具有直接使用 on off one trigger 的能力
 *
 * @param {Object} target 要具有事件能力的对象
 * @param {Object} options 配置项
 * @param {string=} options.eventBusKey 一个 DOM 元素，事件绑定在该元素上
 */
/**
 * @file 给一个对象添加事件方面的 api
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

function evented(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (target.isEvented && target.eventBusEl === options.eventBusKey) {
        return;
    } else {
        target.isEvented = true;
    }

    // @todo normalize args
    var eventBusKey = options.eventBusKey;
    if (eventBusKey && eventBusKey.nodeType === 1) {
        target.eventBusEl = eventBusKey;
    } else {
        target.eventBusEl = Dom.createEl('div');
    }

    // if (target[eventBusKey] && target[eventBusKey]['nodeType'] === 1) {
    //     target.eventBusEl = target[eventBusKey];
    // } else {
    //     target.eventBusEl = Dom.createEl('div');
    // }

    target.on = function (type, fn) {
        Events.on(target.eventBusEl, type, fn);
    };

    target.off = function (type, fn) {
        Events.off(target.eventBusEl, type, fn);
    };

    target.one = function (type, fn) {
        Events.one(target.eventBusEl, type, fn);
    };

    target.trigger = function (type, data) {
        Events.trigger(target.eventBusEl, type, data);
    };
}

},{"../utils/dom":27,"../utils/events":28}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _html = require('./html5');

var _html2 = _interopRequireDefault(_html);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _guid = require('./utils/guid');

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('./utils/events');

var Events = _interopRequireWildcard(_events);

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _fullscreen = require('./utils/fullscreen');

var _fullscreen2 = _interopRequireDefault(_fullscreen);

var _evented = require('./mixins/evented');

var _evented2 = _interopRequireDefault(_evented);

var _obj = require('./utils/obj');

var _plugin = require('./utils/plugin');

var Plugin = _interopRequireWildcard(_plugin);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _computedStyle = require('./utils/computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

var _featureDetector = require('./utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

var _normalizeSource = require('./utils/normalize-source');

var _normalizeSource2 = _interopRequireDefault(_normalizeSource);

require('./ui/play-button');

require('./ui/control-bar');

require('./ui/loading');

require('./ui/progress-bar-simple');

require('./ui/error');

require('./ui/control-bar-pc');

require('./ui/loading-pc');

require('./ui/error-pc');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file Player.js. player initial && api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06(yuhui06@baidu.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @todo 对于 Player 构造函数的特殊照顾需要理一下，可能没必要
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// 确保以下代码都执行一次


var activeClass = 'lark-user-active';

var Player = function (_Component) {
    _inherits(Player, _Component);

    /**
     * 初始化一个播放器实例
     *
     * @constructor
     * @param {Element|string} tag video 标签的 DOM 元素或者 id
     * @param {Object=} options 配置项，可选
     * @param {number=} options.height 播放器高度
     * @param {number=} options.width 播放器宽度
     * @param {boolean=} options.loop 是否循环播放
     * @param {boolean=} options.muted 是否静音
     * @param {boolean=} options.playsinline 是否使用内联的形式播放（即非全屏的形式）。仅 ios10 以上有效，在 ios10 以下，视频播放时会自动进入全屏
     * @param {string=} options.poster 视频封面
     * @param {string=} options.preload 视频预先下载资源的设置，可选值有以下 3 种（当然就算你设置了以下 3 种，最终结果也不一定符合预期，毕竟浏览器嘛，你懂的）
     *                                  - auto 浏览器自己决定
     *                                  - metadata 仅下载 metadata（视频总时长、高宽等信息）
     *                                  - none 不要预下载
     * @param {string=} options.src 视频链接
     * @param {Array=} options.source 视频 source 标签。为 [{src: 'xxx', type: 'xxx'}] 的形式，type 可选
     * @param {Function=} ready 播放器初始化完成后执行的函数，可选
     */
    /* eslint-disable fecs-max-statements */
    function Player(tag, options, ready) {
        _classCallCheck(this, Player);

        tag.id = tag.id || 'larkplayer-' + (0, _guid.newGUID)();

        options.initChildren = false;
        options.createEl = false;
        options.reportTouchActivity = false;
        options.id = options.id || tag.id;

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, null, options, ready));

        _this.isReady = false;

        // @todo check valid options

        _this.tag = tag;

        _this.el = _this.createEl();

        // 使得 this 具有事件能力(on off one trigger)
        (0, _evented2.default)(_this, { eventBusKey: _this.el });

        // 需放在 this.loadTech 方法前面
        _this.handleLoadstart = _this.handleLoadstart.bind(_this);
        _this.handlePlay = _this.handlePlay.bind(_this);
        _this.handleWaiting = _this.handleWaiting.bind(_this);
        _this.handleCanplay = _this.handleCanplay.bind(_this);
        _this.handleCanplaythrough = _this.handleCanplaythrough.bind(_this);
        _this.handlePlaying = _this.handlePlaying.bind(_this);
        _this.handleSeeking = _this.handleSeeking.bind(_this);
        _this.handleSeeked = _this.handleSeeked.bind(_this);
        _this.handleFirstplay = _this.handleFirstplay.bind(_this);
        _this.handlePause = _this.handlePause.bind(_this);
        _this.handleEnded = _this.handleEnded.bind(_this);
        _this.handleDurationchange = _this.handleDurationchange.bind(_this);
        _this.handleTimeupdate = _this.handleTimeupdate.bind(_this);
        _this.handleTap = _this.handleTap.bind(_this);
        _this.handleTouchStart = _this.handleTouchStart.bind(_this);
        _this.handleTouchMove = _this.handleTouchMove.bind(_this);
        _this.handleTouchEnd = _this.handleTouchEnd.bind(_this);
        _this.handleFullscreenChange = _this.handleFullscreenChange.bind(_this);
        _this.handleFullscreenError = _this.handleFullscreenError.bind(_this);
        _this.handleError = _this.handleError.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);

        // 3000ms 后自动隐藏播放器控制条
        _this.activeTimeout = 3000;

        // @todo ios11 click 事件触发问题
        // this.on('click', this.handleClick);
        if (_featureDetector2.default.touch) {
            _this.on('touchstart', _this.handleTouchStart);
            _this.on('touchend', _this.handleTouchEnd);
        } else {
            _this.on('click', _this.handleClick);
            _this.on('mouseenter', _this.handleMouseEnter);
            _this.on('mousemove', _this.handleMouseMove);
            _this.on('mouseleave', _this.handleMouseLeave);
        }

        if (!_this.tech) {
            _this.tech = _this.loadTech();
        }

        _this.initChildren();

        _this.addClass('lark-paused');
        var src = _this.src();
        if (src) {
            // 如果视频已经存在，看下是不是错过了 loadstart 事件
            _this.handleLateInit(_this.tech.el);

            var source = (0, _normalizeSource2.default)({ src: src })[0];
            _this.mediaSourceHandler = _html2.default.selectMediaSourceHandler(source);
            if (_this.mediaSourceHandler) {
                var handlerOptions = _this.getMediaSourceHanlderOptions(_this.mediaSourceHandler.name);
                _this.mediaSourceHandler.handleSource(source, _this, handlerOptions);
            }
        }

        // plugins
        _this.plugins = {};
        var plugins = _this.options.plugins;
        if (plugins) {
            Object.keys(plugins).forEach(function (name) {
                var plugin = Plugin.getPlugin(name);
                if (typeof plugin === 'function') {
                    plugin.call(_this, plugins[name]);
                    _this.plugins[name] = plugin;
                } else {
                    throw new Error('Plugin ' + name + ' not exist');
                }
            });
        }

        // 如果当前视频已经出错，重新触发一次 error 事件
        if (_this.techGet('error')) {
            Events.trigger(_this.tech.el, 'error');
        }

        _this.triggerReady();
        return _this;
    }
    /* eslint-enable fecs-max-statements */

    _createClass(Player, [{
        key: 'getMediaSourceHanlderOptions',
        value: function getMediaSourceHanlderOptions() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            if (this.options && this.options.mediaSourceHandler && this.options.mediaSourceHandler[name]) {

                return this.options.mediaSourceHandler[name];
            } else {
                return {};
            }
        }

        /**
         * 销毁播放器
         *
         */

    }, {
        key: 'dispose',
        value: function dispose() {
            this.trigger('dispose');
            // 避免 dispose 被调用两次
            this.off('dispose');

            // if (this.styleEl_ && this.styleEl_.parentNode) {
            //     this.styleEl_.parentNode.removeChild(this.styleEl_);
            // }

            if (this.tag && this.tag.player) {
                this.tag.player = null;
            }

            if (this.el && this.el.player) {
                this.el.player = null;
            }

            if (this.tech) {
                this.tech.dispose();
            }

            _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'dispose', this).call(this);
        }

        /**
         * 创建播放器 DOM （将 video 标签包裹在一层 div 中，全屏及添加其他子元素时需要）
         *
         * @private
         * @return {Element} el 播放器 DOM
         */

    }, {
        key: 'createEl',
        value: function createEl() {
            var _this2 = this;

            var tag = this.tag;

            // 处理 options 中的 html5 标准属性
            var html5StandardOptions = ['autoplay',
            // 'controls',
            'height', 'loop', 'muted', 'poster', 'preload', 'auto', 'metadata', 'none', 'src', 'width', 'playsinline'];
            (0, _obj.each)(this.options, function (value, key) {
                if (html5StandardOptions.includes(key)) {
                    Dom.setAttribute(tag, key, value);
                }
            });

            if (this.options.source) {
                // 等到 this.tech 初始化完成后再添加
                this.ready(function () {
                    _this2.source(_this2.options.source);
                });
            }

            // 为 video 创建一个父元素，并将 video 的属性全部加在父元素上
            // 将子元素的 id 转移到父元素上
            var el = Dom.createEl('div', null, Dom.getAttributes(tag));

            // 为父元素添加 larkplayer class
            Dom.addClass(el, 'larkplayer');

            Dom.setAttribute(el, 'tabindex', '-1');
            Dom.setAttribute(tag, 'tabindex', '-1');

            // 子元素原来的 id 加上 -larkplayer 后缀
            if (tag.id) {
                tag.id += '-larkplayer';
            }

            // 将原生控制条移除
            // 目前只支持使用自定义的控制条
            tag.removeAttribute('controls');

            // 将 el 插入到 DOM 中
            if (tag.parentNode) {
                tag.parentNode.insertBefore(el, tag);
            }

            // 父元素的 width height 样式继承子元素的值
            // 将 video 标签的 width height 属性移除，确保 width height 为 100%
            if (tag.hasAttribute('width')) {
                var tagWidth = tag.getAttribute('width');
                el.style.width = tagWidth + 'px';
                tag.removeAttribute('width');
            }

            if (tag.hasAttribute('height')) {
                var tagHeight = tag.getAttribute('height');
                el.style.height = tagHeight + 'px';
                tag.removeAttribute('height');
            }

            // @todo safari 好像不支持移动 video DOM?
            // 将 video 插入到 el 中
            el.appendChild(tag);

            return el;
        }

        /**
         * 当 video 标签已经初始化完成后再调用 larkplayer，可能错过一些事件，这里手动触发下
         *
         * @private
         * @param {Element} el video DOM 标签
         */

    }, {
        key: 'handleLateInit',
        value: function handleLateInit(el) {
            var _this3 = this;

            // readyState
            // 0 - HAVE_NOTHING
            // 没有任何资源可供播放，如果 networkState 的状态是 NETWORK_EMPTY 那么 readyState 的状态一定是 HAVE_NOTHING
            // 1 - HAVE_METADATA
            // 视频时长、尺寸已经获取到。这时候还没有可播放的数据，但是跳转到指定时长时播放器不会抛出错误
            // 2 - HAVE_CURRENT_DATA
            // 当前帧的播放没有问题，但是不保证后续可以顺畅播放
            // HAVE_CURRENT_DATA 与 HAVE_METADATA 的区别可以忽略不计
            // 3 - HAVE_FUTURE_DATA
            // 当前帧可以播放，后面的一点也可以播放
            // 一定不是处于最后一帧
            // 4 - HAVE_ENOUGH_DATA
            // 已经全部缓冲完或者照目前的速度播放下去不会有问题

            if (el.networkState === 0 || el.networkState === 3) {
                return;
            }

            // 在 readyState === 0 的时候，loadstart 事件也有可能已经触发了
            // NetworkState is set synchronously BUT loadstart is fired at the
            // end of the current stack, usually before setInterval(fn, 0).
            // So at this point we know loadstart may have already fired or is
            // about to fire, and either way the player hasn't seen it yet.
            // We don't want to fire loadstart prematurely here and cause a
            // double loadstart so we'll wait and see if it happens between now
            // and the next loop, and fire it if not.
            // HOWEVER, we also want to make sure it fires before loadedmetadata
            // which could also happen between now and the next loop, so we'll
            // watch for that also.
            if (el.readyState === 0) {
                var loadstartFired = false;
                var setLoadstartFired = function setLoadstartFired() {
                    loadstartFired = true;
                };

                this.on('loadstart', setLoadstartFired);

                var triggerLoadstart = function triggerLoadstart() {
                    if (!loadstartFired) {
                        this.trigger('loadstart');
                    }
                };

                // 确保在执行 loadedmetadata 之前，执行了 loadstart 事件
                this.on('loadedmetadata', triggerLoadstart);

                // 我们的目标是，错过了 loadstart 的话，在 ready 后再手动 trigger 一次
                this.ready(function () {
                    _this3.off('loadstart', setLoadstartFired);
                    _this3.off('loadedmetadata', triggerLoadstart);

                    if (!loadstartFired) {
                        _this3.trigger('loadstart');
                    }
                });

                return;
            }

            var eventsToTrigger = ['loadstart', 'loadedmetadata'];

            if (el.readyState >= 2) {
                eventsToTrigger.push('loadeddata');
            }

            if (el.readyState >= 3) {
                eventsToTrigger.push('canplay');
            }

            if (el.readyState >= 4) {
                eventsToTrigger.push('canplaythrough');
            }

            this.ready(function () {
                eventsToTrigger.forEach(function (event) {
                    _this3.trigger(event);
                });
            });
        }

        /**
         * 创建一个 Html5 实例
         *
         * @return {Object} tech Html5 实例
         *
         * @private
         */

    }, {
        key: 'loadTech',
        value: function loadTech() {
            var _this4 = this;

            this.options.el = this.tag;
            var tech = new _html2.default(this.player, this.options);

            // 注册 video 的各个事件
            [
            // 'loadstart',

            /**
             * 浏览器停止获取数据时触发
             *
             * @event Player#suspend
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'suspend',

            /**
             * 浏览器在视频下载完成前停止下载时触发。但并不是因为出错，出错时触发 error 事件而不是 abort。
             * 往往是人为的停止下载，比如删除 src
             *
             * @event Player#abort
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'abort',
            // 'error',

            /**
             * 视频被清空时触发
             *
             * @event Player#emptied
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'emptied',

            /**
             * 浏览器获取数据时，数据并没有正常返回时触发
             *
             * @event Player#stalled
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'stalled',

            /**
             * 播放器成功获取到视频总时长、高宽、字幕等信息时触发
             *
             * @event Player#loadedmetadata
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'loadedmetadata',

            /**
             * 播放器第一次能够渲染当前帧时触发
             *
             * @event Player#loadeddata
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'loadeddata',
            // 'canplay',
            // 'canplaythrough',
            // 'playing',
            // 'waiting',
            // 'seeking',
            // 'seeked',
            // 'ended',
            // 'durationchange',
            // 'timeupdate',

            /**
             * 浏览器获取数据的过程中触发
             *
             * @event Player#progress
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'progress',
            // 'play',
            // 'pause',

            /**
             * 视频播放速率改变时触发
             *
             * @event Player#ratechange
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'ratechange',

            /**
             * 视频本身的高宽发生改变时触发，注意不是播放器的高度（比如调整播放器的高宽和全屏不会触发 resize 事件）
             *
             * 这里还不是太清楚，有需要的话看看 w3c 文档吧
             *
             * @see https://html.spec.whatwg.org/#dom-video-videowidth
             * @event Player#resize
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'resize',

            /**
             * 视频声音大小改变时触发
             *
             * @event Player#volumechange
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            'volumechange'].forEach(function (event) {
                // 对于我们不做任何处理的事件，直接 trigger 出去，提供给用户就行了
                Events.on(tech.el, event, function () {
                    _this4.trigger(event);
                });
            });

            // 如果我们要先对事件做处理，那先走我们自己的 handlexxx 函数
            ['loadstart', 'canplay', 'canplaythrough', 'error', 'playing', 'timeupdate', 'waiting', 'seeking', 'seeked', 'ended', 'durationchange', 'play', 'pause'].forEach(function (event) {
                Events.on(tech.el, event, _this4['handle' + (0, _toTitleCase2.default)(event)]);
            });

            // 绑定 firstPlay 事件
            // 先 off 确保只绑定一次
            this.off('play', this.handleFirstplay);
            this.one('play', this.handleFirstplay);

            // 全屏事件
            Events.on(tech.el, 'fullscreenchange', this.handleFullscreenChange);
            _fullscreen2.default.fullscreenchange(this.handleFullscreenChange);
            _fullscreen2.default.fullscreenerror(this.handleFullscreenError);

            return tech;
        }

        /**
         * 从 Html5 实例上执行对应的 get 函数
         *
         * @private
         * @param {string} method 要执行的函数名
         * @return {Mixed} 对应函数的返回值
         */

    }, {
        key: 'techGet',
        value: function techGet(method) {
            return this.tech[method]();
        }

        /**
         * 从 Html5 实例上执行对应的 set 函数
         *
         * @private
         * @param {string} method 要执行的函数名
         * @param {Mixed} val 对应函数需要的参数
         */

    }, {
        key: 'techCall',
        value: function techCall(method, val) {
            try {
                this.tech[method](val);
            } catch (ex) {
                (0, _log2.default)(ex);
            }
        }

        /**
         * 获取或设置播放器的宽度
         *
         * @param {number=} value 要设置的播放器宽度值，可选
         * @return {number} 不传参数则返回播放器当前宽度
         */

    }, {
        key: 'width',
        value: function width(value) {
            if (value !== undefined) {
                if (/\d$/.test(value)) {
                    value = value + 'px';
                }

                this.el.style.width = value;
            } else {
                return (0, _computedStyle2.default)(this.el, 'width');
            }
        }

        /**
         * 获取或设置播放器的高度
         *
         * @param {number=} value 要设置的播放器高度值，可选
         * @return {number} 不传参数则返回播放器当前高度
         */

    }, {
        key: 'height',
        value: function height(value) {
            if (value !== undefined) {
                if (/\d$/.test(value)) {
                    value = value + 'px';
                }

                this.el.style.height = value;
            } else {
                return (0, _computedStyle2.default)(this.el, 'height');
            }
        }

        /**
         * 获取或设置播放器的高宽
         *
         * @private
         * @param {string} dimension 属性名：width/height
         * @param {number} value 要设置的值
         * @return {number} 对应属性的值
         */

    }, {
        key: 'dimension',
        value: function dimension(_dimension, value) {
            var privateDimension = _dimension + '_';

            if (value === undefined) {
                return this[privateDimension] || 0;
            }

            if (value === '') {
                this[privateDimension] = undefined;
            } else {
                var parsedVal = parseFloat(value);
                if (isNaN(parsedVal)) {
                    (0, _log2.default)('Improper value ' + value + ' supplied for ' + _dimension);
                    return;
                }

                this[privateDimension] = parsedVal;
            }

            // this.updateStyleEl_();
        }

        // @dprecated
        // videojs 中的方法，目前没用到

    }, {
        key: 'hasStart',
        value: function hasStart(hasStarted) {
            if (hasStarted !== undefined) {
                if (this.hasStarted !== hasStarted) {
                    this.hasStarted = hasStarted;
                    if (hasStarted) {
                        this.addClass('lark-has-started');
                        this.trigger('firstplay');
                    } else {
                        this.removeClass('lark-has-started');
                    }
                }
                return;
            }

            return !!this.hasStarted;
        }

        // = = = = = = = = = = = = = 事件处理 = = = = = = = = = = = = = =

        /**
         * 处理 loadstart 事件
         *
         * @private
         * @fires Player#loadstart
         * @listens Html5#loadstart
         * @see https://html.spec.whatwg.org/#mediaevents
         */

    }, {
        key: 'handleLoadstart',
        value: function handleLoadstart() {
            this.addClass('lark-loadstart');

            /**
             * loadstart 时触发
             *
             * @event Player#loadstart
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('loadstart');
        }

        /**
         * 处理 play 事件
         *
         * @private
         * @fires Player#play
         * @see https://html.spec.whatwg.org/#mediaevents
         */

    }, {
        key: 'handlePlay',
        value: function handlePlay() {
            var _this5 = this;

            // @todo removeClass 支持一次 remove 多个 class
            this.removeClass('lark-loadstart');
            this.removeClass('lark-ended');
            this.removeClass('lark-paused');
            this.removeClass('lark-error');
            this.removeClass('lark-seeking');
            this.removeClass('lark-waiting');
            this.addClass('lark-playing');

            clearTimeout(this.activeTimeoutHandler);
            this.addClass(activeClass);
            this.activeTimeoutHandler = setTimeout(function () {
                _this5.removeClass(activeClass);
            }, this.activeTimeout);

            /**
             * 视频播放时触发，无论是第一次播放还是暂停、卡顿后恢复播放
             *
             * @event Player#play
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('play');
        }

        /**
         * 处理 waiting 事件
         *
         * @private
         * @fires Player#waiting
         * @see https://html.spec.whatwg.org/#mediaevents
         */

    }, {
        key: 'handleWaiting',
        value: function handleWaiting() {
            this.addClass('lark-waiting');

            /**
             * 视频播放因为下一帧没准备好而暂时停止，但是客户端正在努力缓冲中时触发
             * 简单来讲，在视频卡顿或视频跳转到指定位置时触发，在暂停、视频播放完成、视频播放出错时不会触发
             *
             * @event Player#waiting
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('waiting');
            // 处于 waiting 状态后一般都会伴随一次 timeupdate，即使那之后视频还是处于卡顿状态
            // this.one('timeupdate', () => this.removeClass('lark-waiting'));
        }

        /**
         * 处理 canplay 事件
         *
         * @private
         * @fires Player#canplay
         */

    }, {
        key: 'handleCanplay',
        value: function handleCanplay() {
            this.removeClass('lark-waiting');
            this.removeClass('lark-loadstart');

            if (this.paused()) {
                this.removeClass('lark-playing');
                this.addClass('lark-paused');
            }

            /**
             * 视频能开始播发时触发，并不保证能流畅的播完
             *
             * @event Player#canplay
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('canplay');
        }

        /**
         * 处理 canplaythrough 事件
         *
         * @private
         * @fires Player#canplaythrough
         */

    }, {
        key: 'handleCanplaythrough',
        value: function handleCanplaythrough() {
            this.removeClass('lark-waiting');

            /**
             * 如果从当前开始播放，视频估计能流畅的播完时触发此事件
             *
             * @event Player#canplaythrough
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('canplaythrough');
        }

        /**
         * 处理 playing 事件
         *
         * @private
         * @fires Player#playing
         */

    }, {
        key: 'handlePlaying',
        value: function handlePlaying() {
            this.removeClass('lark-waiting');
            this.removeClass('lark-loadstart');

            /**
             * Playback is ready to start after having been paused or delayed due to lack of media data.
             *
             * @event Player#playing
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             * @see https://html.spec.whatwg.org/#mediaevents
             */
            this.trigger('playing');
        }

        /**
         * 处理 seeking 事件
         *
         * @private
         * @fires Player#seeking
         */

    }, {
        key: 'handleSeeking',
        value: function handleSeeking() {
            this.addClass('lark-seeking');

            /**
             * 视频跳转到指定时刻时触发
             *
             * @event Player#seeking
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('seeking');
        }

        /**
         * 处理 seeked 事件
         *
         * @private
         * @fires Player#seeked
         */

    }, {
        key: 'handleSeeked',
        value: function handleSeeked() {
            this.removeClass('lark-seeking');

            /**
             * 视频跳转到某一时刻完成后触发
             *
             * @event Player#seeked
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('seeked');
        }

        /**
         * 处理自定义的 firstplay 事件
         * 该事件与 play 事件的不同之处在于 firstplay 只会在第一次播放时触发一次
         *
         * @private
         * @fires Player#firstplay
         */

    }, {
        key: 'handleFirstplay',
        value: function handleFirstplay() {
            var _this6 = this;

            // @todo 不清楚有什么用
            this.addClass('lark-has-started');

            clearTimeout(this.activeTimeoutHandler);
            this.addClass(activeClass);
            this.activeTimeoutHandler = setTimeout(function () {
                _this6.removeClass(activeClass);
            }, this.activeTimeout);

            /**
             * 在视频第一次播放时触发，只会触发一次
             *
             * @event Player#firstplay
             */
            this.trigger('firstplay');
        }

        /**
         * 处理 pause 事件
         *
         * @private
         * @fires Player#pause
         */

    }, {
        key: 'handlePause',
        value: function handlePause() {
            this.removeClass('lark-playing');
            this.addClass('lark-paused');

            /**
             * 视频暂停时触发
             *
             * @event Player#pause
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('pause');
        }

        /**
         * 处理 ended 事件
         *
         * @private
         * @fires Player#ended
         */

    }, {
        key: 'handleEnded',
        value: function handleEnded() {
            this.addClass('lark-ended');

            // 如果播放器自动循环了，在 chrome 上不会触发 ended 事件
            // @todo 待验证其他浏览器
            if (this.options.loop) {
                this.currentTime(0);
                this.play();
            } else if (!this.paused()) {
                this.pause();
            }

            /**
             * 视频播放完成时触发，如果设置了 loop 属性为 true，播放完成后可能不触发此事件
             *
             * @event Player#ended
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('ended');
        }

        /**
         * 处理 durationchange 事件
         *
         * @private
         * @fires Player#durationchange
         */

    }, {
        key: 'handleDurationchange',
        value: function handleDurationchange() {
            var data = {
                duration: this.techGet('duration')
            };

            /**
             * 视频时长发生改变时触发
             *
             * @event Player#durationchange
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             */
            this.trigger('durationchange', data);
        }

        /**
         * 处理 timeupdate 事件
         *
         * @private
         * @fires Player#timeupdate
         */

    }, {
        key: 'handleTimeupdate',
        value: function handleTimeupdate() {
            var data = {
                currentTime: this.techGet('currentTime')
            };
            // data.currentTime = this.techGet('currentTime');

            /**
             * 视频当前时刻更新时触发，一般 1s 内会触发好几次
             *
             * @event Player#timeupdate
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             * @param {Object} data 友情附带的数据
             * @param {number} data.currentTime 当前时刻
             */
            this.trigger('timeupdate', data);
        }
    }, {
        key: 'handleTap',
        value: function handleTap() {}

        /**
         * 处理 touchstart 事件，主要用于控制控制条的显隐
         *
         * @param {Object} event 事件发生时，浏览器给的 event
         *
         * @private
         */

    }, {
        key: 'handleTouchStart',
        value: function handleTouchStart(event) {
            // 当控制条显示并且手指放在控制条上时
            if (this.hasClass(activeClass)) {
                if (Dom.parent(event.target, 'lark-play-button') || Dom.parent(event.target, 'lark-control-bar')) {

                    clearTimeout(this.activeTimeoutHandler);
                }
            }
        }

        /**
         * 处理 touchmove 事件
         *
         * @param {Object} event 事件发生时，浏览器给的 event
         *
         * @private
         */

    }, {
        key: 'handleTouchMove',
        value: function handleTouchMove(event) {}

        /**
         * 处理 touchend 事件，主要用于控制控制条的显隐
         *
         * @param {Object} event 事件发生时，浏览器给的 event
         *
         * @private
         */

    }, {
        key: 'handleTouchEnd',
        value: function handleTouchEnd(event) {
            var _this7 = this;

            clearTimeout(this.activeTimeoutHandler);

            var activeClass = 'lark-user-active';

            // 点在播放按钮或者控制条上，（继续）展现控制条
            var clickOnControls = false;
            // @todo 处理得不够优雅
            if (Dom.parent(event.target, 'lark-play-button') || Dom.parent(event.target, 'lark-control-bar')) {

                clickOnControls = true;
            }

            if (!clickOnControls) {
                this.toggleClass(activeClass);

                if (this.paused()) {
                    this.play();
                }
            }

            if (this.hasClass(activeClass)) {
                this.activeTimeoutHandler = setTimeout(function () {
                    _this7.removeClass(activeClass);
                }, this.activeTimeout);
            }
        }

        /**
         * 处理 fullscreenchange 事件
         *
         * @private
         * @fires Player#fullscreenchange
         */
        // Html5 中会处理一次这个事件，会传入 extData

    }, {
        key: 'handleFullscreenChange',
        value: function handleFullscreenChange(event) {
            var extData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var data = {};

            // 移动端的全屏事件会传 extData
            if (extData.isFullscreen !== undefined) {
                this.isFullscreen(extData.isFullscreen);
            } else if (_fullscreen2.default.fullscreenEnabled()) {
                // pc 端 fullscreen 事件
                this.isFullscreen(_fullscreen2.default.isFullscreen());
            }

            if (this.isFullscreen()) {
                data.isFullscreen = true;
                this.addClass('lark-fullscreen');
            } else {
                data.isFullscreen = false;
                this.removeClass('lark-fullscreen');
                // lark-fullscreen-adjust 本应该在 exitFullscreen 函数中调用，但用户可能按 ESC 返回，不会走到 exitFullscreen 函数
                this.removeClass('lark-fullscreen-adjust');
            }

            /**
             * 在进入／退出全屏时触发
             *
             * @event Player#fullscreenchange
             * @param {Object} data 全屏相关的数据
             * @param {boolean} data.isFullscreen 当前是否是全屏状态
             */
            this.trigger('fullscreenchange', data);
        }

        /**
         * 处理 fullscreenerror 事件
         *
         * @fires Player#fullscreenerror
         * @private
         */

    }, {
        key: 'handleFullscreenError',
        value: function handleFullscreenError() {
            /**
             * 在全屏时出错时触发
             *
             * @event Player#fullscreenerror
             */
            this.trigger('fullscreenerror');
        }

        /**
         * 处理 error 事件
         *
         * @param {Object} event 事件发生时，浏览器给的 event
         *
         * @fires Player#error
         * @private
         */

    }, {
        key: 'handleError',
        value: function handleError(event) {
            this.removeClass('lark-playing');
            // this.removeClass('lark-seeking');
            this.addClass('lark-error');

            /**
             * 视频播放出错时触发
             *
             * @event Player#error
             * @param {Object} event 事件触发时浏览器自带的 event 对象
             * @param {MediaError} error MediaError 对象
             * @param {number} error.code 错误编号
             *                         - 1 MEDIA_ERR_ABORTED 视频加载被浏览器（用户）中断
             *                         - 2 MEDIA_ERR_NETWORK 浏览器与视频资源已经建立连接，但是由于网络问题停止下载
             *                         - 3 MEDIA_ERR_DECODE 视频解码失败
             *                         - 4 MEDIA_ERR_SRC_NOT_SUPPORTED 视频资源问题，比如视频不存在
             * @param {string} error.message 错误信息
             */
            this.trigger('error', this.techGet('error'));
        }

        /**
         * 处理播放器 click 事件，主要用于控制控制条显隐
         *
         * pc 上用 click 事件，移动端用 touchend
         *
         * @todo 开发 tap 事件来代替 click
         * @private
         *
         * @param {Object} event 事件发生时，浏览器给的 event
         */

    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            // clearTimeout(this.activeTimeoutHandler);

            // 点在播放按钮或者控制条上，（继续）展现控制条
            var clickOnControls = false;
            // @todo 处理得不够优雅
            if (Dom.parent(event.target, 'lark-control-bar-pc') || Dom.hasClass(event.target, 'lark-control-bar-pc')) {

                clickOnControls = true;
            }

            if (!clickOnControls) {
                // 处于暂停状态时，点击非控制条的位置继续播放
                // 切换暂停／播放状态
                var isPaused = this.paused();
                if (isPaused) {
                    this.play();
                } else {
                    this.pause();
                }
            }
        }
    }, {
        key: 'handleMouseEnter',
        value: function handleMouseEnter(event) {
            var _this8 = this;

            clearTimeout(this.activeTimeoutHandler);

            if (!this.hasClass(activeClass)) {
                this.addClass(activeClass);
            }

            this.activeTimeoutHandler = setTimeout(function () {
                _this8.removeClass(activeClass);
            }, this.activeTimeout);
        }
    }, {
        key: 'handleMouseMove',
        value: function handleMouseMove(event) {
            this.handleMouseEnter(event);
        }
    }, {
        key: 'handleMouseLeave',
        value: function handleMouseLeave(event) {
            clearTimeout(this.activeTimeoutHandler);
            this.removeClass(activeClass);
        }

        // = = = = = = = = = = = = = 对外 api = = = = = = = = = = = = = =

        // = = = func = = =

        /**
         * 获取／设置当前全屏状态标志
         *
         * @param {boolean=} isFs 全屏状态标志
         * @return {boolean} 不传参则返回当前全屏状态
         */

    }, {
        key: 'isFullscreen',
        value: function isFullscreen(isFs) {
            if (isFs !== undefined) {
                this.fullscreenStatus = isFs;
            } else {
                return this.fullscreenStatus;
            }
        }

        /**
         * 进入全屏
         * 会先尝试浏览器提供的全屏方法，如果没有对应方法，则进入由 css 控制的全屏样式
         */

    }, {
        key: 'requestFullscreen',
        value: function requestFullscreen() {
            this.isFullscreen(true);

            if (_fullscreen2.default.fullscreenEnabled()) {
                // 利用 css 强制设置 top right bottom left margin 的值为 0
                // 避免因为定位使得元素全屏时看不到
                // 应该不会出现什么问题
                this.addClass('lark-fullscreen-adjust');
                _fullscreen2.default.requestFullscreen(this.el);
            } else if (this.tech.supportsFullScreen()) {
                this.techGet('enterFullScreen');
            } else {
                this.enterFullWindow();
                this.trigger('fullscreenchange');
            }
        }

        /**
         * 退出全屏
         */

    }, {
        key: 'exitFullscreen',
        value: function exitFullscreen() {
            this.isFullscreen(false);

            if (_fullscreen2.default.fullscreenEnabled() && _fullscreen2.default.isFullscreen()) {
                this.removeClass('lark-fullscreen-adjust');
                _fullscreen2.default.exitFullscreen();
            } else if (this.tech.supportsFullScreen()) {
                this.techGet('exitFullScreen');
            } else {
                this.exitFullWindow();
                this.trigger('fullscreenchange');
            }
        }

        /**
         * 通过 css 控制，使得视频像是进入了全屏一样
         *
         * @private
         */

    }, {
        key: 'enterFullWindow',
        value: function enterFullWindow() {
            this.addClass('lark-full-window');
        }
    }, {
        key: 'fullWindowOnEscKey',
        value: function fullWindowOnEscKey() {}

        /**
         * 去除由 css 控制展现的全屏样式
         *
         * @private
         */

    }, {
        key: 'exitFullWindow',
        value: function exitFullWindow() {
            this.removeClass('lark-full-window');
        }

        /**
         * 播放视频
         */

    }, {
        key: 'play',
        value: function play() {
            var _this9 = this;

            if (!this.src()) {
                _log2.default.warn('No video src applied');
                return;
            }

            // changingSrc 现在用不上，后面支持 source 的时候可能会用上
            // if (this.isReady && this.src()) {
            if (this.isReady) {
                // play 可能返回一个 Promise
                var playReturn = this.techGet('play');
                if (playReturn && playReturn.then) {
                    playReturn.then(null, function (err) {
                        // @todo 这里返回的 err 可以利用下？
                        _log2.default.error(err);
                    });
                }
            } else {
                this.ready(function () {
                    var playReturn = _this9.techGet('play');
                    if (playReturn && playReturn.then) {
                        playReturn.then(null, function (err) {
                            // @todo 这里返回的 err 可以利用下？
                            _log2.default.error(err);
                        });
                    }
                });
            }
        }

        /**
         * 暂停播放
         */

    }, {
        key: 'pause',
        value: function pause() {
            this.techCall('pause');
        }

        /**
         * 加载当前视频的资源
         */

    }, {
        key: 'load',
        value: function load() {
            this.techCall('load');
        }

        // reset video and ui
        // @todo 感觉这个 reset 有点费事而且费性能
        /**
         * 重置播放器
         * 会移除播放器的 src source 属性，并重置各 UI 样式
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.pause();

            // reset video tag
            this.techCall('reset');

            // reset ui
            this.children.forEach(function (child) {
                child && child.reset && child.reset();
            });
        }

        // = = = get attr = = =

        /**
         * 判断当前是否是暂停状态
         *
         * @return {boolean} 当前是否是暂停状态
         */

    }, {
        key: 'paused',
        value: function paused() {
            return this.techGet('paused');
        }

        /**
         * 获取已播放时长
         *
         * @return {number} 当前已经播放的时长，以秒为单位
         */

    }, {
        key: 'played',
        value: function played() {
            return this.techGet('played');
        }
    }, {
        key: 'scrubbing',
        value: function scrubbing(isScrubbing) {}

        /**
         * 获取／设置当前时间
         *
         * @param {number=} seconds 以秒为单位，要设置的当前时间的值。可选
         * @return {number} 不传参数则返回视频当前时刻
         */

    }, {
        key: 'currentTime',
        value: function currentTime(seconds) {
            if (seconds !== undefined) {
                this.techCall('setCurrentTime', seconds);
            } else {
                return this.techGet('currentTime') || 0;
            }
        }

        /**
         * 获取当前视频总时长
         *
         * @return {number} 视频总时长，如果视频未初始化完成，可能返回 NaN
         */

    }, {
        key: 'duration',
        value: function duration() {
            return this.techGet('duration');
        }

        /**
         * 获取视频剩下的时长
         *
         * @return {number} 总时长 - 已播放时长 = 剩下的时长
         */

    }, {
        key: 'remainingTime',
        value: function remainingTime() {
            return this.duration() - this.currentTime();
        }

        /**
         * 获取当前已缓冲的范围
         *
         * @return {TimeRanges} 当前已缓冲的范围（buffer 有自己的 TimeRanges 对象）
         */

    }, {
        key: 'buffered',
        value: function buffered() {
            return this.techGet('buffered');
        }
    }, {
        key: 'bufferedPercent',
        value: function bufferedPercent() {}

        /**
         * 判断当前视频是否已缓冲到最后
         *
         * @return {boolean} 当前视频是否已缓冲到最后
         */

    }, {
        key: 'bufferedEnd',
        value: function bufferedEnd() {
            var buffered = this.buffered();
            var duration = this.duration();
            if (buffered && duration) {
                return buffered.end(buffered.length - 1) === duration;
            } else {
                return false;
            }
        }

        /**
         * 判断当前视频是否处于 seeking（跳转中） 状态
         *
         * @return {boolean} 是否处于跳转中状态
         */

    }, {
        key: 'seeking',
        value: function seeking() {
            return this.techGet('seeking');
        }

        /**
         * 判断当前视频是否可跳转到指定时刻
         *
         * @return {boolean} 前视频是否可跳转到指定时刻
         */

    }, {
        key: 'seekable',
        value: function seekable() {
            return this.techGet('seekable');
        }

        /**
         * 判断当前视频是否已播放完成
         *
         * @return {boolean} 当前视频是否已播放完成
         */

    }, {
        key: 'ended',
        value: function ended() {
            return this.techGet('ended');
        }

        /**
         * 获取当前视频的 networkState 状态
         *
         * @return {number} 当前视频的 networkState 状态
         * @todo 补充 networkState 各状态说明
         */

    }, {
        key: 'networkState',
        value: function networkState() {
            return this.techGet('networkState');
        }

        /**
         * 获取当前播放的视频的原始宽度
         *
         * @return {number} 当前视频的原始宽度
         */

    }, {
        key: 'videoWidth',
        value: function videoWidth() {
            return this.techGet('videoWidth');
        }

        /**
         * 获取当前播放的视频的原始高度
         *
         * @return {number} 当前视频的原始高度
         */

    }, {
        key: 'videoHeight',
        value: function videoHeight() {
            return this.techGet('videoHeight');
        }

        // = = = set && get attr= = =

        /**
         * 获取或设置播放器声音大小
         *
         * @param {number=} decimal 要设置的声音大小的值（0~1），可选
         * @return {number} 不传参数则返回当前视频声音大小
         */

    }, {
        key: 'volume',
        value: function volume(decimal) {
            if (decimal !== undefined) {
                this.techCall('setVolume', Math.min(1, Math.max(decimal, 0)));
            } else {
                return this.techGet('volume');
            }
        }

        /**
         * 获取或设置当前视频的 src 属性的值
         *
         * @param {string=} src 要设置的 src 属性的值，可选
         * @return {string} 不传参数则返回当前视频的 src 或 currentSrc
         */

    }, {
        key: 'src',
        value: function src(_src) {
            if (_src !== undefined) {
                if (this.mediaSourceHandler) {
                    this.mediaSourceHandler.dispose();
                    this.mediaSourceHandler = null;
                }

                var source = (0, _normalizeSource2.default)({ src: _src })[0];
                this.mediaSourceHandler = _html2.default.selectMediaSourceHandler(source);
                if (this.mediaSourceHandler) {
                    var handlerOptions = this.getMediaSourceHanlderOptions(this.mediaSourceHandler.name);
                    this.mediaSourceHandler.handleSource(source, this, handlerOptions);
                } else {
                    // 应该先暂停一下比较好
                    // this.techCall('pause');
                    this.techCall('setSrc', _src);
                }

                // src 改变后，重新绑定一次 firstplay 方法
                // 先 off 确保只绑定一次
                this.off('play', this.handleFirstplay);
                this.one('play', this.handleFirstplay);

                /**
                 * srcchange 时触发
                 *
                 * @event Player#srcchange
                 * @param {string} src 更换后的视频地址
                 */
                this.trigger('srcchange', _src);
            } else {
                return this.techGet('src');
            }
        }

        /**
         * 获取或设置播放器的 source
         *
         * @param {Array=} source 视频源，可选
         * @return {Array} 若不传参则获取 source 数据
         */

    }, {
        key: 'source',
        value: function source(_source) {
            if (_source !== undefined) {
                this.techCall('source', _source);

                /**
                 * srcchange 时触发
                 *
                 * @event Player#srcchange
                 * @param {string} src 更换后的视频地址
                 */
                this.trigger('srcchange', this.player.src());
            } else {
                return this.techGet('source');
            }
        }

        /**
         * 获取或设置当前视频的播放速率
         *
         * @param {number=} playbackRate 要设置的播放速率的值，可选
         * @return {number} 不传参数则返回当前视频的播放速率
         */

    }, {
        key: 'playbackRate',
        value: function playbackRate(_playbackRate) {
            if (_playbackRate !== undefined) {
                this.techCall('setPlaybackRate', _playbackRate);
            } else if (this.tech && this.tech.featuresPlaybackRate) {
                return this.techGet('playbackRate');
            } else {
                return 1.0;
            }
        }

        /**
         * 获取或设置当前视频的默认播放速率
         *
         * @param {number=} defaultPlaybackRate 要设置的默认播放速率的值，可选
         * @return {number} 不传参数则返回当前视频的默认播放速率
         */

    }, {
        key: 'defaultPlaybackRate',
        value: function defaultPlaybackRate(_defaultPlaybackRate) {
            if (_defaultPlaybackRate !== undefined) {
                this.techCall('setDefaultPlaybackRate', _defaultPlaybackRate);
            } else if (this.tech && this.tech.featuresPlaybackRate) {
                return this.techGet('defaultPlaybackRate');
            } else {
                return 1.0;
            }
        }

        /**
         * 设置或获取 poster（视频封面） 属性的值
         *
         * @param {string=} val 可选。要设置的 poster 属性的值
         * @return {string} 不传参数则返回当前 poster 属性的值
         */

    }, {
        key: 'poster',
        value: function poster(val) {
            if (val !== undefined) {
                this.techCall('setPoster', val);
            } else {
                return this.techGet('poster');
            }
        }
    }]);

    return Player;
}(_component2.default);

[
/**
 * 设置或获取 muted 属性的值
 *
 * @param {boolean=} isMuted（静音） 可选。设置 muted 属性的值
 * @return {undefined|boolean} undefined 或 当前 muted 属性值
 */
'muted',

/**
 * 设置或获取 defaultMuted（默认静音） 属性的值
 *
 * @param {boolean=} isDefaultMuted 可选。设置 defaultMuted 属性的值
 * @return {undefined|boolean} undefined 或 当前 defaultMuted 的值
 */
'defaultMuted',

/**
 * 设置或获取 autoplay（自动播放，大多数移动端浏览器不允许视频自动播放） 属性的值
 *
 * @param {boolean=} isAutoplay 可选。设置 autoplay 属性的值
 * @return {undefined|boolean} undefined 或 当前 autoplay 值
 */
'autoplay',

/**
 * 设置或获取 loop（循环播放） 属性的值
 *
 * @param {boolean=} isLoop 可选。设置 loop 属性的值
 * @return {undefined|boolean} undefined 或 当前 loop 值
 */
'loop',
/**
 * 设置或获取 playsinline（是否内联播放，ios10 以上有效） 属性的值
 *
 * @param {boolean=} isPlaysinline 可选。设置 playsinline 属性的值
 * @return {undefined|boolean} undefined 或 当前 playsinline 值
 */
'playsinline',

/**
 * 设置或获取 poster（视频封面） 属性的值
 *
 * @param {string=} poster 可选。设置 poster 属性的值
 * @return {undefined|string} undefined 或 当前 poster 值
 */
// 'poster',

/**
 * 设置或获取 preload（预加载的数据） 属性的值
 *
 * @param {string=} preload 可选。设置 preload 属性的值（none、auto、metadata）
 * @return {undefined|string} undefined 或 当前 preload 值
 */
'preload'].forEach(function (prop) {
    // 这里别用箭头函数，不然 this 就指不到 Player.prototype 了
    Player.prototype[prop] = function (val) {
        if (val !== undefined) {
            this.techCall('set' + (0, _toTitleCase2.default)(prop), val);
            this.options[prop] = val;
        } else {
            return this.techGet(prop);
        }
    };
});

if (_featureDetector2.default.touch) {
    Player.prototype.options = {
        children: ['playButton', 'progressBarSimple', 'controlBar', 'loading', 'error']
    };
} else {
    Player.prototype.options = {
        children: ['controlBarPc', 'loadingPc', 'errorPc']
    };
}

exports.default = Player;

},{"./component":1,"./html5":2,"./mixins/evented":4,"./ui/control-bar":9,"./ui/control-bar-pc":8,"./ui/error":13,"./ui/error-pc":12,"./ui/loading":17,"./ui/loading-pc":16,"./ui/play-button":18,"./ui/progress-bar-simple":20,"./utils/computed-style":25,"./utils/dom":27,"./utils/events":28,"./utils/feature-detector":29,"./utils/fullscreen":30,"./utils/guid":31,"./utils/log":32,"./utils/normalize-source":35,"./utils/obj":36,"./utils/plugin":37,"./utils/to-title-case":39}],6:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * core-js 2.5.1
 * https://github.com/zloirock/core-js
 * License: http://rock.mit-license.org
 * © 2017 Denis Pushkarev
 */
!function (t, n, r) {
  "use strict";
  !function (t) {
    function __webpack_require__(r) {
      if (n[r]) return n[r].exports;var e = n[r] = { i: r, l: !1, exports: {} };return t[r].call(e.exports, e, e.exports, __webpack_require__), e.l = !0, e.exports;
    }var n = {};__webpack_require__.m = t, __webpack_require__.c = n, __webpack_require__.d = function (t, n, r) {
      __webpack_require__.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: r });
    }, __webpack_require__.n = function (t) {
      var n = t && t.__esModule ? function getDefault() {
        return t["default"];
      } : function getModuleExports() {
        return t;
      };return __webpack_require__.d(n, "a", n), n;
    }, __webpack_require__.o = function (t, n) {
      return Object.prototype.hasOwnProperty.call(t, n);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 123);
  }([function (t, n, e) {
    var i = e(2),
        o = e(28),
        u = e(12),
        c = e(13),
        f = e(18),
        a = function a(t, n, e) {
      var s,
          l,
          h,
          p,
          v = t & a.F,
          g = t & a.G,
          y = t & a.S,
          d = t & a.P,
          _ = t & a.B,
          S = g ? i : y ? i[n] || (i[n] = {}) : (i[n] || {}).prototype,
          b = g ? o : o[n] || (o[n] = {}),
          m = b.prototype || (b.prototype = {});g && (e = n);for (s in e) {
        h = ((l = !v && S && S[s] !== r) ? S : e)[s], p = _ && l ? f(h, i) : d && "function" == typeof h ? f(Function.call, h) : h, S && c(S, s, h, t & a.U), b[s] != h && u(b, s, p), d && m[s] != h && (m[s] = h);
      }
    };i.core = o, a.F = 1, a.G = 2, a.S = 4, a.P = 8, a.B = 16, a.W = 32, a.U = 64, a.R = 128, t.exports = a;
  }, function (t, n, r) {
    var e = r(4);t.exports = function (t) {
      if (!e(t)) throw TypeError(t + " is not an object!");return t;
    };
  }, function (t, r) {
    var e = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();"number" == typeof n && (n = e);
  }, function (t, n) {
    t.exports = function (t) {
      try {
        return !!t();
      } catch (n) {
        return !0;
      }
    };
  }, function (t, n) {
    t.exports = function (t) {
      return "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) ? null !== t : "function" == typeof t;
    };
  }, function (t, n, r) {
    var e = r(49)("wks"),
        i = r(32),
        o = r(2).Symbol,
        u = "function" == typeof o;(t.exports = function (t) {
      return e[t] || (e[t] = u && o[t] || (u ? o : i)("Symbol." + t));
    }).store = e;
  }, function (t, n, r) {
    t.exports = !r(3)(function () {
      return 7 != Object.defineProperty({}, "a", { get: function get() {
          return 7;
        } }).a;
    });
  }, function (t, n, r) {
    var e = r(1),
        i = r(89),
        o = r(21),
        u = Object.defineProperty;n.f = r(6) ? Object.defineProperty : function defineProperty(t, n, r) {
      if (e(t), n = o(n, !0), e(r), i) try {
        return u(t, n, r);
      } catch (c) {}if ("get" in r || "set" in r) throw TypeError("Accessors not supported!");return "value" in r && (t[n] = r.value), t;
    };
  }, function (t, n, r) {
    var e = r(23),
        i = Math.min;t.exports = function (t) {
      return t > 0 ? i(e(t), 9007199254740991) : 0;
    };
  }, function (t, n, r) {
    var e = r(22);t.exports = function (t) {
      return Object(e(t));
    };
  }, function (t, n) {
    t.exports = function (t) {
      if ("function" != typeof t) throw TypeError(t + " is not a function!");return t;
    };
  }, function (t, n) {
    var r = {}.hasOwnProperty;t.exports = function (t, n) {
      return r.call(t, n);
    };
  }, function (t, n, r) {
    var e = r(7),
        i = r(31);t.exports = r(6) ? function (t, n, r) {
      return e.f(t, n, i(1, r));
    } : function (t, n, r) {
      return t[n] = r, t;
    };
  }, function (t, n, r) {
    var e = r(2),
        i = r(12),
        o = r(11),
        u = r(32)("src"),
        c = Function.toString,
        f = ("" + c).split("toString");r(28).inspectSource = function (t) {
      return c.call(t);
    }, (t.exports = function (t, n, r, c) {
      var a = "function" == typeof r;a && (o(r, "name") || i(r, "name", n)), t[n] !== r && (a && (o(r, u) || i(r, u, t[n] ? "" + t[n] : f.join(String(n)))), t === e ? t[n] = r : c ? t[n] ? t[n] = r : i(t, n, r) : (delete t[n], i(t, n, r)));
    })(Function.prototype, "toString", function toString() {
      return "function" == typeof this && this[u] || c.call(this);
    });
  }, function (t, n, r) {
    var e = r(0),
        i = r(3),
        o = r(22),
        u = /"/g,
        c = function c(t, n, r, e) {
      var i = String(o(t)),
          c = "<" + n;return "" !== r && (c += " " + r + '="' + String(e).replace(u, "&quot;") + '"'), c + ">" + i + "</" + n + ">";
    };t.exports = function (t, n) {
      var r = {};r[t] = n(c), e(e.P + e.F * i(function () {
        var n = ""[t]('"');return n !== n.toLowerCase() || n.split('"').length > 3;
      }), "String", r);
    };
  }, function (t, n, r) {
    var e = r(46),
        i = r(22);t.exports = function (t) {
      return e(i(t));
    };
  }, function (t, n, r) {
    var e = r(47),
        i = r(31),
        o = r(15),
        u = r(21),
        c = r(11),
        f = r(89),
        a = Object.getOwnPropertyDescriptor;n.f = r(6) ? a : function getOwnPropertyDescriptor(t, n) {
      if (t = o(t), n = u(n, !0), f) try {
        return a(t, n);
      } catch (r) {}if (c(t, n)) return i(!e.f.call(t, n), t[n]);
    };
  }, function (t, n, r) {
    var e = r(11),
        i = r(9),
        o = r(65)("IE_PROTO"),
        u = Object.prototype;t.exports = Object.getPrototypeOf || function (t) {
      return t = i(t), e(t, o) ? t[o] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? u : null;
    };
  }, function (t, n, e) {
    var i = e(10);t.exports = function (t, n, e) {
      if (i(t), n === r) return t;switch (e) {case 1:
          return function (r) {
            return t.call(n, r);
          };case 2:
          return function (r, e) {
            return t.call(n, r, e);
          };case 3:
          return function (r, e, i) {
            return t.call(n, r, e, i);
          };}return function () {
        return t.apply(n, arguments);
      };
    };
  }, function (t, n) {
    var r = {}.toString;t.exports = function (t) {
      return r.call(t).slice(8, -1);
    };
  }, function (t, n, r) {
    var e = r(3);t.exports = function (t, n) {
      return !!t && e(function () {
        n ? t.call(null, function () {}, 1) : t.call(null);
      });
    };
  }, function (t, n, r) {
    var e = r(4);t.exports = function (t, n) {
      if (!e(t)) return t;var r, i;if (n && "function" == typeof (r = t.toString) && !e(i = r.call(t))) return i;if ("function" == typeof (r = t.valueOf) && !e(i = r.call(t))) return i;if (!n && "function" == typeof (r = t.toString) && !e(i = r.call(t))) return i;throw TypeError("Can't convert object to primitive value");
    };
  }, function (t, n) {
    t.exports = function (t) {
      if (t == r) throw TypeError("Can't call method on  " + t);return t;
    };
  }, function (t, n) {
    var r = Math.ceil,
        e = Math.floor;t.exports = function (t) {
      return isNaN(t = +t) ? 0 : (t > 0 ? e : r)(t);
    };
  }, function (t, n, r) {
    var e = r(0),
        i = r(28),
        o = r(3);t.exports = function (t, n) {
      var r = (i.Object || {})[t] || Object[t],
          u = {};u[t] = n(r), e(e.S + e.F * o(function () {
        r(1);
      }), "Object", u);
    };
  }, function (t, n, e) {
    var i = e(18),
        o = e(46),
        u = e(9),
        c = e(8),
        f = e(82);t.exports = function (t, n) {
      var e = 1 == t,
          a = 2 == t,
          s = 3 == t,
          l = 4 == t,
          h = 6 == t,
          p = 5 == t || h,
          v = n || f;return function (n, f, g) {
        for (var y, d, _ = u(n), S = o(_), b = i(f, g, 3), m = c(S.length), x = 0, w = e ? v(n, m) : a ? v(n, 0) : r; m > x; x++) {
          if ((p || x in S) && (y = S[x], d = b(y, x, _), t)) if (e) w[x] = d;else if (d) switch (t) {case 3:
              return !0;case 5:
              return y;case 6:
              return x;case 2:
              w.push(y);} else if (l) return !1;
        }return h ? -1 : s || l ? l : w;
      };
    };
  }, function (t, n, e) {
    if (e(6)) {
      var i = e(33),
          o = e(2),
          u = e(3),
          c = e(0),
          f = e(59),
          a = e(88),
          s = e(18),
          l = e(39),
          h = e(31),
          p = e(12),
          v = e(41),
          g = e(23),
          y = e(8),
          d = e(116),
          _ = e(35),
          S = e(21),
          b = e(11),
          m = e(48),
          x = e(4),
          w = e(9),
          E = e(79),
          O = e(36),
          P = e(17),
          M = e(37).f,
          I = e(81),
          F = e(32),
          A = e(5),
          k = e(25),
          N = e(50),
          j = e(57),
          R = e(84),
          T = e(44),
          L = e(54),
          D = e(38),
          W = e(83),
          C = e(105),
          U = e(7),
          G = e(16),
          B = U.f,
          V = G.f,
          z = o.RangeError,
          q = o.TypeError,
          K = o.Uint8Array,
          J = Array.prototype,
          Y = a.ArrayBuffer,
          H = a.DataView,
          X = k(0),
          Z = k(2),
          $ = k(3),
          Q = k(4),
          tt = k(5),
          nt = k(6),
          rt = N(!0),
          et = N(!1),
          it = R.values,
          ot = R.keys,
          ut = R.entries,
          ct = J.lastIndexOf,
          ft = J.reduce,
          at = J.reduceRight,
          st = J.join,
          lt = J.sort,
          ht = J.slice,
          pt = J.toString,
          vt = J.toLocaleString,
          gt = A("iterator"),
          yt = A("toStringTag"),
          dt = F("typed_constructor"),
          _t = F("def_constructor"),
          St = f.CONSTR,
          bt = f.TYPED,
          mt = f.VIEW,
          xt = k(1, function (t, n) {
        return Mt(j(t, t[_t]), n);
      }),
          wt = u(function () {
        return 1 === new K(new Uint16Array([1]).buffer)[0];
      }),
          Et = !!K && !!K.prototype.set && u(function () {
        new K(1).set({});
      }),
          Ot = function Ot(t, n) {
        var r = g(t);if (r < 0 || r % n) throw z("Wrong offset!");return r;
      },
          Pt = function Pt(t) {
        if (x(t) && bt in t) return t;throw q(t + " is not a typed array!");
      },
          Mt = function Mt(t, n) {
        if (!(x(t) && dt in t)) throw q("It is not a typed array constructor!");return new t(n);
      },
          It = function It(t, n) {
        return Ft(j(t, t[_t]), n);
      },
          Ft = function Ft(t, n) {
        for (var r = 0, e = n.length, i = Mt(t, e); e > r;) {
          i[r] = n[r++];
        }return i;
      },
          At = function At(t, n, r) {
        B(t, n, { get: function get() {
            return this._d[r];
          } });
      },
          kt = function from(t) {
        var n,
            e,
            i,
            o,
            u,
            c,
            f = w(t),
            a = arguments.length,
            l = a > 1 ? arguments[1] : r,
            h = l !== r,
            p = I(f);if (p != r && !E(p)) {
          for (c = p.call(f), i = [], n = 0; !(u = c.next()).done; n++) {
            i.push(u.value);
          }f = i;
        }for (h && a > 2 && (l = s(l, arguments[2], 2)), n = 0, e = y(f.length), o = Mt(this, e); e > n; n++) {
          o[n] = h ? l(f[n], n) : f[n];
        }return o;
      },
          Nt = function of() {
        for (var t = 0, n = arguments.length, r = Mt(this, n); n > t;) {
          r[t] = arguments[t++];
        }return r;
      },
          jt = !!K && u(function () {
        vt.call(new K(1));
      }),
          Rt = function toLocaleString() {
        return vt.apply(jt ? ht.call(Pt(this)) : Pt(this), arguments);
      },
          Tt = { copyWithin: function copyWithin(t, n) {
          return C.call(Pt(this), t, n, arguments.length > 2 ? arguments[2] : r);
        }, every: function every(t) {
          return Q(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, fill: function fill(t) {
          return W.apply(Pt(this), arguments);
        }, filter: function filter(t) {
          return It(this, Z(Pt(this), t, arguments.length > 1 ? arguments[1] : r));
        }, find: function find(t) {
          return tt(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, findIndex: function findIndex(t) {
          return nt(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, forEach: function forEach(t) {
          X(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, indexOf: function indexOf(t) {
          return et(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, includes: function includes(t) {
          return rt(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, join: function join(t) {
          return st.apply(Pt(this), arguments);
        }, lastIndexOf: function lastIndexOf(t) {
          return ct.apply(Pt(this), arguments);
        }, map: function map(t) {
          return xt(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, reduce: function reduce(t) {
          return ft.apply(Pt(this), arguments);
        }, reduceRight: function reduceRight(t) {
          return at.apply(Pt(this), arguments);
        }, reverse: function reverse() {
          for (var t, n = this, r = Pt(n).length, e = Math.floor(r / 2), i = 0; i < e;) {
            t = n[i], n[i++] = n[--r], n[r] = t;
          }return n;
        }, some: function some(t) {
          return $(Pt(this), t, arguments.length > 1 ? arguments[1] : r);
        }, sort: function sort(t) {
          return lt.call(Pt(this), t);
        }, subarray: function subarray(t, n) {
          var e = Pt(this),
              i = e.length,
              o = _(t, i);return new (j(e, e[_t]))(e.buffer, e.byteOffset + o * e.BYTES_PER_ELEMENT, y((n === r ? i : _(n, i)) - o));
        } },
          Lt = function slice(t, n) {
        return It(this, ht.call(Pt(this), t, n));
      },
          Dt = function set(t) {
        Pt(this);var n = Ot(arguments[1], 1),
            r = this.length,
            e = w(t),
            i = y(e.length),
            o = 0;if (i + n > r) throw z("Wrong length!");for (; o < i;) {
          this[n + o] = e[o++];
        }
      },
          Wt = { entries: function entries() {
          return ut.call(Pt(this));
        }, keys: function keys() {
          return ot.call(Pt(this));
        }, values: function values() {
          return it.call(Pt(this));
        } },
          Ct = function Ct(t, n) {
        return x(t) && t[bt] && "symbol" != (typeof n === "undefined" ? "undefined" : _typeof(n)) && n in t && String(+n) == String(n);
      },
          Ut = function getOwnPropertyDescriptor(t, n) {
        return Ct(t, n = S(n, !0)) ? h(2, t[n]) : V(t, n);
      },
          Gt = function defineProperty(t, n, r) {
        return !(Ct(t, n = S(n, !0)) && x(r) && b(r, "value")) || b(r, "get") || b(r, "set") || r.configurable || b(r, "writable") && !r.writable || b(r, "enumerable") && !r.enumerable ? B(t, n, r) : (t[n] = r.value, t);
      };St || (G.f = Ut, U.f = Gt), c(c.S + c.F * !St, "Object", { getOwnPropertyDescriptor: Ut, defineProperty: Gt }), u(function () {
        pt.call({});
      }) && (pt = vt = function toString() {
        return st.call(this);
      });var Bt = v({}, Tt);v(Bt, Wt), p(Bt, gt, Wt.values), v(Bt, { slice: Lt, set: Dt, constructor: function constructor() {}, toString: pt, toLocaleString: Rt }), At(Bt, "buffer", "b"), At(Bt, "byteOffset", "o"), At(Bt, "byteLength", "l"), At(Bt, "length", "e"), B(Bt, yt, { get: function get() {
          return this[bt];
        } }), t.exports = function (t, n, e, a) {
        var s = t + ((a = !!a) ? "Clamped" : "") + "Array",
            h = "get" + t,
            v = "set" + t,
            g = o[s],
            _ = g || {},
            S = g && P(g),
            b = !g || !f.ABV,
            w = {},
            E = g && g.prototype,
            I = function I(t, r) {
          var e = t._d;return e.v[h](r * n + e.o, wt);
        },
            F = function F(t, r, e) {
          var i = t._d;a && (e = (e = Math.round(e)) < 0 ? 0 : e > 255 ? 255 : 255 & e), i.v[v](r * n + i.o, e, wt);
        },
            A = function A(t, n) {
          B(t, n, { get: function get() {
              return I(this, n);
            }, set: function set(t) {
              return F(this, n, t);
            }, enumerable: !0 });
        };b ? (g = e(function (t, e, i, o) {
          l(t, g, s, "_d");var u,
              c,
              f,
              a,
              h = 0,
              v = 0;if (x(e)) {
            if (!(e instanceof Y || "ArrayBuffer" == (a = m(e)) || "SharedArrayBuffer" == a)) return bt in e ? Ft(g, e) : kt.call(g, e);u = e, v = Ot(i, n);var _ = e.byteLength;if (o === r) {
              if (_ % n) throw z("Wrong length!");if ((c = _ - v) < 0) throw z("Wrong length!");
            } else if ((c = y(o) * n) + v > _) throw z("Wrong length!");f = c / n;
          } else f = d(e), u = new Y(c = f * n);for (p(t, "_d", { b: u, o: v, l: c, e: f, v: new H(u) }); h < f;) {
            A(t, h++);
          }
        }), E = g.prototype = O(Bt), p(E, "constructor", g)) : u(function () {
          g(1);
        }) && u(function () {
          new g(-1);
        }) && L(function (t) {
          new g(), new g(null), new g(1.5), new g(t);
        }, !0) || (g = e(function (t, e, i, o) {
          l(t, g, s);var u;return x(e) ? e instanceof Y || "ArrayBuffer" == (u = m(e)) || "SharedArrayBuffer" == u ? o !== r ? new _(e, Ot(i, n), o) : i !== r ? new _(e, Ot(i, n)) : new _(e) : bt in e ? Ft(g, e) : kt.call(g, e) : new _(d(e));
        }), X(S !== Function.prototype ? M(_).concat(M(S)) : M(_), function (t) {
          t in g || p(g, t, _[t]);
        }), g.prototype = E, i || (E.constructor = g));var k = E[gt],
            N = !!k && ("values" == k.name || k.name == r),
            j = Wt.values;p(g, dt, !0), p(E, bt, s), p(E, mt, !0), p(E, _t, g), (a ? new g(1)[yt] == s : yt in E) || B(E, yt, { get: function get() {
            return s;
          } }), w[s] = g, c(c.G + c.W + c.F * (g != _), w), c(c.S, s, { BYTES_PER_ELEMENT: n }), c(c.S + c.F * u(function () {
          _.of.call(g, 1);
        }), s, { from: kt, of: Nt }), "BYTES_PER_ELEMENT" in E || p(E, "BYTES_PER_ELEMENT", n), c(c.P, s, Tt), D(s), c(c.P + c.F * Et, s, { set: Dt }), c(c.P + c.F * !N, s, Wt), i || E.toString == pt || (E.toString = pt), c(c.P + c.F * u(function () {
          new g(1).slice();
        }), s, { slice: Lt }), c(c.P + c.F * (u(function () {
          return [1, 2].toLocaleString() != new g([1, 2]).toLocaleString();
        }) || !u(function () {
          E.toLocaleString.call([1, 2]);
        })), s, { toLocaleString: Rt }), T[s] = N ? k : j, i || N || p(E, gt, j);
      };
    } else t.exports = function () {};
  }, function (t, n, e) {
    var i = e(110),
        o = e(0),
        u = e(49)("metadata"),
        c = u.store || (u.store = new (e(113))()),
        f = function f(t, n, e) {
      var o = c.get(t);if (!o) {
        if (!e) return r;c.set(t, o = new i());
      }var u = o.get(n);if (!u) {
        if (!e) return r;o.set(n, u = new i());
      }return u;
    };t.exports = { store: c, map: f, has: function has(t, n, e) {
        var i = f(n, e, !1);return i !== r && i.has(t);
      }, get: function get(t, n, e) {
        var i = f(n, e, !1);return i === r ? r : i.get(t);
      }, set: function set(t, n, r, e) {
        f(r, e, !0).set(t, n);
      }, keys: function keys(t, n) {
        var r = f(t, n, !1),
            e = [];return r && r.forEach(function (t, n) {
          e.push(n);
        }), e;
      }, key: function key(t) {
        return t === r || "symbol" == (typeof t === "undefined" ? "undefined" : _typeof(t)) ? t : String(t);
      }, exp: function exp(t) {
        o(o.S, "Reflect", t);
      } };
  }, function (n, r) {
    var e = n.exports = { version: "2.5.1" };"number" == typeof t && (t = e);
  }, function (t, n, r) {
    var e = r(32)("meta"),
        i = r(4),
        o = r(11),
        u = r(7).f,
        c = 0,
        f = Object.isExtensible || function () {
      return !0;
    },
        a = !r(3)(function () {
      return f(Object.preventExtensions({}));
    }),
        s = function s(t) {
      u(t, e, { value: { i: "O" + ++c, w: {} } });
    },
        l = t.exports = { KEY: e, NEED: !1, fastKey: function fastKey(t, n) {
        if (!i(t)) return "symbol" == (typeof t === "undefined" ? "undefined" : _typeof(t)) ? t : ("string" == typeof t ? "S" : "P") + t;if (!o(t, e)) {
          if (!f(t)) return "F";if (!n) return "E";s(t);
        }return t[e].i;
      }, getWeak: function getWeak(t, n) {
        if (!o(t, e)) {
          if (!f(t)) return !0;if (!n) return !1;s(t);
        }return t[e].w;
      }, onFreeze: function onFreeze(t) {
        return a && l.NEED && f(t) && !o(t, e) && s(t), t;
      } };
  }, function (t, n, e) {
    var i = e(5)("unscopables"),
        o = Array.prototype;o[i] == r && e(12)(o, i, {}), t.exports = function (t) {
      o[i][t] = !0;
    };
  }, function (t, n) {
    t.exports = function (t, n) {
      return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: n };
    };
  }, function (t, n) {
    var e = 0,
        i = Math.random();t.exports = function (t) {
      return "Symbol(".concat(t === r ? "" : t, ")_", (++e + i).toString(36));
    };
  }, function (t, n) {
    t.exports = !1;
  }, function (t, n, r) {
    var e = r(91),
        i = r(66);t.exports = Object.keys || function keys(t) {
      return e(t, i);
    };
  }, function (t, n, r) {
    var e = r(23),
        i = Math.max,
        o = Math.min;t.exports = function (t, n) {
      return (t = e(t)) < 0 ? i(t + n, 0) : o(t, n);
    };
  }, function (t, n, e) {
    var i = e(1),
        o = e(92),
        u = e(66),
        c = e(65)("IE_PROTO"),
        f = function f() {},
        _a = function a() {
      var t,
          n = e(63)("iframe"),
          r = u.length;for (n.style.display = "none", e(67).appendChild(n), n.src = "javascript:", (t = n.contentWindow.document).open(), t.write("<script>document.F=Object<\/script>"), t.close(), _a = t.F; r--;) {
        delete _a.prototype[u[r]];
      }return _a();
    };t.exports = Object.create || function create(t, n) {
      var e;return null !== t ? (f.prototype = i(t), e = new f(), f.prototype = null, e[c] = t) : e = _a(), n === r ? e : o(e, n);
    };
  }, function (t, n, r) {
    var e = r(91),
        i = r(66).concat("length", "prototype");n.f = Object.getOwnPropertyNames || function getOwnPropertyNames(t) {
      return e(t, i);
    };
  }, function (t, n, r) {
    var e = r(2),
        i = r(7),
        o = r(6),
        u = r(5)("species");t.exports = function (t) {
      var n = e[t];o && n && !n[u] && i.f(n, u, { configurable: !0, get: function get() {
          return this;
        } });
    };
  }, function (t, n) {
    t.exports = function (t, n, e, i) {
      if (!(t instanceof n) || i !== r && i in t) throw TypeError(e + ": incorrect invocation!");return t;
    };
  }, function (t, n, r) {
    var e = r(18),
        i = r(103),
        o = r(79),
        u = r(1),
        c = r(8),
        f = r(81),
        a = {},
        s = {};(n = t.exports = function (t, n, r, l, h) {
      var p,
          v,
          g,
          y,
          d = h ? function () {
        return t;
      } : f(t),
          _ = e(r, l, n ? 2 : 1),
          S = 0;if ("function" != typeof d) throw TypeError(t + " is not iterable!");if (o(d)) {
        for (p = c(t.length); p > S; S++) {
          if ((y = n ? _(u(v = t[S])[0], v[1]) : _(t[S])) === a || y === s) return y;
        }
      } else for (g = d.call(t); !(v = g.next()).done;) {
        if ((y = i(g, _, v.value, n)) === a || y === s) return y;
      }
    }).BREAK = a, n.RETURN = s;
  }, function (t, n, r) {
    var e = r(13);t.exports = function (t, n, r) {
      for (var i in n) {
        e(t, i, n[i], r);
      }return t;
    };
  }, function (t, n, r) {
    var e = r(7).f,
        i = r(11),
        o = r(5)("toStringTag");t.exports = function (t, n, r) {
      t && !i(t = r ? t : t.prototype, o) && e(t, o, { configurable: !0, value: n });
    };
  }, function (t, n, r) {
    var e = r(0),
        i = r(22),
        o = r(3),
        u = r(70),
        c = "[" + u + "]",
        f = RegExp("^" + c + c + "*"),
        a = RegExp(c + c + "*$"),
        s = function s(t, n, r) {
      var i = {},
          c = o(function () {
        return !!u[t]() || "​" != "​"[t]();
      }),
          f = i[t] = c ? n(l) : u[t];r && (i[r] = f), e(e.P + e.F * c, "String", i);
    },
        l = s.trim = function (t, n) {
      return t = String(i(t)), 1 & n && (t = t.replace(f, "")), 2 & n && (t = t.replace(a, "")), t;
    };t.exports = s;
  }, function (t, n) {
    t.exports = {};
  }, function (t, n, r) {
    var e = r(4);t.exports = function (t, n) {
      if (!e(t) || t._t !== n) throw TypeError("Incompatible receiver, " + n + " required!");return t;
    };
  }, function (t, n, r) {
    var e = r(19);t.exports = Object("z").propertyIsEnumerable(0) ? Object : function (t) {
      return "String" == e(t) ? t.split("") : Object(t);
    };
  }, function (t, n) {
    n.f = {}.propertyIsEnumerable;
  }, function (t, n, e) {
    var i = e(19),
        o = e(5)("toStringTag"),
        u = "Arguments" == i(function () {
      return arguments;
    }()),
        c = function c(t, n) {
      try {
        return t[n];
      } catch (r) {}
    };t.exports = function (t) {
      var n, e, f;return t === r ? "Undefined" : null === t ? "Null" : "string" == typeof (e = c(n = Object(t), o)) ? e : u ? i(n) : "Object" == (f = i(n)) && "function" == typeof n.callee ? "Arguments" : f;
    };
  }, function (t, n, r) {
    var e = r(2),
        i = e["__core-js_shared__"] || (e["__core-js_shared__"] = {});t.exports = function (t) {
      return i[t] || (i[t] = {});
    };
  }, function (t, n, r) {
    var e = r(15),
        i = r(8),
        o = r(35);t.exports = function (t) {
      return function (n, r, u) {
        var c,
            f = e(n),
            a = i(f.length),
            s = o(u, a);if (t && r != r) {
          for (; a > s;) {
            if ((c = f[s++]) != c) return !0;
          }
        } else for (; a > s; s++) {
          if ((t || s in f) && f[s] === r) return t || s || 0;
        }return !t && -1;
      };
    };
  }, function (t, n) {
    n.f = Object.getOwnPropertySymbols;
  }, function (t, n, r) {
    var e = r(19);t.exports = Array.isArray || function isArray(t) {
      return "Array" == e(t);
    };
  }, function (t, n, e) {
    var i = e(4),
        o = e(19),
        u = e(5)("match");t.exports = function (t) {
      var n;return i(t) && ((n = t[u]) !== r ? !!n : "RegExp" == o(t));
    };
  }, function (t, n, r) {
    var e = r(5)("iterator"),
        i = !1;try {
      var o = [7][e]();o["return"] = function () {
        i = !0;
      }, Array.from(o, function () {
        throw 2;
      });
    } catch (u) {}t.exports = function (t, n) {
      if (!n && !i) return !1;var r = !1;try {
        var o = [7],
            c = o[e]();c.next = function () {
          return { done: r = !0 };
        }, o[e] = function () {
          return c;
        }, t(o);
      } catch (u) {}return r;
    };
  }, function (t, n, r) {
    var e = r(1);t.exports = function () {
      var t = e(this),
          n = "";return t.global && (n += "g"), t.ignoreCase && (n += "i"), t.multiline && (n += "m"), t.unicode && (n += "u"), t.sticky && (n += "y"), n;
    };
  }, function (t, n, r) {
    var e = r(12),
        i = r(13),
        o = r(3),
        u = r(22),
        c = r(5);t.exports = function (t, n, r) {
      var f = c(t),
          a = r(u, f, ""[t]),
          s = a[0],
          l = a[1];o(function () {
        var n = {};return n[f] = function () {
          return 7;
        }, 7 != ""[t](n);
      }) && (i(String.prototype, t, s), e(RegExp.prototype, f, 2 == n ? function (t, n) {
        return l.call(t, this, n);
      } : function (t) {
        return l.call(t, this);
      }));
    };
  }, function (t, n, e) {
    var i = e(1),
        o = e(10),
        u = e(5)("species");t.exports = function (t, n) {
      var e,
          c = i(t).constructor;return c === r || (e = i(c)[u]) == r ? n : o(e);
    };
  }, function (t, n, e) {
    var i = e(2),
        o = e(0),
        u = e(13),
        c = e(41),
        f = e(29),
        a = e(40),
        s = e(39),
        l = e(4),
        h = e(3),
        p = e(54),
        v = e(42),
        g = e(69);t.exports = function (t, n, e, y, d, _) {
      var S = i[t],
          b = S,
          m = d ? "set" : "add",
          x = b && b.prototype,
          w = {},
          E = function E(t) {
        var n = x[t];u(x, t, "delete" == t ? function (t) {
          return !(_ && !l(t)) && n.call(this, 0 === t ? 0 : t);
        } : "has" == t ? function has(t) {
          return !(_ && !l(t)) && n.call(this, 0 === t ? 0 : t);
        } : "get" == t ? function get(t) {
          return _ && !l(t) ? r : n.call(this, 0 === t ? 0 : t);
        } : "add" == t ? function add(t) {
          return n.call(this, 0 === t ? 0 : t), this;
        } : function set(t, r) {
          return n.call(this, 0 === t ? 0 : t, r), this;
        });
      };if ("function" == typeof b && (_ || x.forEach && !h(function () {
        new b().entries().next();
      }))) {
        var O = new b(),
            P = O[m](_ ? {} : -0, 1) != O,
            M = h(function () {
          O.has(1);
        }),
            I = p(function (t) {
          new b(t);
        }),
            F = !_ && h(function () {
          for (var t = new b(), n = 5; n--;) {
            t[m](n, n);
          }return !t.has(-0);
        });I || ((b = n(function (n, e) {
          s(n, b, t);var i = g(new S(), n, b);return e != r && a(e, d, i[m], i), i;
        })).prototype = x, x.constructor = b), (M || F) && (E("delete"), E("has"), d && E("get")), (F || P) && E(m), _ && x.clear && delete x.clear;
      } else b = y.getConstructor(n, t, d, m), c(b.prototype, e), f.NEED = !0;return v(b, t), w[t] = b, o(o.G + o.W + o.F * (b != S), w), _ || y.setStrong(b, t, d), b;
    };
  }, function (t, n, r) {
    for (var e, i = r(2), o = r(12), u = r(32), c = u("typed_array"), f = u("view"), a = !(!i.ArrayBuffer || !i.DataView), s = a, l = 0, h = "Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(","); l < 9;) {
      (e = i[h[l++]]) ? (o(e.prototype, c, !0), o(e.prototype, f, !0)) : s = !1;
    }t.exports = { ABV: a, CONSTR: s, TYPED: c, VIEW: f };
  }, function (t, n, r) {
    t.exports = r(33) || !r(3)(function () {
      var t = Math.random();__defineSetter__.call(null, t, function () {}), delete r(2)[t];
    });
  }, function (t, n, r) {
    var e = r(0);t.exports = function (t) {
      e(e.S, t, { of: function of() {
          for (var t = arguments.length, n = Array(t); t--;) {
            n[t] = arguments[t];
          }return new this(n);
        } });
    };
  }, function (t, n, e) {
    var i = e(0),
        o = e(10),
        u = e(18),
        c = e(40);t.exports = function (t) {
      i(i.S, t, { from: function from(t) {
          var n,
              e,
              i,
              f,
              a = arguments[1];return o(this), (n = a !== r) && o(a), t == r ? new this() : (e = [], n ? (i = 0, f = u(a, arguments[2], 2), c(t, !1, function (t) {
            e.push(f(t, i++));
          })) : c(t, !1, e.push, e), new this(e));
        } });
    };
  }, function (t, n, r) {
    var e = r(4),
        i = r(2).document,
        o = e(i) && e(i.createElement);t.exports = function (t) {
      return o ? i.createElement(t) : {};
    };
  }, function (t, n, r) {
    var e = r(2),
        i = r(28),
        o = r(33),
        u = r(90),
        c = r(7).f;t.exports = function (t) {
      var n = i.Symbol || (i.Symbol = o ? {} : e.Symbol || {});"_" == t.charAt(0) || t in n || c(n, t, { value: u.f(t) });
    };
  }, function (t, n, r) {
    var e = r(49)("keys"),
        i = r(32);t.exports = function (t) {
      return e[t] || (e[t] = i(t));
    };
  }, function (t, n) {
    t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
  }, function (t, n, r) {
    var e = r(2).document;t.exports = e && e.documentElement;
  }, function (t, n, e) {
    var i = e(4),
        o = e(1),
        u = function u(t, n) {
      if (o(t), !i(n) && null !== n) throw TypeError(n + ": can't set as prototype!");
    };t.exports = { set: Object.setPrototypeOf || ("__proto__" in {} ? function (t, n, r) {
        try {
          (r = e(18)(Function.call, e(16).f(Object.prototype, "__proto__").set, 2))(t, []), n = !(t instanceof Array);
        } catch (i) {
          n = !0;
        }return function setPrototypeOf(t, e) {
          return u(t, e), n ? t.__proto__ = e : r(t, e), t;
        };
      }({}, !1) : r), check: u };
  }, function (t, n, r) {
    var e = r(4),
        i = r(68).set;t.exports = function (t, n, r) {
      var o,
          u = n.constructor;return u !== r && "function" == typeof u && (o = u.prototype) !== r.prototype && e(o) && i && i(t, o), t;
    };
  }, function (t, n) {
    t.exports = "\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
  }, function (t, n, r) {
    var e = r(23),
        i = r(22);t.exports = function repeat(t) {
      var n = String(i(this)),
          r = "",
          o = e(t);if (o < 0 || o == Infinity) throw RangeError("Count can't be negative");for (; o > 0; (o >>>= 1) && (n += n)) {
        1 & o && (r += n);
      }return r;
    };
  }, function (t, n) {
    t.exports = Math.sign || function sign(t) {
      return 0 == (t = +t) || t != t ? t : t < 0 ? -1 : 1;
    };
  }, function (t, n) {
    var r = Math.expm1;t.exports = !r || r(10) > 22025.465794806718 || r(10) < 22025.465794806718 || -2e-17 != r(-2e-17) ? function expm1(t) {
      return 0 == (t = +t) ? t : t > -1e-6 && t < 1e-6 ? t + t * t / 2 : Math.exp(t) - 1;
    } : r;
  }, function (t, n, e) {
    var i = e(23),
        o = e(22);t.exports = function (t) {
      return function (n, e) {
        var u,
            c,
            f = String(o(n)),
            a = i(e),
            s = f.length;return a < 0 || a >= s ? t ? "" : r : (u = f.charCodeAt(a)) < 55296 || u > 56319 || a + 1 === s || (c = f.charCodeAt(a + 1)) < 56320 || c > 57343 ? t ? f.charAt(a) : u : t ? f.slice(a, a + 2) : c - 56320 + (u - 55296 << 10) + 65536;
      };
    };
  }, function (t, n, r) {
    var e = r(53),
        i = r(22);t.exports = function (t, n, r) {
      if (e(n)) throw TypeError("String#" + r + " doesn't accept regex!");return String(i(t));
    };
  }, function (t, n, r) {
    var e = r(5)("match");t.exports = function (t) {
      var n = /./;try {
        "/./"[t](n);
      } catch (r) {
        try {
          return n[e] = !1, !"/./"[t](n);
        } catch (i) {}
      }return !0;
    };
  }, function (t, n, e) {
    var i = e(33),
        o = e(0),
        u = e(13),
        c = e(12),
        f = e(11),
        a = e(44),
        s = e(78),
        l = e(42),
        h = e(17),
        p = e(5)("iterator"),
        v = !([].keys && "next" in [].keys()),
        g = function g() {
      return this;
    };t.exports = function (t, n, e, y, d, _, S) {
      s(e, n, y);var b,
          m,
          x,
          w = function w(t) {
        if (!v && t in M) return M[t];switch (t) {case "keys":
            return function keys() {
              return new e(this, t);
            };case "values":
            return function values() {
              return new e(this, t);
            };}return function entries() {
          return new e(this, t);
        };
      },
          E = n + " Iterator",
          O = "values" == d,
          P = !1,
          M = t.prototype,
          I = M[p] || M["@@iterator"] || d && M[d],
          F = I || w(d),
          A = d ? O ? w("entries") : F : r,
          k = "Array" == n ? M.entries || I : I;if (k && (x = h(k.call(new t()))) !== Object.prototype && x.next && (l(x, E, !0), i || f(x, p) || c(x, p, g)), O && I && "values" !== I.name && (P = !0, F = function values() {
        return I.call(this);
      }), i && !S || !v && !P && M[p] || c(M, p, F), a[n] = F, a[E] = g, d) if (b = { values: O ? F : w("values"), keys: _ ? F : w("keys"), entries: A }, S) for (m in b) {
        m in M || u(M, m, b[m]);
      } else o(o.P + o.F * (v || P), n, b);return b;
    };
  }, function (t, n, r) {
    var e = r(36),
        i = r(31),
        o = r(42),
        u = {};r(12)(u, r(5)("iterator"), function () {
      return this;
    }), t.exports = function (t, n, r) {
      t.prototype = e(u, { next: i(1, r) }), o(t, n + " Iterator");
    };
  }, function (t, n, e) {
    var i = e(44),
        o = e(5)("iterator"),
        u = Array.prototype;t.exports = function (t) {
      return t !== r && (i.Array === t || u[o] === t);
    };
  }, function (t, n, r) {
    var e = r(7),
        i = r(31);t.exports = function (t, n, r) {
      n in t ? e.f(t, n, i(0, r)) : t[n] = r;
    };
  }, function (t, n, e) {
    var i = e(48),
        o = e(5)("iterator"),
        u = e(44);t.exports = e(28).getIteratorMethod = function (t) {
      if (t != r) return t[o] || t["@@iterator"] || u[i(t)];
    };
  }, function (t, n, r) {
    var e = r(207);t.exports = function (t, n) {
      return new (e(t))(n);
    };
  }, function (t, n, e) {
    var i = e(9),
        o = e(35),
        u = e(8);t.exports = function fill(t) {
      for (var n = i(this), e = u(n.length), c = arguments.length, f = o(c > 1 ? arguments[1] : r, e), a = c > 2 ? arguments[2] : r, s = a === r ? e : o(a, e); s > f;) {
        n[f++] = t;
      }return n;
    };
  }, function (t, n, e) {
    var i = e(30),
        o = e(106),
        u = e(44),
        c = e(15);t.exports = e(77)(Array, "Array", function (t, n) {
      this._t = c(t), this._i = 0, this._k = n;
    }, function () {
      var t = this._t,
          n = this._k,
          e = this._i++;return !t || e >= t.length ? (this._t = r, o(1)) : "keys" == n ? o(0, e) : "values" == n ? o(0, t[e]) : o(0, [e, t[e]]);
    }, "values"), u.Arguments = u.Array, i("keys"), i("values"), i("entries");
  }, function (t, n, r) {
    var e,
        i,
        o,
        u = r(18),
        c = r(96),
        f = r(67),
        a = r(63),
        s = r(2),
        l = s.process,
        h = s.setImmediate,
        p = s.clearImmediate,
        v = s.MessageChannel,
        g = s.Dispatch,
        y = 0,
        d = {},
        _ = function _() {
      var t = +this;if (d.hasOwnProperty(t)) {
        var n = d[t];delete d[t], n();
      }
    },
        S = function S(t) {
      _.call(t.data);
    };h && p || (h = function setImmediate(t) {
      for (var n = [], r = 1; arguments.length > r;) {
        n.push(arguments[r++]);
      }return d[++y] = function () {
        c("function" == typeof t ? t : Function(t), n);
      }, e(y), y;
    }, p = function clearImmediate(t) {
      delete d[t];
    }, "process" == r(19)(l) ? e = function e(t) {
      l.nextTick(u(_, t, 1));
    } : g && g.now ? e = function e(t) {
      g.now(u(_, t, 1));
    } : v ? (o = (i = new v()).port2, i.port1.onmessage = S, e = u(o.postMessage, o, 1)) : s.addEventListener && "function" == typeof postMessage && !s.importScripts ? (e = function e(t) {
      s.postMessage(t + "", "*");
    }, s.addEventListener("message", S, !1)) : e = "onreadystatechange" in a("script") ? function (t) {
      f.appendChild(a("script")).onreadystatechange = function () {
        f.removeChild(this), _.call(t);
      };
    } : function (t) {
      setTimeout(u(_, t, 1), 0);
    }), t.exports = { set: h, clear: p };
  }, function (t, n, e) {
    var i = e(2),
        o = e(85).set,
        u = i.MutationObserver || i.WebKitMutationObserver,
        c = i.process,
        f = i.Promise,
        a = "process" == e(19)(c);t.exports = function () {
      var t,
          n,
          e,
          s = function s() {
        var i, o;for (a && (i = c.domain) && i.exit(); t;) {
          o = t.fn, t = t.next;try {
            o();
          } catch (u) {
            throw t ? e() : n = r, u;
          }
        }n = r, i && i.enter();
      };if (a) e = function e() {
        c.nextTick(s);
      };else if (u) {
        var l = !0,
            h = document.createTextNode("");new u(s).observe(h, { characterData: !0 }), e = function e() {
          h.data = l = !l;
        };
      } else if (f && f.resolve) {
        var p = f.resolve();e = function e() {
          p.then(s);
        };
      } else e = function e() {
        o.call(i, s);
      };return function (i) {
        var o = { fn: i, next: r };n && (n.next = o), t || (t = o, e()), n = o;
      };
    };
  }, function (t, n, e) {
    function PromiseCapability(t) {
      var n, e;this.promise = new t(function (t, i) {
        if (n !== r || e !== r) throw TypeError("Bad Promise constructor");n = t, e = i;
      }), this.resolve = i(n), this.reject = i(e);
    }var i = e(10);t.exports.f = function (t) {
      return new PromiseCapability(t);
    };
  }, function (t, n, e) {
    function packIEEE754(t, n, r) {
      var e,
          i,
          o,
          u = Array(r),
          c = 8 * r - n - 1,
          f = (1 << c) - 1,
          a = f >> 1,
          s = 23 === n ? I(2, -24) - I(2, -77) : 0,
          l = 0,
          h = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;for ((t = M(t)) != t || t === O ? (i = t != t ? 1 : 0, e = f) : (e = F(A(t) / k), t * (o = I(2, -e)) < 1 && (e--, o *= 2), (t += e + a >= 1 ? s / o : s * I(2, 1 - a)) * o >= 2 && (e++, o /= 2), e + a >= f ? (i = 0, e = f) : e + a >= 1 ? (i = (t * o - 1) * I(2, n), e += a) : (i = t * I(2, a - 1) * I(2, n), e = 0)); n >= 8; u[l++] = 255 & i, i /= 256, n -= 8) {}for (e = e << n | i, c += n; c > 0; u[l++] = 255 & e, e /= 256, c -= 8) {}return u[--l] |= 128 * h, u;
    }function unpackIEEE754(t, n, r) {
      var e,
          i = 8 * r - n - 1,
          o = (1 << i) - 1,
          u = o >> 1,
          c = i - 7,
          f = r - 1,
          a = t[f--],
          s = 127 & a;for (a >>= 7; c > 0; s = 256 * s + t[f], f--, c -= 8) {}for (e = s & (1 << -c) - 1, s >>= -c, c += n; c > 0; e = 256 * e + t[f], f--, c -= 8) {}if (0 === s) s = 1 - u;else {
        if (s === o) return e ? NaN : a ? -O : O;e += I(2, n), s -= u;
      }return (a ? -1 : 1) * e * I(2, s - n);
    }function unpackI32(t) {
      return t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0];
    }function packI8(t) {
      return [255 & t];
    }function packI16(t) {
      return [255 & t, t >> 8 & 255];
    }function packI32(t) {
      return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255];
    }function packF64(t) {
      return packIEEE754(t, 52, 8);
    }function packF32(t) {
      return packIEEE754(t, 23, 4);
    }function addGetter(t, n, r) {
      y(t[S], n, { get: function get() {
          return this[r];
        } });
    }function get(t, n, r, e) {
      var i = v(+r);if (i + n > t[j]) throw E(b);var o = t[N]._b,
          u = i + t[R],
          c = o.slice(u, u + n);return e ? c : c.reverse();
    }function set(t, n, r, e, i, o) {
      var u = v(+r);if (u + n > t[j]) throw E(b);for (var c = t[N]._b, f = u + t[R], a = e(+i), s = 0; s < n; s++) {
        c[f + s] = a[o ? s : n - s - 1];
      }
    }var i = e(2),
        o = e(6),
        u = e(33),
        c = e(59),
        f = e(12),
        a = e(41),
        s = e(3),
        l = e(39),
        h = e(23),
        p = e(8),
        v = e(116),
        g = e(37).f,
        y = e(7).f,
        d = e(83),
        _ = e(42),
        S = "prototype",
        b = "Wrong index!",
        m = i.ArrayBuffer,
        x = i.DataView,
        w = i.Math,
        E = i.RangeError,
        O = i.Infinity,
        P = m,
        M = w.abs,
        I = w.pow,
        F = w.floor,
        A = w.log,
        k = w.LN2,
        N = o ? "_b" : "buffer",
        j = o ? "_l" : "byteLength",
        R = o ? "_o" : "byteOffset";if (c.ABV) {
      if (!s(function () {
        m(1);
      }) || !s(function () {
        new m(-1);
      }) || s(function () {
        return new m(), new m(1.5), new m(NaN), "ArrayBuffer" != m.name;
      })) {
        for (var T, L = (m = function ArrayBuffer(t) {
          return l(this, m), new P(v(t));
        })[S] = P[S], D = g(P), W = 0; D.length > W;) {
          (T = D[W++]) in m || f(m, T, P[T]);
        }u || (L.constructor = m);
      }var C = new x(new m(2)),
          U = x[S].setInt8;C.setInt8(0, 2147483648), C.setInt8(1, 2147483649), !C.getInt8(0) && C.getInt8(1) || a(x[S], { setInt8: function setInt8(t, n) {
          U.call(this, t, n << 24 >> 24);
        }, setUint8: function setUint8(t, n) {
          U.call(this, t, n << 24 >> 24);
        } }, !0);
    } else m = function ArrayBuffer(t) {
      l(this, m, "ArrayBuffer");var n = v(t);this._b = d.call(Array(n), 0), this[j] = n;
    }, x = function DataView(t, n, e) {
      l(this, x, "DataView"), l(t, m, "DataView");var i = t[j],
          o = h(n);if (o < 0 || o > i) throw E("Wrong offset!");if (e = e === r ? i - o : p(e), o + e > i) throw E("Wrong length!");this[N] = t, this[R] = o, this[j] = e;
    }, o && (addGetter(m, "byteLength", "_l"), addGetter(x, "buffer", "_b"), addGetter(x, "byteLength", "_l"), addGetter(x, "byteOffset", "_o")), a(x[S], { getInt8: function getInt8(t) {
        return get(this, 1, t)[0] << 24 >> 24;
      }, getUint8: function getUint8(t) {
        return get(this, 1, t)[0];
      }, getInt16: function getInt16(t) {
        var n = get(this, 2, t, arguments[1]);return (n[1] << 8 | n[0]) << 16 >> 16;
      }, getUint16: function getUint16(t) {
        var n = get(this, 2, t, arguments[1]);return n[1] << 8 | n[0];
      }, getInt32: function getInt32(t) {
        return unpackI32(get(this, 4, t, arguments[1]));
      }, getUint32: function getUint32(t) {
        return unpackI32(get(this, 4, t, arguments[1])) >>> 0;
      }, getFloat32: function getFloat32(t) {
        return unpackIEEE754(get(this, 4, t, arguments[1]), 23, 4);
      }, getFloat64: function getFloat64(t) {
        return unpackIEEE754(get(this, 8, t, arguments[1]), 52, 8);
      }, setInt8: function setInt8(t, n) {
        set(this, 1, t, packI8, n);
      }, setUint8: function setUint8(t, n) {
        set(this, 1, t, packI8, n);
      }, setInt16: function setInt16(t, n) {
        set(this, 2, t, packI16, n, arguments[2]);
      }, setUint16: function setUint16(t, n) {
        set(this, 2, t, packI16, n, arguments[2]);
      }, setInt32: function setInt32(t, n) {
        set(this, 4, t, packI32, n, arguments[2]);
      }, setUint32: function setUint32(t, n) {
        set(this, 4, t, packI32, n, arguments[2]);
      }, setFloat32: function setFloat32(t, n) {
        set(this, 4, t, packF32, n, arguments[2]);
      }, setFloat64: function setFloat64(t, n) {
        set(this, 8, t, packF64, n, arguments[2]);
      } });_(m, "ArrayBuffer"), _(x, "DataView"), f(x[S], c.VIEW, !0), n.ArrayBuffer = m, n.DataView = x;
  }, function (t, n, r) {
    t.exports = !r(6) && !r(3)(function () {
      return 7 != Object.defineProperty(r(63)("div"), "a", { get: function get() {
          return 7;
        } }).a;
    });
  }, function (t, n, r) {
    n.f = r(5);
  }, function (t, n, r) {
    var e = r(11),
        i = r(15),
        o = r(50)(!1),
        u = r(65)("IE_PROTO");t.exports = function (t, n) {
      var r,
          c = i(t),
          f = 0,
          a = [];for (r in c) {
        r != u && e(c, r) && a.push(r);
      }for (; n.length > f;) {
        e(c, r = n[f++]) && (~o(a, r) || a.push(r));
      }return a;
    };
  }, function (t, n, r) {
    var e = r(7),
        i = r(1),
        o = r(34);t.exports = r(6) ? Object.defineProperties : function defineProperties(t, n) {
      i(t);for (var r, u = o(n), c = u.length, f = 0; c > f;) {
        e.f(t, r = u[f++], n[r]);
      }return t;
    };
  }, function (t, n, r) {
    var e = r(15),
        i = r(37).f,
        o = {}.toString,
        u = "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
        c = function c(t) {
      try {
        return i(t);
      } catch (n) {
        return u.slice();
      }
    };t.exports.f = function getOwnPropertyNames(t) {
      return u && "[object Window]" == o.call(t) ? c(t) : i(e(t));
    };
  }, function (t, n, r) {
    var e = r(34),
        i = r(51),
        o = r(47),
        u = r(9),
        c = r(46),
        f = Object.assign;t.exports = !f || r(3)(function () {
      var t = {},
          n = {},
          r = Symbol(),
          e = "abcdefghijklmnopqrst";return t[r] = 7, e.split("").forEach(function (t) {
        n[t] = t;
      }), 7 != f({}, t)[r] || Object.keys(f({}, n)).join("") != e;
    }) ? function assign(t, n) {
      for (var r = u(t), f = arguments.length, a = 1, s = i.f, l = o.f; f > a;) {
        for (var h, p = c(arguments[a++]), v = s ? e(p).concat(s(p)) : e(p), g = v.length, y = 0; g > y;) {
          l.call(p, h = v[y++]) && (r[h] = p[h]);
        }
      }return r;
    } : f;
  }, function (t, n, r) {
    var e = r(10),
        i = r(4),
        o = r(96),
        u = [].slice,
        c = {},
        f = function f(t, n, r) {
      if (!(n in c)) {
        for (var e = [], i = 0; i < n; i++) {
          e[i] = "a[" + i + "]";
        }c[n] = Function("F,a", "return new F(" + e.join(",") + ")");
      }return c[n](t, r);
    };t.exports = Function.bind || function bind(t) {
      var n = e(this),
          r = u.call(arguments, 1),
          c = function c() {
        var e = r.concat(u.call(arguments));return this instanceof c ? f(n, e.length, e) : o(n, e, t);
      };return i(n.prototype) && (c.prototype = n.prototype), c;
    };
  }, function (t, n) {
    t.exports = function (t, n, e) {
      var i = e === r;switch (n.length) {case 0:
          return i ? t() : t.call(e);case 1:
          return i ? t(n[0]) : t.call(e, n[0]);case 2:
          return i ? t(n[0], n[1]) : t.call(e, n[0], n[1]);case 3:
          return i ? t(n[0], n[1], n[2]) : t.call(e, n[0], n[1], n[2]);case 4:
          return i ? t(n[0], n[1], n[2], n[3]) : t.call(e, n[0], n[1], n[2], n[3]);}return t.apply(e, n);
    };
  }, function (t, n, r) {
    var e = r(19);t.exports = function (t, n) {
      if ("number" != typeof t && "Number" != e(t)) throw TypeError(n);return +t;
    };
  }, function (t, n, r) {
    var e = r(4),
        i = Math.floor;t.exports = function isInteger(t) {
      return !e(t) && isFinite(t) && i(t) === t;
    };
  }, function (t, n, r) {
    var e = r(2).parseFloat,
        i = r(43).trim;t.exports = 1 / e(r(70) + "-0") != -Infinity ? function parseFloat(t) {
      var n = i(String(t), 3),
          r = e(n);return 0 === r && "-" == n.charAt(0) ? -0 : r;
    } : e;
  }, function (t, n, r) {
    var e = r(2).parseInt,
        i = r(43).trim,
        o = r(70),
        u = /^[-+]?0[xX]/;t.exports = 8 !== e(o + "08") || 22 !== e(o + "0x16") ? function parseInt(t, n) {
      var r = i(String(t), 3);return e(r, n >>> 0 || (u.test(r) ? 16 : 10));
    } : e;
  }, function (t, n) {
    t.exports = Math.log1p || function log1p(t) {
      return (t = +t) > -1e-8 && t < 1e-8 ? t - t * t / 2 : Math.log(1 + t);
    };
  }, function (t, n, r) {
    var e = r(72),
        i = Math.pow,
        o = i(2, -52),
        u = i(2, -23),
        c = i(2, 127) * (2 - u),
        f = i(2, -126),
        a = function a(t) {
      return t + 1 / o - 1 / o;
    };t.exports = Math.fround || function fround(t) {
      var n,
          r,
          i = Math.abs(t),
          s = e(t);return i < f ? s * a(i / f / u) * f * u : (n = (1 + u / o) * i, (r = n - (n - i)) > c || r != r ? s * Infinity : s * r);
    };
  }, function (t, n, e) {
    var i = e(1);t.exports = function (t, n, e, o) {
      try {
        return o ? n(i(e)[0], e[1]) : n(e);
      } catch (c) {
        var u = t["return"];throw u !== r && i(u.call(t)), c;
      }
    };
  }, function (t, n, r) {
    var e = r(10),
        i = r(9),
        o = r(46),
        u = r(8);t.exports = function (t, n, r, c, f) {
      e(n);var a = i(t),
          s = o(a),
          l = u(a.length),
          h = f ? l - 1 : 0,
          p = f ? -1 : 1;if (r < 2) for (;;) {
        if (h in s) {
          c = s[h], h += p;break;
        }if (h += p, f ? h < 0 : l <= h) throw TypeError("Reduce of empty array with no initial value");
      }for (; f ? h >= 0 : l > h; h += p) {
        h in s && (c = n(c, s[h], h, a));
      }return c;
    };
  }, function (t, n, e) {
    var i = e(9),
        o = e(35),
        u = e(8);t.exports = [].copyWithin || function copyWithin(t, n) {
      var e = i(this),
          c = u(e.length),
          f = o(t, c),
          a = o(n, c),
          s = arguments.length > 2 ? arguments[2] : r,
          l = Math.min((s === r ? c : o(s, c)) - a, c - f),
          h = 1;for (a < f && f < a + l && (h = -1, a += l - 1, f += l - 1); l-- > 0;) {
        a in e ? e[f] = e[a] : delete e[f], f += h, a += h;
      }return e;
    };
  }, function (t, n) {
    t.exports = function (t, n) {
      return { value: n, done: !!t };
    };
  }, function (t, n, r) {
    r(6) && "g" != /./g.flags && r(7).f(RegExp.prototype, "flags", { configurable: !0, get: r(55) });
  }, function (t, n) {
    t.exports = function (t) {
      try {
        return { e: !1, v: t() };
      } catch (n) {
        return { e: !0, v: n };
      }
    };
  }, function (t, n, r) {
    var e = r(1),
        i = r(4),
        o = r(87);t.exports = function (t, n) {
      if (e(t), i(n) && n.constructor === t) return n;var r = o.f(t);return (0, r.resolve)(n), r.promise;
    };
  }, function (t, n, e) {
    var i = e(111),
        o = e(45);t.exports = e(58)("Map", function (t) {
      return function Map() {
        return t(this, arguments.length > 0 ? arguments[0] : r);
      };
    }, { get: function get(t) {
        var n = i.getEntry(o(this, "Map"), t);return n && n.v;
      }, set: function set(t, n) {
        return i.def(o(this, "Map"), 0 === t ? 0 : t, n);
      } }, i, !0);
  }, function (t, n, e) {
    var i = e(7).f,
        o = e(36),
        u = e(41),
        c = e(18),
        f = e(39),
        a = e(40),
        s = e(77),
        l = e(106),
        h = e(38),
        p = e(6),
        v = e(29).fastKey,
        g = e(45),
        y = p ? "_s" : "size",
        d = function d(t, n) {
      var r,
          e = v(n);if ("F" !== e) return t._i[e];for (r = t._f; r; r = r.n) {
        if (r.k == n) return r;
      }
    };t.exports = { getConstructor: function getConstructor(t, n, e, s) {
        var l = t(function (t, i) {
          f(t, l, n, "_i"), t._t = n, t._i = o(null), t._f = r, t._l = r, t[y] = 0, i != r && a(i, e, t[s], t);
        });return u(l.prototype, { clear: function clear() {
            for (var t = g(this, n), e = t._i, i = t._f; i; i = i.n) {
              i.r = !0, i.p && (i.p = i.p.n = r), delete e[i.i];
            }t._f = t._l = r, t[y] = 0;
          }, "delete": function _delete(t) {
            var r = g(this, n),
                e = d(r, t);if (e) {
              var i = e.n,
                  o = e.p;delete r._i[e.i], e.r = !0, o && (o.n = i), i && (i.p = o), r._f == e && (r._f = i), r._l == e && (r._l = o), r[y]--;
            }return !!e;
          }, forEach: function forEach(t) {
            g(this, n);for (var e, i = c(t, arguments.length > 1 ? arguments[1] : r, 3); e = e ? e.n : this._f;) {
              for (i(e.v, e.k, this); e && e.r;) {
                e = e.p;
              }
            }
          }, has: function has(t) {
            return !!d(g(this, n), t);
          } }), p && i(l.prototype, "size", { get: function get() {
            return g(this, n)[y];
          } }), l;
      }, def: function def(t, n, e) {
        var i,
            o,
            u = d(t, n);return u ? u.v = e : (t._l = u = { i: o = v(n, !0), k: n, v: e, p: i = t._l, n: r, r: !1 }, t._f || (t._f = u), i && (i.n = u), t[y]++, "F" !== o && (t._i[o] = u)), t;
      }, getEntry: d, setStrong: function setStrong(t, n, e) {
        s(t, n, function (t, e) {
          this._t = g(t, n), this._k = e, this._l = r;
        }, function () {
          for (var t = this, n = t._k, e = t._l; e && e.r;) {
            e = e.p;
          }return t._t && (t._l = e = e ? e.n : t._t._f) ? "keys" == n ? l(0, e.k) : "values" == n ? l(0, e.v) : l(0, [e.k, e.v]) : (t._t = r, l(1));
        }, e ? "entries" : "values", !e, !0), h(n);
      } };
  }, function (t, n, e) {
    var i = e(111),
        o = e(45);t.exports = e(58)("Set", function (t) {
      return function Set() {
        return t(this, arguments.length > 0 ? arguments[0] : r);
      };
    }, { add: function add(t) {
        return i.def(o(this, "Set"), t = 0 === t ? 0 : t, t);
      } }, i);
  }, function (t, n, e) {
    var i,
        o = e(25)(0),
        u = e(13),
        c = e(29),
        f = e(94),
        a = e(114),
        s = e(4),
        l = e(3),
        h = e(45),
        p = c.getWeak,
        v = Object.isExtensible,
        g = a.ufstore,
        y = {},
        d = function d(t) {
      return function WeakMap() {
        return t(this, arguments.length > 0 ? arguments[0] : r);
      };
    },
        _ = { get: function get(t) {
        if (s(t)) {
          var n = p(t);return !0 === n ? g(h(this, "WeakMap")).get(t) : n ? n[this._i] : r;
        }
      }, set: function set(t, n) {
        return a.def(h(this, "WeakMap"), t, n);
      } },
        S = t.exports = e(58)("WeakMap", d, _, a, !0, !0);l(function () {
      return 7 != new S().set((Object.freeze || Object)(y), 7).get(y);
    }) && (f((i = a.getConstructor(d, "WeakMap")).prototype, _), c.NEED = !0, o(["delete", "has", "get", "set"], function (t) {
      var n = S.prototype,
          r = n[t];u(n, t, function (n, e) {
        if (s(n) && !v(n)) {
          this._f || (this._f = new i());var o = this._f[t](n, e);return "set" == t ? this : o;
        }return r.call(this, n, e);
      });
    }));
  }, function (t, n, e) {
    var i = e(41),
        o = e(29).getWeak,
        u = e(1),
        c = e(4),
        f = e(39),
        a = e(40),
        s = e(25),
        l = e(11),
        h = e(45),
        p = s(5),
        v = s(6),
        g = 0,
        y = function y(t) {
      return t._l || (t._l = new d());
    },
        d = function d() {
      this.a = [];
    },
        _ = function _(t, n) {
      return p(t.a, function (t) {
        return t[0] === n;
      });
    };d.prototype = { get: function get(t) {
        var n = _(this, t);if (n) return n[1];
      }, has: function has(t) {
        return !!_(this, t);
      }, set: function set(t, n) {
        var r = _(this, t);r ? r[1] = n : this.a.push([t, n]);
      }, "delete": function _delete(t) {
        var n = v(this.a, function (n) {
          return n[0] === t;
        });return ~n && this.a.splice(n, 1), !!~n;
      } }, t.exports = { getConstructor: function getConstructor(t, n, e, u) {
        var s = t(function (t, i) {
          f(t, s, n, "_i"), t._t = n, t._i = g++, t._l = r, i != r && a(i, e, t[u], t);
        });return i(s.prototype, { "delete": function _delete(t) {
            if (!c(t)) return !1;var r = o(t);return !0 === r ? y(h(this, n))["delete"](t) : r && l(r, this._i) && delete r[this._i];
          }, has: function has(t) {
            if (!c(t)) return !1;var r = o(t);return !0 === r ? y(h(this, n)).has(t) : r && l(r, this._i);
          } }), s;
      }, def: function def(t, n, r) {
        var e = o(u(n), !0);return !0 === e ? y(t).set(n, r) : e[t._i] = r, t;
      }, ufstore: y };
  }, function (t, n, r) {
    var e = r(37),
        i = r(51),
        o = r(1),
        u = r(2).Reflect;t.exports = u && u.ownKeys || function ownKeys(t) {
      var n = e.f(o(t)),
          r = i.f;return r ? n.concat(r(t)) : n;
    };
  }, function (t, n, e) {
    var i = e(23),
        o = e(8);t.exports = function (t) {
      if (t === r) return 0;var n = i(t),
          e = o(n);if (n !== e) throw RangeError("Wrong length!");return e;
    };
  }, function (t, n, e) {
    function flattenIntoArray(t, n, e, a, s, l, h, p) {
      for (var v, g, y = s, d = 0, _ = !!h && c(h, p, 3); d < a;) {
        if (d in e) {
          if (v = _ ? _(e[d], d, n) : e[d], g = !1, o(v) && (g = (g = v[f]) !== r ? !!g : i(v)), g && l > 0) y = flattenIntoArray(t, n, v, u(v.length), y, l - 1) - 1;else {
            if (y >= 9007199254740991) throw TypeError();t[y] = v;
          }y++;
        }d++;
      }return y;
    }var i = e(52),
        o = e(4),
        u = e(8),
        c = e(18),
        f = e(5)("isConcatSpreadable");t.exports = flattenIntoArray;
  }, function (t, n, e) {
    var i = e(8),
        o = e(71),
        u = e(22);t.exports = function (t, n, e, c) {
      var f = String(u(t)),
          a = f.length,
          s = e === r ? " " : String(e),
          l = i(n);if (l <= a || "" == s) return f;var h = l - a,
          p = o.call(s, Math.ceil(h / s.length));return p.length > h && (p = p.slice(0, h)), c ? p + f : f + p;
    };
  }, function (t, n, r) {
    var e = r(34),
        i = r(15),
        o = r(47).f;t.exports = function (t) {
      return function (n) {
        for (var r, u = i(n), c = e(u), f = c.length, a = 0, s = []; f > a;) {
          o.call(u, r = c[a++]) && s.push(t ? [r, u[r]] : u[r]);
        }return s;
      };
    };
  }, function (t, n, r) {
    var e = r(48),
        i = r(121);t.exports = function (t) {
      return function toJSON() {
        if (e(this) != t) throw TypeError(t + "#toJSON isn't generic");return i(this);
      };
    };
  }, function (t, n, r) {
    var e = r(40);t.exports = function (t, n) {
      var r = [];return e(t, !1, r.push, r, n), r;
    };
  }, function (t, n) {
    t.exports = Math.scale || function scale(t, n, r, e, i) {
      return 0 === arguments.length || t != t || n != n || r != r || e != e || i != i ? NaN : t === Infinity || t === -Infinity ? t : (t - n) * (i - e) / (r - n) + e;
    };
  }, function (t, n, r) {
    r(124), r(126), r(127), r(128), r(129), r(130), r(131), r(132), r(133), r(134), r(135), r(136), r(137), r(138), r(139), r(140), r(142), r(143), r(144), r(145), r(146), r(147), r(148), r(149), r(150), r(151), r(152), r(153), r(154), r(155), r(156), r(157), r(158), r(159), r(160), r(161), r(162), r(163), r(164), r(165), r(166), r(167), r(168), r(169), r(170), r(171), r(172), r(173), r(174), r(175), r(176), r(177), r(178), r(179), r(180), r(181), r(182), r(183), r(184), r(185), r(186), r(187), r(188), r(189), r(190), r(191), r(192), r(193), r(194), r(195), r(196), r(197), r(198), r(199), r(200), r(201), r(202), r(203), r(204), r(205), r(206), r(208), r(209), r(210), r(211), r(212), r(213), r(214), r(215), r(216), r(217), r(218), r(219), r(84), r(220), r(221), r(222), r(107), r(223), r(224), r(225), r(226), r(227), r(110), r(112), r(113), r(228), r(229), r(230), r(231), r(232), r(233), r(234), r(235), r(236), r(237), r(238), r(239), r(240), r(241), r(242), r(243), r(244), r(245), r(247), r(248), r(250), r(251), r(252), r(253), r(254), r(255), r(256), r(257), r(258), r(259), r(260), r(261), r(262), r(263), r(264), r(265), r(266), r(267), r(268), r(269), r(270), r(271), r(272), r(273), r(274), r(275), r(276), r(277), r(278), r(279), r(280), r(281), r(282), r(283), r(284), r(285), r(286), r(287), r(288), r(289), r(290), r(291), r(292), r(293), r(294), r(295), r(296), r(297), r(298), r(299), r(300), r(301), r(302), r(303), r(304), r(305), r(306), r(307), r(308), r(309), r(310), r(311), r(312), r(313), r(314), r(315), r(316), r(317), r(318), t.exports = r(319);
  }, function (t, n, e) {
    var i = e(2),
        o = e(11),
        u = e(6),
        c = e(0),
        f = e(13),
        a = e(29).KEY,
        s = e(3),
        l = e(49),
        h = e(42),
        p = e(32),
        v = e(5),
        g = e(90),
        y = e(64),
        d = e(125),
        _ = e(52),
        S = e(1),
        b = e(15),
        m = e(21),
        x = e(31),
        w = e(36),
        E = e(93),
        O = e(16),
        P = e(7),
        M = e(34),
        I = O.f,
        F = P.f,
        A = E.f,
        k = i.Symbol,
        N = i.JSON,
        j = N && N.stringify,
        R = v("_hidden"),
        T = v("toPrimitive"),
        L = {}.propertyIsEnumerable,
        D = l("symbol-registry"),
        W = l("symbols"),
        C = l("op-symbols"),
        U = Object.prototype,
        G = "function" == typeof k,
        B = i.QObject,
        V = !B || !B.prototype || !B.prototype.findChild,
        z = u && s(function () {
      return 7 != w(F({}, "a", { get: function get() {
          return F(this, "a", { value: 7 }).a;
        } })).a;
    }) ? function (t, n, r) {
      var e = I(U, n);e && delete U[n], F(t, n, r), e && t !== U && F(U, n, e);
    } : F,
        q = function q(t) {
      var n = W[t] = w(k.prototype);return n._k = t, n;
    },
        K = G && "symbol" == _typeof(k.iterator) ? function (t) {
      return "symbol" == (typeof t === "undefined" ? "undefined" : _typeof(t));
    } : function (t) {
      return t instanceof k;
    },
        J = function defineProperty(t, n, r) {
      return t === U && J(C, n, r), S(t), n = m(n, !0), S(r), o(W, n) ? (r.enumerable ? (o(t, R) && t[R][n] && (t[R][n] = !1), r = w(r, { enumerable: x(0, !1) })) : (o(t, R) || F(t, R, x(1, {})), t[R][n] = !0), z(t, n, r)) : F(t, n, r);
    },
        Y = function defineProperties(t, n) {
      S(t);for (var r, e = d(n = b(n)), i = 0, o = e.length; o > i;) {
        J(t, r = e[i++], n[r]);
      }return t;
    },
        H = function propertyIsEnumerable(t) {
      var n = L.call(this, t = m(t, !0));return !(this === U && o(W, t) && !o(C, t)) && (!(n || !o(this, t) || !o(W, t) || o(this, R) && this[R][t]) || n);
    },
        X = function getOwnPropertyDescriptor(t, n) {
      if (t = b(t), n = m(n, !0), t !== U || !o(W, n) || o(C, n)) {
        var r = I(t, n);return !r || !o(W, n) || o(t, R) && t[R][n] || (r.enumerable = !0), r;
      }
    },
        Z = function getOwnPropertyNames(t) {
      for (var n, r = A(b(t)), e = [], i = 0; r.length > i;) {
        o(W, n = r[i++]) || n == R || n == a || e.push(n);
      }return e;
    },
        $ = function getOwnPropertySymbols(t) {
      for (var n, r = t === U, e = A(r ? C : b(t)), i = [], u = 0; e.length > u;) {
        !o(W, n = e[u++]) || r && !o(U, n) || i.push(W[n]);
      }return i;
    };G || (f((k = function _Symbol() {
      if (this instanceof k) throw TypeError("Symbol is not a constructor!");var t = p(arguments.length > 0 ? arguments[0] : r),
          n = function n(r) {
        this === U && n.call(C, r), o(this, R) && o(this[R], t) && (this[R][t] = !1), z(this, t, x(1, r));
      };return u && V && z(U, t, { configurable: !0, set: n }), q(t);
    }).prototype, "toString", function toString() {
      return this._k;
    }), O.f = X, P.f = J, e(37).f = E.f = Z, e(47).f = H, e(51).f = $, u && !e(33) && f(U, "propertyIsEnumerable", H, !0), g.f = function (t) {
      return q(v(t));
    }), c(c.G + c.W + c.F * !G, { Symbol: k });for (var Q = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), tt = 0; Q.length > tt;) {
      v(Q[tt++]);
    }for (var nt = M(v.store), rt = 0; nt.length > rt;) {
      y(nt[rt++]);
    }c(c.S + c.F * !G, "Symbol", { "for": function _for(t) {
        return o(D, t += "") ? D[t] : D[t] = k(t);
      }, keyFor: function keyFor(t) {
        if (!K(t)) throw TypeError(t + " is not a symbol!");for (var n in D) {
          if (D[n] === t) return n;
        }
      }, useSetter: function useSetter() {
        V = !0;
      }, useSimple: function useSimple() {
        V = !1;
      } }), c(c.S + c.F * !G, "Object", { create: function create(t, n) {
        return n === r ? w(t) : Y(w(t), n);
      }, defineProperty: J, defineProperties: Y, getOwnPropertyDescriptor: X, getOwnPropertyNames: Z, getOwnPropertySymbols: $ }), N && c(c.S + c.F * (!G || s(function () {
      var t = k();return "[null]" != j([t]) || "{}" != j({ a: t }) || "{}" != j(Object(t));
    })), "JSON", { stringify: function stringify(t) {
        if (t !== r && !K(t)) {
          for (var n, e, i = [t], o = 1; arguments.length > o;) {
            i.push(arguments[o++]);
          }return "function" == typeof (n = i[1]) && (e = n), !e && _(n) || (n = function n(t, _n) {
            if (e && (_n = e.call(this, t, _n)), !K(_n)) return _n;
          }), i[1] = n, j.apply(N, i);
        }
      } }), k.prototype[T] || e(12)(k.prototype, T, k.prototype.valueOf), h(k, "Symbol"), h(Math, "Math", !0), h(i.JSON, "JSON", !0);
  }, function (t, n, r) {
    var e = r(34),
        i = r(51),
        o = r(47);t.exports = function (t) {
      var n = e(t),
          r = i.f;if (r) for (var u, c = r(t), f = o.f, a = 0; c.length > a;) {
        f.call(t, u = c[a++]) && n.push(u);
      }return n;
    };
  }, function (t, n, r) {
    var e = r(0);e(e.S + e.F * !r(6), "Object", { defineProperty: r(7).f });
  }, function (t, n, r) {
    var e = r(0);e(e.S + e.F * !r(6), "Object", { defineProperties: r(92) });
  }, function (t, n, r) {
    var e = r(15),
        i = r(16).f;r(24)("getOwnPropertyDescriptor", function () {
      return function getOwnPropertyDescriptor(t, n) {
        return i(e(t), n);
      };
    });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Object", { create: r(36) });
  }, function (t, n, r) {
    var e = r(9),
        i = r(17);r(24)("getPrototypeOf", function () {
      return function getPrototypeOf(t) {
        return i(e(t));
      };
    });
  }, function (t, n, r) {
    var e = r(9),
        i = r(34);r(24)("keys", function () {
      return function keys(t) {
        return i(e(t));
      };
    });
  }, function (t, n, r) {
    r(24)("getOwnPropertyNames", function () {
      return r(93).f;
    });
  }, function (t, n, r) {
    var e = r(4),
        i = r(29).onFreeze;r(24)("freeze", function (t) {
      return function freeze(n) {
        return t && e(n) ? t(i(n)) : n;
      };
    });
  }, function (t, n, r) {
    var e = r(4),
        i = r(29).onFreeze;r(24)("seal", function (t) {
      return function seal(n) {
        return t && e(n) ? t(i(n)) : n;
      };
    });
  }, function (t, n, r) {
    var e = r(4),
        i = r(29).onFreeze;r(24)("preventExtensions", function (t) {
      return function preventExtensions(n) {
        return t && e(n) ? t(i(n)) : n;
      };
    });
  }, function (t, n, r) {
    var e = r(4);r(24)("isFrozen", function (t) {
      return function isFrozen(n) {
        return !e(n) || !!t && t(n);
      };
    });
  }, function (t, n, r) {
    var e = r(4);r(24)("isSealed", function (t) {
      return function isSealed(n) {
        return !e(n) || !!t && t(n);
      };
    });
  }, function (t, n, r) {
    var e = r(4);r(24)("isExtensible", function (t) {
      return function isExtensible(n) {
        return !!e(n) && (!t || t(n));
      };
    });
  }, function (t, n, r) {
    var e = r(0);e(e.S + e.F, "Object", { assign: r(94) });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Object", { is: r(141) });
  }, function (t, n) {
    t.exports = Object.is || function is(t, n) {
      return t === n ? 0 !== t || 1 / t == 1 / n : t != t && n != n;
    };
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Object", { setPrototypeOf: r(68).set });
  }, function (t, n, r) {
    var e = r(48),
        i = {};i[r(5)("toStringTag")] = "z", i + "" != "[object z]" && r(13)(Object.prototype, "toString", function toString() {
      return "[object " + e(this) + "]";
    }, !0);
  }, function (t, n, r) {
    var e = r(0);e(e.P, "Function", { bind: r(95) });
  }, function (t, n, r) {
    var e = r(7).f,
        i = Function.prototype,
        o = /^\s*function ([^ (]*)/;"name" in i || r(6) && e(i, "name", { configurable: !0, get: function get() {
        try {
          return ("" + this).match(o)[1];
        } catch (t) {
          return "";
        }
      } });
  }, function (t, n, r) {
    var e = r(4),
        i = r(17),
        o = r(5)("hasInstance"),
        u = Function.prototype;o in u || r(7).f(u, o, { value: function value(t) {
        if ("function" != typeof this || !e(t)) return !1;if (!e(this.prototype)) return t instanceof this;for (; t = i(t);) {
          if (this.prototype === t) return !0;
        }return !1;
      } });
  }, function (t, n, r) {
    var e = r(2),
        i = r(11),
        o = r(19),
        u = r(69),
        c = r(21),
        f = r(3),
        a = r(37).f,
        s = r(16).f,
        l = r(7).f,
        h = r(43).trim,
        p = e.Number,
        v = p,
        g = p.prototype,
        y = "Number" == o(r(36)(g)),
        d = "trim" in String.prototype,
        _ = function _(t) {
      var n = c(t, !1);if ("string" == typeof n && n.length > 2) {
        var r,
            e,
            i,
            o = (n = d ? n.trim() : h(n, 3)).charCodeAt(0);if (43 === o || 45 === o) {
          if (88 === (r = n.charCodeAt(2)) || 120 === r) return NaN;
        } else if (48 === o) {
          switch (n.charCodeAt(1)) {case 66:case 98:
              e = 2, i = 49;break;case 79:case 111:
              e = 8, i = 55;break;default:
              return +n;}for (var u, f = n.slice(2), a = 0, s = f.length; a < s; a++) {
            if ((u = f.charCodeAt(a)) < 48 || u > i) return NaN;
          }return parseInt(f, e);
        }
      }return +n;
    };if (!p(" 0o1") || !p("0b1") || p("+0x1")) {
      p = function Number(t) {
        var n = arguments.length < 1 ? 0 : t,
            r = this;return r instanceof p && (y ? f(function () {
          g.valueOf.call(r);
        }) : "Number" != o(r)) ? u(new v(_(n)), r, p) : _(n);
      };for (var S, b = r(6) ? a(v) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","), m = 0; b.length > m; m++) {
        i(v, S = b[m]) && !i(p, S) && l(p, S, s(v, S));
      }p.prototype = g, g.constructor = p, r(13)(e, "Number", p);
    }
  }, function (t, n, r) {
    var e = r(0),
        i = r(23),
        o = r(97),
        u = r(71),
        c = 1..toFixed,
        f = Math.floor,
        a = [0, 0, 0, 0, 0, 0],
        s = "Number.toFixed: incorrect invocation!",
        l = function l(t, n) {
      for (var r = -1, e = n; ++r < 6;) {
        e += t * a[r], a[r] = e % 1e7, e = f(e / 1e7);
      }
    },
        h = function h(t) {
      for (var n = 6, r = 0; --n >= 0;) {
        r += a[n], a[n] = f(r / t), r = r % t * 1e7;
      }
    },
        p = function p() {
      for (var t = 6, n = ""; --t >= 0;) {
        if ("" !== n || 0 === t || 0 !== a[t]) {
          var r = String(a[t]);n = "" === n ? r : n + u.call("0", 7 - r.length) + r;
        }
      }return n;
    },
        v = function v(t, n, r) {
      return 0 === n ? r : n % 2 == 1 ? v(t, n - 1, r * t) : v(t * t, n / 2, r);
    },
        g = function g(t) {
      for (var n = 0, r = t; r >= 4096;) {
        n += 12, r /= 4096;
      }for (; r >= 2;) {
        n += 1, r /= 2;
      }return n;
    };e(e.P + e.F * (!!c && ("0.000" !== 8e-5.toFixed(3) || "1" !== .9.toFixed(0) || "1.25" !== 1.255.toFixed(2) || "1000000000000000128" !== 0xde0b6b3a7640080.toFixed(0)) || !r(3)(function () {
      c.call({});
    })), "Number", { toFixed: function toFixed(t) {
        var n,
            r,
            e,
            c,
            f = o(this, s),
            a = i(t),
            y = "",
            d = "0";if (a < 0 || a > 20) throw RangeError(s);if (f != f) return "NaN";if (f <= -1e21 || f >= 1e21) return String(f);if (f < 0 && (y = "-", f = -f), f > 1e-21) if (n = g(f * v(2, 69, 1)) - 69, r = n < 0 ? f * v(2, -n, 1) : f / v(2, n, 1), r *= 4503599627370496, (n = 52 - n) > 0) {
          for (l(0, r), e = a; e >= 7;) {
            l(1e7, 0), e -= 7;
          }for (l(v(10, e, 1), 0), e = n - 1; e >= 23;) {
            h(1 << 23), e -= 23;
          }h(1 << e), l(1, 1), h(2), d = p();
        } else l(0, r), l(1 << -n, 0), d = p() + u.call("0", a);return d = a > 0 ? y + ((c = d.length) <= a ? "0." + u.call("0", a - c) + d : d.slice(0, c - a) + "." + d.slice(c - a)) : y + d;
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(3),
        u = e(97),
        c = 1..toPrecision;i(i.P + i.F * (o(function () {
      return "1" !== c.call(1, r);
    }) || !o(function () {
      c.call({});
    })), "Number", { toPrecision: function toPrecision(t) {
        var n = u(this, "Number#toPrecision: incorrect invocation!");return t === r ? c.call(n) : c.call(n, t);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Number", { EPSILON: Math.pow(2, -52) });
  }, function (t, n, r) {
    var e = r(0),
        i = r(2).isFinite;e(e.S, "Number", { isFinite: function isFinite(t) {
        return "number" == typeof t && i(t);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Number", { isInteger: r(98) });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Number", { isNaN: function isNaN(t) {
        return t != t;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(98),
        o = Math.abs;e(e.S, "Number", { isSafeInteger: function isSafeInteger(t) {
        return i(t) && o(t) <= 9007199254740991;
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Number", { MAX_SAFE_INTEGER: 9007199254740991 });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Number", { MIN_SAFE_INTEGER: -9007199254740991 });
  }, function (t, n, r) {
    var e = r(0),
        i = r(99);e(e.S + e.F * (Number.parseFloat != i), "Number", { parseFloat: i });
  }, function (t, n, r) {
    var e = r(0),
        i = r(100);e(e.S + e.F * (Number.parseInt != i), "Number", { parseInt: i });
  }, function (t, n, r) {
    var e = r(0),
        i = r(100);e(e.G + e.F * (parseInt != i), { parseInt: i });
  }, function (t, n, r) {
    var e = r(0),
        i = r(99);e(e.G + e.F * (parseFloat != i), { parseFloat: i });
  }, function (t, n, r) {
    var e = r(0),
        i = r(101),
        o = Math.sqrt,
        u = Math.acosh;e(e.S + e.F * !(u && 710 == Math.floor(u(Number.MAX_VALUE)) && u(Infinity) == Infinity), "Math", { acosh: function acosh(t) {
        return (t = +t) < 1 ? NaN : t > 94906265.62425156 ? Math.log(t) + Math.LN2 : i(t - 1 + o(t - 1) * o(t + 1));
      } });
  }, function (t, n, r) {
    function asinh(t) {
      return isFinite(t = +t) && 0 != t ? t < 0 ? -asinh(-t) : Math.log(t + Math.sqrt(t * t + 1)) : t;
    }var e = r(0),
        i = Math.asinh;e(e.S + e.F * !(i && 1 / i(0) > 0), "Math", { asinh: asinh });
  }, function (t, n, r) {
    var e = r(0),
        i = Math.atanh;e(e.S + e.F * !(i && 1 / i(-0) < 0), "Math", { atanh: function atanh(t) {
        return 0 == (t = +t) ? t : Math.log((1 + t) / (1 - t)) / 2;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(72);e(e.S, "Math", { cbrt: function cbrt(t) {
        return i(t = +t) * Math.pow(Math.abs(t), 1 / 3);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { clz32: function clz32(t) {
        return (t >>>= 0) ? 31 - Math.floor(Math.log(t + .5) * Math.LOG2E) : 32;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = Math.exp;e(e.S, "Math", { cosh: function cosh(t) {
        return (i(t = +t) + i(-t)) / 2;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(73);e(e.S + e.F * (i != Math.expm1), "Math", { expm1: i });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { fround: r(102) });
  }, function (t, n, r) {
    var e = r(0),
        i = Math.abs;e(e.S, "Math", { hypot: function hypot(t, n) {
        for (var r, e, o = 0, u = 0, c = arguments.length, f = 0; u < c;) {
          f < (r = i(arguments[u++])) ? (o = o * (e = f / r) * e + 1, f = r) : o += r > 0 ? (e = r / f) * e : r;
        }return f === Infinity ? Infinity : f * Math.sqrt(o);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = Math.imul;e(e.S + e.F * r(3)(function () {
      return -5 != i(4294967295, 5) || 2 != i.length;
    }), "Math", { imul: function imul(t, n) {
        var r = +t,
            e = +n,
            i = 65535 & r,
            o = 65535 & e;return 0 | i * o + ((65535 & r >>> 16) * o + i * (65535 & e >>> 16) << 16 >>> 0);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { log10: function log10(t) {
        return Math.log(t) * Math.LOG10E;
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { log1p: r(101) });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { log2: function log2(t) {
        return Math.log(t) / Math.LN2;
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { sign: r(72) });
  }, function (t, n, r) {
    var e = r(0),
        i = r(73),
        o = Math.exp;e(e.S + e.F * r(3)(function () {
      return -2e-17 != !Math.sinh(-2e-17);
    }), "Math", { sinh: function sinh(t) {
        return Math.abs(t = +t) < 1 ? (i(t) - i(-t)) / 2 : (o(t - 1) - o(-t - 1)) * (Math.E / 2);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(73),
        o = Math.exp;e(e.S, "Math", { tanh: function tanh(t) {
        var n = i(t = +t),
            r = i(-t);return n == Infinity ? 1 : r == Infinity ? -1 : (n - r) / (o(t) + o(-t));
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { trunc: function trunc(t) {
        return (t > 0 ? Math.floor : Math.ceil)(t);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(35),
        o = String.fromCharCode,
        u = String.fromCodePoint;e(e.S + e.F * (!!u && 1 != u.length), "String", { fromCodePoint: function fromCodePoint(t) {
        for (var n, r = [], e = arguments.length, u = 0; e > u;) {
          if (n = +arguments[u++], i(n, 1114111) !== n) throw RangeError(n + " is not a valid code point");r.push(n < 65536 ? o(n) : o(55296 + ((n -= 65536) >> 10), n % 1024 + 56320));
        }return r.join("");
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(15),
        o = r(8);e(e.S, "String", { raw: function raw(t) {
        for (var n = i(t.raw), r = o(n.length), e = arguments.length, u = [], c = 0; r > c;) {
          u.push(String(n[c++])), c < e && u.push(String(arguments[c]));
        }return u.join("");
      } });
  }, function (t, n, r) {
    r(43)("trim", function (t) {
      return function trim() {
        return t(this, 3);
      };
    });
  }, function (t, n, r) {
    var e = r(0),
        i = r(74)(!1);e(e.P, "String", { codePointAt: function codePointAt(t) {
        return i(this, t);
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(8),
        u = e(75),
        c = "".endsWith;i(i.P + i.F * e(76)("endsWith"), "String", { endsWith: function endsWith(t) {
        var n = u(this, t, "endsWith"),
            e = arguments.length > 1 ? arguments[1] : r,
            i = o(n.length),
            f = e === r ? i : Math.min(o(e), i),
            a = String(t);return c ? c.call(n, a, f) : n.slice(f - a.length, f) === a;
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(75);i(i.P + i.F * e(76)("includes"), "String", { includes: function includes(t) {
        return !!~o(this, t, "includes").indexOf(t, arguments.length > 1 ? arguments[1] : r);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.P, "String", { repeat: r(71) });
  }, function (t, n, e) {
    var i = e(0),
        o = e(8),
        u = e(75),
        c = "".startsWith;i(i.P + i.F * e(76)("startsWith"), "String", { startsWith: function startsWith(t) {
        var n = u(this, t, "startsWith"),
            e = o(Math.min(arguments.length > 1 ? arguments[1] : r, n.length)),
            i = String(t);return c ? c.call(n, i, e) : n.slice(e, e + i.length) === i;
      } });
  }, function (t, n, e) {
    var i = e(74)(!0);e(77)(String, "String", function (t) {
      this._t = String(t), this._i = 0;
    }, function () {
      var t,
          n = this._t,
          e = this._i;return e >= n.length ? { value: r, done: !0 } : (t = i(n, e), this._i += t.length, { value: t, done: !1 });
    });
  }, function (t, n, r) {
    r(14)("anchor", function (t) {
      return function anchor(n) {
        return t(this, "a", "name", n);
      };
    });
  }, function (t, n, r) {
    r(14)("big", function (t) {
      return function big() {
        return t(this, "big", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("blink", function (t) {
      return function blink() {
        return t(this, "blink", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("bold", function (t) {
      return function bold() {
        return t(this, "b", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("fixed", function (t) {
      return function fixed() {
        return t(this, "tt", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("fontcolor", function (t) {
      return function fontcolor(n) {
        return t(this, "font", "color", n);
      };
    });
  }, function (t, n, r) {
    r(14)("fontsize", function (t) {
      return function fontsize(n) {
        return t(this, "font", "size", n);
      };
    });
  }, function (t, n, r) {
    r(14)("italics", function (t) {
      return function italics() {
        return t(this, "i", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("link", function (t) {
      return function link(n) {
        return t(this, "a", "href", n);
      };
    });
  }, function (t, n, r) {
    r(14)("small", function (t) {
      return function small() {
        return t(this, "small", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("strike", function (t) {
      return function strike() {
        return t(this, "strike", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("sub", function (t) {
      return function sub() {
        return t(this, "sub", "", "");
      };
    });
  }, function (t, n, r) {
    r(14)("sup", function (t) {
      return function sup() {
        return t(this, "sup", "", "");
      };
    });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Array", { isArray: r(52) });
  }, function (t, n, e) {
    var i = e(18),
        o = e(0),
        u = e(9),
        c = e(103),
        f = e(79),
        a = e(8),
        s = e(80),
        l = e(81);o(o.S + o.F * !e(54)(function (t) {
      Array.from(t);
    }), "Array", { from: function from(t) {
        var n,
            e,
            o,
            h,
            p = u(t),
            v = "function" == typeof this ? this : Array,
            g = arguments.length,
            y = g > 1 ? arguments[1] : r,
            d = y !== r,
            _ = 0,
            S = l(p);if (d && (y = i(y, g > 2 ? arguments[2] : r, 2)), S == r || v == Array && f(S)) for (e = new v(n = a(p.length)); n > _; _++) {
          s(e, _, d ? y(p[_], _) : p[_]);
        } else for (h = S.call(p), e = new v(); !(o = h.next()).done; _++) {
          s(e, _, d ? c(h, y, [o.value, _], !0) : o.value);
        }return e.length = _, e;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(80);e(e.S + e.F * r(3)(function () {
      function F() {}return !(Array.of.call(F) instanceof F);
    }), "Array", { of: function of() {
        for (var t = 0, n = arguments.length, r = new ("function" == typeof this ? this : Array)(n); n > t;) {
          i(r, t, arguments[t++]);
        }return r.length = n, r;
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(15),
        u = [].join;i(i.P + i.F * (e(46) != Object || !e(20)(u)), "Array", { join: function join(t) {
        return u.call(o(this), t === r ? "," : t);
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(67),
        u = e(19),
        c = e(35),
        f = e(8),
        a = [].slice;i(i.P + i.F * e(3)(function () {
      o && a.call(o);
    }), "Array", { slice: function slice(t, n) {
        var e = f(this.length),
            i = u(this);if (n = n === r ? e : n, "Array" == i) return a.call(this, t, n);for (var o = c(t, e), s = c(n, e), l = f(s - o), h = Array(l), p = 0; p < l; p++) {
          h[p] = "String" == i ? this.charAt(o + p) : this[o + p];
        }return h;
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(10),
        u = e(9),
        c = e(3),
        f = [].sort,
        a = [1, 2, 3];i(i.P + i.F * (c(function () {
      a.sort(r);
    }) || !c(function () {
      a.sort(null);
    }) || !e(20)(f)), "Array", { sort: function sort(t) {
        return t === r ? f.call(u(this)) : f.call(u(this), o(t));
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(25)(0),
        o = r(20)([].forEach, !0);e(e.P + e.F * !o, "Array", { forEach: function forEach(t) {
        return i(this, t, arguments[1]);
      } });
  }, function (t, n, e) {
    var i = e(4),
        o = e(52),
        u = e(5)("species");t.exports = function (t) {
      var n;return o(t) && ("function" != typeof (n = t.constructor) || n !== Array && !o(n.prototype) || (n = r), i(n) && null === (n = n[u]) && (n = r)), n === r ? Array : n;
    };
  }, function (t, n, r) {
    var e = r(0),
        i = r(25)(1);e(e.P + e.F * !r(20)([].map, !0), "Array", { map: function map(t) {
        return i(this, t, arguments[1]);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(25)(2);e(e.P + e.F * !r(20)([].filter, !0), "Array", { filter: function filter(t) {
        return i(this, t, arguments[1]);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(25)(3);e(e.P + e.F * !r(20)([].some, !0), "Array", { some: function some(t) {
        return i(this, t, arguments[1]);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(25)(4);e(e.P + e.F * !r(20)([].every, !0), "Array", { every: function every(t) {
        return i(this, t, arguments[1]);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(104);e(e.P + e.F * !r(20)([].reduce, !0), "Array", { reduce: function reduce(t) {
        return i(this, t, arguments.length, arguments[1], !1);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(104);e(e.P + e.F * !r(20)([].reduceRight, !0), "Array", { reduceRight: function reduceRight(t) {
        return i(this, t, arguments.length, arguments[1], !0);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(50)(!1),
        o = [].indexOf,
        u = !!o && 1 / [1].indexOf(1, -0) < 0;e(e.P + e.F * (u || !r(20)(o)), "Array", { indexOf: function indexOf(t) {
        return u ? o.apply(this, arguments) || 0 : i(this, t, arguments[1]);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(15),
        o = r(23),
        u = r(8),
        c = [].lastIndexOf,
        f = !!c && 1 / [1].lastIndexOf(1, -0) < 0;e(e.P + e.F * (f || !r(20)(c)), "Array", { lastIndexOf: function lastIndexOf(t) {
        if (f) return c.apply(this, arguments) || 0;var n = i(this),
            r = u(n.length),
            e = r - 1;for (arguments.length > 1 && (e = Math.min(e, o(arguments[1]))), e < 0 && (e = r + e); e >= 0; e--) {
          if (e in n && n[e] === t) return e || 0;
        }return -1;
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.P, "Array", { copyWithin: r(105) }), r(30)("copyWithin");
  }, function (t, n, r) {
    var e = r(0);e(e.P, "Array", { fill: r(83) }), r(30)("fill");
  }, function (t, n, e) {
    var i = e(0),
        o = e(25)(5),
        u = !0;"find" in [] && Array(1).find(function () {
      u = !1;
    }), i(i.P + i.F * u, "Array", { find: function find(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : r);
      } }), e(30)("find");
  }, function (t, n, e) {
    var i = e(0),
        o = e(25)(6),
        u = "findIndex",
        c = !0;u in [] && Array(1)[u](function () {
      c = !1;
    }), i(i.P + i.F * c, "Array", { findIndex: function findIndex(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : r);
      } }), e(30)(u);
  }, function (t, n, r) {
    r(38)("Array");
  }, function (t, n, e) {
    var i = e(2),
        o = e(69),
        u = e(7).f,
        c = e(37).f,
        f = e(53),
        a = e(55),
        s = i.RegExp,
        l = s,
        h = s.prototype,
        p = /a/g,
        v = /a/g,
        g = new s(p) !== p;if (e(6) && (!g || e(3)(function () {
      return v[e(5)("match")] = !1, s(p) != p || s(v) == v || "/a/i" != s(p, "i");
    }))) {
      s = function RegExp(t, n) {
        var e = this instanceof s,
            i = f(t),
            u = n === r;return !e && i && t.constructor === s && u ? t : o(g ? new l(i && !u ? t.source : t, n) : l((i = t instanceof s) ? t.source : t, i && u ? a.call(t) : n), e ? this : h, s);
      };for (var y = c(l), d = 0; y.length > d;) {
        !function (t) {
          t in s || u(s, t, { configurable: !0, get: function get() {
              return l[t];
            }, set: function set(n) {
              l[t] = n;
            } });
        }(y[d++]);
      }h.constructor = s, s.prototype = h, e(13)(i, "RegExp", s);
    }e(38)("RegExp");
  }, function (t, n, e) {
    e(107);var i = e(1),
        o = e(55),
        u = e(6),
        c = /./.toString,
        f = function f(t) {
      e(13)(RegExp.prototype, "toString", t, !0);
    };e(3)(function () {
      return "/a/b" != c.call({ source: "a", flags: "b" });
    }) ? f(function toString() {
      var t = i(this);return "/".concat(t.source, "/", "flags" in t ? t.flags : !u && t instanceof RegExp ? o.call(t) : r);
    }) : "toString" != c.name && f(function toString() {
      return c.call(this);
    });
  }, function (t, n, e) {
    e(56)("match", 1, function (t, n, e) {
      return [function match(e) {
        var i = t(this),
            o = e == r ? r : e[n];return o !== r ? o.call(e, i) : new RegExp(e)[n](String(i));
      }, e];
    });
  }, function (t, n, e) {
    e(56)("replace", 2, function (t, n, e) {
      return [function replace(i, o) {
        var u = t(this),
            c = i == r ? r : i[n];return c !== r ? c.call(i, u, o) : e.call(String(u), i, o);
      }, e];
    });
  }, function (t, n, e) {
    e(56)("search", 1, function (t, n, e) {
      return [function search(e) {
        var i = t(this),
            o = e == r ? r : e[n];return o !== r ? o.call(e, i) : new RegExp(e)[n](String(i));
      }, e];
    });
  }, function (t, n, e) {
    e(56)("split", 2, function (t, n, i) {
      var o = e(53),
          u = i,
          c = [].push,
          f = "length";if ("c" == "abbc".split(/(b)*/)[1] || 4 != "test".split(/(?:)/, -1)[f] || 2 != "ab".split(/(?:ab)*/)[f] || 4 != ".".split(/(.?)(.?)/)[f] || ".".split(/()()/)[f] > 1 || "".split(/.?/)[f]) {
        var a = /()??/.exec("")[1] === r;i = function i(t, n) {
          var e = String(this);if (t === r && 0 === n) return [];if (!o(t)) return u.call(e, t, n);var i,
              s,
              l,
              h,
              p,
              v = [],
              g = (t.ignoreCase ? "i" : "") + (t.multiline ? "m" : "") + (t.unicode ? "u" : "") + (t.sticky ? "y" : ""),
              y = 0,
              d = n === r ? 4294967295 : n >>> 0,
              _ = new RegExp(t.source, g + "g");for (a || (i = new RegExp("^" + _.source + "$(?!\\s)", g)); (s = _.exec(e)) && !((l = s.index + s[0][f]) > y && (v.push(e.slice(y, s.index)), !a && s[f] > 1 && s[0].replace(i, function () {
            for (p = 1; p < arguments[f] - 2; p++) {
              arguments[p] === r && (s[p] = r);
            }
          }), s[f] > 1 && s.index < e[f] && c.apply(v, s.slice(1)), h = s[0][f], y = l, v[f] >= d));) {
            _.lastIndex === s.index && _.lastIndex++;
          }return y === e[f] ? !h && _.test("") || v.push("") : v.push(e.slice(y)), v[f] > d ? v.slice(0, d) : v;
        };
      } else "0".split(r, 0)[f] && (i = function i(t, n) {
        return t === r && 0 === n ? [] : u.call(this, t, n);
      });return [function split(e, o) {
        var u = t(this),
            c = e == r ? r : e[n];return c !== r ? c.call(e, u, o) : i.call(String(u), e, o);
      }, i];
    });
  }, function (t, n, e) {
    var i,
        o,
        u,
        c,
        f = e(33),
        a = e(2),
        s = e(18),
        l = e(48),
        h = e(0),
        p = e(4),
        v = e(10),
        g = e(39),
        y = e(40),
        d = e(57),
        _ = e(85).set,
        S = e(86)(),
        b = e(87),
        m = e(108),
        x = e(109),
        w = a.TypeError,
        E = a.process,
        O = a.Promise,
        P = "process" == l(E),
        M = function M() {},
        I = o = b.f,
        F = !!function () {
      try {
        var t = O.resolve(1),
            n = (t.constructor = {})[e(5)("species")] = function (t) {
          t(M, M);
        };return (P || "function" == typeof PromiseRejectionEvent) && t.then(M) instanceof n;
      } catch (r) {}
    }(),
        A = function A(t) {
      var n;return !(!p(t) || "function" != typeof (n = t.then)) && n;
    },
        k = function k(t, n) {
      if (!t._n) {
        t._n = !0;var r = t._c;S(function () {
          for (var e = t._v, i = 1 == t._s, o = 0; r.length > o;) {
            !function (n) {
              var r,
                  o,
                  u = i ? n.ok : n.fail,
                  c = n.resolve,
                  f = n.reject,
                  a = n.domain;try {
                u ? (i || (2 == t._h && R(t), t._h = 1), !0 === u ? r = e : (a && a.enter(), r = u(e), a && a.exit()), r === n.promise ? f(w("Promise-chain cycle")) : (o = A(r)) ? o.call(r, c, f) : c(r)) : f(e);
              } catch (s) {
                f(s);
              }
            }(r[o++]);
          }t._c = [], t._n = !1, n && !t._h && N(t);
        });
      }
    },
        N = function N(t) {
      _.call(a, function () {
        var n,
            e,
            i,
            o = t._v,
            u = j(t);if (u && (n = m(function () {
          P ? E.emit("unhandledRejection", o, t) : (e = a.onunhandledrejection) ? e({ promise: t, reason: o }) : (i = a.console) && i.error && i.error("Unhandled promise rejection", o);
        }), t._h = P || j(t) ? 2 : 1), t._a = r, u && n.e) throw n.v;
      });
    },
        j = function j(t) {
      if (1 == t._h) return !1;for (var n, r = t._a || t._c, e = 0; r.length > e;) {
        if ((n = r[e++]).fail || !j(n.promise)) return !1;
      }return !0;
    },
        R = function R(t) {
      _.call(a, function () {
        var n;P ? E.emit("rejectionHandled", t) : (n = a.onrejectionhandled) && n({ promise: t, reason: t._v });
      });
    },
        T = function T(t) {
      var n = this;n._d || (n._d = !0, (n = n._w || n)._v = t, n._s = 2, n._a || (n._a = n._c.slice()), k(n, !0));
    },
        L = function L(t) {
      var n,
          r = this;if (!r._d) {
        r._d = !0, r = r._w || r;try {
          if (r === t) throw w("Promise can't be resolved itself");(n = A(t)) ? S(function () {
            var e = { _w: r, _d: !1 };try {
              n.call(t, s(L, e, 1), s(T, e, 1));
            } catch (i) {
              T.call(e, i);
            }
          }) : (r._v = t, r._s = 1, k(r, !1));
        } catch (e) {
          T.call({ _w: r, _d: !1 }, e);
        }
      }
    };F || (O = function Promise(t) {
      g(this, O, "Promise", "_h"), v(t), i.call(this);try {
        t(s(L, this, 1), s(T, this, 1));
      } catch (n) {
        T.call(this, n);
      }
    }, (i = function Promise(t) {
      this._c = [], this._a = r, this._s = 0, this._d = !1, this._v = r, this._h = 0, this._n = !1;
    }).prototype = e(41)(O.prototype, { then: function then(t, n) {
        var e = I(d(this, O));return e.ok = "function" != typeof t || t, e.fail = "function" == typeof n && n, e.domain = P ? E.domain : r, this._c.push(e), this._a && this._a.push(e), this._s && k(this, !1), e.promise;
      }, "catch": function _catch(t) {
        return this.then(r, t);
      } }), u = function u() {
      var t = new i();this.promise = t, this.resolve = s(L, t, 1), this.reject = s(T, t, 1);
    }, b.f = I = function I(t) {
      return t === O || t === c ? new u(t) : o(t);
    }), h(h.G + h.W + h.F * !F, { Promise: O }), e(42)(O, "Promise"), e(38)("Promise"), c = e(28).Promise, h(h.S + h.F * !F, "Promise", { reject: function reject(t) {
        var n = I(this);return (0, n.reject)(t), n.promise;
      } }), h(h.S + h.F * (f || !F), "Promise", { resolve: function resolve(t) {
        return x(f && this === c ? O : this, t);
      } }), h(h.S + h.F * !(F && e(54)(function (t) {
      O.all(t)["catch"](M);
    })), "Promise", { all: function all(t) {
        var n = this,
            e = I(n),
            i = e.resolve,
            o = e.reject,
            u = m(function () {
          var e = [],
              u = 0,
              c = 1;y(t, !1, function (t) {
            var f = u++,
                a = !1;e.push(r), c++, n.resolve(t).then(function (t) {
              a || (a = !0, e[f] = t, --c || i(e));
            }, o);
          }), --c || i(e);
        });return u.e && o(u.v), e.promise;
      }, race: function race(t) {
        var n = this,
            r = I(n),
            e = r.reject,
            i = m(function () {
          y(t, !1, function (t) {
            n.resolve(t).then(r.resolve, e);
          });
        });return i.e && e(i.v), r.promise;
      } });
  }, function (t, n, e) {
    var i = e(114),
        o = e(45);e(58)("WeakSet", function (t) {
      return function WeakSet() {
        return t(this, arguments.length > 0 ? arguments[0] : r);
      };
    }, { add: function add(t) {
        return i.def(o(this, "WeakSet"), t, !0);
      } }, i, !1, !0);
  }, function (t, n, r) {
    var e = r(0),
        i = r(10),
        o = r(1),
        u = (r(2).Reflect || {}).apply,
        c = Function.apply;e(e.S + e.F * !r(3)(function () {
      u(function () {});
    }), "Reflect", { apply: function apply(t, n, r) {
        var e = i(t),
            f = o(r);return u ? u(e, n, f) : c.call(e, n, f);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(36),
        o = r(10),
        u = r(1),
        c = r(4),
        f = r(3),
        a = r(95),
        s = (r(2).Reflect || {}).construct,
        l = f(function () {
      function F() {}return !(s(function () {}, [], F) instanceof F);
    }),
        h = !f(function () {
      s(function () {});
    });e(e.S + e.F * (l || h), "Reflect", { construct: function construct(t, n) {
        o(t), u(n);var r = arguments.length < 3 ? t : o(arguments[2]);if (h && !l) return s(t, n, r);if (t == r) {
          switch (n.length) {case 0:
              return new t();case 1:
              return new t(n[0]);case 2:
              return new t(n[0], n[1]);case 3:
              return new t(n[0], n[1], n[2]);case 4:
              return new t(n[0], n[1], n[2], n[3]);}var e = [null];return e.push.apply(e, n), new (a.apply(t, e))();
        }var f = r.prototype,
            p = i(c(f) ? f : Object.prototype),
            v = Function.apply.call(t, p, n);return c(v) ? v : p;
      } });
  }, function (t, n, r) {
    var e = r(7),
        i = r(0),
        o = r(1),
        u = r(21);i(i.S + i.F * r(3)(function () {
      Reflect.defineProperty(e.f({}, 1, { value: 1 }), 1, { value: 2 });
    }), "Reflect", { defineProperty: function defineProperty(t, n, r) {
        o(t), n = u(n, !0), o(r);try {
          return e.f(t, n, r), !0;
        } catch (i) {
          return !1;
        }
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(16).f,
        o = r(1);e(e.S, "Reflect", { deleteProperty: function deleteProperty(t, n) {
        var r = i(o(t), n);return !(r && !r.configurable) && delete t[n];
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(1),
        u = function u(t) {
      this._t = o(t), this._i = 0;var n,
          r = this._k = [];for (n in t) {
        r.push(n);
      }
    };e(78)(u, "Object", function () {
      var t,
          n = this,
          e = n._k;do {
        if (n._i >= e.length) return { value: r, done: !0 };
      } while (!((t = e[n._i++]) in n._t));return { value: t, done: !1 };
    }), i(i.S, "Reflect", { enumerate: function enumerate(t) {
        return new u(t);
      } });
  }, function (t, n, e) {
    function get(t, n) {
      var e,
          c,
          s = arguments.length < 3 ? t : arguments[2];return a(t) === s ? t[n] : (e = i.f(t, n)) ? u(e, "value") ? e.value : e.get !== r ? e.get.call(s) : r : f(c = o(t)) ? get(c, n, s) : void 0;
    }var i = e(16),
        o = e(17),
        u = e(11),
        c = e(0),
        f = e(4),
        a = e(1);c(c.S, "Reflect", { get: get });
  }, function (t, n, r) {
    var e = r(16),
        i = r(0),
        o = r(1);i(i.S, "Reflect", { getOwnPropertyDescriptor: function getOwnPropertyDescriptor(t, n) {
        return e.f(o(t), n);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(17),
        o = r(1);e(e.S, "Reflect", { getPrototypeOf: function getPrototypeOf(t) {
        return i(o(t));
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Reflect", { has: function has(t, n) {
        return n in t;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(1),
        o = Object.isExtensible;e(e.S, "Reflect", { isExtensible: function isExtensible(t) {
        return i(t), !o || o(t);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Reflect", { ownKeys: r(115) });
  }, function (t, n, r) {
    var e = r(0),
        i = r(1),
        o = Object.preventExtensions;e(e.S, "Reflect", { preventExtensions: function preventExtensions(t) {
        i(t);try {
          return o && o(t), !0;
        } catch (n) {
          return !1;
        }
      } });
  }, function (t, n, e) {
    function set(t, n, e) {
      var f,
          h,
          p = arguments.length < 4 ? t : arguments[3],
          v = o.f(s(t), n);if (!v) {
        if (l(h = u(t))) return set(h, n, e, p);v = a(0);
      }return c(v, "value") ? !(!1 === v.writable || !l(p)) && (f = o.f(p, n) || a(0), f.value = e, i.f(p, n, f), !0) : v.set !== r && (v.set.call(p, e), !0);
    }var i = e(7),
        o = e(16),
        u = e(17),
        c = e(11),
        f = e(0),
        a = e(31),
        s = e(1),
        l = e(4);f(f.S, "Reflect", { set: set });
  }, function (t, n, r) {
    var e = r(0),
        i = r(68);i && e(e.S, "Reflect", { setPrototypeOf: function setPrototypeOf(t, n) {
        i.check(t, n);try {
          return i.set(t, n), !0;
        } catch (r) {
          return !1;
        }
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Date", { now: function now() {
        return new Date().getTime();
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(9),
        o = r(21);e(e.P + e.F * r(3)(function () {
      return null !== new Date(NaN).toJSON() || 1 !== Date.prototype.toJSON.call({ toISOString: function toISOString() {
          return 1;
        } });
    }), "Date", { toJSON: function toJSON(t) {
        var n = i(this),
            r = o(n);return "number" != typeof r || isFinite(r) ? n.toISOString() : null;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(246);e(e.P + e.F * (Date.prototype.toISOString !== i), "Date", { toISOString: i });
  }, function (t, n, r) {
    var e = r(3),
        i = Date.prototype.getTime,
        o = Date.prototype.toISOString,
        u = function u(t) {
      return t > 9 ? t : "0" + t;
    };t.exports = e(function () {
      return "0385-07-25T07:06:39.999Z" != o.call(new Date(-5e13 - 1));
    }) || !e(function () {
      o.call(new Date(NaN));
    }) ? function toISOString() {
      if (!isFinite(i.call(this))) throw RangeError("Invalid time value");var t = this,
          n = t.getUTCFullYear(),
          r = t.getUTCMilliseconds(),
          e = n < 0 ? "-" : n > 9999 ? "+" : "";return e + ("00000" + Math.abs(n)).slice(e ? -6 : -4) + "-" + u(t.getUTCMonth() + 1) + "-" + u(t.getUTCDate()) + "T" + u(t.getUTCHours()) + ":" + u(t.getUTCMinutes()) + ":" + u(t.getUTCSeconds()) + "." + (r > 99 ? r : "0" + u(r)) + "Z";
    } : o;
  }, function (t, n, r) {
    var e = Date.prototype,
        i = e.toString,
        o = e.getTime;new Date(NaN) + "" != "Invalid Date" && r(13)(e, "toString", function toString() {
      var t = o.call(this);return t === t ? i.call(this) : "Invalid Date";
    });
  }, function (t, n, r) {
    var e = r(5)("toPrimitive"),
        i = Date.prototype;e in i || r(12)(i, e, r(249));
  }, function (t, n, r) {
    var e = r(1),
        i = r(21);t.exports = function (t) {
      if ("string" !== t && "number" !== t && "default" !== t) throw TypeError("Incorrect hint");return i(e(this), "number" != t);
    };
  }, function (t, n, e) {
    var i = e(0),
        o = e(59),
        u = e(88),
        c = e(1),
        f = e(35),
        a = e(8),
        s = e(4),
        l = e(2).ArrayBuffer,
        h = e(57),
        p = u.ArrayBuffer,
        v = u.DataView,
        g = o.ABV && l.isView,
        y = p.prototype.slice,
        d = o.VIEW;i(i.G + i.W + i.F * (l !== p), { ArrayBuffer: p }), i(i.S + i.F * !o.CONSTR, "ArrayBuffer", { isView: function isView(t) {
        return g && g(t) || s(t) && d in t;
      } }), i(i.P + i.U + i.F * e(3)(function () {
      return !new p(2).slice(1, r).byteLength;
    }), "ArrayBuffer", { slice: function slice(t, n) {
        if (y !== r && n === r) return y.call(c(this), t);for (var e = c(this).byteLength, i = f(t, e), o = f(n === r ? e : n, e), u = new (h(this, p))(a(o - i)), s = new v(this), l = new v(u), g = 0; i < o;) {
          l.setUint8(g++, s.getUint8(i++));
        }return u;
      } }), e(38)("ArrayBuffer");
  }, function (t, n, r) {
    var e = r(0);e(e.G + e.W + e.F * !r(59).ABV, { DataView: r(88).DataView });
  }, function (t, n, r) {
    r(26)("Int8", 1, function (t) {
      return function Int8Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, r) {
    r(26)("Uint8", 1, function (t) {
      return function Uint8Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, r) {
    r(26)("Uint8", 1, function (t) {
      return function Uint8ClampedArray(n, r, e) {
        return t(this, n, r, e);
      };
    }, !0);
  }, function (t, n, r) {
    r(26)("Int16", 2, function (t) {
      return function Int16Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, r) {
    r(26)("Uint16", 2, function (t) {
      return function Uint16Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, r) {
    r(26)("Int32", 4, function (t) {
      return function Int32Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, r) {
    r(26)("Uint32", 4, function (t) {
      return function Uint32Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, r) {
    r(26)("Float32", 4, function (t) {
      return function Float32Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, r) {
    r(26)("Float64", 8, function (t) {
      return function Float64Array(n, r, e) {
        return t(this, n, r, e);
      };
    });
  }, function (t, n, e) {
    var i = e(0),
        o = e(50)(!0);i(i.P, "Array", { includes: function includes(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : r);
      } }), e(30)("includes");
  }, function (t, n, r) {
    var e = r(0),
        i = r(117),
        o = r(9),
        u = r(8),
        c = r(10),
        f = r(82);e(e.P, "Array", { flatMap: function flatMap(t) {
        var n,
            r,
            e = o(this);return c(t), n = u(e.length), r = f(e, 0), i(r, e, e, n, 0, 1, t, arguments[1]), r;
      } }), r(30)("flatMap");
  }, function (t, n, e) {
    var i = e(0),
        o = e(117),
        u = e(9),
        c = e(8),
        f = e(23),
        a = e(82);i(i.P, "Array", { flatten: function flatten() {
        var t = arguments[0],
            n = u(this),
            e = c(n.length),
            i = a(n, 0);return o(i, n, n, e, 0, t === r ? 1 : f(t)), i;
      } }), e(30)("flatten");
  }, function (t, n, r) {
    var e = r(0),
        i = r(74)(!0);e(e.P, "String", { at: function at(t) {
        return i(this, t);
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(118);i(i.P, "String", { padStart: function padStart(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : r, !0);
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(118);i(i.P, "String", { padEnd: function padEnd(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : r, !1);
      } });
  }, function (t, n, r) {
    r(43)("trimLeft", function (t) {
      return function trimLeft() {
        return t(this, 1);
      };
    }, "trimStart");
  }, function (t, n, r) {
    r(43)("trimRight", function (t) {
      return function trimRight() {
        return t(this, 2);
      };
    }, "trimEnd");
  }, function (t, n, r) {
    var e = r(0),
        i = r(22),
        o = r(8),
        u = r(53),
        c = r(55),
        f = RegExp.prototype,
        a = function a(t, n) {
      this._r = t, this._s = n;
    };r(78)(a, "RegExp String", function next() {
      var t = this._r.exec(this._s);return { value: t, done: null === t };
    }), e(e.P, "String", { matchAll: function matchAll(t) {
        if (i(this), !u(t)) throw TypeError(t + " is not a regexp!");var n = String(this),
            r = "flags" in f ? String(t.flags) : c.call(t),
            e = new RegExp(t.source, ~r.indexOf("g") ? r : "g" + r);return e.lastIndex = o(t.lastIndex), new a(e, n);
      } });
  }, function (t, n, r) {
    r(64)("asyncIterator");
  }, function (t, n, r) {
    r(64)("observable");
  }, function (t, n, e) {
    var i = e(0),
        o = e(115),
        u = e(15),
        c = e(16),
        f = e(80);i(i.S, "Object", { getOwnPropertyDescriptors: function getOwnPropertyDescriptors(t) {
        for (var n, e, i = u(t), a = c.f, s = o(i), l = {}, h = 0; s.length > h;) {
          (e = a(i, n = s[h++])) !== r && f(l, n, e);
        }return l;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(119)(!1);e(e.S, "Object", { values: function values(t) {
        return i(t);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(119)(!0);e(e.S, "Object", { entries: function entries(t) {
        return i(t);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(9),
        o = r(10),
        u = r(7);r(6) && e(e.P + r(60), "Object", { __defineGetter__: function __defineGetter__(t, n) {
        u.f(i(this), t, { get: o(n), enumerable: !0, configurable: !0 });
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(9),
        o = r(10),
        u = r(7);r(6) && e(e.P + r(60), "Object", { __defineSetter__: function __defineSetter__(t, n) {
        u.f(i(this), t, { set: o(n), enumerable: !0, configurable: !0 });
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(9),
        o = r(21),
        u = r(17),
        c = r(16).f;r(6) && e(e.P + r(60), "Object", { __lookupGetter__: function __lookupGetter__(t) {
        var n,
            r = i(this),
            e = o(t, !0);do {
          if (n = c(r, e)) return n.get;
        } while (r = u(r));
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(9),
        o = r(21),
        u = r(17),
        c = r(16).f;r(6) && e(e.P + r(60), "Object", { __lookupSetter__: function __lookupSetter__(t) {
        var n,
            r = i(this),
            e = o(t, !0);do {
          if (n = c(r, e)) return n.set;
        } while (r = u(r));
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.P + e.R, "Map", { toJSON: r(120)("Map") });
  }, function (t, n, r) {
    var e = r(0);e(e.P + e.R, "Set", { toJSON: r(120)("Set") });
  }, function (t, n, r) {
    r(61)("Map");
  }, function (t, n, r) {
    r(61)("Set");
  }, function (t, n, r) {
    r(61)("WeakMap");
  }, function (t, n, r) {
    r(61)("WeakSet");
  }, function (t, n, r) {
    r(62)("Map");
  }, function (t, n, r) {
    r(62)("Set");
  }, function (t, n, r) {
    r(62)("WeakMap");
  }, function (t, n, r) {
    r(62)("WeakSet");
  }, function (t, n, r) {
    var e = r(0);e(e.G, { global: r(2) });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "System", { global: r(2) });
  }, function (t, n, r) {
    var e = r(0),
        i = r(19);e(e.S, "Error", { isError: function isError(t) {
        return "Error" === i(t);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { clamp: function clamp(t, n, r) {
        return Math.min(r, Math.max(n, t));
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { DEG_PER_RAD: Math.PI / 180 });
  }, function (t, n, r) {
    var e = r(0),
        i = 180 / Math.PI;e(e.S, "Math", { degrees: function degrees(t) {
        return t * i;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(122),
        o = r(102);e(e.S, "Math", { fscale: function fscale(t, n, r, e, u) {
        return o(i(t, n, r, e, u));
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { iaddh: function iaddh(t, n, r, e) {
        var i = t >>> 0,
            o = r >>> 0;return (n >>> 0) + (e >>> 0) + ((i & o | (i | o) & ~(i + o >>> 0)) >>> 31) | 0;
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { isubh: function isubh(t, n, r, e) {
        var i = t >>> 0,
            o = r >>> 0;return (n >>> 0) - (e >>> 0) - ((~i & o | ~(i ^ o) & i - o >>> 0) >>> 31) | 0;
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { imulh: function imulh(t, n) {
        var r = +t,
            e = +n,
            i = 65535 & r,
            o = 65535 & e,
            u = r >> 16,
            c = e >> 16,
            f = (u * o >>> 0) + (i * o >>> 16);return u * c + (f >> 16) + ((i * c >>> 0) + (65535 & f) >> 16);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { RAD_PER_DEG: 180 / Math.PI });
  }, function (t, n, r) {
    var e = r(0),
        i = Math.PI / 180;e(e.S, "Math", { radians: function radians(t) {
        return t * i;
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { scale: r(122) });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { umulh: function umulh(t, n) {
        var r = +t,
            e = +n,
            i = 65535 & r,
            o = 65535 & e,
            u = r >>> 16,
            c = e >>> 16,
            f = (u * o >>> 0) + (i * o >>> 16);return u * c + (f >>> 16) + ((i * c >>> 0) + (65535 & f) >>> 16);
      } });
  }, function (t, n, r) {
    var e = r(0);e(e.S, "Math", { signbit: function signbit(t) {
        return (t = +t) != t ? t : 0 == t ? 1 / t == Infinity : t > 0;
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(28),
        o = r(2),
        u = r(57),
        c = r(109);e(e.P + e.R, "Promise", { "finally": function _finally(t) {
        var n = u(this, i.Promise || o.Promise),
            r = "function" == typeof t;return this.then(r ? function (r) {
          return c(n, t()).then(function () {
            return r;
          });
        } : t, r ? function (r) {
          return c(n, t()).then(function () {
            throw r;
          });
        } : t);
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(87),
        o = r(108);e(e.S, "Promise", { "try": function _try(t) {
        var n = i.f(this),
            r = o(t);return (r.e ? n.reject : n.resolve)(r.v), n.promise;
      } });
  }, function (t, n, r) {
    var e = r(27),
        i = r(1),
        o = e.key,
        u = e.set;e.exp({ defineMetadata: function defineMetadata(t, n, r, e) {
        u(t, n, i(r), o(e));
      } });
  }, function (t, n, e) {
    var i = e(27),
        o = e(1),
        u = i.key,
        c = i.map,
        f = i.store;i.exp({ deleteMetadata: function deleteMetadata(t, n) {
        var e = arguments.length < 3 ? r : u(arguments[2]),
            i = c(o(n), e, !1);if (i === r || !i["delete"](t)) return !1;if (i.size) return !0;var a = f.get(n);return a["delete"](e), !!a.size || f["delete"](n);
      } });
  }, function (t, n, e) {
    var i = e(27),
        o = e(1),
        u = e(17),
        c = i.has,
        f = i.get,
        a = i.key,
        s = function s(t, n, e) {
      if (c(t, n, e)) return f(t, n, e);var i = u(n);return null !== i ? s(t, i, e) : r;
    };i.exp({ getMetadata: function getMetadata(t, n) {
        return s(t, o(n), arguments.length < 3 ? r : a(arguments[2]));
      } });
  }, function (t, n, e) {
    var i = e(112),
        o = e(121),
        u = e(27),
        c = e(1),
        f = e(17),
        a = u.keys,
        s = u.key,
        l = function l(t, n) {
      var r = a(t, n),
          e = f(t);if (null === e) return r;var u = l(e, n);return u.length ? r.length ? o(new i(r.concat(u))) : u : r;
    };u.exp({ getMetadataKeys: function getMetadataKeys(t) {
        return l(c(t), arguments.length < 2 ? r : s(arguments[1]));
      } });
  }, function (t, n, e) {
    var i = e(27),
        o = e(1),
        u = i.get,
        c = i.key;i.exp({ getOwnMetadata: function getOwnMetadata(t, n) {
        return u(t, o(n), arguments.length < 3 ? r : c(arguments[2]));
      } });
  }, function (t, n, e) {
    var i = e(27),
        o = e(1),
        u = i.keys,
        c = i.key;i.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(t) {
        return u(o(t), arguments.length < 2 ? r : c(arguments[1]));
      } });
  }, function (t, n, e) {
    var i = e(27),
        o = e(1),
        u = e(17),
        c = i.has,
        f = i.key,
        a = function a(t, n, r) {
      if (c(t, n, r)) return !0;var e = u(n);return null !== e && a(t, e, r);
    };i.exp({ hasMetadata: function hasMetadata(t, n) {
        return a(t, o(n), arguments.length < 3 ? r : f(arguments[2]));
      } });
  }, function (t, n, e) {
    var i = e(27),
        o = e(1),
        u = i.has,
        c = i.key;i.exp({ hasOwnMetadata: function hasOwnMetadata(t, n) {
        return u(t, o(n), arguments.length < 3 ? r : c(arguments[2]));
      } });
  }, function (t, n, e) {
    var i = e(27),
        o = e(1),
        u = e(10),
        c = i.key,
        f = i.set;i.exp({ metadata: function metadata(t, n) {
        return function decorator(e, i) {
          f(t, n, (i !== r ? o : u)(e), c(i));
        };
      } });
  }, function (t, n, r) {
    var e = r(0),
        i = r(86)(),
        o = r(2).process,
        u = "process" == r(19)(o);e(e.G, { asap: function asap(t) {
        var n = u && o.domain;i(n ? n.bind(t) : t);
      } });
  }, function (t, n, e) {
    var i = e(0),
        o = e(2),
        u = e(28),
        c = e(86)(),
        f = e(5)("observable"),
        a = e(10),
        s = e(1),
        l = e(39),
        h = e(41),
        p = e(12),
        v = e(40),
        g = v.RETURN,
        y = function y(t) {
      return null == t ? r : a(t);
    },
        d = function d(t) {
      var n = t._c;n && (t._c = r, n());
    },
        _ = function _(t) {
      return t._o === r;
    },
        S = function S(t) {
      _(t) || (t._o = r, d(t));
    },
        b = function b(t, n) {
      s(t), this._c = r, this._o = t, t = new m(this);try {
        var e = n(t),
            i = e;null != e && ("function" == typeof e.unsubscribe ? e = function e() {
          i.unsubscribe();
        } : a(e), this._c = e);
      } catch (o) {
        return void t.error(o);
      }_(this) && d(this);
    };b.prototype = h({}, { unsubscribe: function unsubscribe() {
        S(this);
      } });var m = function m(t) {
      this._s = t;
    };m.prototype = h({}, { next: function next(t) {
        var n = this._s;if (!_(n)) {
          var r = n._o;try {
            var e = y(r.next);if (e) return e.call(r, t);
          } catch (i) {
            try {
              S(n);
            } finally {
              throw i;
            }
          }
        }
      }, error: function error(t) {
        var n = this._s;if (_(n)) throw t;var e = n._o;n._o = r;try {
          var i = y(e.error);if (!i) throw t;t = i.call(e, t);
        } catch (o) {
          try {
            d(n);
          } finally {
            throw o;
          }
        }return d(n), t;
      }, complete: function complete(t) {
        var n = this._s;if (!_(n)) {
          var e = n._o;n._o = r;try {
            var i = y(e.complete);t = i ? i.call(e, t) : r;
          } catch (o) {
            try {
              d(n);
            } finally {
              throw o;
            }
          }return d(n), t;
        }
      } });var x = function Observable(t) {
      l(this, x, "Observable", "_f")._f = a(t);
    };h(x.prototype, { subscribe: function subscribe(t) {
        return new b(t, this._f);
      }, forEach: function forEach(t) {
        var n = this;return new (u.Promise || o.Promise)(function (r, e) {
          a(t);var i = n.subscribe({ next: function next(n) {
              try {
                return t(n);
              } catch (r) {
                e(r), i.unsubscribe();
              }
            }, error: e, complete: r });
        });
      } }), h(x, { from: function from(t) {
        var n = "function" == typeof this ? this : x,
            r = y(s(t)[f]);if (r) {
          var e = s(r.call(t));return e.constructor === n ? e : new n(function (t) {
            return e.subscribe(t);
          });
        }return new n(function (n) {
          var r = !1;return c(function () {
            if (!r) {
              try {
                if (v(t, !1, function (t) {
                  if (n.next(t), r) return g;
                }) === g) return;
              } catch (e) {
                if (r) throw e;return void n.error(e);
              }n.complete();
            }
          }), function () {
            r = !0;
          };
        });
      }, of: function of() {
        for (var t = 0, n = arguments.length, r = Array(n); t < n;) {
          r[t] = arguments[t++];
        }return new ("function" == typeof this ? this : x)(function (t) {
          var n = !1;return c(function () {
            if (!n) {
              for (var e = 0; e < r.length; ++e) {
                if (t.next(r[e]), n) return;
              }t.complete();
            }
          }), function () {
            n = !0;
          };
        });
      } }), p(x.prototype, f, function () {
      return this;
    }), i(i.G, { Observable: x }), e(38)("Observable");
  }, function (t, n, r) {
    var e = r(0),
        i = r(85);e(e.G + e.B, { setImmediate: i.set, clearImmediate: i.clear });
  }, function (t, n, r) {
    for (var e = r(84), i = r(34), o = r(13), u = r(2), c = r(12), f = r(44), a = r(5), s = a("iterator"), l = a("toStringTag"), h = f.Array, p = { CSSRuleList: !0, CSSStyleDeclaration: !1, CSSValueList: !1, ClientRectList: !1, DOMRectList: !1, DOMStringList: !1, DOMTokenList: !0, DataTransferItemList: !1, FileList: !1, HTMLAllCollection: !1, HTMLCollection: !1, HTMLFormElement: !1, HTMLSelectElement: !1, MediaList: !0, MimeTypeArray: !1, NamedNodeMap: !1, NodeList: !0, PaintRequestList: !1, Plugin: !1, PluginArray: !1, SVGLengthList: !1, SVGNumberList: !1, SVGPathSegList: !1, SVGPointList: !1, SVGStringList: !1, SVGTransformList: !1, SourceBufferList: !1, StyleSheetList: !0, TextTrackCueList: !1, TextTrackList: !1, TouchList: !1 }, v = i(p), g = 0; g < v.length; g++) {
      var y,
          d = v[g],
          _ = p[d],
          S = u[d],
          b = S && S.prototype;if (b && (b[s] || c(b, s, h), b[l] || c(b, l, d), f[d] = h, _)) for (y in e) {
        b[y] || o(b, y, e[y], !0);
      }
    }
  }, function (t, n, r) {
    var e = r(2),
        i = r(0),
        o = e.navigator,
        u = [].slice,
        c = !!o && /MSIE .\./.test(o.userAgent),
        f = function f(t) {
      return function (n, r) {
        var e = arguments.length > 2,
            i = !!e && u.call(arguments, 2);return t(e ? function () {
          ("function" == typeof n ? n : Function(n)).apply(this, i);
        } : n, r);
      };
    };i(i.G + i.B + i.F * c, { setTimeout: f(e.setTimeout), setInterval: f(e.setInterval) });
  }]), "undefined" != typeof module && module.exports ? module.exports = t : "function" == typeof define && define.amd ? define(function () {
    return t;
  }) : n.core = t;
}(1, 1);


},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 显示视频已加载的量
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/13
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/buffering_seeking_time_ranges
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @desc
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    1) 在视频没开始播放之前，提前下载的视频资源由 preload 属性的值决定
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - none 什么都没有，所以我们连视频总时长都没法获取到
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - metadata 可以获取到视频时长、高宽等信息
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - auto 视浏览器而定，一般 >= metadata
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var BufferBar = function (_Component) {
    _inherits(BufferBar, _Component);

    function BufferBar(player, options) {
        _classCallCheck(this, BufferBar);

        var _this = _possibleConstructorReturn(this, (BufferBar.__proto__ || Object.getPrototypeOf(BufferBar)).call(this, player, options));

        _this.line = Dom.$('.lark-buffer-bar__line', _this.el);
        _this.handleProgress = _this.handleProgress.bind(_this);

        _this.player.on('progress', _this.handleProgress);
        // 对于已经 video 已经初始化完成后才调用 larkplayer 的情况，此时可能已经没有 progress 事件
        // 不过我们会在 player.handleLateInit 中重新触发 canplay 等事件（canplay 时，播放器应该已经有一定的 buffer）
        _this.player.on('canplay', _this.handleProgress);
        _this.handleProgress();
        return _this;
    }

    _createClass(BufferBar, [{
        key: 'handleProgress',
        value: function handleProgress() {
            // TimeRanges 对象
            var buffered = this.player.buffered();
            var duration = this.player.duration();
            var currentTime = this.player.currentTime();

            if (duration > 0) {
                for (var i = 0; i < buffered.length; i++) {
                    if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
                        var width = buffered.end(i) / duration * 100 + '%';
                        this.render(width);
                        break;
                    }
                }
            }
        }
    }, {
        key: 'render',
        value: function render(width) {
            this.line.style.width = width;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.render(0);
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var line = Dom.createElement('div', {
                className: 'lark-buffer-bar__line'
            });

            return Dom.createElement('div', {
                className: 'lark-buffer-bar'
            }, line);
        }
    }]);

    return BufferBar;
}(_component2.default);

exports.default = BufferBar;


_component2.default.registerComponent('BufferBar', BufferBar);

},{"../component":1,"../utils/dom":27}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

require('./current-time');

require('./duration');

require('./play-button');

require('./fullscreen-button');

require('./gradient-bottom');

require('./volume');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file ControlBarPc 播放器操作按钮
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ControlBarPc = function (_Component) {
    _inherits(ControlBarPc, _Component);

    function ControlBarPc() {
        _classCallCheck(this, ControlBarPc);

        return _possibleConstructorReturn(this, (ControlBarPc.__proto__ || Object.getPrototypeOf(ControlBarPc)).apply(this, arguments));
    }

    _createClass(ControlBarPc, [{
        key: 'reset',
        value: function reset() {
            this.children.forEach(function (child) {
                child && child.reset && child.reset();
            });
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var time = this.createElement('div', { className: 'lark-time' }, this.createElement('CurrentTime'), this.createElement('span', { className: 'lark-time-separator' }, '/'), this.createElement('Duration'));

            var playButton = this.createElement('playButton', { className: 'lark-play-button-pc' });

            var fullscreenButton = this.createElement('FullscreenButton');
            var gradientBottom = this.createElement('GradientBottom');

            // jsxParser(`
            //     <div className="lark-control-bar-pc">
            //         <ProgressBar className="lark-progress-bar-pc" />
            //         <div className="lark-control__left">
            //             <PlayButton className="lark-play-button-pc" />
            //             <div className="lark-time">
            //                 <CurrentTime />
            //                 <span className="lark-time-separator">/<span>
            //                 <Duration />
            //             </div>
            //         </div>
            //         <div className="lark-control__right">
            //             <FullscreenButton />
            //         </div>
            //     </div>
            // `);

            var volume = this.createElement('Volume');

            var controlLeft = this.createElement('div', { className: 'lark-control__left' }, playButton, volume, time);
            var controlRight = this.createElement('div', { className: 'lark-control__right' }, fullscreenButton);

            var progressBarPc = this.createElement('progressBar', { className: 'lark-progress-bar-pc' });

            return this.createElement('div', { className: 'lark-control-bar-pc' }, gradientBottom, progressBarPc, controlLeft, controlRight);
        }
    }]);

    return ControlBarPc;
}(_component2.default);

exports.default = ControlBarPc;


_component2.default.registerComponent('ControlBarPc', ControlBarPc);

},{"../component":1,"./current-time":10,"./duration":11,"./fullscreen-button":14,"./gradient-bottom":15,"./play-button":18,"./volume":24}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./current-time');

require('./duration');

require('./fullscreen-button');

require('./progress-bar');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file ControlsBar 播放器控制条
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ControlBar = function (_Component) {
    _inherits(ControlBar, _Component);

    function ControlBar() {
        _classCallCheck(this, ControlBar);

        return _possibleConstructorReturn(this, (ControlBar.__proto__ || Object.getPrototypeOf(ControlBar)).apply(this, arguments));
    }

    _createClass(ControlBar, [{
        key: 'reset',
        value: function reset() {
            this.children.forEach(function (child) {
                child && child.reset && child.reset();
            });
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            return Dom.createElement('div', {
                className: 'lark-control-bar'
            });
        }
    }]);

    return ControlBar;
}(_component2.default);

ControlBar.prototype.options = {
    children: ['currentTime', 'progressBar', 'duration', 'fullscreenButton']
};

_component2.default.registerComponent('ControlBar', ControlBar);

exports.default = ControlBar;

},{"../component":1,"../utils/dom":27,"./current-time":10,"./duration":11,"./fullscreen-button":14,"./progress-bar":21}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _timeFormat = require('../utils/time-format');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file current-time.js 当前时间 UI
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/4
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CurrentTime = function (_Component) {
    _inherits(CurrentTime, _Component);

    function CurrentTime(player, options) {
        _classCallCheck(this, CurrentTime);

        var _this = _possibleConstructorReturn(this, (CurrentTime.__proto__ || Object.getPrototypeOf(CurrentTime)).call(this, player, options));

        _this.handleTimeupdate = _this.handleTimeupdate.bind(_this);

        player.on('timeupdate', _this.handleTimeupdate);
        return _this;
    }

    _createClass(CurrentTime, [{
        key: 'handleTimeupdate',
        value: function handleTimeupdate(event, data) {
            this.render(data.currentTime);
        }
    }, {
        key: 'render',
        value: function render(time) {
            Dom.textContent(this.el, (0, _timeFormat.timeFormat)(Math.floor(time)));
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.render(0);
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var currentTime = this.player.currentTime();

            return Dom.createElement('div', {
                className: 'lark-current-time'
            }, (0, _timeFormat.timeFormat)(Math.floor(currentTime)));
        }
    }]);

    return CurrentTime;
}(_component2.default);

exports.default = CurrentTime;


_component2.default.registerComponent('CurrentTime', CurrentTime);

},{"../component":1,"../utils/dom":27,"../utils/time-format":38}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _timeFormat = require('../utils/time-format');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file duration.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Duration = function (_Component) {
    _inherits(Duration, _Component);

    function Duration(player, options) {
        _classCallCheck(this, Duration);

        var _this = _possibleConstructorReturn(this, (Duration.__proto__ || Object.getPrototypeOf(Duration)).call(this, player, options));

        _this.handleLoadedMetaData = _this.handleLoadedMetaData.bind(_this);

        player.on('durationchange', _this.handleLoadedMetaData);
        player.on('loadedmetadata', _this.handleLoadedMetaData);
        return _this;
    }

    _createClass(Duration, [{
        key: 'handleLoadedMetaData',
        value: function handleLoadedMetaData(event) {
            Dom.textContent(this.el, (0, _timeFormat.timeFormat)(Math.floor(this.player.duration())));
        }
    }, {
        key: 'reset',
        value: function reset() {
            Dom.textContent(this.el, '');
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            // @todo 暂时将 duration 的值写在这，后面需要处理下对于已经发生的事件怎么办
            var durationContent = (0, _timeFormat.timeFormat)(Math.floor(this.player.duration()));
            return Dom.createEl('div', {
                className: 'lark-duration'
            }, null, durationContent);
        }
    }]);

    return Duration;
}(_component2.default);

exports.default = Duration;


_component2.default.registerComponent('Duration', Duration);

},{"../component":1,"../utils/dom":27,"../utils/time-format":38}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./error');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file error.js 播放器出错时显示 pc 版
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhuiyuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/8
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var ErrorPc = function (_Component) {
    _inherits(ErrorPc, _Component);

    function ErrorPc(player, options) {
        _classCallCheck(this, ErrorPc);

        var _this = _possibleConstructorReturn(this, (ErrorPc.__proto__ || Object.getPrototypeOf(ErrorPc)).call(this, player, options));

        _this.handleError = _this.handleError.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);

        _this.player.on('error', _this.handleError);
        _this.on('click', _this.handleClick);

        _this.textEl = Dom.$('.lark-error-text', _this.el);
        return _this;
    }

    _createClass(ErrorPc, [{
        key: 'handleClick',
        value: function handleClick() {
            var _this2 = this;

            var src = this.player.src();
            this.player.reset();
            setTimeout(function () {
                _this2.player.src(src);
                _this2.player.play();
            }, 0);
        }
    }, {
        key: 'handleError',
        value: function handleError(event, error) {
            var text = void 0;
            switch (parseInt(error.code, 10)) {
                // MEDIA_ERR_ABORTED
                case 1:
                    text = '加载失败，点击重试(MEDIA_ERR_ABORTED)';
                    break;
                // MEDIA_ERR_NETWORK
                case 2:
                    text = '加载失败，请检查您的网络(MEDIA_ERR_NETWORK)';
                    break;
                // MEDIA_ERR_DECODE
                case 3:
                    text = '视频解码失败(MEDIA_ERR_DECODE)';
                    break;
                // MEDIA_ERR_SRC_NOT_SUPPORTED
                case 4:
                    text = '加载失败，该资源无法访问或者浏览器不支持该视频类型(MEDIA_ERR_SRC_NOT_SUPPORTED)';
                    break;
                default:
                    text = '加载失败，点击重试';
            }

            Dom.replaceContent(this.textEl, text);
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            return this.createElement('div', { className: 'lark-error-pc' }, this.createElement('div', { className: 'lark-error-area' }, this.createElement('div', { className: 'lark-error-text' }, '加载失败，请稍后重试')));
        }
    }]);

    return ErrorPc;
}(_component2.default);

exports.default = ErrorPc;


_component2.default.registerComponent('ErrorPc', ErrorPc);

},{"../component":1,"../utils/dom":27,"./error":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file error.js 播放器出错时显示
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/16
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Error = function (_Component) {
    _inherits(Error, _Component);

    function Error(player, options) {
        _classCallCheck(this, Error);

        var _this = _possibleConstructorReturn(this, (Error.__proto__ || Object.getPrototypeOf(Error)).call(this, player, options));

        _this.handleError = _this.handleError.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);

        _this.player.on('error', _this.handleError);

        _this.on('click', _this.handleClick);
        return _this;
    }

    _createClass(Error, [{
        key: 'handleError',
        value: function handleError(event, data) {
            /* eslint-disable no-console */
            console.log(event, data);
            /* eslint-enable no-console */
        }
    }, {
        key: 'handleClick',
        value: function handleClick() {
            var _this2 = this;

            var src = this.player.src();
            this.player.reset();
            setTimeout(function () {
                _this2.player.src(src);
                _this2.player.play();
            }, 0);
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var errorSpinner = Dom.createElement('span', {
                className: 'lark-error-area__spinner lark-icon-loading'
            });

            var errorText = Dom.createElement('span', {
                className: 'lark-error-area__text'
            }, '加载失败，点击重试');

            var errorCnt = Dom.createElement('div', {
                className: 'lark-error-cnt'
            }, errorSpinner, errorText);

            return Dom.createElement('div', {
                className: 'lark-error-area'
            }, errorCnt);
        }
    }]);

    return Error;
}(_component2.default);

exports.default = Error;


_component2.default.registerComponent('Error', Error);

},{"../component":1,"../utils/dom":27}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _featureDetector = require('../utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file fullscreen-button.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/5
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var FullscreenButton = function (_Component) {
    _inherits(FullscreenButton, _Component);

    function FullscreenButton(player, options) {
        _classCallCheck(this, FullscreenButton);

        var _this = _possibleConstructorReturn(this, (FullscreenButton.__proto__ || Object.getPrototypeOf(FullscreenButton)).call(this, player, options));

        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleMouseOver = _this.handleMouseOver.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);

        _this.on('click', _this.handleClick);

        if (!_featureDetector2.default.touch) {
            _this.fullscreenButton = Dom.$('.lark-request-fullscreen', _this.el);
            _this.exitFullscreenButton = Dom.$('.lark-exit-fullscreen', _this.el);

            Events.on(_this.fullscreenButton, 'mouseover', function () {
                return _this.handleMouseOver(_this.fullscreenButton, '全屏');
            });
            Events.on(_this.exitFullscreenButton, 'mouseover', function () {
                return _this.handleMouseOver(_this.exitFullscreenButton, '退出全屏');
            });

            _this.on('mouseout', _this.handleMouseOut);
        }
        return _this;
    }

    _createClass(FullscreenButton, [{
        key: 'handleClick',
        value: function handleClick() {
            if (!this.player.isFullscreen()) {
                this.player.requestFullscreen();
            } else {
                this.player.exitFullscreen();
            }
        }
    }, {
        key: 'handleMouseOver',
        value: function handleMouseOver(el, content) {
            _tooltip2.default.show({
                hostEl: el,
                placement: 'top',
                margin: 16,
                content: content
            });
        }
    }, {
        key: 'handleMouseOut',
        value: function handleMouseOut(event) {
            _tooltip2.default.hide();
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            // @todo 将两个 icon 分别放到两个类中，这样可以确定他们每个的 click 的事件一定跟自己的名称是相符的
            return Dom.createElement('div', {
                className: 'lark-fullscreen-button'
            }, Dom.createElement('div', {
                className: 'lark-request-fullscreen lark-icon-request-fullscreen'
            }), Dom.createElement('div', {
                // @todo 需要一个非全屏的按钮 sueb
                className: 'lark-exit-fullscreen'
            }));
        }
    }]);

    return FullscreenButton;
}(_component2.default);

exports.default = FullscreenButton;


_component2.default.registerComponent('FullscreenButton', FullscreenButton);

},{"../component":1,"../utils/dom":27,"../utils/events":28,"../utils/feature-detector":29,"./tooltip":23}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 播放器 UI loading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var GradientBottom = function (_Component) {
    _inherits(GradientBottom, _Component);

    function GradientBottom() {
        _classCallCheck(this, GradientBottom);

        return _possibleConstructorReturn(this, (GradientBottom.__proto__ || Object.getPrototypeOf(GradientBottom)).apply(this, arguments));
    }

    _createClass(GradientBottom, [{
        key: 'createEl',
        value: function createEl() {
            return this.createElement('div', { className: 'lark-gradient-bottom' });
        }
    }]);

    return GradientBottom;
}(_component2.default);

exports.default = GradientBottom;


_component2.default.registerComponent('GradientBottom', GradientBottom);

},{"../component":1}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

require('./loading');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 播放器 UI loading pc 版
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/8
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var LoadingPc = function (_Component) {
    _inherits(LoadingPc, _Component);

    function LoadingPc() {
        _classCallCheck(this, LoadingPc);

        return _possibleConstructorReturn(this, (LoadingPc.__proto__ || Object.getPrototypeOf(LoadingPc)).apply(this, arguments));
    }

    _createClass(LoadingPc, [{
        key: 'createEl',
        value: function createEl() {
            var el = this.createElement('div', { className: 'lark-loading-pc' }, this.createElement('div', { className: 'lark-loading-area' }, this.createElement('div', { className: 'lark-loading-spinner' })));

            return el;
        }
    }]);

    return LoadingPc;
}(_component2.default);

exports.default = LoadingPc;


_component2.default.registerComponent('LoadingPc', LoadingPc);

},{"../component":1,"./loading":17}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 播放器 UI loading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Loading = function (_Component) {
    _inherits(Loading, _Component);

    function Loading() {
        _classCallCheck(this, Loading);

        return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
    }

    _createClass(Loading, [{
        key: 'createEl',
        value: function createEl() {
            var loadingSpinner = Dom.createElement('span', {
                className: 'lark-loading-area__spinner lark-icon-loading'
            });

            var loadingText = Dom.createElement('span', {
                className: 'lark-loading-area__text'
            }, '正在加载');

            var loadingCnt = Dom.createElement('div', {
                className: 'lark-loading-cnt'
            }, loadingSpinner, loadingText);

            return Dom.createElement('div', {
                className: 'lark-loading-area'
            }, loadingCnt);
        }
    }]);

    return Loading;
}(_component2.default);

exports.default = Loading;


_component2.default.registerComponent('Loading', Loading);

},{"../component":1,"../utils/dom":27}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _featureDetector = require('../utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file playButton.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/7
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var PlayButton = function (_Component) {
    _inherits(PlayButton, _Component);

    function PlayButton(player, options) {
        _classCallCheck(this, PlayButton);

        // 注意 这里需要将 context（第二个参数） 设置为 this.el，因为这时 DOM 元素还没有插入到 document 里，所以在 document 里是查不到这个元素的
        var _this = _possibleConstructorReturn(this, (PlayButton.__proto__ || Object.getPrototypeOf(PlayButton)).call(this, player, options));

        _this.playBtn = Dom.$('.lark-play-button__play', _this.el);
        _this.pauseBtn = Dom.$('.lark-play-button__pause', _this.el);

        var eventName = _featureDetector2.default.touch ? 'touchend' : 'click';

        Events.on(_this.playBtn, eventName, function (event) {
            return _this.togglePlay(event, true);
        });
        Events.on(_this.pauseBtn, eventName, function (event) {
            return _this.togglePlay(event, false);
        });
        return _this;
    }

    _createClass(PlayButton, [{
        key: 'togglePlay',
        value: function togglePlay(event, isPlay) {
            if (isPlay) {
                if (this.player.paused()) {
                    this.player.play();
                }
            } else {
                if (!this.player.paused()) {
                    this.player.pause();
                }
            }
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var playIcon = Dom.createElement('div', {
                className: 'lark-play-button__play lark-icon-play',
                title: 'play'
            });

            var pauseIcon = Dom.createElement('div', {
                className: 'lark-play-button__pause lark-icon-pause',
                title: 'pause'
            });

            var playButton = Dom.createElement('div', {
                className: 'lark-play-button'
            }, playIcon, pauseIcon);

            if (!this.options.className) {
                Dom.addClass(playButton, 'lark-play-button-mobile');
            } else {
                Dom.addClass(playButton, this.options.className);
            }

            return playButton;
        }
    }]);

    return PlayButton;
}(_component2.default);

exports.default = PlayButton;


_component2.default.registerComponent('PlayButton', PlayButton);

},{"../component":1,"../utils/dom":27,"../utils/events":28,"../utils/feature-detector":29}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./buffer-bar');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar.js 视频进度条
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @desc
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    1) 写这个类主要是为了 DOM 结构，把 bufferBar 放到 progressBarExceptFill，这样才能方便地使用 flex 布局
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           => progressBar 的高度等于整个 controlBar 的高度，方便用户点击
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           => progressBar 中包含 progressBarExceptFill，这是 progressBar 的主体，使用 relative，方便子元素相对于他定位
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           => progressBarExceptFill 中包含 bufferBar。之所以把 bufferBar 放到里面，是因为定位方便。我之前试过将 bufferBar 放到跟 progressBarExceptFill
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *              同级然后通过 position: absolute 定位。但在 ios 和 安卓下是有问题的（奇怪的是 chrome 模拟器没问题）。绝对定位的元素被排挤到了父元素之外的空间
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *              可以自己做下实验外带参考下 https://www.w3.org/TR/css-flexbox-1/#abspos-items
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProgressBarExceptFill = function (_Component) {
    _inherits(ProgressBarExceptFill, _Component);

    function ProgressBarExceptFill() {
        _classCallCheck(this, ProgressBarExceptFill);

        return _possibleConstructorReturn(this, (ProgressBarExceptFill.__proto__ || Object.getPrototypeOf(ProgressBarExceptFill)).apply(this, arguments));
    }

    _createClass(ProgressBarExceptFill, [{
        key: 'createEl',
        value: function createEl() {
            var lineHandle = Dom.createElement('div', {
                className: 'lark-progress-bar__line__handle'
            }, Dom.createElement('div', {
                className: 'lark-progress-bar__line__handle-except-fill'
            }));

            var line = Dom.createElement('div', {
                className: 'lark-progress-bar__line'
            }, lineHandle);

            var progressBarBackground = Dom.createElement('div', {
                className: 'lark-progress-bar__background'
            });

            return Dom.createElement('div', {
                className: 'lark-progress-bar-except-fill'
            }, progressBarBackground, line);
        }
    }]);

    return ProgressBarExceptFill;
}(_component2.default);

exports.default = ProgressBarExceptFill;


ProgressBarExceptFill.prototype.options = {
    children: ['bufferBar']
};

_component2.default.registerComponent('ProgressBarExceptFill', ProgressBarExceptFill);

},{"../component":1,"../utils/dom":27,"./buffer-bar":7}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./buffer-bar');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar-simple.js 简易版的进度条，当控制条消失时在视频底部显示
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProgressBarSimple = function (_Component) {
    _inherits(ProgressBarSimple, _Component);

    function ProgressBarSimple(player, options) {
        _classCallCheck(this, ProgressBarSimple);

        var _this = _possibleConstructorReturn(this, (ProgressBarSimple.__proto__ || Object.getPrototypeOf(ProgressBarSimple)).call(this, player, options));

        _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_this);
        _this.line = Dom.$('.lark-progress-bar__line', _this.el);
        player.on('timeupdate', _this.handleTimeUpdate);
        return _this;
    }

    _createClass(ProgressBarSimple, [{
        key: 'handleTimeUpdate',
        value: function handleTimeUpdate() {
            // 进度条
            var percent = 0;
            var duration = this.player.duration();
            var currentTime = this.player.currentTime();
            if (duration && currentTime) {
                // 保留两位小数四舍五入
                percent = Math.round(currentTime / duration * 100) / 100;
                // 转换为百分数
                percent = percent * 100 + '%';
            }

            this.line.style.width = percent;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.line.style.width = 0;
            this.children.forEach(function (child) {
                child && child.reset && child.reset();
            });
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var line = Dom.createElement('div', {
                className: 'lark-progress-bar__line'
            });

            var background = Dom.createElement('div', {
                className: 'lark-progress-bar__background'
            });

            return Dom.createElement('div', {
                className: 'lark-progress-bar--simple'
            }, background, line);
        }
    }]);

    return ProgressBarSimple;
}(_component2.default);

_component2.default.registerComponent('ProgressBarSimple', ProgressBarSimple);

ProgressBarSimple.prototype.options = {
    children: ['bufferBar']
};

exports.default = ProgressBarSimple;

},{"../component":1,"../utils/dom":27,"./buffer-bar":7}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _featureDetector = require('../utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

var _timeFormat = require('../utils/time-format');

require('./progress-bar-except-fill');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar.js 视频进度条
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/15 支持 pc 端拖拽和 tooltip
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProgressBar = function (_Slider) {
    _inherits(ProgressBar, _Slider);

    function ProgressBar(player, options) {
        _classCallCheck(this, ProgressBar);

        var _this = _possibleConstructorReturn(this, (ProgressBar.__proto__ || Object.getPrototypeOf(ProgressBar)).call(this, player, options));

        _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.onSlideStart = _this.onSlideStart.bind(_this);
        _this.onSlideMove = _this.onSlideMove.bind(_this);
        _this.onSlideEnd = _this.onSlideEnd.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.reset = _this.reset.bind(_this);
        _this.handleMouseOver = _this.handleMouseOver.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);

        _this.line = Dom.$('.lark-progress-bar__line', _this.el);
        _this.lineHandle = Dom.$('.lark-progress-bar__line__handle', _this.el);
        _this.hoverLight = Dom.$('.lark-progress-bar-hover-light', _this.el);
        _this.paddingEl = Dom.$('.lark-progress-bar-padding', _this.el);

        player.on('timeupdate', _this.handleTimeUpdate);
        _this.on('click', _this.handleClick);
        _this.on('touchstart', _this.handleSlideStart);

        if (!_featureDetector2.default.touch) {
            _this.on('mousedown', _this.handleSlideStart);
            _this.on('mouseover', _this.handleMouseOver);
            _this.on('mousemove', _this.handleMouseMove);
            _this.on('mouseout', _this.handleMouseOut);
        }
        return _this;
    }

    _createClass(ProgressBar, [{
        key: 'handleTimeUpdate',
        value: function handleTimeUpdate() {
            // 进度条
            var percent = 0;
            var duration = this.player.duration();
            var currentTime = this.player.currentTime();
            if (duration && currentTime) {
                percent = currentTime / duration * 100 + '%';
            }

            this.line.style.width = percent;
        }
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.update(event);
        }
    }, {
        key: 'onSlideStart',
        value: function onSlideStart(event) {
            this.originalPaused = this.player.paused();
        }
    }, {
        key: 'onSlideMove',
        value: function onSlideMove(event) {
            event.preventDefault();

            if (!this.player.paused()) {
                this.player.pause();
            }

            this.update(event);
        }
    }, {
        key: 'onSlideEnd',
        value: function onSlideEnd(event) {
            // 如果播放器在拖动进度条前不是处于暂停状态，那么拖动完了之后继续播放
            if (this.player.paused && !this.originalPaused && this.originalPaused !== undefined) {
                this.player.play();
            }
        }
    }, {
        key: 'update',
        value: function update(event) {
            var pos = Dom.getPointerPosition(this.el, event);
            var percent = pos.x * 100 + '%';
            var currentTime = this.player.duration() * pos.x;

            this.player.currentTime(currentTime);
            this.line.style.width = percent;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.line.style.width = 0;
            this.children.forEach(function (child) {
                child && child.reset && child.reset();
            });
        }
    }, {
        key: 'showToolTip',
        value: function showToolTip(event) {
            var duration = this.player.duration();
            if (duration) {
                var pointerPos = Dom.getPointerPosition(this.el, event);
                // const elPos = Dom.findPosition(this.el);

                // const top = elPos.top - (this.paddingEl.offsetHeight - this.line.offsetHeight);
                // const left = elPos.left + this.el.offsetWidth * pointerPos.x;
                var currentTime = parseInt(duration * pointerPos.x, 10);

                if (!isNaN(currentTime)) {
                    _tooltip2.default.show({
                        // top: top,
                        // left: left,
                        hostEl: this.el,
                        margin: 13,
                        placement: 'top',
                        isFollowMouse: true,
                        event: event,
                        content: (0, _timeFormat.timeFormat)(Math.floor(currentTime))
                    });
                }
            }
        }
    }, {
        key: 'showHoverLine',
        value: function showHoverLine(event) {
            var pointerPos = Dom.getPointerPosition(this.el, event);
            var left = this.el.offsetWidth * pointerPos.x;

            this.hoverLight.style.width = left + 'px';
        }
    }, {
        key: 'hideHoverLine',
        value: function hideHoverLine(event) {
            this.hoverLight.style.width = 0;
        }
    }, {
        key: 'handleMouseOver',
        value: function handleMouseOver(event) {
            this.showToolTip(event);
            this.showHoverLine(event);
        }
    }, {
        key: 'handleMouseMove',
        value: function handleMouseMove(event) {
            this.showToolTip(event);
            this.showHoverLine(event);
        }
    }, {
        key: 'handleMouseOut',
        value: function handleMouseOut(event) {
            _tooltip2.default.hide();
            this.hideHoverLine(event);
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var className = 'lark-progress-bar';
            if (this.options.className) {
                className = className + ' ' + this.options.className;
            }

            return this.createElement('div', { className: className }, this.createElement('div', { className: 'lark-progress-bar-padding' }), this.createElement('div', { className: 'lark-progress-bar-hover-light' }), this.createElement('progressBarExceptFill'));
        }
    }]);

    return ProgressBar;
}(_slider2.default);

exports.default = ProgressBar;


_component2.default.registerComponent('ProgressBar', ProgressBar);

},{"../component":1,"../utils/dom":27,"../utils/feature-detector":29,"../utils/time-format":38,"./progress-bar-except-fill":19,"./slider":22,"./tooltip":23}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file slide.js 所有需要拖动的元素的父类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Slider = function (_Component) {
    _inherits(Slider, _Component);

    function Slider(player, options) {
        _classCallCheck(this, Slider);

        var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, player, options));

        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleSlideStart = _this.handleSlideStart.bind(_this);
        _this.handleSlideMove = _this.handleSlideMove.bind(_this);
        _this.handleSlideEnd = _this.handleSlideEnd.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.onSlideStart = _this.onSlideStart.bind(_this);
        _this.onSlideMove = _this.onSlideMove.bind(_this);
        _this.onSlideEnd = _this.onSlideEnd.bind(_this);
        return _this;
    }

    _createClass(Slider, [{
        key: 'onClick',
        value: function onClick(event) {}
    }, {
        key: 'onSlideStart',
        value: function onSlideStart(event) {}
    }, {
        key: 'onSlideMove',
        value: function onSlideMove(event) {}
    }, {
        key: 'onSlideEnd',
        value: function onSlideEnd(event) {}
    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            this.onClick(event);
        }
    }, {
        key: 'handleSlideStart',
        value: function handleSlideStart(event) {
            this.onSlideStart(event);

            this.addClass('lark-sliding');

            Events.on(document, 'touchmove', this.handleSlideMove);
            Events.on(document, 'touchend', this.handleSlideEnd);
            Events.on(document, 'mousemove', this.handleSlideMove);
            Events.on(document, 'mouseup', this.handleSlideEnd);
        }
    }, {
        key: 'handleSlideMove',
        value: function handleSlideMove(event) {
            this.onSlideMove(event);
        }
    }, {
        key: 'handleSlideEnd',
        value: function handleSlideEnd(event) {
            this.onSlideEnd(event);

            this.removeClass('lark-sliding');

            Events.off(document, 'touchmove', this.handleSlideMove);
            Events.off(document, 'touchend', this.handleSlideEnd);
            Events.off(document, 'mousemove', this.handleSlideMove);
            Events.off(document, 'mouseup', this.handleSlideEnd);
        }
    }]);

    return Slider;
}(_component2.default);

exports.default = Slider;

},{"../component":1,"../utils/events":28}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
    id: 'lark-tooltip',
    el: null,
    timeoutHandler: null,
    initial: function initial(container) {
        if (this.el) {
            return;
        }

        if (!Dom.isEl(container)) {
            return;
        }

        var el = Dom.createElement('div', {
            className: this.id,
            id: this.id
        });
        Dom.appendContent(container, el);

        this.el = el;
        this.container = container;
    },
    normalize: function normalize(options) {
        return Object.assign({
            timeout: 0,
            content: '',
            top: 0,
            left: 0,
            margin: 0,
            hostEl: null,
            placement: 'top',
            isFollowMouse: false,
            // 这个 event 有点鸡肋，但要获取鼠标位置的时候（即 isFollowMouse: true），必须得从 event 参数里获取
            event: null
        }, options);
    },
    getCoordinate: function getCoordinate(options) {
        var coordinate = void 0;

        switch (options.placement) {
            case 'top':
                // @todo 可以 cache
                var hostElRect = Dom.getBoundingClientRect(options.hostEl);
                var containerRect = Dom.getBoundingClientRect(this.container);

                var left = void 0;
                if (options.isFollowMouse) {
                    var pointerPos = Dom.getPointerPosition(options.hostEl, options.event);
                    left = hostElRect.left - containerRect.left + hostElRect.width * pointerPos.x - this.el.offsetWidth / 2;
                } else {
                    left = hostElRect.left - containerRect.left + (hostElRect.width - this.el.offsetWidth) / 2;
                }

                var outOfBounds = left + this.el.offsetWidth - this.container.offsetWidth;
                if (outOfBounds > 0) {
                    left = left - outOfBounds;
                }

                var top = hostElRect.top - containerRect.top - this.el.offsetHeight - options.margin;
                coordinate = { left: left, top: top };
                break;
        }

        return coordinate;
    },
    show: function show(options) {
        var _this = this;

        clearTimeout(this.timeoutHandler);

        options = this.normalize(options);

        if (!Dom.isEl(options.hostEl)) {
            return;
        }

        if (!this.el) {
            var container = Dom.parent(options.hostEl, 'larkplayer');
            this.initial(container);
        }

        Dom.replaceContent(this.el, options.content);

        setTimeout(function () {
            // 元素 display none 时获取到的 offsetHeight 和 offsetWidth 是 0
            // 所以先以 visibility: hidden 的方式“显示”元素，以获取正确的高宽
            _this.el.style.visibility = 'hidden';
            _this.el.style.display = 'block';
            var coordinate = _this.getCoordinate(options);
            _this.el.style.top = coordinate.top + 'px';
            _this.el.style.left = coordinate.left + 'px';
            _this.el.style.visibility = 'visible';
        }, 0);
    },
    hide: function hide() {
        var _this2 = this;

        if (!this.el) {
            return;
        }

        this.timeoutHandler = setTimeout(function () {
            _this2.el.style.display = 'none';
        });
    }
}; /**
    * @file tooltip.js 用于展示提示性文字
    * @author yuhui06
    * @date 2018/3/22
    */

},{"../utils/dom":27}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 音量 UI 组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Volume = function (_Slider) {
    _inherits(Volume, _Slider);

    function Volume(player, options) {
        _classCallCheck(this, Volume);

        var _this = _possibleConstructorReturn(this, (Volume.__proto__ || Object.getPrototypeOf(Volume)).call(this, player, options));

        _this.onSlideStart = _this.onSlideStart.bind(_this);
        _this.onSlideMove = _this.onSlideMove.bind(_this);
        _this.onSlideEnd = _this.onSlideEnd.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.iconClick = _this.iconClick.bind(_this);
        _this.handleIconMouseOver = _this.handleIconMouseOver.bind(_this);
        _this.handleIconMouseOut = _this.handleIconMouseOut.bind(_this);
        _this.switchStatus = _this.switchStatus.bind(_this);
        _this.clearStatus = _this.clearStatus.bind(_this);

        _this.line = Dom.$('.lark-volume-line__line', _this.el);
        _this.ball = Dom.$('.lark-volume-line__ball', _this.el);
        _this.icon = Dom.$('.lark-volume-icon', _this.el);

        Events.on(_this.icon, 'click', _this.iconClick);
        Events.on(_this.icon, 'mouseover', _this.handleIconMouseOver);
        Events.on(_this.icon, 'mouseout', _this.handleIconMouseOut);
        Events.on(_this.line, 'click', _this.handleClick);
        Events.on(_this.ball, 'mousedown', _this.handleSlideStart);
        Events.on(_this.ball, 'touchstart', _this.handleSlideStart);
        return _this;
    }

    _createClass(Volume, [{
        key: 'onSlideStart',
        value: function onSlideStart(event) {
            this.lastVolume = this.player.volume();
        }
    }, {
        key: 'onSlideMove',
        value: function onSlideMove(event) {
            event.preventDefault();
            var pos = Dom.getPointerPosition(this.line, event);
            this.update(pos.x);
        }
    }, {
        key: 'onSlideEnd',
        value: function onSlideEnd(event) {
            if (this.player.volume() !== 0) {
                this.lastVolume = null;
            }
        }
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.lastVolume = this.player.volume();

            var pos = Dom.getPointerPosition(this.line, event);
            this.update(pos.x);

            if (this.player.volume() !== 0) {
                this.lastVolume = null;
            }
        }
    }, {
        key: 'update',
        value: function update(percent) {
            var lineWidth = this.line.offsetWidth;

            this.ball.style.left = percent * lineWidth + 'px';
            this.player.volume(percent);
            this.switchStatus(percent);
        }
    }, {
        key: 'iconClick',
        value: function iconClick(event) {
            // 点击静音
            if (this.lastVolume == null) {
                this.lastVolume = this.player.volume();
                this.update(0);
            } else {
                // 再次点击时恢复上次的声音
                this.update(this.lastVolume);
                this.lastVolume = null;
            }

            this.handleIconMouseOver();
        }
    }, {
        key: 'handleIconMouseOver',
        value: function handleIconMouseOver() {
            _tooltip2.default.show({
                hostEl: this.icon,
                margin: 16,
                content: this.lastVolume == null ? '静音' : '取消静音'
            });
        }
    }, {
        key: 'handleIconMouseOut',
        value: function handleIconMouseOut(event) {
            _tooltip2.default.hide();
        }
    }, {
        key: 'switchStatus',
        value: function switchStatus(volume) {
            this.clearStatus();

            var status = void 0;
            if (volume === 0) {
                status = 'small';
            } else if (volume <= 0.6 && volume > 0) {
                status = 'middle';
            } else if (volume > 0.6) {
                status = 'large';
            }

            Dom.addClass(this.icon, 'lark-icon-sound-' + status);
        }
    }, {
        key: 'clearStatus',
        value: function clearStatus() {
            var _this2 = this;

            var statusClass = ['lark-icon-sound-small', 'lark-icon-sound-middle', 'lark-icon-sound-large'];
            statusClass.forEach(function (className) {
                Dom.removeClass(_this2.icon, className);
            });
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var volumeIcon = this.createElement('div', { className: 'lark-volume-icon lark-icon-sound-large' });

            var volumeLine = this.createElement('div', { className: 'lark-volume-line' }, this.createElement('div', { className: 'lark-volume-line__line' }, this.createElement('div', { className: 'lark-volume-line__line-padding' })), this.createElement('div', { className: 'lark-volume-line__ball' }));

            return this.createElement('div', { className: 'lark-volume' }, volumeIcon, volumeLine);
        }
    }]);

    return Volume;
}(_slider2.default);

exports.default = Volume;


_component2.default.registerComponent('Volume', Volume);

},{"../component":1,"../utils/dom":27,"../utils/events":28,"./slider":22,"./tooltip":23}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = computedStyle;
/**
 * @file 获取元素指定样式的值
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

/**
 * 获取元素指定样式
 * 主要针对 window.getComputedStyle 做兼容处理
 *
 * @param {Element} el 从该元素的上获取指定样式值
 * @param {string} prop 要获取的样式
 * @return {string} 样式值
 *
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function computedStyle(el, prop) {
    if (!el || !prop) {
        return '';
    }

    if (typeof window.getComputedStyle === 'function') {
        var styleCollection = window.getComputedStyle(el);
        return styleCollection ? styleCollection[prop] : '';
    }

    return el.currentStyle && el.currentStyle[prop] || '';
}

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getData = getData;
exports.hasData = hasData;
exports.removeData = removeData;

var _guid = require('./guid');

// 所有的数据会存在这里
// 我们可以将数据与 DOM 元素绑定，但又不是直接将数据放在它上面
// eg. Event listeners 是通过这种方式绑定的
var elData = {};

// @test
/**
 * @file dom-data.js
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 * @desc
 *      1) 这是一个神奇的方法，看好了，最好别眨眼😉
 *      2) 这里没有 setData 方法，只负责取数据就行了。我们往取回来的数据里塞东西，自然就存起来了
 */

window.elData = elData;

// 每次当然要存在不一样的地方
var elIdAttr = 'larkplayer_data_' + Date.now();

/**
 * 获取 DOM 元素上的数据
 *
 * @param {Element} el 获取该元素上的数据
 * @return {Object} 想要的数据
 */
function getData(el) {
    var id = el[elIdAttr];

    if (!id) {
        id = el[elIdAttr] = (0, _guid.newGUID)();
    }

    if (!elData[id]) {
        elData[id] = {};
    }

    return elData[id];
}

/**
 * 判断一个元素上是否有我们存的数据
 *
 * @param {Element} el 就是要看这个元素上有没有我们之前存的数据
 * @return {boolean} 元素上是否存有数据
 */
function hasData(el) {
    var id = el[elIdAttr];

    if (!id || !elData[id]) {
        return false;
    }

    return !!Object.keys(elData[id]).length;
}

/**
 * 删除我们之前在元素上存放的数据
 *
 * @param {Element} el 宿主元素
 */
function removeData(el) {
    var id = el[elIdAttr];

    if (!id) {
        return;
    }

    // 删除存放的数据
    delete elData[id];

    // 同时删除 DOM 上的对应属性
    try {
        delete el[elIdAttr];
    } catch (e) {
        if (el.removeAttribute) {
            el.removeAttribute(elIdAttr);
        } else {
            // IE document 节点似乎不支持 removeAttribute 方法
            el[elIdAttr] = null;
        }
    }
}

},{"./guid":31}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.$$ = exports.$ = undefined;
exports.isReal = isReal;
exports.isEl = isEl;
exports.createQuerier = createQuerier;
exports.createEl = createEl;
exports.createElement = createElement;
exports.textContent = textContent;
exports.normalizeContent = normalizeContent;
exports.isTextNode = isTextNode;
exports.prependTo = prependTo;
exports.parent = parent;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;
exports.setAttributes = setAttributes;
exports.getAttributes = getAttributes;
exports.getAttribute = getAttribute;
exports.setAttribute = setAttribute;
exports.removeAttribute = removeAttribute;
exports.blockTextSelection = blockTextSelection;
exports.unblockTextSelection = unblockTextSelection;
exports.getBoundingClientRect = getBoundingClientRect;
exports.findPosition = findPosition;
exports.getPointerPosition = getPointerPosition;
exports.emptyEl = emptyEl;
exports.appendContent = appendContent;
exports.insertContent = insertContent;
exports.replaceContent = replaceContent;

var _obj = require('./obj');

var _computedStyle = require('./computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file dom 相关 api
 * @author yuhui06@baidu.com
 * @date 2017/11/2
 */

var document = window.document;

/**
 * 检测一个字符串是否包含任何非空格的字符
 *
 * @inner
 *
 * @param {string} str 待检查的字符串
 * @return {boolean} 是否包含非空格的字符
 */
function isNonBlankString(str) {
    return typeof str === 'string' && /\S/.test(str);
}

/**
 * 如果字符串中包含空格，则抛出错误
 *
 * @inner
 *
 * @param {string} str 待检查的字符串
 * @throws {Error}
 */
function throwIfWhitespace(str) {
    if (/\s/.test(str)) {
        throw new Error('class has illegal whitespace characters');
    }
}

/**
 * 生成一个正则表达式，用于检查一个元素的 className 字符串中是否包含特定的 className
 *
 * @inner
 *
 * @param {string} className 就是为了他！
 * @return {Regexp} 用于检查该类名是否存在于一个元素的 className 字符串中
 */
function classRegExp(className) {
    return new RegExp('(^|\\s)' + className + '($|\\$)');
}

/**
 * 是否处于浏览器环境中
 *
 * @return {boolean}
 */
function isReal() {
    // IE 9 以下，DOM 上的方法的 typeof 类型为 'object' 而不是 'function'
    // 所以这里用 'undefined' 检测
    return typeof document.createElement !== 'undefined';
}

/**
 * 判断一个变量是否是 DOM element
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 是否是 DOM element
 */
function isEl(value) {
    return (0, _obj.isObject)(value) && value.nodeType === 1;
}

/**
 * 创建一个 DOM 查询函数，这个函数在原有方法的基础上有额外的指定上下文的功能
 *
 * @param {string} method 方法名
 * @return {Function} 查询 DOM 用的函数
 */
function createQuerier(method) {
    return function (selector, context) {
        if (!isNonBlankString(selector)) {
            return document[method](null);
        }
        if (isNonBlankString(context)) {
            context = document.querySelector(context);
        }

        var ctx = isEl(context) ? context : document;

        return ctx[method] && ctx[method](selector);
    };
}

/**
 * 创建 DOM 元素
 *
 * @param {string=} tagName 元素类型。可选，默认 div
 * @param {Object=} properties 元素 prop 属性。可选，默认无
 * @param {Object=} attributes 元素 attr 属性。可选，默认无
 * @param {string|Element|TextNode|Array|Function=} content 元素内容。可选，默认无
 * @return {Element} el 创建的元素
 */
function createEl() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
    var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var content = arguments[3];

    var el = document.createElement(tagName);

    if (properties == null) {
        properties = {};
    }

    if (attributes == null) {
        attributes = {};
    }

    Object.keys(properties).forEach(function (propName) {
        var val = properties[propName];

        // 对于一些属性需要特殊处理
        if (propName.indexOf('aria-') !== -1 || propName === 'role' || propName === 'type') {

            el.setAttribute(propName, val);
        } else if (propName === 'textContent') {
            // textContent 并不是所有浏览器都支持，单独写了个方法
            textContent(el, val);
        } else {
            el[propName] = val;
        }
    });

    Object.keys(attributes).forEach(function (attrName) {
        el.setAttribute(attrName, attributes[attrName]);
    });

    if (content) {
        appendContent(el, content);
    }

    return el;
}

/**
 * 创建一个元素，并能添加 props 和 子元素
 *
 * vjs 的 createEl 将 props 和 attrs 分成了两个参数，但是我们的业务没必要这么做
 * 而且每次想要传 child 参数的时候，还得先传 attrs 参数让我觉得很烦
 *
 * @todo 先写一个这个函数自己用，后面看有没有必要把 createEl 函数换掉
 *
 * @param {string} tagName DOM 元素标签名
 * @param {Object=} props 要到 DOM 元素上的属性。注意，这里直接是 el.propName = value 的形式，如果涉及到 attrs，建议后续用 setAttrbute 自己添加
 * @param {...Element|string} child 元素的子元素，参数个数不限。可以没有，也可以有多个
 * @return {Element} el 创建的元素
 */
function createElement() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var el = document.createElement(tagName);

    if (props == null) {
        props = {};
    }
    Object.keys(props).forEach(function (propName) {
        el[propName] = props[propName];
    });

    for (var _len = arguments.length, child = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        child[_key - 2] = arguments[_key];
    }

    if (child) {
        appendContent(el, child);
    }

    return el;
}

/**
 * 更改 DOM 元素中的文本节点（整个文本内容都会被替换掉）
 *
 * @param {Element} el 将要改变文本节点的 DOM 元素
 * @param {string} text 要添加的文本
 * @return {Element} el 更改后的 DOM 元素
 */
function textContent(el, text) {
    if (typeof el.textContent === 'undefined') {
        el.innerText = text;
    } else {
        el.textContent = text;
    }

    return el;
}

/**
 * 将要插入到 DOM 元素中的内容标准化
 *
 * 使用 createTextNode 而不是 createElement 避免 XSS 漏洞
 *
 * @param {string|Element|TextNode|Array|Function} content
 *        - string: 标准化为 text node
 *        - Element/TextNode: 不做任何处理
 *        - Array: 遍历处理数组元素
 *        - Function: 先运行得到结果再处理
 * @return {Array} 标准化后的内容
 */
function normalizeContent(content) {
    if (typeof content === 'function') {
        content = content();
    }

    return (Array.isArray(content) ? content : [].concat(content)).map(function (value) {
        if (typeof value === 'function') {
            value = value();
        }

        if (isEl(value) || isTextNode(value)) {
            return value;
        }

        if (isNonBlankString(value)) {
            return document.createTextNode(value);
        }
    }).filter(function (value) {
        return value;
    });
}

/**
 * 判断一个变量是否是 textNode
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 是否是 textNode
 */
function isTextNode(value) {
    return (0, _obj.isObject)(value) && value.nodeType === 3;
}

/**
 * 将一个元素插入到另一个中作为第一个子元素
 *
 * @param {Element} child 最终的子元素
 * @param {Element} parent 最终的父元素
 */
function prependTo(child, parent) {
    if (parent.firstChild) {
        parent.insertBefore(child, parent.firstChild);
    } else {
        parent.appendChild(child);
    }
}

/**
 * 返回指定元素的最近的命中选择器的父元素
 *
 * @param {Element} el 要寻找父元素的指定元素
 * @param {string} classForSelector 目前只支持 class 选择器
 * @return {Element|null} 选择器命中的最近的父元素列表
 */
function parent(el, classForSelector) {
    var result = null;
    while (el && el.parentNode) {
        if (hasClass(el.parentNode, classForSelector)) {
            result = el.parentNode;
            el = null;
        } else {
            el = el.parentNode;
        }
    }

    return result;
}

/**
 * 检查指定元素是否包含指定 class
 *
 * @param {Element} el 宿主元素
 * @param {string} classToCheck 待检查的 class
 * @return {boolean} 元素上是否包含指定 class
 */
function hasClass(el, classToCheck) {
    throwIfWhitespace(classToCheck);

    if (el.classList) {
        // node.contains(otherNode)
        return el.classList.contains(classToCheck);
    } else {
        return classRegExp(classToCheck).test(el.className);
    }
}

/**
 * 给指定元素增加 class
 *
 * @param {Element} el 要添加 class 的元素
 * @param {string} classToAdd 要添加的 class
 * @return {Element} 添加完 class 后的元素
 */
function addClass(el, classToAdd) {
    if (el.classList) {
        el.classList.add(classToAdd);
    } else if (!hasClass(el, classToAdd)) {
        el.className = (el.className + ' ' + classToAdd).trim();
    }

    return el;
}

/**
 * 移除指定元素的指定 class
 *
 * @param {Element} el 要移除 class 的元素
 * @param {string} classToRemove 要移除的 class
 * @return {Element} 移除指定 class 后的元素
 */
function removeClass(el, classToRemove) {
    if (hasClass(el, classToRemove)) {
        if (el.classList) {
            el.classList.remove(classToRemove);
        } else {
            el.className = el.className.split(/\s+/).filter(function (className) {
                return className !== classToRemove;
            }).join(' ');
        }
    }

    return el;
}

/**
 * 增加或删除一个元素上的指定的 class
 *
 * @param {Element} el 将要改变 class 的元素
 * @param {string} classToToggle 要添加或删除的 class
 * @param {Function|boolean=} predicate 添加或删除 class 的依据（额外的判断条件）
 * @return {Element} 改变完 class 后的元素
 */
function toggleClass(el, classToToggle, predicate) {
    // IE 下不支持 el.classList.toggle 方法的第二个参数
    // 不过不影响，因为这里我们用 add/remove
    var has = hasClass(el, classToToggle);

    if (typeof predicate === 'function') {
        predicate = predicate(el, classToToggle);
    }

    if (typeof predicate !== 'boolean') {
        predicate = !has;
    }

    if (predicate === has) {
        return;
    }

    if (predicate) {
        addClass(el, classToToggle);
    } else {
        removeClass(el, classToToggle);
    }

    return el;
}

/**
 * 设置元素的属性
 *
 * @param {Element} el 要设置属性的元素
 * @param {Object} attributes 要设置的属性集合
 */
function setAttributes(el, attributes) {
    Object.keys(attributes).forEach(function (attrName) {
        var attrValue = attributes[attrName];

        if (attrValue == null || attrValue === false) {
            el.removeAttribute(attrName);
        } else {
            el.setAttribute(attrName, attrValue === true ? '' : attrValue);
        }
    });
}

/**
 * 获取元素的所有属性，将 DOM 的 NamedNodeMap 表示为 key/value 的形式
 *
 * @param {Element} el 要获取属性的元素
 * @return {Object} 以 key/value 形式存储的属性
 * @desc
 *      1) boolean 的属性，其值为 true/false
 */
function getAttributes(el) {
    var collection = {};

    // 已知的值为 boolean 的属性
    // 有些浏览器的这些属性的 typeof 是 boolean，有些不是
    // 列出一个白名单以确保我们想要的效果
    var knownBooleans = ['autoplay', 'controls', 'playsinline', 'webkit-playsinline', 'loop', 'muted', 'default', 'defaultMuted'];

    if (el && el.attributes && el.attributes.length) {
        var attrs = el.attributes;

        for (var i = 0; i < attrs.length; i++) {
            var attrName = attrs[i]['name'];
            var attrValue = attrs[i]['value'];

            if (typeof el[attrName] === 'boolean' || knownBooleans.includes(attrName)) {
                attrValue = attrValue !== null;
            }

            collection[attrName] = attrValue;
        }
    }

    return collection;
}

/**
 * 获取元素的指定属性，element.getAttribute 换一种写法
 *
 * @param {Element} el 要获取属性的元素
 * @param {string} attribute 要获取的属性名
 * @return {string} 获取的属性值
 */
function getAttribute(el, attribute) {
    return el.getAttribute(attribute);
}

/**
 * 设置元素的指定属性 element.setAttribute 换一种写法
 *
 * @param {Element} el 要设置属性的元素
 * @param {string} attr 要设置的属性
 * @param {Mixed} value 要设置的属性的值
 */
function setAttribute(el, attr, value) {
    if (value === false) {
        removeAttribute(el, attr);
    } else {
        // 应该没有属性的值为 "true" 的形式，对于这种，直接转换为空的字符串
        // 如 controls = "true" => controls
        el.setAttribute(attr, value === true ? '' : value);
    }
}

/**
 * 移除元素上的指定属性 element.removeAttribute 换一种写法
 *
 * @param {Element} el 要移除属性的元素
 * @param {string} attribute 要移除的属性名
 */
function removeAttribute(el, attribute) {
    el.removeAttribute(attribute);
}

/**
 * 当拖动东西的时候，尝试去阻塞选中文本的功能
 */
function blockTextSelection() {
    document.body.focus();
    document.onselectstart = function () {
        return false;
    };
}

/**
 * 关闭对文本选中功能的阻塞
 */
function unblockTextSelection() {
    document.onselectstart = function () {
        return true;
    };
}

/**
 * 同原生的 getBoundingClientRect 方法一样，确保兼容性
 *
 * 在一些老的浏览器（比如 IE8）提供的属性不够时，此方法会手动补全
 *
 * 另外，一些浏览器不支持向 ClientRect/DOMRect 对象中添加属性，所以我们选择创建一个新的对象，
 * 并且把 ClientReact 中的标准属性浅拷贝过来（ x 和 y 没有拷贝，因为这个属性支持的并不广泛）
 *
 * @param {Element} el 要获取 ClientRect 对象的元素
 * @return {Object|undefined}
 */
function getBoundingClientRect(el) {
    // TODO 为什么还需要判断 parentNode
    if (el && el.getBoundingClientRect && el.parentNode) {
        var rect = el.getBoundingClientRect();
        var result = {};

        ['top', 'right', 'bottom', 'left', 'width', 'height'].forEach(function (attr) {
            if (rect[attr] !== undefined) {
                result[attr] = rect[attr];
            }
        });

        if (!result.height) {
            result.height = parseFloat((0, _computedStyle2.default)(el, 'height'));
        }

        if (!result.width) {
            result.width = parseFloat((0, _computedStyle2.default)(el, 'width'));
        }

        return result;
    }
}

/**
 * 获取一个元素在文档中的绝对位置（left, top）
 *
 * @see http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @param {Element} el 要获取位置的元素
 * @return {Object} 包含位置信息的对象
 *
 * @desc
 *      1) clientLeft/clientTop 获取一个元素的左/上边框的宽度，不包括 padding 和 margin 的值
 */
function findPosition(el) {
    var box = getBoundingClientRect(el);

    if (!box) {
        return { left: 0, top: 0 };
    }

    var docEl = document.documentElement;
    var body = document.body;

    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var scrollLeft = window.pageXOffset || body.scrollLeft;
    var left = box.left + scrollLeft - clientLeft;

    var clientTop = docEl.clientLeft || body.clientLeft || 0;
    var scrollTop = window.pageYOffset || body.scrollTop;
    var top = box.top + scrollTop - clientTop;

    // 安卓有时侯返回小数，稍微有点偏差，这里四舍五入下
    return {
        left: Math.round(left),
        top: Math.round(top)
    };
}

/**
 * x and y coordinates for a dom element or mouse pointer
 * 以左下角为原点
 *
 * @typedef {Object} DOM~Coordinates
 *
 * @property {number} x  该点距元素左边的距离／元素宽
 * @property {number} y  该点距元素底部的距离／元素高
 */
/**
 * 获取一个元素上被点击的位置（相对于该元素左下角）
 *
 * @param {Element} el 被点击的元素
 * @param {Event} event 点击事件
 * @return {DOM~Coordinates}
 * @desc
 *      1) offsetWidth/offsetHeight: 元素宽／高，包括 border padding width/height scrollbar
 *      2) pageX/pageY: 点击的 x/y 坐标，相对于 document，是个绝对值（当有滚动条时会把滚动条的距离也计算在内）
 *      3) changedTouches: touch 事件中的相关数据
 */
function getPointerPosition(el, event) {
    var box = findPosition(el);
    var boxW = el.offsetWidth;
    var boxH = el.offsetHeight;
    var boxY = box.top;
    var boxX = box.left;

    var pageX = event.pageX;
    var pageY = event.pageY;

    if (event.changedTouches) {
        pageX = event.changedTouches[0].pageX;
        pageY = event.changedTouches[0].pageY;
    }

    return {
        x: Math.max(0, Math.min(1, (pageX - boxX) / boxW)),
        y: Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH))
    };
}

/**
 * 清空一个元素
 *
 * @param {Element} el 要清空的元素
 * @return {Element} 移除所有子元素后的元素
 */
function emptyEl(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    return el;
}

/**
 * 向元素内插入内容
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content 待插入的内容，会先经过 normalizeContent 处理
 * @return {Element} 被塞了新内容的元素
 */
function appendContent(el, content) {
    normalizeContent(content).forEach(function (node) {
        return el.appendChild(node);
    });
    return el;
}

/**
 * 替换元素的内容
 * 感觉名字起得不怎么好
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content
 *        参见 normalizeContent 中参数描述 {@link: dom:normalizeContent}
 * @return {Element} el 替换内容后的元素
 */
function insertContent(el, content) {
    return appendContent(emptyEl(el), content);
}

/**
 * 同 insertContent
 * insertContent 是 vjs 里的函数，但我感觉名字起的不好，我想用这个
 *
 * @todo 看可不可以直接把 insertContent 函数去掉（需考虑到后续对 vjs 插件的影响）;
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content
 *        参见 normalizeContent 中参数描述 {@link: dom:normalizeContent}
 * @return {Element} el 替换内容后的元素
 */
function replaceContent(el, content) {
    return appendContent(emptyEl(el), content);
}

/**
 * 通过选择器和上下文（可选）找到一个指定元素
 *
 * @const
 *
 * @type {Function}
 * @param {string} selector css 选择器，反正最后都会被 querySelector 处理，你看着传吧
 * @param {Element|string=} 上下文环境。可选，默认为 document
 * @return {Element|null} 被选中的元素或 null
 */
var $ = exports.$ = createQuerier('querySelector');

/**
 * 通过选择器和上下文（可选）找到所有符合的元素
 *
 * @const
 *
 * @type {Function}
 * @param {string} selector css 选择器，反正最后都会被 querySelectorAll 处理，你看着传吧
 * @param {Element|string=} 上下文环境。可选，默认为 document
 * @return {NodeList} 被选中的元素列表，如果没有符合条件的元素，空列表
 */
var $$ = exports.$$ = createQuerier('querySelectorAll');

},{"./computed-style":25,"./obj":36}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isPassiveSupported = undefined;
exports.fixEvent = fixEvent;
exports.on = on;
exports.trigger = trigger;
exports.off = off;
exports.one = one;

var _domData = require('./dom-data');

var DomData = _interopRequireWildcard(_domData);

var _guid = require('./guid');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// data.disabled
// data.dispatcher
// data.handlers
// let data = {};

/**
 * @file 事件系统，借用系统事件能力的同时，能添加自定义事件
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

var document = window.document;

/**
 * 清理事件相关的数据(Clean up the listener cache and dispatchers)
 *
 * @inner
 *
 * @param {Element} elem 待清理的元素
 * @param {string} type 待清理的事件类型
 */
function cleanUpEvents(elem, type) {
    var data = DomData.getData(elem);

    // 如果该 type 下已经没有回调函数，那就取消掉之前注册的事件并且删除不必要的属性
    if (data.handlers && data.handlers[type] && data.handlers[type]['length'] === 0) {
        // 删除不必要的属性
        delete data.handlers[type];

        // 删除之前注册的事件
        if (elem.removeEventListener) {
            elem.removeEventListener(type, data.dispatcher, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, data.dispatcher);
        }
    }

    // 如果 hanlders 下已经没有 type，那可以清除 data 下的所有属性了
    if (Object.getOwnPropertyNames(data.handlers).length === 0) {
        delete data.handlers;
        delete data.dispatcher;
        delete data.disabled;
    }

    // 如果 data 的属性已经被清空，那么对应 DOM 上的数据相关的属性也可以清除了
    if (Object.getOwnPropertyNames(data).length === 0) {
        DomData.removeData(elem);
    }
}

/**
 * 循环 types 数组，给每个 type 都执行指定的方法
 *
 * 将需要在不同函数里执行的循环操作抽离出来
 *
 * @inner
 *
 * @param {Function} func 要循环执行的函数
 * @param {Element} elem 宿主元素
 * @param {Array} types 类型数组
 * @param {Function} callback 要注册的回调函数
 */
function handleMultipleEvents(func, elem, types, callback) {
    if (types && types.length) {
        types.forEach(function (type) {
            return func(elem, type, callback);
        });
    }
}

/**
 * 修复事件，使其具有标准的属性
 *
 * @param {Event|Object} event 待修复的事件
 * @return {Object} 修复后的事件
 */
function fixEvent(event) {
    function returnTure() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    // Test if fixing up is needed
    // Used to check if !event.stopPropagation instead of isPropagationStopped
    // But native events return true for stopPropagation, but don't have
    // other expected methods like isPropagationStopped. Seems to be a problem
    // with the Javascript Ninja code. So we're just overriding all events now.
    if (!event || !event.isPropagationStopped) {
        var old = event || window.event;

        event = {};

        // Clone the old object so that we can modify the values event = {};
        // IE8 Doesn't like when you mess with native event properties
        // Firefox returns false for event.hasOwnProperty('type') and other props
        //  which makes copying more difficult.
        // TODO: Probably best to create a whitelist of event props
        for (var key in old) {
            // Safari 6.0.3 warns you if you try to copy deprecated layerX/Y
            // Chrome warns you if you try to copy deprecated keyboardEvent.keyLocation
            // and webkitMovementX/Y
            if (key !== 'layerX' && key !== 'layerY' && key !== 'keyLocation' && key !== 'webkitMovementX' && key !== 'webkitMovementY') {
                // Chrome 32+ warns if you try to copy deprecated returnValue, but
                // we still want to if preventDefault isn't supported (IE8).
                if (!(key === 'returnValue' && old.preventDefault)) {
                    event[key] = old[key];
                }
            }
        }

        // 事件发生在此元素上
        if (!event.target) {
            event.target = event.srcElement || document;
        }

        // 跟事件发生元素有关联的元素
        if (!event.relatedTarget) {
            event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
        }

        // 阻止默认事件
        event.preventDefault = function () {
            if (old.preventDefault) {
                old.preventDefault();
            }

            event.returnValue = false;
            old.returnValue = false;
            event.defaultPrevented = true;
        };

        event.defaultPrevented = false;

        // 阻止事件冒泡
        event.stopPropagation = function () {
            if (old.stopPropagation) {
                old.stopPropagation();
            }

            event.cancelBubble = true;
            old.cancelBubble = true;
            event.isPropagationStopped = returnTure;
        };

        event.isPropagationStopped = returnFalse;

        // 阻止事件冒泡，并且当前阶段的事件也不执行
        event.stopImmediatePropagation = function () {
            if (old.stopImmediatePropagation) {
                old.stopImmediatePropagation();
            }

            event.isImmediatePropagationStopped = returnTure;
            event.stopPropagation();
        };

        event.isImmediatePropagationStopped = returnFalse;

        // 鼠标位置
        if (event.clientX != null) {
            var doc = document.documentElement;
            var body = document.body;

            // clientX 代表与窗口左边的距离，根据页面滚动不同，是可变的
            // pageX 代表相对于文档左边的距离，是个常量
            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);

            event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }

        // 键盘按键
        event.which = event.charCode || event.keyCode;

        // 鼠标按键
        // 0: 左键
        // 1: 中间按钮
        // 2: 右键
        if (event.button != null) {
            // em... 这里应该是 与运算，就没去细究了
            /* eslint-disable */
            event.button = event.button & 1 ? 0 : event.button & 4 ? 1 : event.button & 2 ? 2 : 0;
            /* eslint-disable */
        }
    }

    return event;
}

/**
 * 是否支持 passive event listeners
 * passive event listeners 可以提升页面的滚动性能
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
var isPassiveSupported = exports.isPassiveSupported = false;
(function () {
    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
                // 如果浏览器会来读取这个属性，说明支持该功能
                exports.isPassiveSupported = isPassiveSupported = true;
            }
        });

        window.addEventListener('test', null, opts);
    } catch (ex) {}
})();

/**
 * @const 目前 chrome 支持的 passive event
 */
var passiveEvents = ['touchstart', 'touchmove'];

/**
 * 向元素注册监听函数
 *
 * @todo explain
 * @param {Element|Object} 要绑定事件的元素／对象，这里允许 Object 是考虑到后面讲事件处理作为一种能力赋予任何一个对象
 * @param {string|Array} 事件类型，可以是数组的形式
 * @param {Function} fn 要注册的回调函数
 */
function on(elem, type, fn) {
    if (Array.isArray(type)) {
        return handleMultipleEvents(on, elem, type, fn);
    }

    // 对于自定义的事件，我们只能自己存起来
    // 这样在手动触发时，才能拿出来发动一把
    var data = DomData.getData(elem);
    if (!data.handlers) {
        data.handlers = {};
    }

    if (!data.handlers[type]) {
        data.handlers[type] = [];
    }

    if (!fn.guid) {
        fn.guid = (0, _guid.newGUID)();
    }

    // 我们往 handlers[type] 里面存函数，然后通过 dispatcher 调用
    data.handlers[type].push(fn);

    if (!data.dispatcher) {
        /**
         * trigger 的时候，我们通过调用这个函数，来调用注册在对应 elem 的对应 type 上的所有函数
         *
         * @param {Event} event 事件
         * @param {Mixed} extraData 传入函数的数据
         */
        data.dispatcher = function (event, extraData) {
            if (data.disabled) {
                return;
            }

            // 通过 event.type 找到之前注册的回调函数
            var handlers = data.handlers[event.type];

            event = fixEvent(event);

            if (handlers) {
                // 鲁棒性。如果事件在执行过程中发生变动，不至于影响原来注册的事件，从而影响下次执行
                var handlersClone = handlers.slice(0);

                for (var i = 0; i < handlersClone.length; i++) {
                    // 如果执行了 stopImmediatePropagation，那我们应该立即停止
                    if (event.isImmediatePropagationStopped()) {
                        break;
                    } else {
                        try {
                            // 在当前 elem 上调用，同时将 event extraData 传过去当参数
                            handlersClone[i].call(elem, event, extraData);
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                }
            }
        };
    }

    // 只注册一次
    if (data.handlers[type]['length'] === 1) {
        // 系统事件，借用系统的能力调起
        // 注意 这里注册的是 dispatcher 函数，通过 dispatcher 来统一地管理 fn
        if (elem.addEventListener) {
            // passive event listener
            var options = false;
            if (isPassiveSupported && passiveEvents.includes(type)) {
                options = { passive: true };
            }

            elem.addEventListener(type, data.dispatcher, options);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, data.dispatcher);
        }
    }
}

/**
 * 触发事件
 *
 * @param {string} 事件类型
 * @param {Mixed} hash 事件触发时，传入的数据
 */
function trigger(elem, event, hash) {
    // 先判断 hasData，避免直接用 getData 给 elem 添加额外的数据（具体可参见 DomData:getData）
    var data = DomData.hasData(elem) ? DomData.getData(elem) : {};
    // 事件冒泡
    var parent = elem.parentNode || elem.ownerDocument;

    // 将 string 包装成正常的事件类型
    if (typeof event === 'string') {
        event = { type: event, target: elem };
    }

    // 标准化
    event = fixEvent(event);

    // 如果有事件调度函数，那我们可以通过这个函数去调用注册在这个元素上的对应类型的事件
    // 理论上注册过事件后就会有这个函数
    if (data.dispatcher) {
        data.dispatcher.call(elem, event, hash);
    }

    // 冒泡吧
    // 如果还有父元素，并且没有手动阻止事件冒泡，且这个事件本身支持冒泡（media events 不支持），那我们继续
    if (parent && !event.isPropagationStopped() && event.bubbles === true) {
        // 注意 这里就直接传我们标准化过的 event 了，不用再传 type
        trigger.call(null, parent, event, hash);
        // 如果已经到最上层的元素，并且没有被阻止事件的默认行为，那我们看看有没有系统对这种事件有没有默认行为要执行
    } else if (!parent && !event.defaultPrevented) {
        var targetData = DomData.getData(event.target);
        // 如果系统也在这个事件上注册有函数
        if (event.target[event.type]) {
            // 在执行系统的事件函数前，先关闭我们自己的事件分发，因为已经执行过一次了（否则之前的那些事件有会被执行一次）
            targetData.disabled = true;

            // 执行系统默认事件
            if (typeof event.target[event.type] === 'function') {
                event.target[event.type]();
            }

            // 恢复 disable 参数，避免对下次事件造成影响
            targetData.disabled = false;
        }
    }

    // 告知调用者这个事件的默认行为是否被阻止了
    // @see https://www.w3.org/TR/DOM-Level-3-Events/#event-flow-default-cancel
    return !event.defaultPrevented;
}

/**
 * 移除已注册的事件
 *
 * @param {Element} elem 要移除事件的元素
 * @param {string|Array=} 事件类型。可选，如果没有 type 参数，则移除该元素上所有的事件
 * @param {Function=} 要移除的指定的函数。可选，如果没有此参数，则移除该 type 上的所有事件
 *
 * @desc
 *    1) 请按照参数顺序传参数
 */
function off(elem, type, fn) {
    if (!DomData.hasData(elem)) {
        return;
    }

    var data = DomData.getData(elem);

    if (!data.handlers) {
        return;
    }

    if (Array.isArray(type)) {
        return handleMultipleEvents(off, elem, type, fn);
    }

    function removeType(curType) {
        data.handlers[curType] = [];
        cleanUpEvents(elem, curType);
    }

    // 避免不传 type，直接传 fn 的情况
    if (typeof type === 'function') {
        throw new Error('注销指定事件函数前，先指定事件类型');
    }

    // 没有传 type，则移除所有事件
    if (!type) {
        for (var i in data.handlers) {
            removeType(i);
        }

        return;
    }

    // 传了 type
    var handlers = data.handlers[type];

    if (!handlers) {
        return;
    }

    // 传了 type，但没传 fn，则移除该 type 下的所有事件
    if (type && !fn) {
        removeType(type);
        return;
    }

    // 传了 type 且传了 fn，则移除 type 下的 fn
    // 如果这个函数之前注册过，就会有 guid 属性
    if (fn.guid) {
        if (handlers && handlers.length) {
            data.handlers[type] = handlers.filter(function (value) {
                return value.guid !== fn.guid;
            });
        }
    }

    // 最后需要再扫描下，有没有刚好被移除了所有函数的 type 或者 handlers
    cleanUpEvents(elem, type);
}

/**
 * 在指定事件下，只触发指定函数一次
 *
 * @param {Element} elem 要绑定事件的元素
 * @param {string|Array} type 绑定的事件类型
 * @param {Function} 注册的回调函数
 */
function one(elem, type, fn) {
    if (Array.isArray(type)) {
        return handleMultipleEvents(one, elem, type, fn);
    }

    function executeOnlyOnce() {
        off(elem, type, executeOnlyOnce);
        fn.apply(this, arguments);
    }

    // 移除函数需要 guid 属性
    executeOnlyOnce.guid = fn.guid = fn.guid || (0, _guid.newGUID)();

    on(elem, type, executeOnlyOnce);
}

},{"./dom-data":26,"./guid":31}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @file 检测浏览器是否支持某些特性
 * @author yuhui06
 * @date 2018/3/8
 */

var document = window.document;

exports.default = {
  touch: 'ontouchend' in document
};

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('./events');

var Events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var document = window.document;

/**
 * @const 目前所有的 fullscreen api
 */
/**
 * @file 将 fullscreen api 抽象并统一
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/8
 * @desc
 *    1) 在全屏播放器的时候，选择将 video 的父元素全屏而不是将 video 标签全屏，在 pc 上可以帮你解决很多问题
 *    2) 这个全屏并不是万能的，在一些浏览器下依然无法全屏（如 ios safari、IE9）
 *
 * @see https://fullscreen.spec.whatwg.org/
 * @see https://developers.google.com/web/fundamentals/native-hardware/fullscreen/?hl=zh-cn
 * @see https://github.com/sindresorhus/screenfull.js/blob/gh-pages/readme.md
 */

var API = [
// ideal api
['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
// New WebKit
['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'],
// Old WebKit (Safari 5.1)
['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];

var browserApi = {};

API.forEach(function (value, index) {
    if (value && value[1] in document) {
        value.forEach(function (val, i) {
            browserApi[API[0][i]] = val;
        });
    }
});

exports.default = {
    requestFullscreen: function requestFullscreen(el) {
        el[browserApi.requestFullscreen]();
    },
    exitFullscreen: function exitFullscreen() {
        document[browserApi.exitFullscreen]();
    },
    fullscreenElement: function fullscreenElement() {
        return document[browserApi.fullscreenElement];
    },
    fullscreenEnabled: function fullscreenEnabled() {
        return document[browserApi.fullscreenEnabled];
    },
    isFullscreen: function isFullscreen() {
        return !!this.fullscreenElement();
    },
    fullscreenchange: function fullscreenchange(callback) {
        Events.on(document, browserApi.fullscreenchange, callback);
    },
    fullscreenerror: function fullscreenerror(callback) {
        Events.on(document, browserApi.fullscreenerror, callback);
    },

    // @todo 不够优雅，不过好歹是给了事件注销的机会
    off: function off(type, callback) {
        if (/change/.test(type)) {
            type = browserApi.fullscreenchange;
        } else {
            type = browserApi.fullscreenerror;
        }
        Events.off(document, type, callback);
    }
};

},{"./events":28}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newGUID = newGUID;
/**
 * @file guid 唯一标识
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

// guid 从 1 开始
var guid = 1;

/**
 * 获取一个自增且唯一的 ID
 *
 * @return {number} 新的 ID
 */
function newGUID() {
  return guid++;
}

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;
/**
 * @file log.js log...log....loggggg
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/16
 */

/**
 * 在控制台输出日志信息
 *
 * @param {...string|object} 参数个人任意，类型不限
 * @example
 *    1) log('style: %c,'
 *           + 'just like print in c.'
 *           + 'string: %s,'
 *           + 'int: %i,'
 *           + 'float: %f,'
 *           + 'object: %o',
 *           'color:red;font-style: italic;',
 *           'string',
 *           333,
 *           1.2334,
 *           {});
 */

/* eslint-disable no-console */

function log() {
  var _console;

  (_console = console).log.apply(_console, arguments);
}

log.info = console.info;

log.warn = console.warn;

log.error = console.error;

log.clear = console.clear;

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mergeOptions;

var _obj = require('./obj.js');

/**
 * 深拷贝和合并对象，为 options 定制
 *
 * @param {...Object} args 要合并的对象
 * @return {Object} 合并后的对象
 * @desc
 *      1) 这里其实我们还有一个隐形的约定：options 不要乱传，options 本身是个对象，options 的值要么是对象，要么是普通类型（非引用）
 */
function mergeOptions() {
    var result = {};

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    args.forEach(function (opt) {
        // 对空数组 forEach 时，回调函数传入的参数会是 undefined
        // 这个判断，就是这个函数的鲁棒性所在
        if (!opt) {
            return;
        }

        (0, _obj.each)(opt, function (value, key) {
            // 不是对象时，我们认为他只是普通类型（非引用）时，直接赋值就行了
            if (!(0, _obj.isPlain)(value)) {
                result[key] = value;
            } else {
                // 如果 value 是对象，先保证 result[key] 是对象，再进行后面的赋值
                if (!(0, _obj.isPlain)(result[key])) {
                    result[key] = {};
                }

                // 把剩下的值 merge 到 result[key] 上，如果剩下的值的 key 里还有对象，就递归了
                result[key] = mergeOptions(result[key], value);
            }
        });
    });

    return result;
} /**
   * @file 深拷贝和合并对象（为 options 定制）
   * @author yuhui06@baidu.com
   * @date 2017/11/3
   */

},{"./obj.js":36}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @file 视频 MIME Type 对照表
 * @author YuHui<yuhui06@baidu.com>
 * @version 1.0 | YuHui<yuhui06@baidu.com> | 2017/12/14 | initial
 */

exports.default = {
    'flv': 'video/x-flv',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'm3u8': 'application/x-mpegURL',
    'ts': 'video/MP2T',
    '3gp': 'video/3gpp',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'wmv': 'video/x-ms-wmv'
};

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = nomalizeSource;

var _obj = require('./obj');

var _mimeTypeMap = require('./mime-type-map');

var _mimeTypeMap2 = _interopRequireDefault(_mimeTypeMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @const
 * 匹配 url 最后一个 . 后面的字符串
 */
/**
 * @file 标准化用户传入的 source 参数
 * @author YuHui<yuhui06@baidu.com>
 * @version 1.0 | YuHui<yuhui06@baidu.com> | 2017/12/14 | initial
 */

var MIME_TYPE_REG = /\.([\w]+)$/;

/**
 * 根据 src 字符串获取视频类型
 *
 * @param {string} src 链接地址
 * @return {string|undefined} MIMEType 文件类型
 */
function getMIMEType(src) {
    var MIMEType = '';
    if (typeof src === 'string') {
        var matchResult = src.match(MIME_TYPE_REG);
        if (Array.isArray(matchResult)) {
            MIMEType = matchResult[1];
        }
    }

    return _mimeTypeMap2.default[MIMEType];
}

/**
 * 标准化单个 source 对象
 *
 * @param {Object} singleSource 传入的 source 对象
 * @param {string} singleSource.src 视频链接
 * @param {string=} singleSource.type 可选，视频类型，若不填则自动根据视频链接的后缀生成
 * @return {Object} singleSource 标准化后的 source 对象
 */
function nomalizeSingleSource(singleSource) {
    if (!(0, _obj.isPlain)(singleSource)) {
        throw new TypeError('SingleSource should be an Object');
    }

    if (typeof singleSource.src !== 'string') {
        throw new TypeError('SingleSource.src should be a string');
    }

    if (singleSource.hasOwnProperty('type') && typeof singleSource.type !== 'string') {
        throw new TypeError('SingleSource.type should be a string');
    }

    if (!singleSource.type) {
        singleSource.type = getMIMEType(singleSource.src);
    }

    return singleSource;
}

/**
 * 标准化 source
 *
 * @param {Object|Array} source 要添加到 video 标签里的 source，可以是单个的对象，也可以是包含多个对象的数组
 * @return {Array} 标准化后的 source
 */
function nomalizeSource(source) {
    if ((0, _obj.isPlain)(source)) {
        return [nomalizeSingleSource(source)];
    } else if (Array.isArray(source)) {
        return source.map(function (value) {
            return nomalizeSingleSource(value);
        });
    } else {
        throw new TypeError('Source should be an Object or an Array which contains Object');
    }
}

},{"./mime-type-map":34,"./obj":36}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.isPlain = isPlain;
exports.each = each;
/**
 * @file Object 相关方法
 * @module obj
 * @author yuhui06@baidu.com
 * @date 2017/11/2
 */

/**
 * @callback obj:EachCallback
 *
 * @param {Mixed} value 对象目前的 key 所对应的值
 * @param {string} key 对象目前的 key
 */

/**
 * 检查一个变量是否是对象（而不是 null）
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 该变量是否是对象
 * @desc
 *      1) typeof null 的值是 object
 */
function isObject(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * 判断一个变量是否是“纯粹”的对象
 *
 * @param {Mixed} value 任意 js 变量
 * @return {boolean} 该变量是否是纯粹的对象
 */
function isPlain(value) {
  return isObject(value) && toString.call(value) === '[object Object]' && value.constructor === Object;
}

/**
 * 迭代对象
 *
 * @param {Object} obj 要迭代的对象
 * @param {EachCallback} fn 每次迭代时调用的函数，具体参见 EachCallback 定义
 */
function each(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
}

},{}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPluginExist = isPluginExist;
exports.getPlugin = getPlugin;
exports.registerPlugin = registerPlugin;
exports.deregisterPlugin = deregisterPlugin;
/**
 * @file plugin.js 一些不想直接写在播放器中的代码，但又可能用到的功能，我们称之为 plugin
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/20
 */

/**
 * @const
 * @inner
 *
 * 以 name => plugin 的形式存储 plugin 的对象
 */
var pluginStore = {};

/**
 * 判断 plugin 的名称是否已存在
 *
 * @param {string} name plugin 名称
 * @return {boolean} 指定名称是否已存在
 */
function isPluginExist(name) {
  return pluginStore.hasOwnProperty(name);
}

/**
 * 通过名称获取对应过的 plugin
 *
 * @param {string} name 要获取的 plugin 的名称
 * @return {Function} 要获取的 plugin
 */
function getPlugin(name) {
  return pluginStore[name];
}

/**
 * 注册 plugin
 * 此方法会被赋值到 larkplayer 上（larkplayer.registerPlugin = registerPlugin）
 * 后续调用时，我们一般从 larkplayer 上调用
 *
 * @param {string} name 要注册的 plugin 的名称
 * @param {Function} plugin 要注册的 plugin 函数。
 *                   plugin 的 this 在运行时会被指定为 player
 */
function registerPlugin(name, plugin) {
  if (typeof plugin !== 'function') {
    throw new TypeError('Plugin should be a function');
  }

  if (isPluginExist(name)) {
    throw new Error('Plugin has existed, register fail');
  }

  pluginStore[name] = plugin;
}

/**
 * 注销 plugin
 *
 * @param {name} name 要注销的 plugin 名称
 */
function deregisterPlugin(name) {
  delete pluginStore[name];
}

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeFormat = timeFormat;
/**
 * @file time-format.js 将秒数格式化为指定的时间字符串形式
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/3
 */

/**
 * 将秒数格式化为 hh:mm:ss 的形式
 *
 * @param {number} seconds 要转化的秒数
 * @return {string} 格式化后的表示时间的字符串
 */

/**
 * 不足两位的时间，前面补零
 *
 * @inner
 *
 * @param {string|number} val 该段位的时间（如 1h 12h 23m 1s）
 * @return {string} 进行过不足两位前面补零操作的时间串
 */
function pad(val) {
    val = '' + val;
    if (val.length < 2) {
        val = '0' + val;
    }

    return val;
}

/**
 * 将传入的秒数格式化为 hh:mm:ss 的形式，如果不足一小时，则为 mm:ss 的形式
 *
 * @param {number} seconds 总秒数
 * @return {string} 格式化后的时间串
 */
function timeFormat(seconds) {
    seconds = parseInt(seconds, 10);
    if (!isNaN(seconds)) {
        var hour = Math.floor(seconds / 3600);
        var minute = Math.floor((seconds - hour * 3600) / 60);
        var second = seconds % 60;

        var result = [pad(minute), pad(second)];
        if (hour > 0) {
            result.unshift(pad(hour));
        }

        return result.join(':');
    } else {
        return '- -';
    }
}

},{}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toTitleCase;
exports.titleCaseEquals = titleCaseEquals;
/**
 * @file to-title-case.js
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

/**
 * 将字符串的首字母大写
 *
 * @param {string} str 要将首字母大写的字符串
 * @return {string} 首字母大写的字符串
 */
function toTitleCase(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // let [firstChar, ...otherChars] = [...str];
  // return firstChar.toUpperCase() + otherChars.join('');

  // return [...str].map((value, index) => (index === 0 ? value.toUpperCase() : value)).join('');
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 比较两个字符串在首字母大写的情况下是否相等
 *
 * @param {string} str1 待比较的字符串
 * @param {string} str2 待比较的字符串
 * @return {boolean} 两个字符串在首字母大写后是否相等
 */
function titleCaseEquals(str1, str2) {
  return toTitleCase(str1) === toTitleCase(str2);
}

},{}]},{},[3])(3)
});