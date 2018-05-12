/**
 * @file Player.js. player initial && api
 * @author yuhui06(yuhui06@baidu.com)
 * @date 2017/11/6
 * @todo 对于 Player 构造函数的特殊照顾需要理一下，可能没必要
 */

import includes from 'lodash.includes';
import document from 'global/document';

import Html5 from './html5/html5';
import HTML5_EVENTS from './html5/html5-events';
import {HTML5_WRITABLE_ATTRS, HTML5_READONLY_ATTRS} from './html5/html5-attrs';
import fullscreen from './html5/fullscreen';
import Component from './plugin/component';
import MediaSourceHandler from './plugin/media-source-handler';
import Plugin from './plugin/plugin';
import PluginTypes from './plugin/plugin-types';
import * as Events from './events/events';
import * as DOM from './utils/dom';
import toTitleCase from './utils/to-title-case';
import evented from './events/evented';
import {each} from './utils/obj';
import log from './utils/log';
import computedStyle from './utils/computed-style';
import featureDetector from './utils/feature-detector';

/**
 * @class
 */
class Player {

    /**
     * 初始化一个播放器实例
     *
     * @constructor
     * @param {Element|string} tag DOM 元素或其 id（如果是 video 标签，会将其已有属性作为参数）
     * @param {Object=} options 配置项，可选
     * @param {number=} options.height 播放器高度
     * @param {number=} options.width 播放器宽度
     * @param {boolean=} options.loop 是否循环播放，默认 false
     * @param {boolean=} options.controls 是否有控制条，默认 false
     * @param {string=} options.controlsList 对原生控制条的一些设置，可选值为 nodownload nofullscreen noremoteplayback
     * @param {number=} options.playbackRate 视频播放速率，默认 1.0
     * @param {number=} options.defaultPlaybackRate 视频默认播放速率，默认 1.0
     * @param {number=} options.volume 声音大小，默认 1，取值应在 0~1
     * @param {boolean=} options.muted 是否静音，默认 false
     * @param {boolean=} options.playsinline 是否使用内联的形式播放（即非全屏的形式），默认 true。仅 ios10 以上有效，在 ios10 以下，视频播放时会自动进入全屏
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
    constructor(tag, options, readyFn) {
        this.isReady = false;
        this.player = this;
        this.options = options;
        this.tag = tag;
        this.el = this.createEl();
        this.ready(readyFn);

        evented(this, {eventBusKey: this.el});

        this.handleFirstplay = this.handleFirstplay.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
        this.handleFullscreenError = this.handleFullscreenError.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.fullWindowOnEscKey = this.fullWindowOnEscKey.bind(this);

        if (featureDetector.touch) {
            this.on('touchend', this.handleTouchEnd);
        } else {
            this.on('click', this.handleClick);
        }

        if (!this.tech) {
            this.tech = this.loadTech();
        }

        const src = this.src();
        if (src) {
            // 如果视频已经存在，看下是不是错过了 loadstart 事件
            this.handleLateInit(this.tech.el);

            this.callMS(src);
        }

        this.initialUIPlugins();
        this.initialNormalPlugins();
        this.triggerReady();
    }
    /* eslint-enable fecs-max-statements */

    initialNormalPlugins() {
        this[PluginTypes.OTHERS] = {};
        const allPlugins = Plugin.getAll();
        allPlugins.forEach(PluginClass => {
            const name = PluginClass._displayName;
            const pluginInstance = new PluginClass(this, this.getPluginOptions(name, PluginTypes.OTHERS));
            this[PluginTypes.OTHERS][name] = pluginInstance;
        });
    }

    initialUIPlugins() {
        // @hack 为了让 Component.createElement 能取到 player
        Component.player = this;

        this[PluginTypes.UI] = {};
        const allPlugins = Component.getAll();
        allPlugins.forEach(PluginClass => {
            const name = PluginClass._displayName;
            const pluginInstance = new PluginClass(this, this.getPluginOptions(name, PluginTypes.UI));
            const el = pluginInstance.el;
            this.el.appendChild(el);
            this[PluginTypes.UI][name] = pluginInstance;
        });
    }

    getPluginOptions(name, namespace) {
        return this.options && this.options[namespace] && this.options[namespace][name];
    }

    callMS(src) {
        this.disposeMS();

        const HandlerClass = MediaSourceHandler.select(src);
        if (HandlerClass) {
            this.MSHandler = new HandlerClass(this, this.getPluginOptions(HandlerClass._displayName, PluginTypes.MS));
            this.MSHandler.src(src);

            return true;
        }

        return false;
    }

    disposeMS() {
        if (this.MSHandler) {
            this.MSHandler.dispose();
            this.MSHandler = null;
        }
    }

    ready(fn) {
        if (fn) {
            if (this.isReady) {
                setTimeout(() => {
                    fn.call(this);
                }, 1);
            } else {
                this.readyQueue = this.readyQueue || [];
                this.readyQueue.push(fn);
            }
        }
    }

    triggerReady() {
        this.isReady = true;

        setTimeout(() => {
            const readyQueue = this.readyQueue;
            this.readyQueue = [];
            if (readyQueue && readyQueue.length) {
                readyQueue.forEach(fn => {
                    fn.call(this);
                });
            }

            this.trigger('ready');
        }, 1);
    }

    removeClass(className) {
        return DOM.removeClass(this.el, className);
    }

    addClass(className) {
        return DOM.addClass(this.el, className);
    }

    hasClass(className) {
        return DOM.hasClass(this.el, className);
    }

    toggleClass(className) {
        return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
    }

    /**
     * 销毁播放器
     *
     */
    dispose() {
        this.trigger('dispose');

        // 注销全屏事件
        fullscreen.off();

        // 销毁 MS 插件
        this.disposeMS();

        if (this.tag && this.tag.player) {
            this.tag.player = null;
        }

        if (this.el && this.el.player) {
            this.el.player = null;
        }

        if (this.tech) {
            this.tech.dispose();
        }
    }

    /**
     * 创建播放器 DOM （将 video 标签包裹在一层 div 中，全屏及添加其他子元素时需要）
     *
     * @private
     * @return {Element} el 播放器 DOM
     */
    createEl() {
        const tag = this.tag;

        // 处理 options 中的 html5 标准属性
        each(this.options, (value, key) => {
            if (includes(HTML5_WRITABLE_ATTRS, key) && value) {
                DOM.setAttribute(tag, key, value);
            }
        });

        if (this.options.source) {
            this.ready(() => {
                this.source(this.options.source);
            });
        }

        // 创建容器元素
        const el = DOM.createElement('div', {
            className: 'larkplayer',
            id: tag.id + '-larkplayer'
        });

        DOM.setAttribute(tag, 'tabindex', '-1');

        // 将 el 插入到 DOM 中
        if (tag.parentNode) {
            tag.parentNode.insertBefore(el, tag);
        }

        if (tag.hasAttribute('width')) {
            el.style.width = tag.getAttribute('width') + 'px';
            tag.setAttribute('width', '100%');
        }

        if (tag.hasAttribute('height')) {
            el.style.height = tag.getAttribute('height') + 'px';
            tag.setAttribute('height', '100%');
        }

        el.appendChild(tag);

        return el;
    }

    /**
     * 当 video 标签已经初始化完成后再调用 larkplayer，可能错过一些事件，这里手动触发下
     *
     * @private
     * @param {Element} el video DOM 标签
     */
    handleLateInit(el) {
        if (!!el.error) {
            this.ready(() => {
                this.trigger('error');
            });
            return;
        }

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
            let loadstartFired = false;
            const setLoadstartFired = () => {
                loadstartFired = true;
            };

            this.on('loadstart', setLoadstartFired);

            const triggerLoadstart = () => {
                if (!loadstartFired) {
                    this.trigger('loadstart');
                }
            };

            // 确保在执行 loadedmetadata 之前，执行了 loadstart 事件
            this.on('loadedmetadata', triggerLoadstart);

            // 我们的目标是，错过了 loadstart 的话，在 ready 后再手动 trigger 一次
            this.ready(() => {
                this.off('loadstart', setLoadstartFired);
                this.off('loadedmetadata', triggerLoadstart);

                if (!loadstartFired) {
                    this.trigger('loadstart');
                }
            });

            return;
        }

        const eventsToTrigger = ['loadstart', 'loadedmetadata'];

        if (el.readyState >= 2) {
            eventsToTrigger.push('loadeddata');
        }

        if (el.readyState >= 3) {
            eventsToTrigger.push('canplay');
        }

        if (el.readyState >= 4) {
            eventsToTrigger.push('canplaythrough');
        }

        this.ready(() => {
            eventsToTrigger.forEach(event => {
                this.trigger(event);
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
    loadTech() {
        this.options.el = this.tag;
        let tech = new Html5(this.player, this.options);

        // 代理 video 的各个事件
        HTML5_EVENTS.forEach(eventName => {
            Events.on(tech.el, eventName, () => {
                this.trigger(eventName);
            });
        });

        // 绑定 firstPlay 事件
        this.off('play', this.handleFirstplay);
        this.one('play', this.handleFirstplay);

        // 全屏事件
        Events.on(tech.el, 'fullscreenchange', this.handleFullscreenChange);
        fullscreen.fullscreenchange(this.handleFullscreenChange);
        fullscreen.fullscreenerror(this.handleFullscreenError);

        return tech;
    }

    /**
     * 从 Html5 实例上执行对应的 get 函数
     *
     * @private
     * @param {string} method 要执行的函数名
     * @return {Mixed} 对应函数的返回值
     */
    techGet(method) {
        return this.tech[method]();
    }

    /**
     * 从 Html5 实例上执行对应的 set 函数
     *
     * @private
     * @param {string} method 要执行的函数名
     * @param {Mixed} val 对应函数需要的参数
     */
    techCall(method, val) {
        try {
            this.tech[method](val);
        } catch (ex) {
            log(ex);
        }
    }

    /**
     * 获取或设置播放器的宽度
     *
     * @param {number=} value 要设置的播放器宽度值，可选
     * @return {number|NaN} 不传参数则返回播放器当前宽度
     */
    width(value) {
        if (value !== undefined) {
            if (/\d$/.test(value)) {
                value = value + 'px';
            }

            this.el.style.width = value;
        } else {
            return parseInt(computedStyle(this.el, 'width'), 0);
        }
    }

    /**
     * 获取或设置播放器的高度
     *
     * @param {number=} value 要设置的播放器高度值，可选
     * @return {number|NaN} 不传参数则返回播放器当前高度
     */
    height(value) {
        if (value !== undefined) {
            if (/\d$/.test(value)) {
                value = value + 'px';
            }

            this.el.style.height = value;
        } else {
            return parseInt(computedStyle(this.el, 'height'), 0);
        }
    }

    // = = = = = = = = = = = = = 事件处理 = = = = = = = = = = = = = =

    /**
     * 处理自定义的 firstplay 事件
     * 该事件与 play 事件的不同之处在于 firstplay 只会在第一次播放时触发一次
     *
     * @private
     * @fires Player#firstplay
     */
    handleFirstplay() {
        /**
         * 在视频第一次播放时触发，只会触发一次
         *
         * @event Player#firstplay
         */
        this.trigger('firstplay');
    }

    handleTouchEnd(event) {
        if (event.target === this.tech.el && this.paused()) {
            this.play();
        }
    }

    /**
     * 处理 fullscreenchange 事件
     *
     * @private
     * @fires Player#fullscreenchange
     */
    // Html5 中会处理一次这个事件，会传入 extData
    handleFullscreenChange(event, extData = {}) {
        let data = {};

        // 移动端的全屏事件会传 extData
        if (event.detail && event.detail.isFullscreen !== undefined) {
            this.fullscreenStatus = event.detail.isFullscreen;
        } else if (fullscreen.fullscreenEnabled()) {
            // pc 端 fullscreen 事件
            this.fullscreenStatus = fullscreen.isFullscreen();
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
        this.trigger('fullscreenchange', {detail: data});
    }

    /**
     * 处理 fullscreenerror 事件
     *
     * @fires Player#fullscreenerror
     * @private
     */
    handleFullscreenError() {
        /**
         * 在全屏时出错时触发
         *
         * @event Player#fullscreenerror
         */
        this.trigger('fullscreenerror');
    }

    handleClick(event) {
        if (event.target === this.tech.el) {
            this.paused() ? this.play() : this.pause();
        }
    }

    // = = = = = = = = = = = = = 对外 api = = = = = = = = = = = = = =

    /**
     * 判断当前是否处于全屏状态
     *
     * @return {boolean} 返回当前全屏状态
     */
    isFullscreen() {
        return this.fullscreenStatus || false;
    }

    /**
     * 进入全屏
     * 会先尝试浏览器提供的全屏方法，如果没有对应方法，则进入由 css 控制的全屏样式
     */
    requestFullscreen() {
        this.fullscreenStatus = true;

        if (fullscreen.fullscreenEnabled()) {
            // 利用 css 强制设置 top right bottom left margin 的值为 0
            // 避免因为定位使得元素全屏时看不到
            this.addClass('lark-fullscreen-adjust');
            fullscreen.requestFullscreen(this.el);
        } else if (this.tech.supportsFullScreen()) {
            this.techGet('enterFullScreen');
        } else {
            this.enterFullWindow();
        }
    }

    /**
     * 退出全屏
     */
    exitFullscreen() {
        this.fullscreenStatus = false;

        if (fullscreen.fullscreenEnabled() && fullscreen.isFullscreen()) {
            this.removeClass('lark-fullscreen-adjust');
            fullscreen.exitFullscreen();
        } else if (this.tech.supportsFullScreen()) {
            this.techGet('exitFullScreen');
        } else {
            this.exitFullWindow();
        }
    }

    /**
     * 通过 css 控制，使得视频像是进入了全屏一样
     *
     * @private
     */
    enterFullWindow() {
        this.addClass('lark-full-window');
        this.trigger('fullscreenchange');
        Events.on(document, 'keydown', this.fullWindowOnEscKey);
    }

    fullWindowOnEscKey(event) {
        const keyCode = event.keyCode || event.which;
        // Esc 键码为 27
        if (keyCode === 27) {
            this.exitFullWindow();
        }
    }

    /**
     * 去除由 css 控制展现的全屏样式
     *
     * @private
     */
    exitFullWindow() {
        this.removeClass('lark-full-window');
        this.trigger('fullscreenchange');
        Events.off(document, 'keydown', this.fullWindowOnEscKey);
    }

    internalPlay() {
        const playReturn = this.techGet('play');
        if (playReturn && playReturn.then) {
            playReturn.then(null, err => {
                // @todo 这里返回的 err 可以利用下？
                log.error(err);
            });
        }
    }

    /**
     * 播放视频
     */
    play() {
        if (this.MSHandler) {
            this.MSHandler.play();
        } else {
            this.isReady ? this.internalPlay() : this.ready(this.internalPlay);
        }
    }

    /**
     * 暂停播放
     */
    pause() {
        this.techCall('pause');
    }

    /**
     * 加载当前视频的资源，一般不需手动调用，链接更新时会自动加载
     */
    load() {
        this.techCall('load');
    }

    // reset video and ui
    // @todo 感觉这个 reset 有点费事而且费性能
    /**
     * 重置播放器
     * 会移除播放器的 src source 属性，并重置各 UI 样式
     */
    reset() {
        this.pause();

        // reset video tag
        this.techCall('reset');

        // reset ui
        this.children.forEach(child => {
            child && child.reset && child.reset();
        });
    }

    /**
     * 获取／设置当前时间
     *
     * @param {number=} seconds 以秒为单位，要设置的当前时间的值。可选
     * @return {number} 不传参数则返回视频当前时刻
     */
    currentTime(seconds) {
        if (seconds !== undefined) {
            this.techCall('setCurrentTime', seconds);
        } else {
            return this.techGet('currentTime') || 0;
        }
    }

    /**
     * 获取视频剩下的时长
     *
     * @return {number} 总时长 - 已播放时长 = 剩下的时长
     */
    remainingTime() {
        return this.duration() - this.currentTime();
    }

    /**
     * 判断当前视频是否已缓冲到最后
     *
     * @return {boolean} 当前视频是否已缓冲到最后
     */
    bufferedEnd() {
        const buffered = this.buffered();
        const duration = this.duration();
        if (buffered && duration) {
            return buffered.end(buffered.length - 1) === duration;
        } else {
            return false;
        }
    }

    /**
     * 获取或设置当前视频的 src 属性的值
     *
     * @param {string=} src 要设置的 src 属性的值，可选
     * @return {string} 不传参数则返回当前视频的 src 或 currentSrc
     */
    src(src) {
        if (src !== undefined) {

            const success = this.callMS(src);
            if (!success) {
                this.techCall('setSrc', src);
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
            this.trigger('srcchange', {detail: src});
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
    source(source) {
        if (source !== undefined) {
            this.techCall('source', source);
            this.trigger('srcchange', {detail: this.player.src()});
        } else {
            return this.techGet('source');
        }
    }
}

HTML5_WRITABLE_ATTRS
    .filter(attr => !includes(['src', 'currentTime', 'width', 'height'], attr))
    .forEach(attr => {
        Player.prototype[attr] = function (val) {
            if (val !== undefined) {
                this.techCall(`set${toTitleCase(attr)}`, val);
                this.options[attr] = val;
            } else {
                return this.techGet(attr);
            }
        };
    });

HTML5_READONLY_ATTRS.forEach(attr => {
    Player.prototype[attr] = function () {
        return this.techGet(attr);
    }
});

export default Player;


// Generate HTML5_WRITABLE_ATTRS docs
/**
 * @function poster
 * @description 获取或设置 poster 的值
 * @memberof Player
 * @instance
 *
 * @param {string=} poster 封面图
 * @return {boolean} 不传参时返回当前 poster 的值
 */

/**
 * @function preload
 * @description 获取或设置 preload 的值
 * @memberof Player
 * @instance
 *
 * @param {string=} preload 自动下载策略，可选值为 none, metadata, auto
 * @return {boolean} 不传参时返回当前 preload 的值
 */

/**
 * @function autoplay
 * @description 获取或设置 autoplay 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} autoplay 是否自动播放，默认 false，由于浏览器策略，移动端大多无法自动播放
 * @return {boolean} 不传参时返回当前 autoplay 的值
 */

/**
 * @function loop
 * @description 获取或设置 loop 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} loop 是否循环播放，默认 false
 * @return {boolean} 不传参时返回当前 loop 的值
 */

/**
 * @function muted
 * @description 获取或设置 muted 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} muted 是否静音，默认 false
 * @return {boolean} 不传参时返回当前 muted 的值
 */

/**
 * @function defaultMuted
 * @description 获取或设置 defaultMuted 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} defaultMuted 是否默认静音，默认 false
 * @return {boolean} 不传参时返回当前 defaultMuted 的值
 */

/**
 * @function controls
 * @description 获取或设置 controls 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} controls 是否显示控制条，默认 false
 * @return {boolean} 不传参时返回当前 controls 的值
 */

/**
 * @function controlsList
 * @description 获取或设置 controlsList 的值
 * @memberof Player
 * @instance
 *
 * @param {string=} controlsList 对控制条的一些设置，可选值为 nodownload, nofullscreen, noremoteplayback
 *     比如 'nodownload nofullscreen'
 * @return {external:DOMTokenList} 不传参时返回当前 controlsList 的值
 */

/**
 * @function playsinline
 * @description 获取或设置 playsinline 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} playsinline 是否内联播放，IOS10 及以上有效，默认 true
 * @return {boolean} 不传参时返回当前 playsinline 的值
 */

/**
 * @function playbackRate
 * @description 获取或设置 playbackRate 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} playbackRate 播放速率，默认为 1.0
 * @return {boolean} 不传参时返回当前 playbackRate 的值
 */

/**
 * @function defaultPlaybackRate
 * @description 获取或设置 defaultPlaybackRate 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} defaultPlaybackRate 默认播放速率，默认为 1.0
 * @return {boolean} 不传参时返回当前 defaultPlaybackRate 的值
 */

/**
 * @function volume
 * @description 获取或设置 volume 的值
 * @memberof Player
 * @instance
 *
 * @param {boolean=} volume 播放速率，默认为 1，可选值为 0~1
 * @return {boolean} 不传参时返回当前 volume 的值
 */


// Generate HTML5_READONLY_ATTRS docs
/**
 * @function error
 * @description 获取 error 的值
 * @memberof Player
 * @instance
 *
 * @return {external:MediaError|null} 出错时返回 [MediaError]{@link https://developer.mozilla.org/en-US/docs/Web/API/MediaError} 对象，否则返回 null
 * @see html spec [mediaerror]{@link https://html.spec.whatwg.org/multipage/media.html#mediaerror} for detail
 */

/**
 * @function currentSrc
 * @description 获取 currentSrc 的值
 * @memberof Player
 * @instance
 *
 * @return {string} 当前视频链接
 */

/**
 * @function networkState
 * @description 获取 networkState 的值
 * @memberof Player
 * @instance
 *
 * @return {number} 当前播放器的网络状态
 * @see https://html.spec.whatwg.org/multipage/media.html#network-states
 */

/**
 * @function buffered
 * @description 获取 buffered 的值
 * @memberof Player
 * @instance
 *
 * @return {external:TimeRanges} 当前已缓冲的区间
 */

/**
 * @function readyState
 * @description 获取 readyState 的值
 * @memberof Player
 * @instance
 *
 * @return {number} 当前 readyState 的值
 * @see html spec [dom-media-readystate]{@link https://html.spec.whatwg.org/multipage/media.html#dom-media-readystate} for detail
 */

/**
 * @function seeking
 * @description 获取 seeking 的值
 * @memberof Player
 * @instance
 *
 * @return {boolean} 播放器是否正在跳转到某一时刻
 */

/**
 * @function duration
 * @description 获取 duration 的值
 * @memberof Player
 * @instance
 *
 * @return {number|NaN} 视频总时长
 */

/**
 * @function paused
 * @description 获取 paused 的值
 * @memberof Player
 * @instance
 *
 * @return {boolean} 当前是否处于暂停状态
 */

/**
 * @function played
 * @description 获取 played 的值
 * @memberof Player
 * @instance
 *
 * @return {external:TimeRanges} 当前真正已播放过的时间范围，假设从时刻 A 直接跳到 B，A B 之间的时间并不算已经播放过
 */

/**
 * @function seekable
 * @description 获取 seekable 的值
 * @memberof Player
 * @instance
 *
 * @return {external:TimeRanges} 当前可流畅切换的时间范围
 */

/**
 * @function ended
 * @description 获取 ended 的值
 * @memberof Player
 * @instance
 *
 * @return {boolean} 是否已播放完成
 */

/**
 * @function videoWidth
 * @description 获取 videoWidth 的值
 * @memberof Player
 * @instance
 *
 * @return {number|NaN} 视频原始宽度（注意不是播放器宽度）
 */

/**
 * @function videoHeight
 * @description 获取 videoHeight 的值
 * @memberof Player
 * @instance
 *
 * @return {number|NaN} 视频原始高度（注意不是播放器高度）
 */


// Generate HTML5_EVENTS docs
/**
 * @event Player#loadstart
 * @description The user agent begins looking for media data
 * @see html spec [event-media-loadstart]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-loadstart} for detail
 */

/**
 * @event Player#suspend
 * @description The user agent is intentionally not currently fetching media data
 * @see html spec [event-media-suspend]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-suspend} for detail
 */

/**
 * @event Player#abort
 * @description The user agent stops fetching the media data before it is completely downloaded, but not due to an error
 * @see html spec [event-media-abort]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-abort} for detail
 */

/**
 * @event Player#error
 * @description An error occurs while fetching the media data or the type of the resource is not supported media format
 * @see html spec [event-media-error]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-error} for detail
 */

/**
 * @event Player#emptied
 * @description A media element whose networkState was previously not in the NETWORK_EMPTY state has just switched to that state
 * @see html spec [event-media-emptied]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-emptied} for detail
 */

/**
 * @event Player#stalled
 * @description The user agent is trying to fetch media data, but data is unexpectedly not forthcoming
 * @see html spec [event-media-stalled]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-stalled} for detail
 */

/**
 * @event Player#loadedmetadata
 * @description The user agent has just determined the duration and dimensions of the media resource and the text tracks are ready
 * @see html spec [event-media-loadedmetadata]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-loadedmetadata} for detail
 */

/**
 * @event Player#loadeddata
 * @description The user agent can render the media data at the current playback position for the first time
 * @see html spec [event-media-loadeddata]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-loadeddata} for detail
 */

/**
 * @event Player#canplay
 * @description The user agent can resume playback of the media data, but estimates that if playback were to be started now, the media resource could not be rendered at the current playback rate up to its end without having to stop for further buffering of content
 * @see html spec [event-media-canplay]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-canplay} for detail
 */

/**
 * @event Player#canplaythrough
 * @description The user agent estimates that if playback were to be started now, the media resource could be rendered at the current playback rate all the way to its end without having to stop for further buffering
 * @see html spec [event-media-canplaythrough]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-canplaythrough} for detail
 */

/**
 * @event Player#playing
 * @description Playback is ready to start after having been paused or delayed due to lack of media data
 * @see html spec [event-media-playing]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-playing} for detail
 */

/**
 * @event Player#waiting
 * @description Playback has stopped because the next frame is not available, but the user agent expects that frame to become available in due course
 * @see html spec [event-media-waiting]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-waiting} for detail
 */

/**
 * @event Player#seeking
 * @description The seeking IDL attribute changed to true, and the user agent has started seeking to a new position
 * @see html spec [event-media-seeking]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-seeking} for detail
 */

/**
 * @event Player#seeked
 * @description The seeking IDL attribute changed to false after the current playback position was changed
 * @see html spec [event-media-seeked]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-seeked} for detail
 */

/**
 * @event Player#ended
 * @description Playback has stopped because the end of the media resource was reached
 * @see html spec [event-media-ended]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-ended} for detail
 */

/**
 * @event Player#durationchange
 * @description The duration attribute has just been updated
 * @see html spec [event-media-durationchange]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-durationchange} for detail
 */

/**
 * @event Player#timeupdate
 * @description The current playback position changed as part of normal playback or in an especially interesting way, for example discontinuously
 * @see html spec [event-media-timeupdate]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-timeupdate} for detail
 */

/**
 * @event Player#progress
 * @description The user agent is fetching media data
 * @see html spec [event-media-progress]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-progress} for detail
 */

/**
 * @event Player#play
 * @description The element is no longer paused. Fired after the play() method has returned, or when the autoplay attribute has caused playback to begin
 * @see html spec [event-media-play]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-play} for detail
 */

/**
 * @event Player#pause
 * @description The element has been paused. Fired after the pause() method has returned
 * @see html spec [event-media-pause]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-pause} for detail
 */

/**
 * @event Player#ratechange
 * @description Either the defaultPlaybackRate or the playbackRate attribute has just been updated
 * @see https://html.spec.whatwg.org/multipage/media.html#event-media-ratechange
 */

/**
 * @event Player#resize
 * @description One or both of the videoWidth and videoHeight attributes have just been updated
 * @see html spec [event-media-resize]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-resize} for detail
 */

/**
 * @event Player#volumechange
 * @description Either the volume attribute or the muted attribute has changed. Fired after the relevant attribute's setter has returned
 * @see html spec [event-media-volumechange]{@link https://html.spec.whatwg.org/multipage/media.html#event-media-volumechange} for detail
 */

/**
 * @external TimeRanges
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
 */

/**
 * @external DOMTokenList
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
 */

/**
 * @external MediaError
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaError
 */



