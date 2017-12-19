/**
 * @file ControlsBar 播放器控制条
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/9
 */

import Component from '../component';
import * as Dom from '../utils/dom';

import './current-time';
import './duration';
import './fullscreen-button';
import './progress-bar';

class ControlBar extends Component {
    constructor(player, options) {
        super(player, options);
    }

    reset() {
        this.children.forEach(child => {
            child && child.reset && child.reset();
        });
    }

    createEl() {
        return Dom.createElement('div', {
            className: 'lark-control-bar'
        });
    }
}

ControlBar.prototype.options = {
    children: [
        'currentTime',
        'progressBar',
        'duration',
        'fullscreenButton'
    ]
};

Component.registerComponent('ControlBar', ControlBar);

export default ControlBar;