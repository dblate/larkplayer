'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./buffer-bar');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar-simple.js 简易版的进度条，当控制条消失时在视频底部显示
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProgressBarSimple = function (_Component) {
    _inherits(ProgressBarSimple, _Component);

    function ProgressBarSimple(player, options) {
        _classCallCheck(this, ProgressBarSimple);

        var _this = _possibleConstructorReturn(this, (ProgressBarSimple.__proto__ || Object.getPrototypeOf(ProgressBarSimple)).call(this, player, options));

        _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_this);
        _this.line = Dom.$('.lark-progress-bar__line', _this.el);
        player.on('timeupdate', _this.handleTimeUpdate);
        return _this;
    }

    _createClass(ProgressBarSimple, [{
        key: 'handleTimeUpdate',
        value: function handleTimeUpdate() {
            // 进度条
            var percent = 0;
            var duration = this.player.duration();
            var currentTime = this.player.currentTime();
            if (duration && currentTime) {
                // 保留两位小数四舍五入
                percent = Math.round(currentTime / duration * 100) / 100;
                // 转换为百分数
                percent = percent * 100 + '%';
            }

            this.line.style.width = percent;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.line.style.width = 0;
            this.children.forEach(function (child) {
                child && child.reset && child.reset();
            });
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var line = Dom.createElement('div', {
                className: 'lark-progress-bar__line'
            });

            var background = Dom.createElement('div', {
                className: 'lark-progress-bar__background'
            });

            return Dom.createElement('div', {
                className: 'lark-progress-bar--simple'
            }, background, line);
        }
    }]);

    return ProgressBarSimple;
}(_component2.default);

_component2.default.registerComponent('ProgressBarSimple', ProgressBarSimple);

ProgressBarSimple.prototype.options = {
    children: ['bufferBar']
};

exports.default = ProgressBarSimple;
