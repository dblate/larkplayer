/**
 * @file Player.js. player initial && api
 * @author yuhui06(yuhui06@baidu.com)
 * @date 2017/11/6
 * @todo 对于 Player 构造函数的特殊照顾需要理一下，可能没必要
 */

import includes from 'lodash.includes';
import document from 'global/document';

import Html5 from './html5/html5';
import html5Events from './html5/html5-events';
import html5WritableAttrs from './html5/html5-writable-attrs';
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
 * @class Player
 */
class Player {

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
    constructor(tag, options, readyFn) {
        this.isReady = false;
        this.player = this;
        this.options = options;
        this.tag = tag;
        this.el = this.createEl();
        this.ready(readyFn);

        // 使得 this 具有事件能力(on off one trigger)
        evented(this, {eventBusKey: this.el});

        // 需放在 this.loadTech 方法前面
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

        // 如果当前视频已经出错，重新触发一次 error 事件
        if (this.techGet('error')) {
            Events.trigger(this.tech.el, 'error');
        }

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
            if (includes(html5WritableAttrs, key) && value) {
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
        html5Events.forEach(eventName => {
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

    /**
     * 处理 touchend 事件，主要用于控制控制条的显隐
     *
     * @param {Object} event 事件发生时，浏览器给的 event
     *
     * @private
     */
    handleTouchEnd(event) {
        let clickOnControls = false;
        if (DOM.parent(event.target, 'lark-play-button')
            || DOM.parent(event.target, 'lark-control-bar')) {

            clickOnControls = true;
        }

        if (!clickOnControls) {
            if (this.paused()) {
                this.play();
            }
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
     * 加载当前视频的资源
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

    // = = = get attr = = =

    /**
     * 判断当前是否是暂停状态
     *
     * @return {boolean} 当前是否是暂停状态
     */
    paused() {
        return this.techGet('paused');
    }

    /**
     * 获取已播放时长
     *
     * @return {number} 当前已经播放的时长，以秒为单位
     */
    played() {
        return this.techGet('played');
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
     * 获取当前视频总时长
     *
     * @return {number} 视频总时长，如果视频未初始化完成，可能返回 NaN
     */
    duration() {
        return this.techGet('duration');
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
     * 获取当前已缓冲的范围
     *
     * @return {TimeRanges} 当前已缓冲的范围（buffer 有自己的 TimeRanges 对象）
     */
    buffered() {
        return this.techGet('buffered');
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
     * 判断当前视频是否处于 seeking（跳转中） 状态
     *
     * @return {boolean} 是否处于跳转中状态
     */
    seeking() {
        return this.techGet('seeking');
    }

    /**
     * 判断当前视频是否可跳转到指定时刻
     *
     * @return {boolean} 前视频是否可跳转到指定时刻
     */
    seekable() {
        return this.techGet('seekable');
    }

    /**
     * 判断当前视频是否已播放完成
     *
     * @return {boolean} 当前视频是否已播放完成
     */
    ended() {
        return this.techGet('ended');
    }

    /**
     * 获取当前视频的 networkState 状态
     *
     * @return {number} 当前视频的 networkState 状态
     * @todo 补充 networkState 各状态说明
     */
    networkState() {
        return this.techGet('networkState');
    }

    /**
     * 获取当前播放的视频的原始宽度
     *
     * @return {number} 当前视频的原始宽度
     */
    videoWidth() {
        return this.techGet('videoWidth');
    }

    /**
     * 获取当前播放的视频的原始高度
     *
     * @return {number} 当前视频的原始高度
     */
    videoHeight() {
        return this.techGet('videoHeight');
    }

    // = = = set && get attr= = =

    /**
     * 获取或设置播放器声音大小
     *
     * @param {number=} decimal 要设置的声音大小的值（0~1），可选
     * @return {number} 不传参数则返回当前视频声音大小
     */
    volume(decimal) {
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

            /**
             * srcchange 时触发
             *
             * @event Player#srcchange
             * @param {string} src 更换后的视频地址
             */
            this.trigger('srcchange', {detail: this.player.src()});
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
    playbackRate(playbackRate) {
        if (playbackRate !== undefined) {
            this.techCall('setPlaybackRate', playbackRate);
        } else if (this.tech && this.tech.featuresPlaybackRate) {
            return this.techGet('playbackRate');
        } else {
            return 1.0;
        }
    }

    /**
     * 获取或设置当前视频的默认播放速率
     *
     * @todo 确认是否有必要传参
     *
     * @param {number=} defaultPlaybackRate 要设置的默认播放速率的值，可选
     * @return {number} 不传参数则返回当前视频的默认播放速率
     */
    defaultPlaybackRate(defaultPlaybackRate) {
        if (defaultPlaybackRate !== undefined) {
            this.techCall('setDefaultPlaybackRate', defaultPlaybackRate);
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
    poster(val) {
        if (val !== undefined) {
            this.techCall('setPoster', val);
        } else {
            return this.techGet('poster');
        }
    }

}

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
    'preload',
    'controls'
].forEach(prop => {
    // 这里别用箭头函数，不然 this 就指不到 Player.prototype 了
    Player.prototype[prop] = function (val) {
        if (val !== undefined) {
            this.techCall(`set${toTitleCase(prop)}`, val);
            this.options[prop] = val;
        } else {
            return this.techGet(prop);
        }
    };
});

export default Player;


































