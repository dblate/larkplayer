/**
 * @file fullscreen-button.js
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/5
 */

import Component from '../component';
import * as Dom from '../utils/dom';

export default class FullscreenButton extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleClick = this.handleClick.bind(this);

        this.on('click', this.handleClick);
    }

    handleClick() {
        if (!this.player.isFullscreen()) {
            this.player.requestFullscreen();
        } else {
            this.player.exitFullscreen();
        }
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