'use strict';

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('./utils/events');

var Events = _interopRequireWildcard(_events);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _scriptLoader = require('./utils/script-loader');

var scriptLoader = _interopRequireWildcard(_scriptLoader);

var _plugin = require('./utils/plugin');

var Plugin = _interopRequireWildcard(_plugin);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

require('./shim/third_party/shim.min.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// __uri 只在 fis 环境中支持
// scriptLoader.loadCss(__uri('../css/larkplayer.less'));

/**
 * @file larkplayer.js larkplayer 入口函数
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

var document = window.document;

// 包含所有兼容 es6 的代码
// @todo 有没有更好的解决方案，目前看 babel-plugin-transform-runtime 不会解决在原型上的方法
// @see https://www.zhihu.com/question/49382420/answer/115692473


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

    return { el: el, options: options, readyFn: readyFn };
}

function larkplayer(el, options, readyFn) {
    var _normalize = normalize(el, options, readyFn);
    // () 避免 {} 在行首造成语法错误


    el = _normalize.el;
    options = _normalize.options;
    readyFn = _normalize.readyFn;


    var player = new _player2.default(el, options, readyFn);

    return player;
}

// verison
larkplayer.version = '1.0';

// dom
larkplayer.dom = Dom;

// events
larkplayer.on = Events.on;

larkplayer.one = Events.one;

larkplayer.off = Events.off;

larkplayer.trigger = Events.trigger;

// log
larkplayer.log = _log2.default;

// plugin
larkplayer.registerPlugin = Plugin.registerPlugin;
larkplayer.deregisterPlugin = Plugin.deregisterPlugin;

// export default larkplayer;
// for babel es6
// @see https://github.com/babel/babel/issues/2724
module.exports = larkplayer;
//# sourceMappingURL=larkplayer.js.map
