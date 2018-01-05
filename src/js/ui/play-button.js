/**
 * @file playButton.js
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

import Component from '../component';
import * as Dom from '../utils/dom';
import * as Events from '../utils/events';

export default class PlayButton extends Component {
    constructor(player, options) {
        super(player, options);

        // this.handleClick = this.handleClick.bind(this);

        // 注意 这里需要将 context（第二个参数） 设置为 this.el，因为这时 DOM 元素还没有插入到 document 里，所以在 document 里是查不到这个元素的
        this.playBtn = Dom.$('.lark-play-button__play', this.el);
        this.pauseBtn = Dom.$('.lark-play-button__pause', this.el);

        // @todo 临时处理 ios11 click 事件问题
        Events.on(this.playBtn, 'touchend', event => this.togglePlay(event, true));
        Events.on(this.pauseBtn, 'touchend', event => this.togglePlay(event, false));

    }

    togglePlay(event, isPlay) {
        // 这里阻止事件冒泡，因为跟播放器顶部 暂停状态时点击播放器任意区域播放视频冲突了
        // 这里暂停视频后，事件传到顶部后又播放视频
        // @todo 看有没有更好的解决方法
        event.stopPropagation();
        if (isPlay) {
            if (this.player.paused()) {
                this.player.play();
            }
        } else {
            if (!this.player.paused()) {
                this.player.pause();
            }
        }
    }

    createEl() {
        const playIcon = Dom.createElement('div', {
            className: 'lark-play-button__play lark-icon-play',
            title: 'play'
        });

        const pauseIcon = Dom.createElement('div', {
            className: 'lark-play-button__pause lark-icon-pause',
            title: 'pause'
        });

        return Dom.createElement('div', {
            className: 'lark-play-button'
        }, playIcon, pauseIcon);
    }
}

Component.registerComponent('PlayButton', PlayButton);