/**
 * @file Events
 * @author yuhui06
 * @date 2017/11/3
 *       2018/4/27 简化代码
 */

import * as DOM from '../utils/dom';
import * as Events from './events';

export default function evented(target = {}) {
    const eventBusKey = DOM.isEl(target.el) ? target.el : DOM.createElement('div');

    target.on = function (eventName, fn) {
        Events.on(eventBusKey, eventName, fn);
    }

    target.off = function (eventName, fn) {
        Events.off(eventBusKey, eventName, fn);
    }

    target.one = function (eventName, fn) {
        Events.one(eventBusKey, eventName, fn);
    }

    target.trigger = function (eventName, initialDict) {
        Events.trigger(eventBusKey, eventName, initialDict);
    }
}