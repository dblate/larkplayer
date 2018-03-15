
import Component from '../component';
import * as Dom from '../utils/dom';

const tooltip = {
    id: 'lark-tooltip',
    el: null,
    timeoutHandler: null,
    initial: function () {
        if (this.el) {
            return;
        }

        const body = Dom.$('body');
        const el = Dom.createElement('div', {
            className: this.id,
            id: this.id
        });
        Dom.appendContent(body, el);

        this.el = el;
    },
    normalize(options) {
        return Object.assign({
            timeout: 0,
            content: '',
            top: 0,
            left: 0
        }, options);
    },
    show(options) {
        clearTimeout(this.timeoutHandler);

        options = this.normalize(options);

        if (!this.el) {
            this.initial();
        }

        Dom.replaceContent(this.el, options.content);
        setTimeout(() => {
            this.el.style.top = options.top - this.el.offsetHeight + 'px';
            this.el.style.left = options.left + 'px';
            this.el.style.display = 'block';
        }, 0);
    },
    hide() {
        this.timeoutHandler = setTimeout(() => {
            this.el.style.display = 'none';
        });
    }
};

export default tooltip;