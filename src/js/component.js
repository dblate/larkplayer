/**
 * @file class Componet 所有 UI 的基类
 * @author yuhui06@baidu.com
 * @date 2017/11/4
 * @todo 支持 tap 事件
 */

import * as Dom from './utils/dom';
import {newGUID} from './utils/guid';
import toTitleCase from './utils/to-title-case';
import mergeOptions from './utils/merge-options';
import evented from './mixins/evented';


export default class Component {
    constructor(player, options, ready) {
        if (!player && this.play) {
            this.player = player = this;
        } else {
            this.player = player;
        }

        // 避免覆盖 prototype.options
        this.options = mergeOptions({}, this.options);
        options = this.options = mergeOptions(this.options, options);
        this.id = options.id || (options.el && options.el.id);
        if (!this.id) {
            const id = player && player.id || 'no_player';
            this.id = `${id}_component_${newGUID()}`;
        }

        this.name = options.name || null;

        // Html5 中 options.el 为 video 标签
        if (options.el) {
            this.el = options.el;
        // 有时侯我们不希望在这里执行 createEl
        } else if (options.createEl !== false) {
            // 往往是执行子类的 createEl 方法
            this.el = this.createEl();
        }

        evented(this, {eventBusKey: this.el});

        // 子元素相关信息
        this.children = [];
        this.childNameIndex = {};

        if (options.initChildren !== false) {
            this.initChildren();
        }

        this.ready(ready);
    }

    // dispose 应该做到以下几方面
    // 1. remove Elements for memory
    // 2. remove Events for memory
    // 3. remove reference for GC
    dispose() {
        this.trigger({type: 'dispose', bubbles: false});

        if (this.el) {
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.off();
            this.el = null;
        }

        if (this.children) {
            this.children.forEach(child => {
                if (typeof child.dispose === 'function') {
                    child.dispose();
                }
            });
            this.children = null;
            this.childNameIndex = null;
        }
    }

    createEl(tagName, properties, attributes) {
        return Dom.createEl(tagName, properties, attributes);
    }

    createElement(tagName, props, ...child) {
        const ComponentClass = Component.getComponent(toTitleCase(tagName));
        if (ComponentClass) {
            const instance = new ComponentClass(this.player, props);
            const instanceEl = instance.el;

            if (child) {
                Dom.appendContent(instanceEl, child);
            }

            return instanceEl;
        } else {
            return Dom.createElement(tagName, props, ...child);
        }
    }

    appendChild(el, child) {

    }

    contentEl() {
        return this.contentEl || this.el;
    }

    getChild(name) {

        if (!name) {
            return;
        }

        return this.childNameIndex[toTitleCase(name)];
    }

    addChild() {

    }

    removeChild() {

    }

    initChildren() {
        if (this.options.children && this.options.children.length) {
            // 目前只支持平行的就够了
            this.options.children.forEach(componentName => {
                const ComponentClass = Component.getComponent(toTitleCase(componentName));
                // @todo 判断 ComponentClass 是否合法
                if (ComponentClass) {
                    // @todo this.options 传到子元素里有什么用？
                    // this.options 里的 el 会跟子元素的 el 冲突
                    let child = new ComponentClass(this.player);

                    this.children.push(child);
                    this.childNameIndex[componentName] = child;

                    this.el.appendChild(child.el);
                }
            });
        }
    }

    ready(fn) {
        if (fn) {
            if (this.isReady) {
                setTimeout(() => {
                    fn.call(this);
                }, 1);
            } else {
                this.readyQueue = this.readyQueue || [];
                this.readyQueue.push(fn);
            }
        }
    }

    triggerReady() {
        this.isReady = true;

        setTimeout(() => {
            const readyQueue = this.readyQueue;
            this.readyQueue = [];
            if (readyQueue && readyQueue.length) {
                readyQueue.forEach(fn => {
                    fn.call(this);
                });
            }

            this.trigger('ready');
        }, 1);
    }

    $(selector, context) {
        return Dom.$(selector, context || this.contentEl());
    }

    $$(selector, context) {
        return Dom.$$(selector, context || this.contentEl());
    }

    hasClass(classToCheck) {
        return Dom.hasClass(this.el, classToCheck);
    }

    addClass(classToAdd) {
        return Dom.addClass(this.el, classToAdd);
    }

    removeClass(classToRemove) {
        return Dom.removeClass(this.el, classToRemove);
    }

    toggleClass(classToToggle) {
        return Dom.toggleClass(this.el, classToToggle);
    }

    show() {
        this.removeClass('lark-hidden');
    }

    hide() {
        this.addClass('lark-hidden');
    }

    lockShowing() {
        this.addClass('lark-lock-showing');
    }

    unlockShowing() {
        this.removeClass('lark-lock-showing');
    }

    getAttribute(attribute) {
        return Dom.getAttribute(this.el, attribute);
    }

    setAttribute(attribute, value) {
        return Dom.setAttribute(attribute, value);
    }

    removeAttribute(attribute) {
        return Dom.removeAttribute(this.el, attribute);
    }

    width() {

    }

    height() {

    }

    focus() {
        this.el.focus();
    }

    blur() {
        this.el.blur();
    }

    static registerComponent(name, component) {
        // 静态方法，this 是指 Component 这个类而不是他的实例
        if (!this.components) {
            this.components = {};
        }

        this.components[name] = component;
    }

    static getComponent(name) {
        return this.components[name];
    }
}



































