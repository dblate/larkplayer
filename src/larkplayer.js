/**
 * @file larkplayer entry
 * @author yuhui06
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

    if (typeof el === 'string') {
        el = DOM.$(/^#/.test(el) ? el : `#${el}`);
    }
    if (!DOM.isEl(el)) {
        throw new Error('[larkplayer initial error]: el should be an id or DOM element!');
    }
    if (el.tagName.toUpperCase() !== 'VIDEO') {
        const videoEl = DOM.createElement('video', {
            id: el.id + '-video'
        });

        el.appendChild(videoEl);
        el = videoEl;
    }

    return [el, options, readyFn];
}

function larkplayer(el, options, readyFn) {
    if (!Html5.isSupported()) {
        el.innerHTML = '请升级或更换浏览器以支持 html5 视频播放';
        return false;
    }

    return new Player(...normalize(el, options, readyFn));
}

assign(larkplayer, {Events, DOM, Component, MediaSourceHandler, Plugin, util});

// @see https://github.com/babel/babel/issues/2724
module.exports = larkplayer;

