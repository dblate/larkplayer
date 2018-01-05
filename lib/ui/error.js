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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file error.js 播放器出错时显示
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/16
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Error = function (_Component) {
    _inherits(Error, _Component);

    function Error(player, options) {
        _classCallCheck(this, Error);

        var _this = _possibleConstructorReturn(this, (Error.__proto__ || Object.getPrototypeOf(Error)).call(this, player, options));

        _this.handleError = _this.handleError.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);

        _this.player.on('error', _this.handleError);

        _this.on('click', _this.handleClick);
        return _this;
    }

    _createClass(Error, [{
        key: 'handleError',
        value: function handleError(event, data) {
            console.log(event, data);
        }
    }, {
        key: 'handleClick',
        value: function handleClick() {
            var src = this.player.src();
            this.player.reset();
            this.player.src(src);
        }
    }, {
        key: 'createEl',
        value: function createEl() {
            var errorSpinner = Dom.createElement('span', {
                className: 'lark-error-area__spinner lark-icon-loading'
            });

            var errorText = Dom.createElement('span', {
                className: 'lark-error-area__text'
            }, '加载失败，点击重试');

            var errorCnt = Dom.createElement('div', {
                className: 'lark-error-cnt'
            }, errorSpinner, errorText);

            return Dom.createElement('div', {
                className: 'lark-error-area'
            }, errorCnt);
        }
    }]);

    return Error;
}(_component2.default);

exports.default = Error;


_component2.default.registerComponent('Error', Error);
