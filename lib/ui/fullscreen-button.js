'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file fullscreen-button.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/5
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var FullscreenButton = function (_Component) {
    _inherits(FullscreenButton, _Component);

    function FullscreenButton(player, options) {
        _classCallCheck(this, FullscreenButton);

        var _this = _possibleConstructorReturn(this, (FullscreenButton.__proto__ || Object.getPrototypeOf(FullscreenButton)).call(this, player, options));

        _this.handleClick = _this.handleClick.bind(_this);

        _this.on('click', _this.handleClick);
        return _this;
    }

    _createClass(FullscreenButton, [{
        key: 'handleClick',
        value: function handleClick() {
            if (!this.player.isFullscreen()) {
                this.player.requestFullscreen();
            } else {
                this.player.exitFullscreen();
            }
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            // @todo 将两个 icon 分别放到两个类中，这样可以确定他们每个的 click 的事件一定跟自己的名称是相符的
            return Dom.createElement('div', {
                className: 'lark-fullscreen-button'
            }, Dom.createElement('div', {
                className: 'lark-request-fullscreen lark-icon-request-fullscreen'
            }), Dom.createElement('div', {
                // @todo 需要一个非全屏的按钮 sueb
                className: 'lark-exit-fullscreen'
            }));
        }
    }]);

    return FullscreenButton;
}(_component2.default);

exports.default = FullscreenButton;


_component2.default.registerComponent('FullscreenButton', FullscreenButton);
