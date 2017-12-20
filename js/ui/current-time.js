/**
 * @file current-time.js 当前时间 UI
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/4
 */

import Component from '../component';
import * as Dom from '../utils/dom';
import {timeFormat} from '../utils/time-format';

export default class CurrentTime extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleTimeupdate = this.handleTimeupdate.bind(this);

        player.on('timeupdate', this.handleTimeupdate);
    }

    handleTimeupdate(event, data) {
        this.render(data);
    }

    render(data) {
        Dom.textContent(this.el, timeFormat(Math.floor(data.currentTime)));
    }

    reset() {
        this.render({currentTime: 0});
    }

    createEl() {
        const currentTime = this.player.currentTime();

        return Dom.createElement('div', {
            className: 'lark-current-time'
        }, timeFormat(Math.floor(currentTime)));
    }
}

Component.registerComponent('CurrentTime', CurrentTime);