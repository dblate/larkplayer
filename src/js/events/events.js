/**
 * @file Events
 * @author yuhui06
 * @date 2017/11/3
 *       2018/4/27 使用 CustomEvent 重构 Events 模块
 */

import document from 'global/document';
import assign from 'lodash.assign';


export function on(el, eventName, fn, options = false) {
    el.addEventListener(eventName, fn, options);
}

export function off(el, eventName, fn, options = false) {
    el.removeEventListener(eventName, fn, options);
}

// @todo 感觉实现方式有问题
export function one(el, eventName, fn, options = false) {
    function wrapper() {
        fn();
        off(el, eventName, wrapper, options);
    }

    on(el, eventName, wrapper, options);
}

export function trigger(el, eventName, initialDict = {}) {
    initialDict = assign({
        bubbles: false,
        cancelable: false,
        detail: null
    }, initialDict);

    // for IE9/10/11
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, initialDict.bubbles, initialDict.cancelable, initialDict.detail);

    el.dispatchEvent(event);
}


