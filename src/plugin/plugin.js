/**
 * @file 普通插件基类
 * @author yuhui06
 * @date 2018/4/8
 * @desc
 *    1) 插件需继承此类实现
 *    2) 插件通过 Plugin.register(class, options) 绑定
 */


import pluginStore from './plugin-store';
import PluginTypes from './plugin-types';

export default class Plugin {
    constructor(player, options = {}) {
        this.player = player;
        this.options = options;

        this.dispose = this.dispose.bind(this);
        this.player.on('dispose', this.dispose);
    }

    dispose() {
        this.player = null;
        this.options = null;
    }

    static register(plugin, options) {
        pluginStore.add(plugin, options, PluginTypes.OTHERS);
    }

    static unregister(name) {
        pluginStore.delete(name, PluginTypes.OTHERS);
    }

    static get(name) {
        pluginStore.get(name, PluginTypes.OTHERS);
    }

    static getAll() {
        return pluginStore.getAll(PluginTypes.OTHERS);
    }
}





