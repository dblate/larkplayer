'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file class Componet 所有 UI 的基类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yuhui06@baidu.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @date 2017/11/4
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @todo 支持 tap 事件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _domData = require('./utils/dom-data');

var DomData = _interopRequireWildcard(_domData);

var _fn = require('./utils/fn');

var Fn = _interopRequireWildcard(_fn);

var _guid = require('./utils/guid');

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _mergeOptions = require('./utils/merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

var _evented = require('./mixins/evented');

var _evented2 = _interopRequireDefault(_evented);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var document = window.document;

var Component = function () {
    function Component(player, options, ready) {
        _classCallCheck(this, Component);

        if (!player && this.play) {
            this.player = player = this;
        } else {
            this.player = player;
        }

        // 避免覆盖 prototype.options
        this.options = (0, _mergeOptions2.default)({}, this.options);
        options = this.options = (0, _mergeOptions2.default)(this.options, options);
        this.id = options.id || options.el && options.el.id;
        if (!this.id) {
            var id = player && player.id || 'no_player';
            this.id = id + '_component_' + (0, _guid.newGUID)();
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

        (0, _evented2.default)(this, { eventBusKey: this.el ? 'el' : null });

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


    _createClass(Component, [{
        key: 'dispose',
        value: function dispose() {
            this.trigger({ type: 'dispose', bubbles: false });

            if (this.el) {
                if (this.el.parentNode) {
                    this.el.parentNode.removeChild(this.el);
                }
                this.off();
                this.el = null;
            }

            if (this.children) {
                this.children.forEach(function (child) {
                    if (typeof child.dispose === 'function') {
                        child.dispose();
                    }
                });
                this.children = null;
                this.childNameIndex = null;
            }
        }
    }, {
        key: 'createEl',
        value: function createEl(tagName, properties, attributes) {
            return Dom.createEl(tagName, properties, attributes);
        }
    }, {
        key: 'contentEl',
        value: function contentEl() {
            return this.contentEl || this.el;
        }
    }, {
        key: 'getChild',
        value: function getChild(name) {

            if (!name) {
                return;
            }

            return this.childNameIndex[(0, _toTitleCase2.default)(name)];
        }
    }, {
        key: 'addChild',
        value: function addChild() {}
    }, {
        key: 'removeChild',
        value: function removeChild() {}
    }, {
        key: 'initChildren',
        value: function initChildren() {
            var _this = this;

            if (this.options.children && this.options.children.length) {
                // 目前只支持平行的就够了
                this.options.children.forEach(function (componentName) {
                    var ComponentClass = Component.getComponent((0, _toTitleCase2.default)(componentName));
                    // @todo 判断 ComponentClass 是否合法
                    if (ComponentClass) {
                        // @todo this.options 传到子元素里有什么用？
                        // this.options 里的 el 会跟子元素的 el 冲突
                        var child = new ComponentClass(_this.player);

                        _this.children.push(child);
                        _this.childNameIndex[componentName] = child;

                        _this.el.appendChild(child.el);
                    }
                });
            }
        }
    }, {
        key: 'ready',
        value: function ready(fn) {
            var _this2 = this;

            if (fn) {
                if (this.isReady) {
                    setTimeout(function () {
                        fn.call(_this2);
                    }, 1);
                } else {
                    this.readyQueue = this.readyQueue || [];
                    this.readyQueue.push(fn);
                }
            }
        }
    }, {
        key: 'triggerReady',
        value: function triggerReady() {
            var _this3 = this;

            this.isReady = true;

            setTimeout(function () {
                var readyQueue = _this3.readyQueue;
                _this3.readyQueue = [];
                if (readyQueue && readyQueue.length) {
                    readyQueue.forEach(function (fn) {
                        fn.call(_this3);
                    });
                }

                _this3.trigger('ready');
            }, 1);
        }
    }, {
        key: '$',
        value: function $(selector, context) {
            return Dom.$(selector, context || this.contentEl());
        }
    }, {
        key: '$$',
        value: function $$(selector, context) {
            return Dom.$$(selector, context || this.contentEl());
        }
    }, {
        key: 'hasClass',
        value: function hasClass(classToCheck) {
            return Dom.hasClass(this.el, classToCheck);
        }
    }, {
        key: 'addClass',
        value: function addClass(classToAdd) {
            return Dom.addClass(this.el, classToAdd);
        }
    }, {
        key: 'removeClass',
        value: function removeClass(classToRemove) {
            return Dom.removeClass(this.el, classToRemove);
        }
    }, {
        key: 'toggleClass',
        value: function toggleClass(classToToggle) {
            return Dom.toggleClass(this.el, classToToggle);
        }
    }, {
        key: 'show',
        value: function show() {
            this.removeClass('lark-hidden');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.addClass('lark-hidden');
        }
    }, {
        key: 'lockShowing',
        value: function lockShowing() {
            this.addClass('lark-lock-showing');
        }
    }, {
        key: 'unlockShowing',
        value: function unlockShowing() {
            this.removeClass('lark-lock-showing');
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(attribute) {
            return Dom.getAttribute(this.el, attribute);
        }
    }, {
        key: 'setAttribute',
        value: function setAttribute(attribute, value) {
            return Dom.setAttribute(attribute, value);
        }
    }, {
        key: 'removeAttribute',
        value: function removeAttribute(attribute) {
            return Dom.removeAttribute(this.el, attribute);
        }
    }, {
        key: 'width',
        value: function width() {}
    }, {
        key: 'height',
        value: function height() {}
    }, {
        key: 'focus',
        value: function focus() {
            this.el.focus();
        }
    }, {
        key: 'blur',
        value: function blur() {
            this.el.blur();
        }
    }], [{
        key: 'registerComponent',
        value: function registerComponent(name, component) {
            // 静态方法，this 是指 Component 这个类而不是他的实例
            if (!this.components) {
                this.components = {};
            }

            this.components[name] = component;
        }
    }, {
        key: 'getComponent',
        value: function getComponent(name) {
            return this.components[name];
        }
    }]);

    return Component;
}();

exports.default = Component;
//# sourceMappingURL=component.js.map
