'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _timeFormat = require('../utils/time-format');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file duration.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Duration = function (_Component) {
    _inherits(Duration, _Component);

    function Duration(player, options) {
        _classCallCheck(this, Duration);

        var _this = _possibleConstructorReturn(this, (Duration.__proto__ || Object.getPrototypeOf(Duration)).call(this, player, options));

        _this.handleLoadedMetaData = _this.handleLoadedMetaData.bind(_this);

        player.on('durationchange', _this.handleLoadedMetaData);
        player.on('loadedmetadata', _this.handleLoadedMetaData);
        return _this;
    }

    _createClass(Duration, [{
        key: 'handleLoadedMetaData',
        value: function handleLoadedMetaData(event) {
            Dom.textContent(this.el, (0, _timeFormat.timeFormat)(Math.floor(this.player.duration())));
        }
    }, {
        key: 'reset',
        value: function reset() {
            Dom.textContent(this.el, '');
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            // @todo 暂时将 duration 的值写在这，后面需要处理下对于已经发生的事件怎么办
            var durationContent = (0, _timeFormat.timeFormat)(Math.floor(this.player.duration()));
            return Dom.createEl('div', {
                className: 'lark-duration'
            }, null, durationContent);
        }
    }]);

    return Duration;
}(_component2.default);

exports.default = Duration;


_component2.default.registerComponent('Duration', Duration);
