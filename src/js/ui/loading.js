/**
 * @file 播放器 UI loading
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/9
 */


import classnames from 'classnames';

import Component from '../plugin/component';
import * as Dom from '../utils/dom';
import featureDetector from '../utils/feature-detector';


export default class Loading extends Component {
    createEl() {
        return (
            <div className={classnames('lark-loading-area', this.options.className)}>
                <div className="lark-loading-cnt">
                    <span className="lark-loading-area__spinner lark-icon-loading"></span>
                    <span className="lark-loading-area__text">正在加载</span>
                </div>
            </div>
        );
    }
}

if (featureDetector.touch) {
    Component.register(Loading);
}
