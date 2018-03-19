/**
 * @file larkplayer.js larkplayer 入口函数
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

import * as Dom from './utils/dom';
import * as Events from './utils/events';
import Component from './component';
import Player from './player';
import * as scriptLoader from './utils/script-loader';
import * as Plugin from './utils/plugin';
import log from './utils/log';

// 包含所有兼容 es6 的代码
// @todo 有没有更好的解决方案，目前看 babel-plugin-transform-runtime 不会解决在原型上的方法
// @see https://www.zhihu.com/question/49382420/answer/115692473
import './shim/third_party/shim.min.js';

const document = window.document;

function normalize(el, options, readyFn) {
    if (typeof el === 'string') {
        if (el.charAt(0) !== '#') {
            el = '#' + el;
        }

        el = Dom.$(el);
    }

    options = options || {};

    // 默认添加 playsinline 属性
    if (options.playsinline === undefined) {
        options.playsinline = true;
    }

    readyFn = readyFn || function () {};

    return {el, options, readyFn};
}


function larkplayer(el, options, readyFn) {
    // () 避免 {} 在行首造成语法错误
    ({el, options, readyFn} = normalize(el, options, readyFn));

    const player = new Player(el, options, readyFn);

    return player;
}


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