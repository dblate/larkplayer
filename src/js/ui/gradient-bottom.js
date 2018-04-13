/**
 * @file 播放器 UI loading
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/9
 */


import classnames from 'classnames';

import Component from '../plugin/component';


export default class GradientBottom extends Component {
    createEl() {
        return (
            <div className={classnames('lark-gradient-bottom', this.options.className)}></div>
        );
    }
}

// Component.register(GradientBottom);
