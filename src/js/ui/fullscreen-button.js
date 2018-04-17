/**
 * @file fullscreen-button.js
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/5
 */


import classnames from 'classnames';

import Component from '../plugin/component';
import * as DOM from '../utils/dom';
import * as Events from '../events/events';
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
            this.fullscreenButton = DOM.$('.lark-request-fullscreen', this.el);
            this.exitFullscreenButton = DOM.$('.lark-exit-fullscreen', this.el);

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

    dispose() {
        if (!featureDetector.touch) {
            Events.off(this.fullscreenButton);
            Events.off(this.exitFullscreenButton);
            this.fullscreenButton = null;
            this.exitFullscreenButton = null;
        }

        super.dispose();
    }

    createEl() {
        // @todo 将两个 icon 分别放到两个类中，这样可以确定他们每个的 click 的事件一定跟自己的名称是相符的
        // @todo 需要一个非全屏的按钮 sueb
        return (
            <div className={classnames('lark-fullscreen-button', this.options.className)}>
                <div className="lark-request-fullscreen lark-icon-request-fullscreen"></div>
                <div className="lark-exit-fullscreen"></div>
            </div>
        );
    }
}



