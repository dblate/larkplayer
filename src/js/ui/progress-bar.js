/**
 * @file progress-bar.js 视频进度条
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/6
 * @date 2018/3/15 支持 pc 端拖拽和 tooltip
 */

import Component from '../component';
import Slider from './slider';
import tooltip from './tooltip';
import * as Dom from '../utils/dom';
import * as Events from '../utils/events';
import computedStyle from '../utils/computed-style';
import featureDetector from '../utils/feature-detector';
import {timeFormat} from '../utils/time-format';

import './progress-bar-except-fill';

const document = window.document;

class ProgressBar extends Slider {
    constructor(player, options) {
        super(player, options);

        this.getTooltipTop = this.getTooltipTop.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSlideStart = this.onSlideStart.bind(this);
        this.onSlideMove = this.onSlideMove.bind(this);
        this.onSlideEnd = this.onSlideEnd.bind(this);
        this.update = this.update.bind(this);
        this.reset = this.reset.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);

        this.line = Dom.$('.lark-progress-bar__line', this.el);
        this.lineHandle = Dom.$('.lark-progress-bar__line__handle', this.el);
        this.hoverLight = Dom.$('.lark-progress-bar-hover-light', this.el);

        player.on('ready', () => {
            this.tooltipTop = this.getTooltipTop();
            this.elPos = Dom.findPosition(this.el);
        });

        player.on('timeupdate', this.handleTimeUpdate);
        this.on('click', this.handleClick);
        this.on('touchstart', this.handleSlideStart);

        if (!featureDetector.touch) {
            this.on('mousedown', this.handleSlideStart);
            this.on('mouseover', this.handleMouseOver);
            this.on('mousemove', this.handleMouseMove);
            this.on('mouseout', this.handleMouseOut);
        }
    }

    getTooltipTop() {
        const padding = Dom.$('.lark-progress-bar-padding', this.el);
        const line = Dom.$('.lark-progress-bar__line', this.el);
        const marginTop = padding.offsetHeight - line.offsetHeight;
        const elPos = Dom.findPosition(this.el);
        const top = elPos.top - marginTop;

        return top;
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
        // 如果播放器在拖动进度条前不是处于暂停状态，那么拖动完了之后继续播放
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

    showToolTip(event) {
        const pointerPos = Dom.getPointerPosition(this.el, event);
        const left = this.elPos.left + this.el.offsetWidth * pointerPos.x;
        const currentTime = this.player.duration() * pointerPos.x;

        tooltip.show({
            top: this.tooltipTop,
            left: left,
            content: timeFormat(Math.floor(currentTime))
        });
    }

    showHoverLine(event) {
        const pointerPos = Dom.getPointerPosition(this.el, event);
        const left = this.el.offsetWidth * pointerPos.x;

        this.hoverLight.style.width = left + 'px';
    }

    hideHoverLine(event) {
        this.hoverLight.style.width = 0;
    }

    handleMouseOver(event) {
        this.showToolTip(event);
        this.showHoverLine(event);
    }

    handleMouseMove(event) {
        this.showToolTip(event);
        this.showHoverLine(event);
    }

    handleMouseOut(event) {
        tooltip.hide();
        this.hideHoverLine(event);
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
            this.createElement(
                'div',
                {className: 'lark-progress-bar-hover-light'}
            ),
            this.createElement('progressBarExceptFill')
        );
    }
}


Component.registerComponent('ProgressBar', ProgressBar);


export default ProgressBar;