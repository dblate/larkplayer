/**
 * @file dom 相关 api
 * @author yuhui06@baidu.com
 * @date 2017/11/2
 */

import {isObject} from './obj';
import computedStyle from './computed-style';

const document = window.document;


/**
 * 检测一个字符串是否包含任何非空格的字符
 *
 * @inner
 *
 * @param {string} str 待检查的字符串
 * @return {boolean} 是否包含非空格的字符
 */
function isNonBlankString(str) {
    return typeof str === 'string' && (/\S/).test(str);
}

/**
 * 如果字符串中包含空格，则抛出错误
 *
 * @inner
 *
 * @param {string} str 待检查的字符串
 * @throws {Error}
 */
function throwIfWhitespace(str) {
    if ((/\s/).test(str)) {
        throw new Error('class has illegal whitespace characters');
    }
}

/**
 * 生成一个正则表达式，用于检查一个元素的 className 字符串中是否包含特定的 className
 *
 * @inner
 *
 * @param {string} className 就是为了他！
 * @return {Regexp} 用于检查该类名是否存在于一个元素的 className 字符串中
 */
function classRegExp(className) {
    return new RegExp('(^|\\s)' + className + '($|\\$)');
}

/**
 * 是否处于浏览器环境中
 *
 * @return {boolean}
 */
export function isReal() {
    // IE 9 以下，DOM 上的方法的 typeof 类型为 'object' 而不是 'function'
    // 所以这里用 'undefined' 检测
    return typeof document.createElement !== 'undefined';
}

/**
 * 判断一个变量是否是 DOM element
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 是否是 DOM element
 */
export function isEl(value) {
    return isObject(value) && value.nodeType === 1;
}


/**
 * 创建一个 DOM 查询函数，这个函数在原有方法的基础上有额外的指定上下文的功能
 *
 * @param {string} method 方法名
 * @return {Function} 查询 DOM 用的函数
 */
export function createQuerier(method) {
    return function (selector, context) {
        if (!isNonBlankString(selector)) {
            return document[method](null);
        }
        if (isNonBlankString(context)) {
            context = document.querySelector(context);
        }

        const ctx = isEl(context) ? context : document;

        return ctx[method] && ctx[method](selector);
    };
}

/**
 * 创建 DOM 元素
 *
 * @param {string=} tagName 元素类型。可选，默认 div
 * @param {Object=} properties 元素 prop 属性。可选，默认无
 * @param {Object=} attributes 元素 attr 属性。可选，默认无
 * @param {string|Element|TextNode|Array|Function=} content 元素内容。可选，默认无
 * @return {Element} el 创建的元素
 */
export function createEl(tagName = 'div', properties = {}, attributes = {}, content) {
    const el = document.createElement(tagName);

    if (properties == null) {
        properties = {};
    }

    if (attributes == null) {
        attributes = {};
    }

    Object.keys(properties).forEach(propName => {
        const val = properties[propName];

        // 对于一些属性需要特殊处理
        if (propName.indexOf('aria-') !== -1
            || propName === 'role'
            || propName === 'type') {

            el.setAttribute(propName, val);
        } else if (propName === 'textContent') {
            // textContent 并不是所有浏览器都支持，单独写了个方法
            textContent(el, val);
        } else {
            el[propName] = val;
        }
    });

    Object.keys(attributes).forEach(attrName => {
        el.setAttribute(attrName, attributes[attrName]);
    });

    if (content) {
        appendContent(el, content);
    }

    return el;
}

/**
 * 创建一个元素，并能添加 props 和 子元素
 *
 * vjs 的 createEl 将 props 和 attrs 分成了两个参数，但是我们的业务没必要这么做
 * 而且每次想要传 child 参数的时候，还得先传 attrs 参数让我觉得很烦
 *
 * @todo 先写一个这个函数自己用，后面看有没有必要把 createEl 函数换掉
 *
 * @param {string} tagName DOM 元素标签名
 * @param {Object=} props 要到 DOM 元素上的属性。注意，这里直接是 el.propName = value 的形式，如果涉及到 attrs，建议后续用 setAttrbute 自己添加
 * @param {...Element|string} child 元素的子元素，参数个数不限。可以没有，也可以有多个
 * @return {Element} el 创建的元素
 */
export function createElement(tagName = 'div', props = {}, ...child) {
    const el = document.createElement(tagName);

    if (props == null) {
        props = {};
    }
    Object.keys(props).forEach(propName => {
        el[propName] = props[propName];
    });

    if (child) {
        appendContent(el, child);
    }

    return el;
}

/**
 * 更改 DOM 元素中的文本节点（整个文本内容都会被替换掉）
 *
 * @param {Element} el 将要改变文本节点的 DOM 元素
 * @param {string} text 要添加的文本
 * @return {Element} el 更改后的 DOM 元素
 */
export function textContent(el, text) {
    if (typeof el.textContent === 'undefined') {
        el.innerText = text;
    } else {
        el.textContent = text;
    }

    return el;
}

/**
 * 将要插入到 DOM 元素中的内容标准化
 *
 * 使用 createTextNode 而不是 createElement 避免 XSS 漏洞
 *
 * @param {string|Element|TextNode|Array|Function} content
 *        - string: 标准化为 text node
 *        - Element/TextNode: 不做任何处理
 *        - Array: 遍历处理数组元素
 *        - Function: 先运行得到结果再处理
 * @return {Array} 标准化后的内容
 */
export function normalizeContent(content) {
    if (typeof content === 'function') {
        content = content();
    }

    return (Array.isArray(content) ? content : [].concat(content)).map(value => {
        if (typeof value === 'function') {
            value = value();
        }

        if (isEl(value) || isTextNode(value)) {
            return value;
        }

        if (isNonBlankString(value)) {
            return document.createTextNode(value);
        }
    }).filter(value => value);
}

/**
 * 判断一个变量是否是 textNode
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 是否是 textNode
 */
export function isTextNode(value) {
    return isObject(value) && value.nodeType === 3;
}

/**
 * 将一个元素插入到另一个中作为第一个子元素
 *
 * @param {Element} child 最终的子元素
 * @param {Element} parent 最终的父元素
 */
export function prependTo(child, parent) {
    if (parent.firstChild) {
        parent.insertBefore(child, parent.firstChild);
    } else {
        parent.appendChild(child);
    }
}

/**
 * 返回指定元素的最近的命中选择器的父元素
 *
 * @param {Element} el 要寻找父元素的指定元素
 * @param {string} classForSelector 目前只支持 class 选择器
 * @return {Element|null} 选择器命中的最近的父元素列表
 */
export function parent(el, classForSelector) {
    let result = null;
    while (el && el.parentNode) {
        if (hasClass(el.parentNode, classForSelector)) {
            result = el.parentNode;
            el = null;
        } else {
            el = el.parentNode;
        }
    }

    return result;
}

/**
 * 检查指定元素是否包含指定 class
 *
 * @param {Element} el 宿主元素
 * @param {string} classToCheck 待检查的 class
 * @return {boolean} 元素上是否包含指定 class
 */
export function hasClass(el, classToCheck) {
    throwIfWhitespace(classToCheck);

    if (el.classList) {
        // node.contains(otherNode)
        return el.classList.contains(classToCheck);
    } else {
        return classRegExp(classToCheck).test(el.className);
    }
}

/**
 * 给指定元素增加 class
 *
 * @param {Element} el 要添加 class 的元素
 * @param {string} classToAdd 要添加的 class
 * @return {Element} 添加完 class 后的元素
 */
export function addClass(el, classToAdd) {
    if (el.classList) {
        el.classList.add(classToAdd);
    } else if (!hasClass(el, classToAdd)) {
        el.className = (el.className + ' ' + classToAdd).trim();
    }

    return el;
}

/**
 * 移除指定元素的指定 class
 *
 * @param {Element} el 要移除 class 的元素
 * @param {string} classToRemove 要移除的 class
 * @return {Element} 移除指定 class 后的元素
 */
export function removeClass(el, classToRemove) {
    if (hasClass(el, classToRemove)) {
        if (el.classList) {
            el.classList.remove(classToRemove);
        } else {
            el.className = el.className.split(/\s+/).filter(className => className !== classToRemove).join(' ');
        }
    }

    return el;
}

/**
 * 增加或删除一个元素上的指定的 class
 *
 * @param {Element} el 将要改变 class 的元素
 * @param {string} classToToggle 要添加或删除的 class
 * @param {Function|boolean=} predicate 添加或删除 class 的依据（额外的判断条件）
 * @return {Element} 改变完 class 后的元素
 */
export function toggleClass(el, classToToggle, predicate) {
    // IE 下不支持 el.classList.toggle 方法的第二个参数
    // 不过不影响，因为这里我们用 add/remove
    const has = hasClass(el, classToToggle);

    if (typeof predicate === 'function') {
        predicate = predicate(el, classToToggle);
    }

    if (typeof predicate !== 'boolean') {
        predicate = !has;
    }

    if (predicate === has) {
        return;
    }

    if (predicate) {
        addClass(el, classToToggle);
    } else {
        removeClass(el, classToToggle);
    }

    return el;
}

/**
 * 设置元素的属性
 *
 * @param {Element} el 要设置属性的元素
 * @param {Object} attributes 要设置的属性集合
 */
export function setAttributes(el, attributes) {
    Object.keys(attributes).forEach(attrName => {
        const attrValue = attributes[attrName];

        if (attrValue == null || attrValue === false) {
            el.removeAttribute(attrName);
        } else {
            el.setAttribute(attrName, (attrValue === true ? '' : attrValue));
        }
    });
}

/**
 * 获取元素的所有属性，将 DOM 的 NamedNodeMap 表示为 key/value 的形式
 *
 * @param {Element} el 要获取属性的元素
 * @return {Object} 以 key/value 形式存储的属性
 * @desc
 *      1) boolean 的属性，其值为 true/false
 */
export function getAttributes(el) {
    let collection = {};

    // 已知的值为 boolean 的属性
    // 有些浏览器的这些属性的 typeof 是 boolean，有些不是
    // 列出一个白名单以确保我们想要的效果
    const knownBooleans = [
        'autoplay',
        'controls',
        'playsinline',
        'webkit-playsinline',
        'loop',
        'muted',
        'default',
        'defaultMuted'
    ];

    if (el && el.attributes && el.attributes.length) {
        const attrs = el.attributes;

        for (let i = 0; i < attrs.length; i++) {
            let attrName = attrs[i]['name'];
            let attrValue = attrs[i]['value'];

            if (typeof el[attrName] === 'boolean' || knownBooleans.includes(attrName)) {
                attrValue = (attrValue !== null);
            }

            collection[attrName] = attrValue;
        }
    }

    return collection;
}

/**
 * 获取元素的指定属性，element.getAttribute 换一种写法
 *
 * @param {Element} el 要获取属性的元素
 * @param {string} attribute 要获取的属性名
 * @return {string} 获取的属性值
 */
export function getAttribute(el, attribute) {
    return el.getAttribute(attribute);
}

/**
 * 设置元素的指定属性 element.setAttribute 换一种写法
 *
 * @param {Element} el 要设置属性的元素
 * @param {string} attr 要设置的属性
 * @param {Mixed} value 要设置的属性的值
 */
export function setAttribute(el, attr, value) {
    if (value === false) {
        removeAttribute(el, attr);
    } else {
        // 应该没有属性的值为 "true" 的形式，对于这种，直接转换为空的字符串
        // 如 controls = "true" => controls
        el.setAttribute(attr, (value === true ? '' : value));
    }
}

/**
 * 移除元素上的指定属性 element.removeAttribute 换一种写法
 *
 * @param {Element} el 要移除属性的元素
 * @param {string} attribute 要移除的属性名
 */
export function removeAttribute(el, attribute) {
    el.removeAttribute(attribute);
}

/**
 * 当拖动东西的时候，尝试去阻塞选中文本的功能
 */
export function blockTextSelection() {
    document.body.focus();
    document.onselectstart = function () {
        return false;
    };
}

/**
 * 关闭对文本选中功能的阻塞
 */
export function unblockTextSelection() {
    document.onselectstart = function () {
        return true;
    };
}

/**
 * 同原生的 getBoundingClientRect 方法一样，确保兼容性
 *
 * 在一些老的浏览器（比如 IE8）提供的属性不够时，此方法会手动补全
 *
 * 另外，一些浏览器不支持向 ClientRect/DOMRect 对象中添加属性，所以我们选择创建一个新的对象，
 * 并且把 ClientReact 中的标准属性浅拷贝过来（ x 和 y 没有拷贝，因为这个属性支持的并不广泛）
 *
 * @param {Element} el 要获取 ClientRect 对象的元素
 * @return {Object|undefined}
 */
export function getBoundingClientRect(el) {
    // TODO 为什么还需要判断 parentNode
    if (el && el.getBoundingClientRect && el.parentNode) {
        const rect = el.getBoundingClientRect();
        const result = {};

        ['top', 'right', 'bottom', 'left', 'width', 'height'].forEach(attr => {
            if (rect[attr] !== undefined) {
                result[attr] = rect[attr];
            }
        });

        if (!result.height) {
            result.height = parseFloat(computedStyle(el, 'height'));
        }

        if (!result.width) {
            result.width = parseFloat(computedStyle(el, 'width'));
        }

        return result;
    }
}

/**
 * 获取一个元素在文档中的绝对位置（left, top）
 *
 * @see http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @param {Element} el 要获取位置的元素
 * @return {Object} 包含位置信息的对象
 *
 * @desc
 *      1) clientLeft/clientTop 获取一个元素的左/上边框的宽度，不包括 padding 和 margin 的值
 */
export function findPosition(el) {
    let box = getBoundingClientRect(el);

    if (!box) {
        return {left: 0, top: 0};
    }

    const docEl = document.documentElement;
    const body = document.body;

    const clientLeft = docEl.clientLeft || body.clientLeft || 0;
    const scrollLeft = window.pageXOffset || body.scrollLeft;
    const left = box.left + scrollLeft - clientLeft;

    const clientTop = docEl.clientLeft || body.clientLeft || 0;
    const scrollTop = window.pageYOffset || body.scrollTop;
    const top = box.top + scrollTop - clientTop;

    // 安卓有时侯返回小数，稍微有点偏差，这里四舍五入下
    return {
        left: Math.round(left),
        top: Math.round(top)
    };
}

/**
 * x and y coordinates for a dom element or mouse pointer
 * 以左下角为原点
 *
 * @typedef {Object} DOM~Coordinates
 *
 * @property {number} x  该点距元素左边的距离／元素宽
 * @property {number} y  该点距元素底部的距离／元素高
 */
/**
 * 获取一个元素上被点击的位置（相对于该元素左下角）
 *
 * @param {Element} el 被点击的元素
 * @param {Event} event 点击事件
 * @return {DOM~Coordinates}
 * @desc
 *      1) offsetWidth/offsetHeight: 元素宽／高，包括 border padding width/height scrollbar
 *      2) pageX/pageY: 点击的 x/y 坐标，相对于 document，是个绝对值（当有滚动条时会把滚动条的距离也计算在内）
 *      3) changedTouches: touch 事件中的相关数据
 */
export function getPointerPosition(el, event) {
    const box = findPosition(el);
    const boxW = el.offsetWidth;
    const boxH = el.offsetHeight;
    const boxY = box.top;
    const boxX = box.left;

    let pageX = event.pageX;
    let pageY = event.pageY;

    if (event.changedTouches) {
        pageX = event.changedTouches[0].pageX;
        pageY = event.changedTouches[0].pageY;
    }

    return {
        x: Math.max(0, Math.min(1, (pageX - boxX) / boxW)),
        y: Math.max(0, Math.min(1, ((boxY - pageY) + boxH) / boxH))
    };
}

/**
 * 清空一个元素
 *
 * @param {Element} el 要清空的元素
 * @return {Element} 移除所有子元素后的元素
 */
export function emptyEl(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    return el;
}

/**
 * 向元素内插入内容
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content 待插入的内容，会先经过 normalizeContent 处理
 * @return {Element} 被塞了新内容的元素
 */
export function appendContent(el, content) {
    normalizeContent(content).forEach(node => el.appendChild(node));
    return el;
}

/**
 * 替换元素的内容
 * 感觉名字起得不怎么好
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content
 *        参见 normalizeContent 中参数描述 {@link: dom:normalizeContent}
 * @return {Element} el 替换内容后的元素
 */
export function insertContent(el, content) {
    return appendContent(emptyEl(el), content);
}

/**
 * 同 insertContent
 * insertContent 是 vjs 里的函数，但我感觉名字起的不好，我想用这个
 *
 * @todo 看可不可以直接把 insertContent 函数去掉（需考虑到后续对 vjs 插件的影响）;
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content
 *        参见 normalizeContent 中参数描述 {@link: dom:normalizeContent}
 * @return {Element} el 替换内容后的元素
 */
export function replaceContent(el, content) {
    return appendContent(emptyEl(el), content);
}

/**
 * 通过选择器和上下文（可选）找到一个指定元素
 *
 * @const
 *
 * @type {Function}
 * @param {string} selector css 选择器，反正最后都会被 querySelector 处理，你看着传吧
 * @param {Element|string=} 上下文环境。可选，默认为 document
 * @return {Element|null} 被选中的元素或 null
 */
export const $ = createQuerier('querySelector');


/**
 * 通过选择器和上下文（可选）找到所有符合的元素
 *
 * @const
 *
 * @type {Function}
 * @param {string} selector css 选择器，反正最后都会被 querySelectorAll 处理，你看着传吧
 * @param {Element|string=} 上下文环境。可选，默认为 document
 * @return {NodeList} 被选中的元素列表，如果没有符合条件的元素，空列表
 */
export const $$ = createQuerier('querySelectorAll');




























