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
import PluginTypes from './plugin-types';
import * as DOM from '../utils/dom';
import * as Events from '../events/events';
import evented from '../events/evented';
import toCamelCase from '../utils/to-camel-case';


export default class Component {
    constructor(player, options = {}) {
        this.player = player;
        this.options = options;
        this.el = this.createEl(this.options);

        evented(this, {eventBusKey: this.el});
        this.dispose = this.dispose.bind(this);
        this.player.on('dispose', this.dispose);
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

        let ComponentClass;
        if (typeof name === 'string') {
            ComponentClass = Component.get(toCamelCase(name));
        } else if (name.prototype instanceof Component) {
            ComponentClass = name;
        }

        if (ComponentClass) {
            // 这里的 this.player 不是什么黑魔法，它确实无法取到实例中的 this.player
            // 只不过是在调用 Component.createElement 之前，先给 Component.player 赋了值而已
            // 如果你看不懂我在说什么，当我没说
            const instance = new ComponentClass(this.player, options);
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
        return pluginStore.add(component, options, PluginTypes.UI);
    }

    static get(name) {
        return pluginStore.get(name, PluginTypes.UI);
    }

    static getAll() {
        return pluginStore.getAll(PluginTypes.UI);
    }
}







