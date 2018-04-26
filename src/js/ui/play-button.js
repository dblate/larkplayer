/**
 * @file playButton.js
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */


import classnames from 'classnames';

import Component from '../plugin/component';
import * as DOM from '../utils/dom';
import * as Events from '../events/events';
import featureDetector from '../utils/feature-detector';

export default class PlayButton extends Component {
    constructor(player, options) {
        super(player, options);

        this.togglePlay = this.togglePlay.bind(this);

        // 注意 这里需要将 context（第二个参数） 设置为 this.el，因为这时 DOM 元素还没有插入到 document 里，所以在 document 里是查不到这个元素的
        this.playBtn = DOM.$('.lark-play-button__play', this.el);
        this.pauseBtn = DOM.$('.lark-play-button__pause', this.el);
        this.eventName = featureDetector.touch ? 'touchend' : 'click';

        Events.on(this.playBtn, this.eventName, this.togglePlay);
        Events.on(this.pauseBtn, this.eventName, this.togglePlay);
    }

    togglePlay(event, isPlay) {
        if (this.player.paused()) {
            this.player.play();
        } else {
            this.player.pause();
        }
    }

    dispose() {
        Events.off(this.playBtn, this.eventName, this.togglePlay);
        Events.off(this.pauseBtn, this.eventName, this.togglePlay);
        this.playBtn = null;
        this.pauseBtn = null;

        super.dispose();
    }

    createEl() {
        return (
            <div className={classnames('lark-play-button', this.options.className, {
                'lark-play-button-mobile': !this.options.className
            })}>
                <div className="lark-play-button__play lark-icon-play" title="play"></div>
                <div className="lark-play-button__pause lark-icon-pause" title="pause"></div>
            </div>
        );
    }
}

if (featureDetector.touch) {
    Component.register(PlayButton, {name: 'playButton'});
}




