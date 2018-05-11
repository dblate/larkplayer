/**
 * @file html5 video api proxy
 * @author yuhui06(yuhui06@baidu.com)
 * @date 2017/11/6
 * @see https://html.spec.whatwg.org/#event-media-emptied
 * @see https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-src
 */

import window from 'global/window';
import document from 'global/document';
import includes from 'lodash.includes'; 

import * as DOM from '../utils/dom';
import toTitleCase from '../utils/to-title-case';
import normalizeSource from '../utils/normalize-source';
import evented from '../events/evented';
import HTML5_ATTRS, {HTML5_WRITABLE_ATTRS, HTML5_WRITABLE_BOOL_ATTRS} from './html5-attrs';

export default class Html5 {
    constructor(player, options) {
        this.options = options;
        this.el = this.options.el;

        evented(this, {eventBusKey: this.el});
        this.proxyWebkitFullscreen();
    }

    dispose() {
        Html5.disposeMediaElement(this.el);
    }

    proxyWebkitFullscreen() {
        if (!('webkitDisplayingFullscreen' in this.el)) {
            return;
        }

        let endFn = function () {
            this.trigger('fullscreenchange', {detail: {isFullscreen: false}});
        };

        let beginFn = function () {
            if ('webkitPresentationMode' in this.el
                && this.el.webkitPresentationMode !== 'picture-in-picture') {

                this.one('webkitendfullscreen', endFn);
                this.trigger('fullscreenchange', {detail: {isFullscreen: true}});
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

Html5.disposeMediaElement = function (el) {
    Html5.resetMediaElement(el);
    el.parentNode && el.parentNode.removeChild(el);
};

Html5.resetMediaElement = function (el) {
    if (!el) {
        return;
    }

    while(el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }

    el.removeAttribute('src');

    if (typeof el.load === 'function') {
        try {
            el.load();
        } catch (ex) {}
    }
};

// Wrap HTML5 video attributes with a getter 
HTML5_ATTRS.forEach(attr => {
    Html5.prototype[attr] = function () {
        return includes(HTML5_WRITABLE_BOOL_ATTRS, attr)
            ? (this.el[attr] || this.el.hasAttribute(attr))
            : this.el[attr];
    };
});

// Wrap HTML5 video attributes with a setter on Html5 prototype
HTML5_WRITABLE_ATTRS.forEach(attr => {
    Html5.prototype[`set${toTitleCase(attr)}`] = function (value) {
        this.el[attr] = value;
        value === false && this.el.removeAttribute(attr);
    };
});

// Wrap native functions with a function
[
    'pause',
    'load',
    'play'
].forEach(prop => {
    Html5.prototype[prop] = function () {
        return this.el[prop]();
    };
});


