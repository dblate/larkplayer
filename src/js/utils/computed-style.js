/**
 * @file 获取元素指定样式的值
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

/**
 * 获取元素指定样式
 * 主要针对 window.getComputedStyle 做兼容处理
 *
 * @param {Element} el 从该元素的上获取指定样式值
 * @param {string} prop 要获取的样式
 * @return {string} 样式值
 *
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
export default function computedStyle(el, prop) {
    if (!el || !prop) {
        return '';
    }

    if (typeof window.getComputedStyle === 'function') {
        const styleCollection = window.getComputedStyle(el);
        return styleCollection ? styleCollection[prop] : '';
    }

    return (el.currentStyle && el.currentStyle[prop]) || '';
}