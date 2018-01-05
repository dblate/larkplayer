/**
 * @file progress-bar.js 视频进度条
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/6
 * @desc
 *    1) 目前用的 click 事件，不支持 tap 事件
 *    2) 只支持移动端拖拽，不支持 pc 端鼠标拖拽
 */

import Component from '../component';
import * as Dom from '../utils/dom';
import * as Events from '../utils/events';
import computedStyle from '../utils/computed-style';

import './progress-bar-except-fill';

const document = window.document;

class ProgressBar extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.line = Dom.$('.lark-progress-bar__line', this.el);
        this.lineHandle = Dom.$('.lark-progress-bar__line__handle', this.el);
        player.on('timeupdate', this.handleTimeUpdate);
        this.on('click', this.handleClick);

        // 拖拽
        Events.on(this.lineHandle, 'touchstart', this.handleTouchStart);
        Events.on(document, 'touchend', this.handleTouchEnd);
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

    handleClick(event) {
        const pos = Dom.getPointerPosition(this.el, event);
        const xPos = Math.round(pos.x * 10000) / 10000;
        const xPercent = xPos * 100 + '%';
        const currentTime = this.player.duration() * xPos;

        // 跳到指定位置播放
        // @todo 这里好像就直接开始播了，如果一开始视频不是播放状态，那这里是不是也不播好点
        this.player.currentTime(currentTime);
        // 更新 ui
        this.line.style.width = xPercent;
        // console.log('ProgressBar click', pos, xPos);
    }

    handleTouchStart(event) {
        const pos = Dom.getPointerPosition(this.el, event);
        const xPos = Math.round(pos.x * 10000) / 10000;
        const xPercent = xPos * 100 + '%';


        console.log('touchstart', xPercent, event);
        const touches = event.changedTouches || event.touches;
        // this.isHandleTouched = true;
        this.startX = touches[0]['pageX'];
        this.originalLineWidth = parseInt(computedStyle(this.line, 'width'), 10);
        this.originalBarWidth = parseInt(computedStyle(this.el, 'width'), 10);

        Events.on(document, 'touchmove', this.handleTouchMove);
        Events.on(document, 'touchend', this.handleTouchEnd);

        this.originalPaused = this.player.paused();
    }

    // @todo 跟 pm 确认是滑动时不断设置 currentTime 还是松手后才设置
    handleTouchMove(event) {
        const touches = event.changedTouches || event.touches;
        this.curX = touches[0]['pageX'];
        this.diffX = this.curX - this.startX;
        const xPos = Math.round((this.originalLineWidth + this.diffX) / this.originalBarWidth * 10000) / 10000;
        const xPercent = Math.min(xPos, 1) * 100 + '%';
        this.line.style.width = xPercent;

        // 拖动进度条的时候暂停视频，避免杂音
        if (!this.player.paused()) {
            this.player.pause();
        }
        const duration = this.player.duration();
        this.player.currentTime(xPos * duration);
    }

    handleTouchEnd(event) {
        // 如果播放器在拖动进度条的时候不是出于暂停状态，那么拖动完了之后继续播放
        if (this.player.paused && !this.originalPaused && this.originalPaused !== undefined) {
            this.player.play();
        }
        Events.off(document, 'touchmove', this.handleTouchMove);
        Events.off(document, 'touchend', this.handleTouchEnd);
    }

    reset() {
        this.line.style.width = 0;
        this.children.forEach(child => {
            child && child.reset && child.reset();
        });
    }

    createEl() {
        return Dom.createElement('div', {
            className: 'lark-progress-bar'
        });
    }
}

ProgressBar.prototype.options = {
    children: ['progressBarExceptFill']
};

Component.registerComponent('ProgressBar', ProgressBar);

export default ProgressBar;