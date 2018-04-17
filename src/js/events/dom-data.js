/**
 * @file dom-data.js
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

import {newGUID} from '../utils/guid';

// 所有的数据会存在这里
// 我们可以将数据与 DOM 元素绑定，但又不是直接将数据放在它上面
// eg. Event listeners 是通过这种方式绑定的
let elData = {};

const elIdAttr = 'larkplayer_data_' + Date.now();

/**
 * 获取 DOM 元素上的数据
 *
 * @param {Element} el 获取该元素上的数据
 * @return {Object} 想要的数据
 */
export function getData(el) {
    let id = el[elIdAttr];

    if (!id) {
        id = el[elIdAttr] = newGUID();
    }

    if (!elData[id]) {
        elData[id] = {};
    }

    return elData[id];
}

/**
 * 判断一个元素上是否有我们存的数据
 *
 * @param {Element} el 就是要看这个元素上有没有我们之前存的数据
 * @return {boolean} 元素上是否存有数据
 */
export function hasData(el) {
    const id = el[elIdAttr];

    if (!id || !elData[id]) {
        return false;
    }

    return !!Object.keys(elData[id]).length;
}

/**
 * 删除我们之前在元素上存放的数据
 *
 * @param {Element} el 宿主元素
 */
export function removeData(el) {
    const id = el[elIdAttr];

    if (!id) {
        return;
    }

    // 删除存放的数据
    delete elData[id];

    // 同时删除 DOM 上的对应属性
    try {
        delete el[elIdAttr];
    } catch (e) {
        if (el.removeAttribute) {
            el.removeAttribute(elIdAttr);
        } else {
            // IE document 节点似乎不支持 removeAttribute 方法
            el[elIdAttr] = null;
        }
    }
}





















