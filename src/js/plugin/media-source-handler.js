/**
 * @file MediaSourceHandler 插件基类，指基于 Media Source Extension 处理视频解码的一类插件
 * @author yuhui06
 * @date 2018/4/2
 * @desc
 *     1) MS 插件通过继承 MediaSourceHandler 实现
 *     2) MS 插件通过 MediaSourceHandler.register(handler, options) 绑定
 *     3) MS 插件需实现 canPlay 静态方法，用于判断插件是否支持特定类型
 */

// import Hls from 'hls.js';
import find from 'lodash.find';

import pluginStore from './plugin-store';
import {MS} from './plugin-types';


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
        return pluginStore.add(handler, options, MS);
    }

    static getAll() {
        return pluginStore.getAll(MS);
    }

    static getName(handler) {

    }

    static select(src, type) {
        const allMSHandlers = MediaSourceHandler.getAll();
        return find(allMSHandlers, value => value.canPlay(src, type));
    }
}


// @example
// class HlsMediaSourceHandler extends MediaSourceHandler {
//     constructor(player, options) {
//         super(player, options);

//         this.player.isReady = false;

//         this.hls = new Hls(options);

//         this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
//             this.player.triggerReady();
//         });

//         this.hls.on(Hls.Events.ERROR, (event, data) => {
//             if (data.fatal) {
//                 switch (data.type) {
//                     case Hls.ErrorTypes.MEDIA_ERROR:
//                         this.handleMediaError();
//                         break;
//                     case Hls.ErrorTypes.NETWORK_ERROR:
//                     default:
//                         this.hls.destroy();
//                         break;
//                 }
//             }
//         });
//     }

//     src(src) {
//         this.player.isReady = false;
//         this.hls.attachMedia(this.player.tech.el);
//         this.hls.loadSource(src);
//     }

//     internalPlay() {
//         const playReturn = this.player.techGet('play');
//         if (playReturn && playReturn.then) {
//             playReturn.then(null, err => {
//                 console.error(err);
//             });
//         }
//     }

//     play() {
//         if (this.player.isReady) {
//             this.internalPlay();
//         } else {
//             this.player.ready(() => {
//                 this.internalPlay();
//             });
//         }
//     }

//     handleMediaError() {
//         const now = Date.now();
//         const minRecoverInterval = 3000;

//         if (!this.recoverDecodingErrorDate || (now - this.recoverDecodingErrorDate) > minRecoverInterval) {
//             this.recoverDecodingErrorDate = now;
//             this.hls.recoverMediaError();
//         } else if (!this.recoverSwapAudioCodecDate || (now - this.recoverSwapAudioCodecDate) > minRecoverInterval) {
//             this.recoverSwapAudioCodecDate = now;
//             this.hls.swapAudioCodec();
//             this.hls.recoverMediaError();
//         } else {
//             this.hls.destroy();
//         }
//     }

//     dispose() {
//         if (this.hls instanceof Hls) {
//             this.hls.destroy();
//             if (this.hls.bufferTimer) {
//                 clearInterval(this.hls.bufferTimer);
//                 this.hls.bufferTimer = undefined;
//             }
//         }
//         this.hls = null;
//     }


//     static canPlay(src, type) {
//         const fileExtReg = /\.m3u8?/i;
//         const typeReg = /application\/((x-mpegURL)|(vnd\.apple\.mpegurl))/i;

//         return Hls.isSupported() && (typeReg.test(type) || fileExtReg.test(src));
//     }
// }

// MediaSourceHandler.register(HlsMediaSourceHandler, {name: 'hls'});

