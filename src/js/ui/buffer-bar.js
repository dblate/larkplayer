/**
 * @file 显示视频已加载的量
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/13
 * @see https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/buffering_seeking_time_ranges
 * @desc
 *    1) 在视频没开始播放之前，提前下载的视频资源由 preload 属性的值决定
 *           - none 什么都没有，所以我们连视频总时长都没法获取到
 *           - metadata 可以获取到视频时长、高宽等信息
 *           - auto 视浏览器而定，一般 >= metadata
 */

import classnames from 'classnames';

import Component from '../plugin/component';
import * as DOM from '../utils/dom';

export default class BufferBar extends Component {
    constructor(player, options) {
        super(player, options);

        this.line = DOM.$('.lark-buffer-bar__line', this.el);
        this.handleProgress = this.handleProgress.bind(this);

        this.player.on('progress', this.handleProgress);
        // 对于已经 video 已经初始化完成后才调用 larkplayer 的情况，此时可能已经没有 progress 事件
        // 不过我们会在 player.handleLateInit 中重新触发 canplay 等事件（canplay 时，播放器应该已经有一定的 buffer）
        this.player.on('canplay', this.handleProgress);
        this.handleProgress();
    }

    handleProgress() {
        // TimeRanges 对象
        const buffered = this.player.buffered();
        const duration = this.player.duration();
        const currentTime = this.player.currentTime();

        if (duration > 0) {
            for (let i = 0; i < buffered.length; i++) {
                if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
                    const width = (buffered.end(i) / duration) * 100 + '%';
                    this.render(width);
                    break;
                }
            }
        }
    }

    render(width) {
        this.line.style.width = width;
    }

    reset() {
        this.render(0);
    }

    dispose() {
        this.player.off('progress', this.handleProgress);
        this.player.off('canplay', this.handleProgress);

        this.line = null;

        super.dispose();
    }

    createEl() {
        return (
            <div className={classnames('lark-buffer-bar', this.options.className)}>
                <div className="lark-buffer-bar__line"></div>
            </div>
        );
    }
}


