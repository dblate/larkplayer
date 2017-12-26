"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;
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
// const log = console.log;
function log() {
  var _console;

  (_console = console).log.apply(_console, arguments);
}

log.info = console.info;

log.warn = console.warn;

log.error = console.error;

log.clear = console.clear;
//# sourceMappingURL=log.js.map
