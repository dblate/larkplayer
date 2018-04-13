/**
 * @file 普通插件基类
 * @author yuhui06
 * @date 2018/4/8
 * @desc
 *    1) 插件需继承此类实现
 *    2) 插件通过 Plugin.register(class, options) 绑定
 */


import pluginStore from './plugin-store';
import {OTHERS} from './plugin-types';

export default class Plugin {
    constructor(player, options = {}) {
        this.player = player;
        this.options = options;
    }

    dispose() {
        this.player = null;
        this.options = null;
    }

    static register(plugin, options) {
        pluginStore.add(plugin, options, OTHERS);
    }

    static get(name) {
        pluginStore.get(name, OTHERS);
    }

    static getAll() {
        return pluginStore.getAll(OTHERS);
    }
}


// @example
// class PlayContinue extends Plugin {
//     constructor(player, options) {
//         super(player, options);

//         this.handleFirstPlay = this.handleFirstPlay.bind(this);

//         this.player.on('firstplay', this.handleFirstPlay);
//     }

//     handleFirstPlay() {
//         console.log('firstplay in PlayContinue');
//     }

//     dispose() {
//         this.player.off(this.handleFirstPlay);
//         super.dispose();
//     }
// }


// Plugin.register(PlayContinue, {name: 'playContinue'});





