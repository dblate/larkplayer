/**
 * @file component.js UI 插件基类
 * @author yuhui06
 * @date 2018/4/8
 * @desc
 *    1) UI 插件需继承此类实现
 *    2) UI 插件通过 Component.register(class, options) 绑定
 *    3) 编写插件时建议引入 DOM 和 Events 模块，食用效果更佳
 */

import pluginStore from './plugin-store';
import {UI} from './plugin-types';
import * as DOM from '../utils/dom';
import * as Events from '../utils/events';
import evented from '../mixins/evented';


export default class Component {
    constructor(player, options = {}) {
        this.player = player;
        this.options = options;
        this.el = this.createEl(this.options);

        evented(this, {eventBusKey: this.el});
    }

    createEl() {
        return DOM.createElement('div', this.options);
    }

    // 1. remove Elements for memory
    // 2. remove Events for memory
    // 3. remove reference for GC
    dispose() {
        if (DOM.isEl(this.el) && this.el.parentNode) {
            Events.off(this.el);
            this.el.parentNode.removeChild(this.el);
        }
        this.player = null;
        this.options = null;
        this.el = null;
    }

    static createElement(name, options = {}, ...child) {
        // babel 编译后的默认值遇到 null 时会取 null，因为判断的是 !== undefined
        options = options || {};

        let component;
        if (typeof name === 'string') {
            component = Component.get(name.toLowerCase());
        } else if (Component.isPrototypeOf(name)) {
            component = name;
        }

        if (component) {
            // 这里的 this.player 不是什么黑魔法，它确实无法取到实例中的 this.player
            // 只不过是在调用 Component.createElement 之前，先给 Component.player 赋了值而已
            // 如果你看不懂我在说什么，当我没说
            const instance = new component(this.player, options);
            const el = instance.el;

            if (child) {
                DOM.appendContent(el, child);
            }

            return el;
        } else {
            return DOM.createElement(name, options, ...child);
        }
    }

    static register(component, options) {
        return pluginStore.add(component, options, UI);
    }

    static get(name) {
        return pluginStore.get(name, UI);
    }

    static getAll() {
        return pluginStore.getAll(UI);
    }
}


// @example
// class Dialog extends Component {
//     constructor(player, options) {
//         super(player, options);

//         this.handleClose = this.handleClose.bind(this);

//         this.closeEl = DOM.$('.dialog__close', this.el);
//         Events.on(this.closeEl, 'click', this.handleClose);
//     }

//     handleClose() {
//         this.el.style.display = 'none';
//     }

//     createEl() {
//         this.options = Object.assign({
//             className: '',
//             title: '',
//             cnt: ''
//         }, this.options);

//         const tpl = `
//             <div class="dialog ${this.options.className}">
//                 <i className="dialog__close">close</i>
//                 <h1 class="dialog__title">${this.options.title}</h1>
//                 <p class="dialog__cnt">${this.options.cnt}</p>
//             </div>
//         `;

//         const el = Component.createElement('div', {className: 'dialog-container'});
//         el.innerHTML = tpl;

//         return el;
//     }
// }

// class ErrorDialog extends Component {
//     constructor(player, options) {
//         super(player, options);

//         this.handleError = this.handleError.bind(this);
//         this.player.on('error', this.handleError);
//     }

//     handleError(event) {
//         this.el.style.display = 'block';
//     }

//     createEl() {
//         return Component.createElement(Dialog, {
//             className: 'error-dialog',
//             title: 'Error',
//             cnt: 'Video play error, plz try again later.'
//         });
//     }
// }

// Component.register(ErrorDialog, {name: 'error_dialog'});







