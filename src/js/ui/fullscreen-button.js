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

            Events.on(this.fullscreenButton, 'mouseover', this.handleMouseOver);
            Events.on(this.exitFullscreenButton, 'mouseover', this.handleMouseOver);

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

    handleMouseOver(event) {
        tooltip.show({
            hostEl: event.target,
            placement: 'top',
            margin: 16,
            content: event.target.title
        });
    }

    handleMouseOut(event) {
        tooltip.hide();
    }

    dispose() {
        this.off('click', this.handleClick);

        if (!featureDetector.touch) {
            Events.off(this.fullscreenButton, 'mouseover', this.handleMouseOver);
            Events.off(this.exitFullscreenButton, 'mouseover', this.handleMouseOver);
            this.fullscreenButton = null;
            this.exitFullscreenButton = null;

            this.off('mouseout', this.handleMouseOut);
        }

        super.dispose();
    }

    createEl() {
        return (
            <div className={classnames('lark-fullscreen-button', this.options.className)}>
                <div className="lark-request-fullscreen lark-icon-request-fullscreen" title="全屏"></div>
                <div className="lark-exit-fullscreen" title="退出全屏"></div>
            </div>
        );
    }
}



