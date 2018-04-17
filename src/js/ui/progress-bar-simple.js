/**
 * @file progress-bar-simple.js 简易版的进度条，当控制条消失时在视频底部显示
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/10
 */


import classnames from 'classnames';

import Component from '../plugin/component';
import * as DOM from '../utils/dom';
import BufferBar from './buffer-bar';
import featureDetector from '../utils/feature-detector';

export default class ProgressBarSimple extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.line = DOM.$('.lark-progress-bar__line', this.el);
        player.on('timeupdate', this.handleTimeUpdate);
    }

    handleTimeUpdate() {
        // 进度条
        let percent = 0;
        let duration = this.player.duration();
        let currentTime = this.player.currentTime();
        if (duration && currentTime) {
            // 保留两位小数四舍五入
            percent = Math.round(currentTime / duration * 100) / 100;
            // 转换为百分数
            percent = percent * 100 + '%';
        }

        this.line.style.width = percent;
    }

    reset() {
        this.line.style.width = 0;
        this.children.forEach(child => {
            child && child.reset && child.reset();
        });
    }

    dispose() {
        this.line = null;

        super.dispose();
    }

    createEl() {
        return (
            <div className={classnames('lark-progress-bar--simple', this.options.className)}>
                <div className="lark-progress-bar__background"></div>
                <div className="lark-progress-bar__line"></div>
                <BufferBar />
            </div>
        );
    }
}

if (featureDetector.touch) {
    Component.register(ProgressBarSimple, {name: 'progressBarSimple'});
}


