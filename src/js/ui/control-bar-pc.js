/**
 * @file ControlBarPc 播放器操作按钮
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/9
 */

import Component from '../component';
import * as Dom from '../utils/dom';
import CurrentTime from './current-time';
import Duration from './duration';
import PlayButton from './play-button';
import FullscreenButton from './fullscreen-button';
import ProgressBar from './progress-bar';
import GradientBottom from './gradient-bottom';

import './current-time';
import './duration';
import './fullscreen-button';
import './play-button';
import './volume';

class ControlBarPc extends Component {
    constructor(player, options) {
        super(player, options);
    }

    reset() {
        this.children.forEach(child => {
            child && child.reset && child.reset();
        });
    }

    createEl() {
        const time = this.createElement(
            'div',
            {className: 'lark-time'},
            this.createElement('CurrentTime'),
            this.createElement(
                'span',
                {className: 'lark-time-separator'},
                '/'
            ),
            this.createElement('Duration')
        );


        const playButton = this.createElement(
            'playButton',
            {className: 'lark-play-button-pc'}
        );

        const fullscreenButton = this.createElement('FullscreenButton');
        const gradientBottom = this.createElement('GradientBottom');


        // jsxParser(`
        //     <div className="lark-control-bar-pc">
        //         <ProgressBar className="lark-progress-bar-pc" />
        //         <div className="lark-control__left">
        //             <PlayButton className="lark-play-button-pc" />
        //             <div className="lark-time">
        //                 <CurrentTime />
        //                 <span className="lark-time-separator">/<span>
        //                 <Duration />
        //             </div>
        //         </div>
        //         <div className="lark-control__right">
        //             <FullscreenButton />
        //         </div>
        //     </div>
        // `);

        const volume = this.createElement('Volume');

        const controlLeft = this.createElement(
            'div',
            {className: 'lark-control__left'},
            playButton,
            volume,
            time
        );
        const controlRight = this.createElement(
            'div',
            {className: 'lark-control__right'},
            fullscreenButton
        );

        const progressBarPc = this.createElement(
            'progressBar',
            {className: 'lark-progress-bar-pc'}
        );

        return this.createElement(
            'div',
            {className: 'lark-control-bar-pc'},
            gradientBottom,
            progressBarPc,
            controlLeft,
            controlRight
        );
    }
}

Component.registerComponent('ControlBarPc', ControlBarPc);

export default ControlBarPc;