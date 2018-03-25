/**
 * @file 播放器 UI loading pc 版
 * @author yuhui06
 * @date 2018/3/8
 */

import Component from '../component';

import './loading';


export default class LoadingPc extends Component {
    createEl() {
        const el = this.createElement(
            'div',
            {className: 'lark-loading-pc'},
            this.createElement(
                'div',
                {className: 'lark-loading-area'},
                this.createElement(
                    'div',
                    {className: 'lark-loading-spinner'}
                )
            ),
        );

        return el;
    }
}

Component.registerComponent('LoadingPc', LoadingPc);
