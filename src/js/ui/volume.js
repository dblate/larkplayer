/**
 * @file 音量 UI 组件
 * @author yuhui06
 * @date 2018/3/9
 */

import Component from '../component';
import * as Dom from '../utils/dom';
import * as Events from '../utils/events';
import Slider from './slider';
import tooltip from './tooltip';


export default class Volume extends Slider {
    constructor(player, options) {
        super(player, options);

        this.onSlideStart = this.onSlideStart.bind(this);
        this.onSlideMove = this.onSlideMove.bind(this);
        this.onSlideEnd = this.onSlideEnd.bind(this);
        this.onClick = this.onClick.bind(this);
        this.update = this.update.bind(this);
        this.iconClick = this.iconClick.bind(this);
        this.handleIconMouseOver = this.handleIconMouseOver.bind(this);
        this.handleIconMouseOut = this.handleIconMouseOut.bind(this);
        this.switchStatus = this.switchStatus.bind(this);
        this.clearStatus = this.clearStatus.bind(this);

        this.line = Dom.$('.lark-volume-line__line', this.el);
        this.ball = Dom.$('.lark-volume-line__ball', this.el);
        this.icon = Dom.$('.lark-volume-icon', this.el);

        Events.on(this.icon, 'click', this.iconClick);
        Events.on(this.icon, 'mouseover', this.handleIconMouseOver);
        Events.on(this.icon, 'mouseout', this.handleIconMouseOut);
        Events.on(this.line, 'click', this.handleClick);
        Events.on(this.ball, 'mousedown', this.handleSlideStart);
        Events.on(this.ball, 'touchstart', this.handleSlideStart);
    }

    onSlideStart(event) {
        this.lastVolume = this.player.volume();
    }

    onSlideMove(event) {
        event.preventDefault();
        const pos = Dom.getPointerPosition(this.line, event);
        this.update(pos.x);
    }

    onSlideEnd(event) {
        if (this.player.volume() !== 0) {
            this.lastVolume = null;
        }
    }

    onClick(event) {
        this.lastVolume = this.player.volume();

        const pos = Dom.getPointerPosition(this.line, event);
        this.update(pos.x);

        if (this.player.volume() !== 0) {
            this.lastVolume = null;
        }
    }

    update(percent) {
        const lineWidth = this.line.offsetWidth;

        this.ball.style.left = percent * lineWidth + 'px';
        this.player.volume(percent);
        this.switchStatus(percent);
    }

    iconClick(event) {
        // 点击静音
        if (this.lastVolume == null) {
            this.lastVolume = this.player.volume();
            this.update(0);
        } else {
            // 再次点击时恢复上次的声音
            this.update(this.lastVolume);
            this.lastVolume = null;
        }

        this.handleIconMouseOver();
    }

    handleIconMouseOver() {
        tooltip.show({
            hostEl: this.icon,
            margin: 16,
            content: this.lastVolume == null ? '静音' : '取消静音'
        });
    }

    handleIconMouseOut(event) {
        tooltip.hide();
    }

    switchStatus(volume) {
        this.clearStatus();

        let status;
        if (volume === 0) {
            status = 'small';
        } else if (volume <= 0.6 && volume > 0) {
            status = 'middle';
        } else if (volume > 0.6) {
            status = 'large';
        }

        Dom.addClass(this.icon, `lark-icon-sound-${status}`);
    }

    clearStatus() {
        const statusClass = ['lark-icon-sound-small', 'lark-icon-sound-middle', 'lark-icon-sound-large'];
        statusClass.forEach(className => {
            Dom.removeClass(this.icon, className);
        });
    }

    createEl() {
        const volumeIcon = this.createElement(
            'div',
            {className: 'lark-volume-icon lark-icon-sound-large'},
        );

        const volumeLine = this.createElement(
            'div',
            {className: 'lark-volume-line'},
            this.createElement(
                'div',
                {className: 'lark-volume-line__line'},
                this.createElement(
                    'div',
                    {className: 'lark-volume-line__line-padding'}
                )
            ),
            this.createElement(
                'div',
                {className: 'lark-volume-line__ball'}
            )
        );

        return this.createElement(
            'div',
            {className: 'lark-volume'},
            volumeIcon,
            volumeLine
        );
    }
}

Component.registerComponent('Volume', Volume);