'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _normalizeSource = require('./utils/normalize-source');

var _normalizeSource2 = _interopRequireDefault(_normalizeSource);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
                console.log(ex, 'Video is not ready');
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
            if (typeof this.el.webkitExitFullScreenm === 'function') {
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
                console.log(ex);
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
