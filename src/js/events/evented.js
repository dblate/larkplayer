/**
 * @file 给一个对象添加事件方面的 api
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

import * as Events from './events';
import * as DOM from '../utils/dom';

/**
 * 使一个对象具有直接使用 on off one trigger 的能力
 *
 * @param {Object} target 要具有事件能力的对象
 * @param {Object} options 配置项
 * @param {string=} options.eventBusKey 一个 DOM 元素，事件绑定在该元素上
 */
export default function evented(target, options = {}) {
    if (target.isEvented && target.eventBusEl === options.eventBusKey) {
        return;
    } else {
        target.isEvented = true;
    }

    // @todo normalize args
    const eventBusKey = options.eventBusKey;
    if (eventBusKey && eventBusKey.nodeType === 1) {
        target.eventBusEl = eventBusKey;
    } else {
        target.eventBusEl = DOM.createEl('div');
    }

    // if (target[eventBusKey] && target[eventBusKey]['nodeType'] === 1) {
    //     target.eventBusEl = target[eventBusKey];
    // } else {
    //     target.eventBusEl = DOM.createEl('div');
    // }

    target.on = function (type, fn) {
        Events.on(target.eventBusEl, type, fn);
    };

    target.off = function (type, fn) {
        Events.off(target.eventBusEl, type, fn);
    };

    target.one = function (type, fn) {
        Events.one(target.eventBusEl, type, fn);
    };

    target.trigger = function (type, data) {
        Events.trigger(target.eventBusEl, type, data);
    };
}