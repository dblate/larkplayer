'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadCss = loadCss;

var _dom = require('./dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var head = window.document.getElementsByTagName('head')[0]; /**
                                                             * @file script-loader.js 加载脚本
                                                             * @author yuhui<yuhui06@baidu.com>
                                                             * @date 2017/11/21
                                                             */

function loadCss(src) {
    var link = Dom.createEl('link', {
        type: 'text/css',
        rel: 'stylesheet',
        href: src
    });

    head.appendChild(link);
}
