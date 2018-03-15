/**
 * @file 音量 UI 组件
 * @author yuhui06
 * @date 2018/3/9
 */

import Component from '../component';
import * as Dom from '../utils/dom';
import * as Events from '../utils/events';
import featureDetector from '../utils/feature-detector';
import Slide from './slide';

const document = window.document;

export default class Volume extends Slide {
    constructor(player, options) {
        super(player, options);

        this.iconClick = this.iconClick.bind(this);
        this.onSlideMove = this.onSlideMove.bind(this);
        this.onClick = this.onClick.bind(this);
        this.update = this.update.bind(this);

        this.line = Dom.$('.lark-volume-line__line', this.el);
        this.ball = Dom.$('.lark-volume-line__ball', this.el);
        this.icon = Dom.$('.lark-volume-icon', this.el);

        this.lineWidth = this.line.offsetWidth;

        Events.on(this.icon, 'click', this.iconClick);
        Events.on(this.line, 'click', this.handleClick);
        Events.on(this.ball, 'mousedown', this.handleSlideStart);
        Events.on(this.ball, 'touchstart', this.handleSlideStart);
    }

    onSlideMove(event) {
        event.preventDefault();
        this.update(event);
    }

    onClick(event) {
        this.update(event);
    }

    update(event) {
        const pos = Dom.getPointerPosition(this.line, event);
        const percent = pos.x;
        const lineWidth = this.line.offsetWidth;

        this.ball.style.left = percent * lineWidth + 'px';
        this.player.volume(percent);
        this.switchStatus(percent);

        console.log(percent);
    }

    iconClick() {
        this.ball.style.left = 0;
        this.player.volume(0);
        this.switchStatus(0)
    }

    switchStatus(volume) {
        this.removeStatusClass();
        if (volume === 0) {
            Dom.addClass(this.icon, 'lark-icon-sound-small')
        } else if (volume <= 0.6 && volume > 0) {
            Dom.addClass(this.icon, 'lark-icon-sound-middle');
        } else if (volume > 0.6) {
            Dom.addClass(this.icon, 'lark-icon-sound-large')
        }
    }

    removeStatusClass() {
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