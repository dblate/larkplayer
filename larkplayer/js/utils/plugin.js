/**
 * @file plugin.js 一些不想直接写在播放器中的代码，但又可能用到的功能，我们称之为 plugin
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/20
 */

/**
 * @const
 * @inner
 *
 * 以 name => plugin 的形式存储 plugin 的对象
 */
const pluginStore = {};

/**
 * 判断 plugin 的名称是否已存在
 *
 * @param {string} name plugin 名称
 * @return {boolean} 指定名称是否已存在
 */
export function isPluginExist(name) {
    return pluginStore.hasOwnProperty(name);
}

/**
 * 通过名称获取对应过的 plugin
 *
 * @param {string} name 要获取的 plugin 的名称
 * @return {Function} 要获取的 plugin
 */
export function getPlugin(name) {
    return pluginStore[name];
}

/**
 * 注册 plugin
 * 此方法会被赋值到 larkplayer 上（larkplayer.registerPlugin = registerPlugin）
 * 后续调用时，我们一般从 larkplayer 上调用
 *
 * @param {string} name 要注册的 plugin 的名称
 * @param {Function} plugin 要注册的 plugin 函数。
 *                   plugin 的 this 在运行时会被指定为 player
 */
export function registerPlugin(name, plugin) {
    if (typeof plugin !== 'function') {
        throw new TypeError('Plugin should be a function');
    }

    if (isPluginExist(name)) {
        throw new Error('Plugin has existed, register fail');
    }

    pluginStore[name] = plugin;
}

/**
 * 注销 plugin
 *
 * @param {name} name 要注销的 plugin 名称
 */
export function deregisterPlugin(name) {
    delete pluginStore[name];
}