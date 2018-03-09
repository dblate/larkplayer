/**
 * @file 播放器 UI loading
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/9
 */

import Component from '../component';
import * as Dom from '../utils/dom';


export default class GradientBottom extends Component {
    createEl() {
        return this.createElement('div', {className: 'lark-gradient-bottom'});
    }
}

Component.registerComponent('GradientBottom', GradientBottom);
