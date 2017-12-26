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

var _fn = require('./utils/fn');

var Fn = _interopRequireWildcard(_fn);

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

require('./ui/play-button');

require('./ui/control-bar');

require('./ui/loading');

require('./ui/progress-bar-simple');

require('./ui/error');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file Player.js. player initial && api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06(yuhui06@baidu.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// 确保以下代码都执行一次


var document = window.document;

var Player = function (_Component) {
    _inherits(Player, _Component);

    /**
     * 初始化一个播放器实例
     *
     * @param {Element} tag HTML5 video tag
     * @param {Object=} options 配置项。可选
     * @param {Function=} ready 播放器初始化完成后执行的函数
     */
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
        (0, _evented2.default)(_this, { eventBusKey: 'el' });

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

        // 3000ms 后自动隐藏播放器控制条
        _this.activeTimeout = 3000;

        // @todo ios11 在 click 上出了点问题，先注释掉，用 touchend 代替 click 方法
        // this.on('click', this.handleClick);
        // this.on('touchstart', this.handleTouchStart);

        _this.on('touchend', _this.handleTouchEnd);

        if (!_this.tech) {
            _this.tech = _this.loadTech();
        }

        _this.initChildren();

        _this.addClass('lark-paused');
        // 如果视频已经存在，看下是不是错过了 loadstart 事件
        if (_this.src()) {
            _this.handleLateInit(_this.tech.el);
        }

        // plugins
        var plugins = _this.options.plugins;
        if (plugins) {
            Object.keys(plugins).forEach(function (name) {
                var plugin = Plugin.getPlugin(name);
                if (plugin) {
                    plugin.call(_this, plugins[name]);
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

    /**
     * 销毁播放器
     *
     */


    _createClass(Player, [{
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

        // 创建一个 Html5 实例

    }, {
        key: 'loadTech',
        value: function loadTech() {
            var _this4 = this;

            this.options.el = this.tag;
            var tech = new _html2.default(this.player, this.options);

            // 注册 video 的各个事件
            [
            // 'loadstart',
            'suspend', 'abort',
            // 'error',
            'emptied', 'stalled', 'loadedmetadata', 'loadeddata',
            // 'canplay',
            // 'canplaythrough',
            // 'playing',
            // 'waiting',
            // 'seeking',
            // 'seeked',
            // 'ended',
            // 'durationchange',
            // 'timeupdate',
            'progress',
            // 'play',
            // 'pause',
            'ratechange', 'resize', 'volumechange'].forEach(function (event) {
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
    }, {
        key: 'techGet',
        value: function techGet(method) {
            return this.tech[method]();
        }
    }, {
        key: 'techCall',
        value: function techCall(method, val) {
            try {
                this.tech[method](val);
            } catch (ex) {
                (0, _log2.default)(ex);
            }
        }
    }, {
        key: 'width',
        value: function width(value) {
            return this.dimension('width', value);
        }
    }, {
        key: 'height',
        value: function height(value) {
            return this.dimension('height', value);
        }
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

    }, {
        key: 'handleLoadstart',
        value: function handleLoadstart() {
            this.addClass('lark-loadstart');

            this.trigger('loadstart');
        }
    }, {
        key: 'handlePlay',
        value: function handlePlay() {
            // @todo removeClass 支持一次 remove 多个 class
            this.removeClass('lark-loadstart');
            this.removeClass('lark-ended');
            this.removeClass('lark-paused');
            this.removeClass('lark-error');
            this.removeClass('lark-seeking');
            this.removeClass('lark-waiting');
            this.addClass('lark-playing');

            this.trigger('play');
        }
    }, {
        key: 'handleWaiting',
        value: function handleWaiting() {
            this.addClass('lark-waiting');

            this.trigger('waiting');
            // 处于 waiting 状态后一般都会伴随一次 timeupdate，即使那之后视频还是处于卡顿状态
            // this.one('timeupdate', () => this.removeClass('lark-waiting'));
        }
    }, {
        key: 'handleCanplay',
        value: function handleCanplay() {
            this.removeClass('lark-waiting');

            this.trigger('canplay');
        }
    }, {
        key: 'handleCanplaythrough',
        value: function handleCanplaythrough() {
            this.removeClass('lark-waiting');

            this.trigger('canplaythrough');
        }
    }, {
        key: 'handlePlaying',
        value: function handlePlaying() {
            this.removeClass('lark-waiting');
            this.removeClass('lark-loadstart');

            this.trigger('playing');
        }
    }, {
        key: 'handleSeeking',
        value: function handleSeeking() {
            this.addClass('lark-seeking');

            this.trigger('seeking');
        }
    }, {
        key: 'handleSeeked',
        value: function handleSeeked() {
            this.removeClass('lark-seeking');

            this.trigger('seeked');
        }
    }, {
        key: 'handleFirstplay',
        value: function handleFirstplay() {
            var _this5 = this;

            // @todo 不清楚有什么用
            this.addClass('lark-has-started');

            //
            this.addClass('lark-user-active');
            this.activeTimeoutHandler = setTimeout(function () {
                _this5.removeClass('lark-user-active');
            }, this.activeTimeout);

            this.trigger('firstplay');
        }
    }, {
        key: 'handlePause',
        value: function handlePause() {
            this.removeClass('lark-playing');
            this.addClass('lark-paused');

            this.trigger('pause');
        }
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

            this.trigger('ended');
        }
    }, {
        key: 'handleDurationchange',
        value: function handleDurationchange() {
            var data = {
                duration: this.techGet('duration')
            };

            this.trigger('durationchange', data);
        }
    }, {
        key: 'handleTimeupdate',
        value: function handleTimeupdate() {
            var data = {
                currentTime: this.techGet('currentTime')
            };
            // data.currentTime = this.techGet('currentTime');

            this.trigger('timeupdate', data);
        }
    }, {
        key: 'handleTap',
        value: function handleTap() {}
    }, {
        key: 'handleTouchStart',
        value: function handleTouchStart(event) {
            var activeClass = 'lark-user-active';
            // 当控制条显示并且手指放在控制条上时
            if (this.hasClass(activeClass)) {
                if (Dom.parent(event.target, 'lark-play-button') || Dom.parent(event.target, 'lark-control-bar')) {

                    clearTimeout(this.activeTimeoutHandler);
                }

                Events.on(document, 'touchmove', this.handleTouchMove);
                Events.on(document, 'touchend', this.handleTouchEnd);
            }
        }
    }, {
        key: 'handleTouchMove',
        value: function handleTouchMove(event) {}
    }, {
        key: 'handleTouchEnd',
        value: function handleTouchEnd(event) {
            var _this6 = this;

            // const activeClass = 'lark-user-active';
            // clearTimeout(this.activeTimeoutHandler);

            // this.activeTimeoutHandler = setTimeout(() => {
            //     this.removeClass(activeClass);
            // }, this.activeTimeout);

            // Events.off(document, 'touchmove', this.handleTouchMove);
            // Events.off(document, 'touchend', this.handleTouchEnd);

            // @todo 临时将 click 事件转移到 touchend，ios 11 下 click 事件目前有问题
            // 处于暂停状态时，点击播放器任何位置都均继续播放
            if (this.paused()) {
                this.play();
            }

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
            }

            if (this.hasClass(activeClass)) {
                this.activeTimeoutHandler = setTimeout(function () {
                    _this6.removeClass(activeClass);
                }, this.activeTimeout);
            }
        }

        // Html5 中会处理一次这个事件，会传入 extData

    }, {
        key: 'handleFullscreenChange',
        value: function handleFullscreenChange(event) {
            var extData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var data = {};

            if (extData.isFullscreen !== undefined) {
                this.isFullscreen(extData.isFullscreen);
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

            this.trigger('fullscreenchange', data);
        }
    }, {
        key: 'handleFullscreenError',
        value: function handleFullscreenError() {
            this.trigger('fullscreenerror');
        }
    }, {
        key: 'handleError',
        value: function handleError(event) {
            this.removeClass('lark-playing');
            // this.removeClass('lark-seeking');
            this.addClass('lark-error');

            this.trigger('error', this.techGet('error'));
        }
    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            var _this7 = this;

            // 处于暂停状态时，点击播放器任何位置都均继续播放
            if (this.paused()) {
                this.play();
            }

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
            }

            if (this.hasClass(activeClass)) {
                this.activeTimeoutHandler = setTimeout(function () {
                    _this7.removeClass(activeClass);
                }, this.activeTimeout);
            }
        }

        // = = = = = = = = = = = = = 对外 api = = = = = = = = = = = = = =

        // = = = func = = =

    }, {
        key: 'isFullscreen',
        value: function isFullscreen(isFs) {
            if (isFs !== undefined) {
                this.fullscreenStatus = isFs;
            } else {
                return this.fullscreenStatus;
            }
        }
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
    }, {
        key: 'enterFullWindow',
        value: function enterFullWindow() {
            this.addClass('lark-full-window');
        }
    }, {
        key: 'fullWindowOnEscKey',
        value: function fullWindowOnEscKey() {}
    }, {
        key: 'exitFullWindow',
        value: function exitFullWindow() {
            this.removeClass('lark-full-window');
        }
    }, {
        key: 'play',
        value: function play() {
            if (!this.src()) {
                _log2.default.warn('No video src applied');
                return;
            }

            // changingSrc 现在用不上，后面支持 source 的时候可能会用上
            if (this.isReady && this.src()) {
                // play 可能返回一个 Promise
                var playReturn = this.techGet('play');
                if (playReturn && playReturn.then) {
                    playReturn.then(null, function (err) {
                        // @todo 这里返回的 err 可以利用下？
                        _log2.default.error(err);
                    });
                }
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.techCall('pause');
        }
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
         * 获取／设置 当前时间
         *
         * @param {number=} seconds 秒数，可选。
         *                  传参则设置视频当前时刻
         *                  不传参，则获取视频当前时刻
         * @return {number|undefined} 不传参时返回视频当前时刻；传参数时设置视频当前时刻，返回 undefined
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

        // @todo duration 可以设置？

    }, {
        key: 'duration',
        value: function duration() {
            return this.techGet('duration');
        }
    }, {
        key: 'remainingTime',
        value: function remainingTime() {
            return this.duration() - this.currentTime();
        }
    }, {
        key: 'buffered',
        value: function buffered() {
            return this.techGet('buffered');
        }
    }, {
        key: 'bufferedPercent',
        value: function bufferedPercent() {}
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
    }, {
        key: 'seeking',
        value: function seeking() {
            return this.techGet('seeking');
        }
    }, {
        key: 'seekable',
        value: function seekable() {
            return this.techGet('seekable');
        }
    }, {
        key: 'ended',
        value: function ended() {
            return this.techGet('ended');
        }
    }, {
        key: 'networkState',
        value: function networkState() {
            return this.techGet('networkState');
        }
    }, {
        key: 'videoWidth',
        value: function videoWidth() {
            return this.techGet('videoWidth');
        }
    }, {
        key: 'videoHeight',
        value: function videoHeight() {
            return this.techGet('videoHeight');
        }

        // = = = set && get attr= = =

    }, {
        key: 'volume',
        value: function volume(decimal) {
            if (decimal !== undefined) {
                this.techCall('setVolume', Math.min(1, Math.max(decimal, 0)));
            } else {
                return this.techGet('volume');
            }
        }
    }, {
        key: 'src',
        value: function src(_src) {
            if (_src !== undefined) {
                if (_src !== this.techGet('src')) {
                    // 应该先暂停一下比较好
                    this.techCall('pause');
                    this.techCall('setSrc', _src);

                    // src 改变后，重新绑定一次 firstplay 方法
                    // 先 off 确保只绑定一次
                    this.off('play', this.handleFirstplay);
                    this.one('play', this.handleFirstplay);
                }
            } else {
                return this.techGet('src');
            }
        }

        /**
         * 获取播放器 source 数据或者设置 source 标签
         *
         * @param {Array=} source 视频源，可选
         * @return {Array|undefined} 若不传参则获取 source 数据；传参则设置 source 标签，返回 undefined
         */

    }, {
        key: 'source',
        value: function source(_source) {
            if (_source !== undefined) {
                this.techCall('source', _source);
            } else {
                return this.techGet('source');
            }
        }
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
'poster',

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
            this.techGet(prop);
        }
    };
});

Player.prototype.options = {
    children: ['playButton', 'progressBarSimple', 'controlBar', 'loading', 'error']
};

exports.default = Player;
//# sourceMappingURL=player.js.map
