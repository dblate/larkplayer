/**
 * @file progress-bar.js 视频进度条
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/6
 * @desc
 *    1) 写这个类主要是为了 DOM 结构，把 bufferBar 放到 progressBarExceptFill，这样才能方便地使用 flex 布局
 *           => progressBar 的高度等于整个 controlBar 的高度，方便用户点击
 *           => progressBar 中包含 progressBarExceptFill，这是 progressBar 的主体，使用 relative，方便子元素相对于他定位
 *           => progressBarExceptFill 中包含 bufferBar。之所以把 bufferBar 放到里面，是因为定位方便。我之前试过将 bufferBar 放到跟 progressBarExceptFill
 *              同级然后通过 position: absolute 定位。但在 ios 和 安卓下是有问题的（奇怪的是 chrome 模拟器没问题）。绝对定位的元素被排挤到了父元素之外的空间
 *              可以自己做下实验外带参考下 https://www.w3.org/TR/css-flexbox-1/#abspos-items
 */


import classnames from 'classnames';

import Component from '../plugin/component';
import * as Dom from '../utils/dom';
import BufferBar from './buffer-bar';

export default class ProgressBarExceptFill extends Component {
    createEl() {
        return (
            <div className={classnames('lark-progress-bar-except-fill', this.options.className)}>
                <div className="lark-progress-bar__background"></div>
                <div className="lark-progress-bar__line">
                    <div className="lark-progress-bar__line__handle">
                        <div className="lark-progress-bar__line__handle-except-fill"></div>
                    </div>
                </div>
                <BufferBar />
            </div>
        );
    }
}

// Component.register(ProgressBarExceptFill);


