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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file playButton.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/7
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var PlayButton = function (_Component) {
    _inherits(PlayButton, _Component);

    function PlayButton(player, options) {
        _classCallCheck(this, PlayButton);

        // this.handleClick = this.handleClick.bind(this);

        // 注意 这里需要将 context（第二个参数） 设置为 this.el，因为这时 DOM 元素还没有插入到 document 里，所以在 document 里是查不到这个元素的
        var _this = _possibleConstructorReturn(this, (PlayButton.__proto__ || Object.getPrototypeOf(PlayButton)).call(this, player, options));

        _this.playBtn = Dom.$('.lark-play-button__play', _this.el);
        _this.pauseBtn = Dom.$('.lark-play-button__pause', _this.el);

        // @todo 临时处理 ios11 click 事件问题
        Events.on(_this.playBtn, 'touchend', function (event) {
            return _this.togglePlay(event, true);
        });
        Events.on(_this.pauseBtn, 'touchend', function (event) {
            return _this.togglePlay(event, false);
        });

        return _this;
    }

    _createClass(PlayButton, [{
        key: 'togglePlay',
        value: function togglePlay(event, isPlay) {
            // 这里阻止事件冒泡，因为跟播放器顶部 暂停状态时点击播放器任意区域播放视频冲突了
            // 这里暂停视频后，事件传到顶部后又播放视频
            // @todo 看有没有更好的解决方法
            event.stopPropagation();
            if (isPlay) {
                if (this.player.paused()) {
                    this.player.play();
                }
            } else {
                if (!this.player.paused()) {
                    this.player.pause();
                }
            }
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var playIcon = Dom.createElement('div', {
                className: 'lark-play-button__play lark-icon-play',
                title: 'play'
            });

            var pauseIcon = Dom.createElement('div', {
                className: 'lark-play-button__pause lark-icon-pause',
                title: 'pause'
            });

            return Dom.createElement('div', {
                className: 'lark-play-button'
            }, playIcon, pauseIcon);
        }
    }]);

    return PlayButton;
}(_component2.default);

exports.default = PlayButton;


_component2.default.registerComponent('PlayButton', PlayButton);
