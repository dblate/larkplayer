/**
 * @file slide.js 所有需要拖动的元素的父类
 * @author yuhui06
 * @date 2018/3/15
 */

import Component from '../component';
import * as Events from '../utils/events';

export default class Slider extends Component {
    constructor(player, options) {
        super(player, options);

        this.handleClick = this.handleClick.bind(this);
        this.handleSlideStart = this.handleSlideStart.bind(this);
        this.handleSlideMove = this.handleSlideMove.bind(this);
        this.handleSlideEnd = this.handleSlideEnd.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSlideStart = this.onSlideStart.bind(this);
        this.onSlideMove = this.onSlideMove.bind(this);
        this.onSlideEnd = this.onSlideEnd.bind(this);
    }

    onClick(event) {

    }

    onSlideStart(event) {

    }

    onSlideMove(event) {

    }

    onSlideEnd(event) {

    }

    handleClick(event) {
        this.onClick(event);
    }

    handleSlideStart(event) {
        this.onSlideStart(event);

        this.addClass('lark-sliding');

        Events.on(document, 'touchmove', this.handleSlideMove);
        Events.on(document, 'touchend', this.handleSlideEnd);
        Events.on(document, 'mousemove', this.handleSlideMove);
        Events.on(document, 'mouseup', this.handleSlideEnd);
    }

    handleSlideMove(event) {
        this.onSlideMove(event);
    }

    handleSlideEnd(event) {
        this.onSlideEnd(event);

        this.removeClass('lark-sliding');

        Events.off(document, 'touchmove', this.handleSlideMove);
        Events.off(document, 'touchend', this.handleSlideEnd);
        Events.off(document, 'mousemove', this.handleSlideMove);
        Events.off(document, 'mouseup', this.handleSlideEnd);
    }
}
