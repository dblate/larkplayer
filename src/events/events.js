/**
 * @file Events
 * @author yuhui06
 * @date 2017/11/3
 *       2018/4/27 使用 CustomEvent 重构 Events 模块
 */

import document from 'global/document';
import assign from 'object-assign';

/**
 * 绑定事件
 *
 * @param {Element} el 要绑定事件的 DOM 元素
 * @param {string} eventName 事件名
 * @param {Function} fn 回调函数
 * @param {(Object|boolean)=} options 事件触发方式设置。可选，默认为 false
 *                   @https://dom.spec.whatwg.org/#dictdef-eventlisteneroptions 查看其他可选项
 */
export function on(el, eventName, fn, options = false) {
    el.addEventListener(eventName, fn, options);
}

/**
 * 注销事件
 *
 * @param {Element} el 要注销事件的 DOM 元素
 * @param {string} eventName 事件名
 * @param {Function} fn 要注销的函数名
 * @param {(Object|boolean)=} options 事件触发方式设置
 */
export function off(el, eventName, fn, options = false) {
    el.removeEventListener(eventName, fn, options);
}

/**
 * 绑定事件且该事件只执行一次
 *
 * @param {Element} el 要绑定事件的 DOM 元素
 * @param {string} eventName 事件名
 * @param {Function} fn 回调函数
 * @param {(Object|boolean)=} options 事件触发方式设置。可选，默认为 false
 */
export function one(el, eventName, fn, options = false) {
    function wrapper() {
        fn();
        off(el, eventName, wrapper, options);
    }

    on(el, eventName, wrapper, options);
}

/**
 * 触发事件
 *
 * @param {Element} el 触发事件的元素
 * @param {string} eventName 事件名
 * @param {Object=} initialDict 一些其他设置，可选
 * @param {boolean} initialDict.bubbles 是否冒泡，默认 false
 * @param {boolean} initialDict.cancelable 是否可取消，默认 false
 * @param {Mixed} initialDict.detail 随事件传递的自定义数据，默认 null 
 */
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


