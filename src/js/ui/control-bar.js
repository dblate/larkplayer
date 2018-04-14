/**
 * @file ControlsBar 播放器控制条
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/9
 */

import classnames from 'classnames';

import Component from '../plugin/component';

import CurrentTime from './current-time';
import Duration from './duration';
import FullscreenButton from './fullscreen-button';
import ProgressBar from './progress-bar';
import featureDetector from '../utils/feature-detector';

export default class ControlBar extends Component {
    reset() {
        this.children.forEach(child => {
            child && child.reset && child.reset();
        });
    }

    createEl() {
        return (
            <div className={classnames('lark-control-bar', this.options.className)}>
                <CurrentTime />
                <ProgressBar />
                <Duration />
                <FullscreenButton />
            </div>
        );
    }
}

if (featureDetector.touch) {
    Component.register(ControlBar);
}