/**
 * @file 播放器 UI loading
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/9
 */

import Component from '../component';
import * as Dom from '../utils/dom';


export default class Loading extends Component {
    createEl() {
        const loadingSpinner = Dom.createElement('span', {
            className: 'lark-loading-area__spinner lark-icon-loading'
        });

        const loadingText = Dom.createElement('span', {
            className: 'lark-loading-area__text'
        }, '正在加载');

        const loadingCnt = Dom.createElement('div', {
            className: 'lark-loading-cnt'
        }, loadingSpinner, loadingText);

        return Dom.createElement('div', {
            className: 'lark-loading-area'
        }, loadingCnt);
    }
}

Component.registerComponent('Loading', Loading);
