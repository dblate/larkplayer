'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.isPlain = isPlain;
exports.each = each;
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
function isObject(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * 判断一个变量是否是“纯粹”的对象
 *
 * @param {Mixed} value 任意 js 变量
 * @return {boolean} 该变量是否是纯粹的对象
 */
function isPlain(value) {
  return isObject(value) && toString.call(value) === '[object Object]' && value.constructor === Object;
}

/**
 * 迭代对象
 *
 * @param {Object} obj 要迭代的对象
 * @param {EachCallback} fn 每次迭代时调用的函数，具体参见 EachCallback 定义
 */
function each(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
}
