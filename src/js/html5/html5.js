/**
 * @file html5 video api proxy
 * @author yuhui06(yuhui06@baidu.com)
 * @date 2017/11/6
 * @see https://html.spec.whatwg.org/#event-media-emptied
 * @see https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-src
 */

import window from 'global/window';
import document from 'global/document';

import * as DOM from '../utils/dom';
import toTitleCase from '../utils/to-title-case';
import normalizeSource from '../utils/normalize-source';
import evented from '../events/evented';


export default class Html5 {
    constructor(player, options) {
        this.options = options;
        this.el = this.options.el;

        evented(this, {eventBusKey: this.el});

        // @todo 处理有 source 的情况

        this.proxyWebkitFullscreen();
    }

    dispose() {
        Html5.disposeMediaElement(this.el);
    }


    setCurrentTime(seconds) {
        try {
            this.el.currentTime = seconds;
        } catch (ex) {
            /* eslint-disable no-console */
            console.log(ex, 'Video is not ready');
            /* eslint-enbale no-console */
        }
    }

    width() {
        return this.el.offsetWidth;
    }

    height() {
        return this.el.offsetHeight;
    }

    proxyWebkitFullscreen() {
        if (!('webkitDisplayingFullscreen' in this.el)) {
            return;
        }

        let endFn = function () {
            this.trigger('fullscreenchange', {isFullscreen: false});
        };

        let beginFn = function () {
            if ('webkitPresentationMode' in this.el
                && this.el.webkitPresentationMode !== 'picture-in-picture') {

                this.one('webkitendfullscreen', endFn);
                this.trigger('fullscreenchange', {isFullscreen: true});
            }
        };

        // @todo 改变执行事件时的 this
        beginFn = beginFn.bind(this);
        endFn = endFn.bind(this);

        this.on('webkitbeginfullscreen', beginFn);
        this.on('dispose', () => {
            this.off('webkitbeginfullscreen', beginFn);
            this.off('webkitendfullscreen', endFn);
        });
    }

    supportsFullScreen() {
        // return this.el.webkitSupportsFullscreen;

        if (typeof this.el.webkitEnterFullScreen === 'function') {
            const userAgent = window.navigator && window.navigator.userAgent || '';

            // Seems to be broken in Chromium/Chrome && Safari in Leopard
            if ((/Android/).test(userAgent) || !(/Chrome|Mac OS X 10.5/).test(userAgent)) {
                return true;
            }
        }

        return false;
    }

    enterFullScreen() {
        if (typeof this.el.webkitEnterFullScreen === 'function') {
            this.el.webkitEnterFullScreen();
        }
    }

    exitFullScreen() {
        if (typeof this.el.webkitExitFullScreen === 'function') {
            // @test
            this.player.removeClass('lark-fullscreen');

            this.el.webkitExitFullScreen();
        }
    }

    src(src) {
        if (src === undefined) {
            return this.el.currentSrc || this.el.src;
        }

        this.setSrc(src);
    }

    source(source) {
        if (source === undefined) {
            const sourceNodeList = DOM.$$('source', this.el);
            const sourceArray = Array.from(sourceNodeList);
            return sourceArray.map(value => {
                return {
                    src: value.src,
                    type: value.type
                };
            });
        } else {
            source = normalizeSource(source);

            let docFragment = document.createDocumentFragment();
            source.forEach(value => {
                const sourceElem = DOM.createElement('source', {
                    src: value.src,
                    type: value.type
                });
                docFragment.appendChild(sourceElem);
            });
            this.el.appendChild(docFragment);
        }
    }

    reset() {
        Html5.resetMediaElement(this.el);
    }

    currentSrc() {
        if (this.currentSource) {
            return this.currentSource.src;
        }

        return this.el.currentSrc;
    }

    setControls(val) {
        this.el.controls = !!val;
    }

    getVideoPlaybackQuality() {

    }
}

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

/**
 * 检查是否可以改变播放器的声音大小（许多移动端的浏览器没法改变声音大小，比如 ios）
 *
 * @return {boolean} 是否可以改变声音大小
 */
Html5.canControlVolume = function () {
    // IE will error if Windows Media Player not installed #3315
    try {
        const volume = Html5.TEST_VID.volume;

        Html5.TEST_VID.volume = (volume / 2) + 0.1;
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
        const playbackRate = Html5.TEST_VID.playbackRate;
        Html5.TEST_VID.playbackRate = (playbackRate / 2) + 0.1;
        return playbackRate !== Html5.TEST_VID.playbackRate;
    } catch (ex) {
        return false;
    }
};

// HTML5 video 事件
Html5.Events = [
    'loadstart',
    'suspend',
    'abort',
    'error',
    'emptied',
    'stalled',
    'loadedmetadata',
    'loadeddata',
    'canplay',
    'canplaythrough',
    'playing',
    'waiting',
    'seeking',
    'seeked',
    'ended',
    'durationchange',
    'timeupdate',
    'progress',
    'play',
    'pause',
    'ratechange',
    'resize',
    'volumechange'
];

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
        }());
    }
};

Html5.resetMediaElement = function (el) {
    if (!el) {
        return;
    }

    const sources = el.querySelectorAll('source');
    let i = sources.length;

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
        }());
    }
};

// HTML5 video attributes proxy
// 获取对应属性的值
// muted defaultMuted autoplay controls loop playsinline
[
    'muted',
    'defaultMuted',
    'autoplay',
    'controls',
    'loop',
    'playsinline'
].forEach(attr => {
    Html5.prototype[attr] = function () {
        return this.el[attr] || this.el.hasAttribute(attr);
    };
});

// HTML5 video attributes proxy
// 设置对应属性的值
// setMuted, setDefaultMuted, setAutoPlay, setLoop, setPlaysinline
// setControls 算是特例
[
    'muted',
    'defaultMuted',
    'autoplay',
    'loop',
    'playsinline'
].forEach(attr => {
    Html5.prototype['set' + toTitleCase(attr)] = function (value) {
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
[
    'paused',
    'currentTime',
    'duration',
    'buffered',
    'volume',
    'poster',
    'preload',
    'error',
    'seeking',
    'seekable',
    'ended',
    'playbackRate',
    'defaultPlaybackRate',
    'played',
    'networkState',
    'readyState',
    'videoWidth',
    'videoHeight'
].forEach(prop => {
    Html5.prototype[prop] = function () {
        return this.el[prop];
    };
});

// Wrap HTML5 video properties with a setter in the following format:
// set + toTitleCase(propName)
// setVolume, setSrc, setPoster, setPreload, setPlaybackRate, setDefaultPlaybackRate
[
    'volume',
    'src',
    'poster',
    'preload',
    'playbackRate',
    'defaultPlaybackRate'
].forEach(prop => {
    Html5.prototype['set' + toTitleCase(prop)] = function (value) {
        this.el[prop] = value;
    };
});


// Wrap native functions with a function
// pause, load, play
[
    'pause',
    'load',
    'play'
].forEach(prop => {
    Html5.prototype[prop] = function () {
        return this.el[prop]();
    };
});


