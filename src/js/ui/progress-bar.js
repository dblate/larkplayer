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
import featureDetector from '../utils/feature-detector';
import Slide from './slide';

import './progress-bar-except-fill';

const document = window.document;

class ProgressBar extends Slide {
    constructor(player, options) {
        super(player, options);

        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSlideStart = this.onSlideStart.bind(this);
        this.onSlideMove = this.onSlideMove.bind(this);
        this.onSlideEnd = this.onSlideEnd.bind(this);
        this.update = this.update.bind(this);
        this.reset = this.reset.bind(this);

        this.line = Dom.$('.lark-progress-bar__line', this.el);
        this.lineHandle = Dom.$('.lark-progress-bar__line__handle', this.el);

        player.on('timeupdate', this.handleTimeUpdate);
        this.on('click', this.handleClick);
        Events.on(this.lineHandle, 'touchstart', this.handleSlideStart);
        Events.on(this.lineHandle, 'mousedown', this.handleSlideStart);
    }

    handleTimeUpdate() {
        // 进度条
        let percent = 0;
        let duration = this.player.duration();
        let currentTime = this.player.currentTime();
        if (duration && currentTime) {
            percent = currentTime / duration * 100 + '%';
        }

        this.line.style.width = percent;
    }

    onClick(event) {
        this.update(event);
    }

    onSlideStart(event) {
        this.originalPaused = this.player.paused();
    }

    onSlideMove(event) {
        event.preventDefault();

        if (!this.player.paused()) {
            this.player.pause();
        }

        this.update(event);
    }

    onSlideEnd(event) {
        // 如果播放器在拖动进度条的时候不是处于暂停状态，那么拖动完了之后继续播放
        if (this.player.paused && !this.originalPaused && this.originalPaused !== undefined) {
            this.player.play();
        }
    }

    update(event) {
        const pos = Dom.getPointerPosition(this.el, event);
        const percent = pos.x * 100 + '%';
        const currentTime = this.player.duration() * pos.x;

        this.player.currentTime(currentTime);
        this.line.style.width = percent;
    }

    reset() {
        this.line.style.width = 0;
        this.children.forEach(child => {
            child && child.reset && child.reset();
        });
    }

    createEl() {
        let className = 'lark-progress-bar';
        if (this.options.className) {
            className = className + ' ' + this.options.className;
        }

        return this.createElement(
            'div',
            {className},
            this.createElement(
                'div',
                {className: 'lark-progress-bar-padding'}
            ),
            this.createElement('progressBarExceptFill')
        );
    }
}


Component.registerComponent('ProgressBar', ProgressBar);


export default ProgressBar;