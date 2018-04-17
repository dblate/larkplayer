/**
 * @file 音量 UI 组件
 * @author yuhui06
 * @date 2018/3/9
 */


import classnames from 'classnames';

/* eslint-disable no-unused-vars */
import Component from '../plugin/component';
/* eslint-enable no-unused-vars */
import * as DOM from '../utils/dom';
import * as Events from '../events/events';
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

        this.line = DOM.$('.lark-volume-line__line', this.el);
        this.ball = DOM.$('.lark-volume-line__ball', this.el);
        this.icon = DOM.$('.lark-volume-icon', this.el);

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
        const pos = DOM.getPointerPosition(this.line, event);
        this.update(pos.x);
    }

    onSlideEnd(event) {
        if (this.player.volume() !== 0) {
            this.lastVolume = null;
        }
    }

    onClick(event) {
        this.lastVolume = this.player.volume();

        const pos = DOM.getPointerPosition(this.line, event);
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

        DOM.addClass(this.icon, `lark-icon-sound-${status}`);
    }

    clearStatus() {
        const statusClass = ['lark-icon-sound-small', 'lark-icon-sound-middle', 'lark-icon-sound-large'];
        statusClass.forEach(className => {
            DOM.removeClass(this.icon, className);
        });
    }

    dispose() {
        Events.off(this.icon, 'click', this.iconClick);
        Events.off(this.line, 'click', this.handleClick);
        Events.off(this.ball, 'mousedown', this.handleSlideStart);

        this.icon = null;
        this.line = null;
        this.ball = null;

        super.dispose();
    }

    createEl() {
        return (
            <div className={classnames('lark-volume', this.options.className)}>
                <div className="lark-volume-icon lark-icon-sound-large"></div>
                <div className="lark-volume-line">
                    <div className="lark-volume-line__line">
                        <div className="lark-volume-line__line-padding"></div>
                    </div>
                    <div className="lark-volume-line__ball"></div>
                </div>
            </div>
        );
    }
}



