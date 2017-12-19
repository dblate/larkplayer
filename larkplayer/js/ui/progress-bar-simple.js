/**
 * @file progress-bar-simple.js 简易版的进度条，当控制条消失时在视频底部显示
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/10
 */

import Component from '../component';
import * as Dom from '../utils/dom';

import './buffer-bar';

class ProgressBarSimple extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.line = Dom.$('.lark-progress-bar__line', this.el);
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

    createEl() {
        const line = Dom.createElement('div', {
            className: 'lark-progress-bar__line'
        });

        const background = Dom.createElement('div', {
            className: 'lark-progress-bar__background'
        });

        return Dom.createElement('div', {
            className: 'lark-progress-bar--simple'
        }, background, line);
    }
}

Component.registerComponent('ProgressBarSimple', ProgressBarSimple);

ProgressBarSimple.prototype.options = {
    children: ['bufferBar']
};

export default ProgressBarSimple;