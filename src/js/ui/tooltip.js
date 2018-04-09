/**
 * @file tooltip.js 用于展示提示性文字
 * @author yuhui06
 * @date 2018/3/22
 * @todo 多个播放器实例并存时有点鸡肋
 */

import * as Dom from '../utils/dom';
import assign from 'lodash.assign';

export default {
    id: 'lark-tooltip',
    el: null,
    timeoutHandler: null,
    initial(container) {
        // if (this.el) {
        //     return;
        // }

        if (!Dom.isEl(container)) {
            return;
        }

        const el = Dom.createElement('div', {
            className: this.id
        });
        Dom.appendContent(container, el);

        this.el = el;
        this.container = container;
    },
    normalize(options) {
        return assign({
            timeout: 0,
            content: '',
            top: 0,
            left: 0,
            margin: 0,
            hostEl: null,
            placement: 'top',
            isFollowMouse: false,
            // 这个 event 有点鸡肋，但要获取鼠标位置的时候（即 isFollowMouse: true），必须得从 event 参数里获取
            event: null
        }, options);
    },
    getCoordinate(options) {
        let coordinate;

        switch (options.placement) {
            case 'top':
                // @todo 可以 cache
                const hostElRect = Dom.getBoundingClientRect(options.hostEl);
                const containerRect = Dom.getBoundingClientRect(this.container);

                let left;
                if (options.isFollowMouse) {
                    const pointerPos = Dom.getPointerPosition(options.hostEl, options.event);
                    left = hostElRect.left
                        - containerRect.left
                        + hostElRect.width * pointerPos.x
                        - this.el.offsetWidth / 2;
                } else {
                    left = hostElRect.left - containerRect.left + (hostElRect.width - this.el.offsetWidth) / 2;
                }

                const outOfBounds = left + this.el.offsetWidth - this.container.offsetWidth;
                if (outOfBounds > 0) {
                    left = left - outOfBounds;
                }

                const top = hostElRect.top - containerRect.top - this.el.offsetHeight - options.margin;
                coordinate = {left, top};
                break;
        }

        return coordinate;
    },
    show(options) {
        clearTimeout(this.timeoutHandler);

        options = this.normalize(options);

        if (!Dom.isEl(options.hostEl)) {
            return;
        }

        const container = Dom.parent(options.hostEl, 'larkplayer');
        const el = Dom.$('.lark-tooltip', container);

        // 多个播放器实例并存时需要不断切换 this.el 和 this.container
        if (el) {
            this.el = el;
            this.container = container;
        } else {
            this.initial(container);
        }

        // if (!this.el) {
        //     const container = Dom.parent(options.hostEl, 'larkplayer');
        //     this.initial(container);
        // }

        Dom.replaceContent(this.el, options.content);

        setTimeout(() => {
            // 元素 display none 时获取到的 offsetHeight 和 offsetWidth 是 0
            // 所以先以 visibility: hidden 的方式“显示”元素，以获取正确的高宽
            this.el.style.visibility = 'hidden';
            this.el.style.display = 'block';
            const coordinate = this.getCoordinate(options);
            this.el.style.top = coordinate.top + 'px';
            this.el.style.left = coordinate.left + 'px';
            this.el.style.visibility = 'visible';
        }, 0);
    },
    hide() {
        if (!this.el) {
            return;
        }

        this.timeoutHandler = setTimeout(() => {
            this.el.style.display = 'none';
        });
    }
};