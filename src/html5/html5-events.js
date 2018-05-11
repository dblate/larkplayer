/**
 * @file html5 video events
 * @author yuhui06
 * @date 2018/5/10
 * @see https://www.w3.org/TR/html5/semantics-embedded-content.html#media-elements-event-summary
 * @todo 移到这里后，player event 的文档怎么办？
 */

export default [
    'loadstart',

    /**
     * 浏览器停止获取数据时触发
     *
     * @event Player#suspend
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'suspend',

    /**
     * 浏览器在视频下载完成前停止下载时触发。但并不是因为出错，出错时触发 error 事件而不是 abort。
     * 往往是人为的停止下载，比如删除 src
     *
     * @event Player#abort
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'abort',
    'error',

    /**
     * 视频被清空时触发
     *
     * @event Player#emptied
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'emptied',

    /**
     * 浏览器获取数据时，数据并没有正常返回时触发
     *
     * @event Player#stalled
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'stalled',

    /**
     * 播放器成功获取到视频总时长、高宽、字幕等信息时触发
     *
     * @event Player#loadedmetadata
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'loadedmetadata',

    /**
     * 播放器第一次能够渲染当前帧时触发
     *
     * @event Player#loadeddata
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'loadeddata',
    'canplay',
    'canplaythrough',
    'playing',
    'waiting',
    'seeking',
    'seeked',
    'ended',
    'durationchange',
    'timeupdate',

    /**
     * 浏览器获取数据的过程中触发
     *
     * @event Player#progress
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'progress',
    'play',
    'pause',

    /**
     * 视频播放速率改变时触发
     *
     * @event Player#ratechange
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'ratechange',

    /**
     * 视频本身的高宽发生改变时触发，注意不是播放器的高度（比如调整播放器的高宽和全屏不会触发 resize 事件）
     *
     * 这里还不是太清楚，有需要的话看看 w3c 文档吧
     *
     * @see https://html.spec.whatwg.org/#dom-video-videowidth
     * @event Player#resize
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'resize',

    /**
     * 视频声音大小改变时触发
     *
     * @event Player#volumechange
     * @param {Object} event 事件触发时浏览器自带的 event 对象
     */
    'volumechange'
];