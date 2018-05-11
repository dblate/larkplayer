/**
 * @file to-title-case.js
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

/**
 * 将字符串的首字母大写
 *
 * @param {string} str 要将首字母大写的字符串
 * @return {string} 首字母大写的字符串
 */
export default function toTitleCase(str) {
    if (typeof str !== 'string') {
        return str;
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
}