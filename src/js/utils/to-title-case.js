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

    // let [firstChar, ...otherChars] = [...str];
    // return firstChar.toUpperCase() + otherChars.join('');

    // return [...str].map((value, index) => (index === 0 ? value.toUpperCase() : value)).join('');
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 比较两个字符串在首字母大写的情况下是否相等
 *
 * @param {string} str1 待比较的字符串
 * @param {string} str2 待比较的字符串
 * @return {boolean} 两个字符串在首字母大写后是否相等
 */
export function titleCaseEquals(str1, str2) {
    return toTitleCase(str1) === toTitleCase(str2);
}