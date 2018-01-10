/**
 * @file fast-click.js  使一个 DOM 元素具有 fastclick 功能。
 *                      fastclick: 在移动端中，利用 touch 事件手动触发 click，避免移动端 click 的 300ms 延时
 * @author yuhui06
 * @date 2017/1/6
 */

import * as Events from '../utils/events';
import * as Dom from '../utils/dom';

function createClick(event) {
    let clickEvent = {};
    for (let attr in event) {
        clickEvent[attr] = event[attr];
    }
    clickEvent.type = 'click';
}

export default function fastClick(el) {
    if (el.childNodes.length) {
        for (let i = 0; i < el.childNodes.length; i++) {
            const curEl = el.childNodes[i];
            if (Dom.isEl(curEl)) {
                _fastClick(curEl);
            }

            fastClick(curEl);
        }
    }
}

// @todo 命名规范有问题，但是暂时想不出更好的命名
function _fastClick(el) {
    if (!Dom.isEl(el)) {
        return;
    }

    // 手指移动的距离超过 10px，则不构造 fastclick 事件
    const distanceLimit = 10;
    // 手指按压的时间超过 200ms 则不构造 fastclick 事件
    const timeLimit = 200;
    let couldBeFastClick = false;
    let eventData = {};
    Events.on(el, 'touchstart', event => {
        if (event.touches.length === 1) {
            couldBeFastClick = true;

            const touches = event.changedTouches || event.touches;
            eventData.startTime = Date.now();
            eventData.startX = touches[0]['pageX'];
            eventData.startY = touches[0]['pageY'];
        } else {
            couldBeFastClick = false;
        }
    });

    Events.on(el, 'touchmove', event => {
        if (event.touches.length === 1) {
            const touches = event.changedTouches || event.touches;
            const currentX = touches[0]['pageX'];
            const currentY = touches[0]['pageY'];
            // 两点之间的距离计算
            const distance = (Math.pow(currentX, 2) + Math.pow(currentY, 2))
                - (Math.pow(eventData.startX, 2) + Math.pow(eventData.startY, 2));
            if (distance < distanceLimit) {
                couldBeFastClick = true;
            } else {
                couldBeFastClick = false;
            }
        } else {
            couldBeFastClick = false;
        }
    });

    Events.on(el, 'touchend', event => {
        if (couldBeFastClick) {
            const currentTime = Date.now();
            if (currentTime - eventData.startTime < timeLimit) {
                // 使用我们手动触发的 click 时，禁止后续浏览器自己触发的 click 事件
                event.preventDefault();

                Events.trigger(el, createClick(event), event);
            }
        }
    });
}