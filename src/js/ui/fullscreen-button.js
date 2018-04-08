/**
 * @file fullscreen-button.js
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/5
 */

import Component from '../component';
import * as Dom from '../utils/dom';
import * as Events from '../utils/events';
import tooltip from './tooltip';
import featureDetector from '../utils/feature-detector';

export default class FullscreenButton extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);

        this.on('click', this.handleClick);

        if (!featureDetector.touch) {
            this.fullscreenButton = Dom.$('.lark-request-fullscreen', this.el);
            this.exitFullscreenButton = Dom.$('.lark-exit-fullscreen', this.el);

            Events.on(
                this.fullscreenButton,
                'mouseover',
                () => this.handleMouseOver(this.fullscreenButton, '全屏')
            );
            Events.on(
                this.exitFullscreenButton,
                'mouseover',
                () => this.handleMouseOver(this.exitFullscreenButton, '退出全屏')
            );

            this.on('mouseout', this.handleMouseOut);
        }
    }

    handleClick() {
        if (!this.player.isFullscreen()) {
            this.player.requestFullscreen();
        } else {
            this.player.exitFullscreen();
        }

        tooltip.hide();
    }

    handleMouseOver(el, content) {
        tooltip.show({
            hostEl: el,
            placement: 'top',
            margin: 16,
            content: content
        });
    }

    handleMouseOut(event) {
        tooltip.hide();
    }

    createEl() {
        // @todo 将两个 icon 分别放到两个类中，这样可以确定他们每个的 click 的事件一定跟自己的名称是相符的
        return Dom.createElement('div', {
            className: 'lark-fullscreen-button'
        }, Dom.createElement('div', {
            className: 'lark-request-fullscreen lark-icon-request-fullscreen'
        }), Dom.createElement('div', {
            // @todo 需要一个非全屏的按钮 sueb
            className: 'lark-exit-fullscreen'
        }));
    }
}

Component.registerComponent('FullscreenButton', FullscreenButton);