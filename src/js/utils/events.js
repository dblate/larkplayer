/**
 * @file 事件系统，借用系统事件能力的同时，能添加自定义事件
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

import * as DomData from './dom-data';
import {newGUID} from './guid';

// data.disabled
// data.dispatcher
// data.handlers
// let data = {};

const document = window.document;

/**
 * 清理事件相关的数据(Clean up the listener cache and dispatchers)
 *
 * @inner
 *
 * @param {Element} elem 待清理的元素
 * @param {string} type 待清理的事件类型
 */
function cleanUpEvents(elem, type) {
    const data = DomData.getData(elem);

    // 如果该 type 下已经没有回调函数，那就取消掉之前注册的事件并且删除不必要的属性
    if (data.handlers && data.handlers[type] && data.handlers[type]['length'] === 0) {
        // 删除不必要的属性
        delete data.handlers[type];

        // 删除之前注册的事件
        if (elem.removeEventListener) {
            elem.removeEventListener(type, data.dispatcher, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, data.dispatcher);
        }
    }

    // 如果 hanlders 下已经没有 type，那可以清除 data 下的所有属性了
    if (Object.getOwnPropertyNames(data.handlers).length === 0) {
        delete data.handlers;
        delete data.dispatcher;
        delete data.disabled;
    }

    // 如果 data 的属性已经被清空，那么对应 DOM 上的数据相关的属性也可以清除了
    if (Object.getOwnPropertyNames(data).length === 0) {
        DomData.removeData(elem);
    }
}

/**
 * 循环 types 数组，给每个 type 都执行指定的方法
 *
 * 将需要在不同函数里执行的循环操作抽离出来
 *
 * @inner
 *
 * @param {Function} func 要循环执行的函数
 * @param {Element} elem 宿主元素
 * @param {Array} types 类型数组
 * @param {Function} callback 要注册的回调函数
 */
function handleMultipleEvents(func, elem, types, callback) {
    if (types && types.length) {
        types.forEach(type => func(elem, type, callback));
    }
}

/**
 * 修复事件，使其具有标准的属性
 *
 * @param {Event|Object} event 待修复的事件
 * @return {Object} 修复后的事件
 */
export function fixEvent(event) {
    function returnTure() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    // Test if fixing up is needed
    // Used to check if !event.stopPropagation instead of isPropagationStopped
    // But native events return true for stopPropagation, but don't have
    // other expected methods like isPropagationStopped. Seems to be a problem
    // with the Javascript Ninja code. So we're just overriding all events now.
    if (!event || !event.isPropagationStopped) {
        const old = event || window.event;

        event = {};

        // Clone the old object so that we can modify the values event = {};
        // IE8 Doesn't like when you mess with native event properties
        // Firefox returns false for event.hasOwnProperty('type') and other props
        //  which makes copying more difficult.
        // TODO: Probably best to create a whitelist of event props
        for (const key in old) {
            // Safari 6.0.3 warns you if you try to copy deprecated layerX/Y
            // Chrome warns you if you try to copy deprecated keyboardEvent.keyLocation
            // and webkitMovementX/Y
            if (key !== 'layerX' && key !== 'layerY' && key !== 'keyLocation'
                && key !== 'webkitMovementX' && key !== 'webkitMovementY') {
                // Chrome 32+ warns if you try to copy deprecated returnValue, but
                // we still want to if preventDefault isn't supported (IE8).
                if (!(key === 'returnValue' && old.preventDefault)) {
                    event[key] = old[key];
                }
            }
        }

        // 事件发生在此元素上
        if (!event.target) {
            event.target = event.srcElement || document;
        }

        // 跟事件发生元素有关联的元素
        if (!event.relatedTarget) {
            event.relatedTarget = event.fromElement === event.target
                ? event.toElement
                : event.fromElement;
        }

        // 阻止默认事件
        event.preventDefault = function () {
            if (old.preventDefault) {
                old.preventDefault();
            }

            event.returnValue = false;
            old.returnValue = false;
            event.defaultPrevented = true;
        };

        event.defaultPrevented = false;

        // 阻止事件冒泡
        event.stopPropagation = function () {
            if (old.stopPropagation) {
                old.stopPropagation();
            }

            event.cancelBubble = true;
            old.cancelBubble = true;
            event.isPropagationStopped = returnTure;
        };

        event.isPropagationStopped = returnFalse;

        // 阻止事件冒泡，并且当前阶段的事件也不执行
        event.stopImmediatePropagation = function () {
            if (old.stopImmediatePropagation) {
                old.stopImmediatePropagation();
            }

            event.isImmediatePropagationStopped = returnTure;
            event.stopPropagation();
        };

        event.isImmediatePropagationStopped = returnFalse;

        // 鼠标位置
        if (event.clientX != null) {
            const doc = document.documentElement;
            const body = document.body;

            // clientX 代表与窗口左边的距离，根据页面滚动不同，是可变的
            // pageX 代表相对于文档左边的距离，是个常量
            event.pageX = event.clientX
                + (doc && doc.scrollLeft || body && body.scrollLeft || 0)
                - (doc && doc.clientLeft || body && body.clientLeft || 0);

            event.pageY = event.clientY
                + (doc && doc.scrollTop || body && body.scrollTop || 0)
                - (doc && doc.clientTop || body && body.clientTop || 0);
        }

        // 键盘按键
        event.which = event.charCode || event.keyCode;

        // 鼠标按键
        // 0: 左键
        // 1: 中间按钮
        // 2: 右键
        if (event.button != null) {
            // em... 这里应该是 与运算，就没去细究了
            /* eslint-disable */
            event.button = (event.button & 1 ? 0 :
                (event.button & 4 ? 1 :
                    (event.button & 2 ? 2 : 0)));
            /* eslint-disable */
        }
    }

    return event;
}

/**
 * 是否支持 passive event listeners
 * passive event listeners 可以提升页面的滚动性能
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export let isPassiveSupported = false;
(function () {
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get() {
                // 如果浏览器会来读取这个属性，说明支持该功能
                isPassiveSupported = true;
            }
        });

        window.addEventListener('test', null, opts);
    } catch (ex) {
    }
})();

/**
 * @const 目前 chrome 支持的 passive event
 */
const passiveEvents = [
    'touchstart',
    'touchmove'
];

/**
 * 向元素注册监听函数
 *
 * @todo explain
 * @param {Element|Object} 要绑定事件的元素／对象，这里允许 Object 是考虑到后面讲事件处理作为一种能力赋予任何一个对象
 * @param {string|Array} 事件类型，可以是数组的形式
 * @param {Function} fn 要注册的回调函数
 */
export function on(elem, type, fn) {
    if (Array.isArray(type)) {
        return handleMultipleEvents(on, elem, type, fn);
    }


    // 对于自定义的事件，我们只能自己存起来
    // 这样在手动触发时，才能拿出来发动一把
    let data = DomData.getData(elem);
    if (!data.handlers) {
        data.handlers = {};
    }

    if (!data.handlers[type]) {
        data.handlers[type] = [];
    }

    if (!fn.guid) {
        fn.guid = newGUID();
    }

    // 我们往 handlers[type] 里面存函数，然后通过 dispatcher 调用
    data.handlers[type].push(fn);

    if (!data.dispatcher) {
        /**
         * trigger 的时候，我们通过调用这个函数，来调用注册在对应 elem 的对应 type 上的所有函数
         *
         * @param {Event} event 事件
         * @param {Mixed} extraData 传入函数的数据
         */
        data.dispatcher = function (event, extraData) {
            if (data.disabled) {
                return;
            }

            // 通过 event.type 找到之前注册的回调函数
            const handlers = data.handlers[event.type];

            event = fixEvent(event);

            if (handlers) {
                // 鲁棒性。如果事件在执行过程中发生变动，不至于影响原来注册的事件，从而影响下次执行
                const handlersClone = handlers.slice(0);

                for (let i = 0; i < handlersClone.length; i++) {
                    // 如果执行了 stopImmediatePropagation，那我们应该立即停止
                    if (event.isImmediatePropagationStopped()) {
                        break;
                    } else {
                        try {
                            // 在当前 elem 上调用，同时将 event extraData 传过去当参数
                            handlersClone[i].call(elem, event, extraData);
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                }
            }
        };
    }

    // 只注册一次
    if (data.handlers[type]['length'] === 1) {
        // 系统事件，借用系统的能力调起
        // 注意 这里注册的是 dispatcher 函数，通过 dispatcher 来统一地管理 fn
        if (elem.addEventListener) {
            // passive event listener
            let options = false;
            if (isPassiveSupported && passiveEvents.includes(type)) {
                options = {passive: true};
            }

            elem.addEventListener(type, data.dispatcher, options);
        } else if (elem.attachEvent) {
            elem.attachEvent(('on' + type), data.dispatcher);
        }
    }
}

/**
 * 触发事件
 *
 * @param {string} 事件类型
 * @param {Mixed} hash 事件触发时，传入的数据
 */
export function trigger(elem, event, hash) {
    // 先判断 hasData，避免直接用 getData 给 elem 添加额外的数据（具体可参见 DomData:getData）
    const data = DomData.hasData(elem) ? DomData.getData(elem) : {};
    // 事件冒泡
    const parent = elem.parentNode || elem.ownerDocument;

    // 将 string 包装成正常的事件类型
    if (typeof event === 'string') {
        event = {type: event, target: elem};
    }

    // 标准化
    event = fixEvent(event);

    // 如果有事件调度函数，那我们可以通过这个函数去调用注册在这个元素上的对应类型的事件
    // 理论上注册过事件后就会有这个函数
    if (data.dispatcher) {
        data.dispatcher.call(elem, event, hash);
    }

    // 冒泡吧
    // 如果还有父元素，并且没有手动阻止事件冒泡，且这个事件本身支持冒泡（media events 不支持），那我们继续
    if (parent && !event.isPropagationStopped() && event.bubbles === true) {
        // 注意 这里就直接传我们标准化过的 event 了，不用再传 type
        trigger.call(null, parent, event, hash);
    // 如果已经到最上层的元素，并且没有被阻止事件的默认行为，那我们看看有没有系统对这种事件有没有默认行为要执行
    } else if (!parent && !event.defaultPrevented) {
        const targetData = DomData.getData(event.target);
        // 如果系统也在这个事件上注册有函数
        if (event.target[event.type]) {
            // 在执行系统的事件函数前，先关闭我们自己的事件分发，因为已经执行过一次了（否则之前的那些事件有会被执行一次）
            targetData.disabled = true;

            // 执行系统默认事件
            if (typeof event.target[event.type] === 'function') {
                event.target[event.type]();
            }

            // 恢复 disable 参数，避免对下次事件造成影响
            targetData.disabled = false;
        }
    }

    // 告知调用者这个事件的默认行为是否被阻止了
    // @see https://www.w3.org/TR/DOM-Level-3-Events/#event-flow-default-cancel
    return !event.defaultPrevented;
}

/**
 * 移除已注册的事件
 *
 * @param {Element} elem 要移除事件的元素
 * @param {string|Array=} 事件类型。可选，如果没有 type 参数，则移除该元素上所有的事件
 * @param {Function=} 要移除的指定的函数。可选，如果没有此参数，则移除该 type 上的所有事件
 *
 * @desc
 *    1) 请按照参数顺序传参数
 */
export function off(elem, type, fn) {
    if (!DomData.hasData(elem)) {
        return;
    }

    let data = DomData.getData(elem);

    if (!data.handlers) {
        return;
    }

    if (Array.isArray(type)) {
        return handleMultipleEvents(off, elem, type, fn);
    }

    function removeType(curType) {
        data.handlers[curType] = [];
        cleanUpEvents(elem, curType);
    }

    // 避免不传 type，直接传 fn 的情况
    if (typeof type === 'function') {
        throw new Error('注销指定事件函数前，先指定事件类型');
    }

    // 没有传 type，则移除所有事件
    if (!type) {
        for (let i in data.handlers) {
            removeType(i);
        }

        return;
    }

    // 传了 type
    let handlers = data.handlers[type];

    if (!handlers) {
        return;
    }

    // 传了 type，但没传 fn，则移除该 type 下的所有事件
    if (type && !fn) {
        removeType(type);
        return;
    }

    // 传了 type 且传了 fn，则移除 type 下的 fn
    // 如果这个函数之前注册过，就会有 guid 属性
    if (fn.guid) {
        if (handlers && handlers.length) {
            data.handlers[type] = handlers.filter(value => value.guid !== fn.guid);
        }
    }

    // 最后需要再扫描下，有没有刚好被移除了所有函数的 type 或者 handlers
    cleanUpEvents(elem, type);
}

/**
 * 在指定事件下，只触发指定函数一次
 *
 * @param {Element} elem 要绑定事件的元素
 * @param {string|Array} type 绑定的事件类型
 * @param {Function} 注册的回调函数
 */
export function one(elem, type, fn) {
    if (Array.isArray(type)) {
        return handleMultipleEvents(one, elem, type, fn);
    }

    function executeOnlyOnce() {
        off(elem, type, executeOnlyOnce);
        fn.apply(this, arguments);
    }

    // 移除函数需要 guid 属性
    executeOnlyOnce.guid = fn.guid = fn.guid || newGUID();

    on(elem, type, executeOnlyOnce);
}





































