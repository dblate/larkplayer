/**
 * @file script-loader.js 加载脚本
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/21
 */

import * as Dom from './dom';

const head = window.document.getElementsByTagName('head')[0];

export function loadCss(src) {
    const link = Dom.createEl('link', {
        type: 'text/css',
        rel: 'stylesheet',
        href: src
    });

    head.appendChild(link);
}