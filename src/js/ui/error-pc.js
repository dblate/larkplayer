/**
 * @file error.js 播放器出错时显示 pc 版
 * @author yuhuiyuhui06
 * @date 2018/3/8
 */
import Component from '../component';
import * as Dom from '../utils/dom';

import './error';

export default class ErrorPc extends Component {
    createEl() {
        return this.createElement(
            'div',
            {className: 'lark-error-pc'},
            this.createElement('Error')
        );
    }
}

Component.registerComponent('ErrorPc', ErrorPc);