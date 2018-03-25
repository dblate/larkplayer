/**
 * @file 检测浏览器是否支持某些特性
 * @author yuhui06
 * @date 2018/3/8
 */

const document = window.document;

export default {
    touch: 'ontouchend' in document
};