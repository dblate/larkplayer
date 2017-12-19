/**
 * @file duration.js
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/10
 */
import Component from '../component';
import * as Dom from '../utils/dom';
import {timeFormat} from '../utils/time-format';

export default class Duration extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleLoadedMetaData = this.handleLoadedMetaData.bind(this);

        player.on('durationchange', this.handleLoadedMetaData);
        player.on('loadedmetadata', this.handleLoadedMetaData);
    }

    handleLoadedMetaData(event) {
        Dom.textContent(this.el, timeFormat(Math.floor(this.player.duration())));
    }

    reset() {
        Dom.textContent(this.el, '');
    }

    createEl() {
        // @todo 暂时将 duration 的值写在这，后面需要处理下对于已经发生的事件怎么办
        let durationContent = timeFormat(Math.floor(this.player.duration()));
        return Dom.createEl('div', {
            className: 'lark-duration'
        }, null, durationContent);
    }
}

Component.registerComponent('Duration', Duration);