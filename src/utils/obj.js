/**
 * @file Object 相关方法
 * @module obj
 * @author yuhui06@baidu.com
 * @date 2017/11/2
 */

/**
 * @callback obj:EachCallback
 *
 * @param {Mixed} value 对象目前的 key 所对应的值
 * @param {string} key 对象目前的 key
 */


/**
 * 检查一个变量是否是对象（而不是 null）
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 该变量是否是对象
 * @desc
 *      1) typeof null 的值是 object
 */
export function isObject(value) {
    return !!value && typeof value === 'object';
}

/**
 * 判断一个变量是否是“纯粹”的对象
 *
 * @param {Mixed} value 任意 js 变量
 * @return {boolean} 该变量是否是纯粹的对象
 */
export function isPlain(value) {
    return isObject(value)
        && Object.prototype.toString.call(value) === '[object Object]'
        && value.constructor === Object;
}

/**
 * 迭代对象
 *
 * @param {Object} obj 要迭代的对象
 * @param {EachCallback} fn 每次迭代时调用的函数，具体参见 EachCallback 定义
 */
export function each(obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key));
}