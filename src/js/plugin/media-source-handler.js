/**
 * @file MediaSourceHandler 插件基类，指基于 Media Source Extension 处理视频解码的一类插件
 * @author yuhui06
 * @date 2018/4/2
 * @desc
 *     1) MS 插件通过继承 MediaSourceHandler 实现
 *     2) MS 插件通过 MediaSourceHandler.register(handler, options) 绑定
 *     3) MS 插件需实现 canPlay 静态方法，用于判断插件是否支持特定类型
 */

import find from 'lodash.find';

import pluginStore from './plugin-store';
import PluginTypes from './plugin-types';


export default class MediaSourceHandler {
    constructor(player, options) {
        this.player = player;
        this.options = options;
    }

    src(src) {
        this.player.techCall('setSrc', src);
    }

    play() {
        this.player.techCall('play');
    }

    dispose() {
        this.player = null;
        this.options = null;
    }

    static canPlay(src, type) {
        return false;
    }

    static register(handler, options) {
        return pluginStore.add(handler, options, PluginTypes.MS);
    }

    static getAll() {
        return pluginStore.getAll(PluginTypes.MS);
    }

    static select(src, type) {
        const allMSHandlers = MediaSourceHandler.getAll();
        return find(allMSHandlers, value => value.canPlay(src, type));
    }
}

