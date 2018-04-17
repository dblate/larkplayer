/**
 * @file 将命名风格改为驼峰式
 * @author yuhui06
 * @date 2018/4/16
 */

// @notice 由于目前不存在下划线等连接的单词，所以单纯将首字母改成小写即可
export default function toCamelCase(str) {
    if (typeof str !== 'string') {
        return str;
    }

    return str.charAt(0).toLowerCase() + str.slice(1);
}