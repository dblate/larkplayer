/**
 * @file larkplayer.js larkplayer 入口函数
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

import assign from 'object-assign';

import * as DOM from './utils/dom';
import * as Events from './events/events';
import Player from './player';
import Html5 from './html5/html5';
import Component from './plugin/component';
import MediaSourceHandler from './plugin/media-source-handler';
import Plugin from './plugin/plugin';
import util from './utils/utils';

function normalize(el, options = {}, readyFn = function () {}) {
    options = assign({playsinline: true}, options);

    // 如果传入 id，则根据 id 获取元素
    if (typeof el === 'string') {
        el = DOM.$(/^#/.test(el) ? el : `#${el}`);
    }

    if (!DOM.isEl(el)) {
        throw new Error('[larkplayer initial error]: el should be an id or DOM element!');
    }

    // 如果该元素不是 video 标签，则在该元素内创建 video 标签
    if (el.tagName.toUpperCase() !== 'VIDEO') {
        let videoEl = DOM.createElement('video', {
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

assign(larkplayer, {
    Events,
    DOM,
    Component,
    MediaSourceHandler,
    Plugin,
    util
});

// for babel es6
// @see https://github.com/babel/babel/issues/2724
module.exports = larkplayer;

