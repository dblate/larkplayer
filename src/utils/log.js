/**
 * @file log.js log...log....loggggg
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/16
 */

/**
 * 在控制台输出日志信息
 *
 * @param {...string|object} 参数个人任意，类型不限
 * @example
 *    1) log('style: %c,'
 *           + 'just like print in c.'
 *           + 'string: %s,'
 *           + 'int: %i,'
 *           + 'float: %f,'
 *           + 'object: %o',
 *           'color:red;font-style: italic;',
 *           'string',
 *           333,
 *           1.2334,
 *           {});
 */

/* eslint-disable no-console */

export default function log(...args) {
    console.log(...args);
}

log.info = console.info;

log.warn = console.warn;

log.error = console.error;

log.clear = console.clear;