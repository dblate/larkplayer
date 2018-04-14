/**
 * @file not-support.js 不支持 html5 video 标签时提示
 * @author yuhui06
 * @date 2018/3/29
 */


import classnames from 'classnames';

import * as Dom from '../utils/dom';

export default class NotSupport extends Component {
    createEl() {
        return (
            <div className={classnames('lark-not-support-notice', this.options.className)}>
                <div className="lark-not-support-notice__text">
                    您的浏览器不支持 html5 视频播放，请升级浏览器版本或更换为 chrome 浏览器
                </div>
            </div>
        );
    }
}

Component.register(NotSupport);