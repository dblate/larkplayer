/**
 * @file guid 唯一标识
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

// guid 从 1 开始
let guid = 1;

/**
 * 获取一个自增且唯一的 ID
 *
 * @return {number} 新的 ID
 */
export function newGUID() {
    return guid++;
}