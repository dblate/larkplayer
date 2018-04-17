/**
 * @file 播放完成样式
 * @author yuhui06
 * @date 2018/4/17
 */


import classnames from 'classnames';

import Component from '../plugin/component';
import featureDetector from '../utils/feature-detector';

export default class Complete extends Component {
    createEl() {
        return (
            <div className={classnames('lark-complete', this.options.className)}>
                <div className="lark-complete__replay lark-icon-replay"></div>
            </div>
        );
    }
}

// 目前只要 PC 端，移动端的样式不好看
if (!featureDetector.touch) {
    Component.register(Complete, {name: 'complete'});
}