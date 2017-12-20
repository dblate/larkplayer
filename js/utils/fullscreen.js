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

import * as Events from './events';

const document = window.document;

/**
 * @const 目前所有的 fullscreen api
 */
const API = [
    // ideal api
    [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
    ],
    // New WebKit
    [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

    ],
    // Old WebKit (Safari 5.1)
    [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

    ],
    [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
    ],
    [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
    ]
];

let browserApi = {};


API.forEach((value, index) => {
    if (value && value[1] in document) {
        value.forEach((val, i) => {
            browserApi[API[0][i]] = val;
        });
    }
});

export default {
    requestFullscreen(el) {
        el[browserApi.requestFullscreen]();
    },
    exitFullscreen() {
        document[browserApi.exitFullscreen]();
    },
    fullscreenElement() {
        return document[browserApi.fullscreenElement];
    },
    fullscreenEnabled() {
        return document[browserApi.fullscreenEnabled];
    },
    isFullscreen() {
        return !!this.fullscreenElement();
    },
    fullscreenchange(callback) {
        Events.on(document, browserApi.fullscreenchange, callback);
    },
    fullscreenerror(callback) {
        Events.on(document, browserApi.fullscreenerror, callback);
    },
    // @todo 不够优雅，不过好歹是给了事件注销的机会
    off(type, callback) {
        if (/change/.test(type)) {
            type = browserApi.fullscreenchange;
        } else {
            type = browserApi.fullscreenerror;
        }
        Events.off(document, type, callback);
    }
};









