/**
 * @file larkplayer.js larkplayer 入口函数
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

import assign from 'lodash.assign';

import * as Dom from './utils/dom';
import * as Events from './utils/events';
import Player from './player';
import * as Plugin from './utils/plugin';
import log from './utils/log';
import Html5 from './html5';

function normalize(el, options = {}, readyFn = function () {}) {
    const defaultOptions = {
        playsinline: true
    };

    options = assign({}, defaultOptions, options);

    // 如果传入 id，则根据 id 获取元素
    if (typeof el === 'string') {
        if (el.charAt(0) !== '#') {
            el = '#' + el;
        }

        el = Dom.$(el);
    }

    if (!Dom.isEl(el)) {
        throw new Error('[larkplayer initial error]: el should be an id or DOM element!');
    }

    // 如果该元素不是 video 标签，则在该元素内创建 video 标签
    if (el.tagName.toUpperCase() !== 'VIDEO') {
        let videoEl = Dom.createElement('video', {
            id: el.id + '-video'
        });

        el.appendChild(videoEl);
        el = videoEl;
        videoEl = null;
    }

    return {el, options, readyFn};
}


function larkplayer(el, options, readyFn) {
    // @todo 优化不支持 html5 video 标签时的展示
    if (!Html5.isSupported()) {
        return false;
    }

    // () 避免 {} 在行首造成语法错误
    ({el, options, readyFn} = normalize(el, options, readyFn));

    const player = new Player(el, options, readyFn);

    return player;
}


larkplayer.Html5 = Html5;

larkplayer.dom = Dom;

// events
larkplayer.on = Events.on;
larkplayer.one = Events.one;
larkplayer.off = Events.off;
larkplayer.trigger = Events.trigger;

larkplayer.log = log;

// plugin
larkplayer.registerPlugin = Plugin.registerPlugin;
larkplayer.deregisterPlugin = Plugin.deregisterPlugin;

// export default larkplayer;
// for babel es6
// @see https://github.com/babel/babel/issues/2724
module.exports = larkplayer;