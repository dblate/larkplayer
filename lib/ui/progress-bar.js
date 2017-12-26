'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _computedStyle = require('../utils/computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

require('./progress-bar-except-fill');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar.js 视频进度条
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @desc
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    1) 目前用的 click 事件，不支持 tap 事件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    2) 只支持移动端拖拽，不支持 pc 端鼠标拖拽
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var document = window.document;

var ProgressBar = function (_Component) {
    _inherits(ProgressBar, _Component);

    function ProgressBar(player, options) {
        _classCallCheck(this, ProgressBar);

        var _this = _possibleConstructorReturn(this, (ProgressBar.__proto__ || Object.getPrototypeOf(ProgressBar)).call(this, player, options));

        _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleTouchStart = _this.handleTouchStart.bind(_this);
        _this.handleTouchMove = _this.handleTouchMove.bind(_this);
        _this.handleTouchEnd = _this.handleTouchEnd.bind(_this);

        _this.line = Dom.$('.lark-progress-bar__line', _this.el);
        _this.lineHandle = Dom.$('.lark-progress-bar__line__handle', _this.el);
        player.on('timeupdate', _this.handleTimeUpdate);
        _this.on('click', _this.handleClick);

        // 拖拽
        Events.on(_this.lineHandle, 'touchstart', _this.handleTouchStart);
        Events.on(document, 'touchend', _this.handleTouchEnd);
        return _this;
    }

    _createClass(ProgressBar, [{
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
        key: 'handleClick',
        value: function handleClick(event) {
            var pos = Dom.getPointerPosition(this.el, event);
            var xPos = Math.round(pos.x * 10000) / 10000;
            var xPercent = xPos * 100 + '%';
            var currentTime = this.player.duration() * xPos;

            // 跳到指定位置播放
            // @todo 这里好像就直接开始播了，如果一开始视频不是播放状态，那这里是不是也不播好点
            this.player.currentTime(currentTime);
            // 更新 ui
            this.line.style.width = xPercent;
            // console.log('ProgressBar click', pos, xPos);
        }
    }, {
        key: 'handleTouchStart',
        value: function handleTouchStart(event) {
            var pos = Dom.getPointerPosition(this.el, event);
            var xPos = Math.round(pos.x * 10000) / 10000;
            var xPercent = xPos * 100 + '%';

            console.log('touchstart', xPercent, event);
            var touches = event.changedTouches || event.touches;
            // this.isHandleTouched = true;
            this.startX = touches[0]['pageX'];
            this.originalLineWidth = parseInt((0, _computedStyle2.default)(this.line, 'width'), 10);
            this.originalBarWidth = parseInt((0, _computedStyle2.default)(this.el, 'width'), 10);

            Events.on(document, 'touchmove', this.handleTouchMove);
            Events.on(document, 'touchend', this.handleTouchEnd);

            this.originalPaused = this.player.paused();
        }

        // @todo 跟 pm 确认是滑动时不断设置 currentTime 还是松手后才设置

    }, {
        key: 'handleTouchMove',
        value: function handleTouchMove(event) {
            var touches = event.changedTouches || event.touches;
            this.curX = touches[0]['pageX'];
            this.diffX = this.curX - this.startX;
            var xPos = Math.round((this.originalLineWidth + this.diffX) / this.originalBarWidth * 10000) / 10000;
            var xPercent = Math.min(xPos, 1) * 100 + '%';
            this.line.style.width = xPercent;

            // 拖动进度条的时候暂停视频，避免杂音
            if (!this.player.paused()) {
                this.player.pause();
            }
            var duration = this.player.duration();
            this.player.currentTime(xPos * duration);
        }
    }, {
        key: 'handleTouchEnd',
        value: function handleTouchEnd(event) {
            // 如果播放器在拖动进度条的时候不是出于暂停状态，那么拖动完了之后继续播放
            if (this.player.paused && !this.originalPaused && this.originalPaused !== undefined) {
                this.player.play();
            }
            Events.off(document, 'touchmove', this.handleTouchMove);
            Events.off(document, 'touchend', this.handleTouchEnd);
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
            return Dom.createElement('div', {
                className: 'lark-progress-bar'
            });
        }
    }]);

    return ProgressBar;
}(_component2.default);

ProgressBar.prototype.options = {
    children: ['progressBarExceptFill']
};

_component2.default.registerComponent('ProgressBar', ProgressBar);

exports.default = ProgressBar;
//# sourceMappingURL=progress-bar.js.map
