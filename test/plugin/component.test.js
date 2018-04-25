/**
 * @file Component CHAJIAN CESHI
 * @author yuhui06
 * @date 2018/4/23
 */

import classnames from 'classnames';

describe('Component', function () {
    beforeEach(function () {
        const html = `
            <div id="test-id">
                <div class="div-class" id="div-id">
                <video class="video-class" id="video-id"></video>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);

        const Component = larkplayer.Component;
        class MyPlayButton extends Component {
            createEl() {
                return (
                    <div
                        id="my-play-button"
                        className={classnames('my-play-button', this.options.className)}
                        title={this.options.title}
                        role="button"
                    >
                        <button
                            className="my-play-button__play"
                            role="button"
                            title="play!"
                            hello="hello"
                        >
                            PLAY
                        </button>
                        <span
                            className="my-play-button__pause"
                            role="button"
                            title="pause!"
                            hello="xx"
                        >
                            PAUSE
                        </span>
                    </div>
                );
            }
        }

        Component.register(MyPlayButton, {name: 'thisIsMyPlayButton'});
        this.MyPlayButton = MyPlayButton;
        this.player = larkplayer('video-id', {
            UI: {
                thisIsMyPlayButton: {
                    className: 'this_class_name_will_be_assigned',
                    title: 'this_title_may_change_your_life'
                }
            }
        });
    });

    afterEach(function () {
        this.player.dispose();
        document.body.removeChild(document.getElementById('test-id'));
    });

    it('createEl() should return DOM element', function () {
        const Component = larkplayer.Component;
        const playBtn = new this.MyPlayButton(Component.player);
        expect(playBtn.el).toEqual(jasmine.objectContaining({
            nodeName: 'DIV',
            nodeType: 1,
            // className: 'my-play-button',
            role: 'button'
        }));

        expect(playBtn.el.childNodes.length).toBe(2);

        const playEl = playBtn.el.childNodes[0];
        const pauseEl = playBtn.el.childNodes[1];

        expect(playEl).toEqual(jasmine.objectContaining({
            nodeName: 'BUTTON',
            nodeType: 1,
            className: 'my-play-button__play',
            role: 'button',
            title: 'play!',
            hello: 'hello',
            textContent: 'PLAY'
        }));

        expect(pauseEl).toEqual(jasmine.objectContaining({
            nodeName: 'SPAN',
            nodeType: 1,
            className: 'my-play-button__pause',
            role: 'button',
            title: 'pause!',
            hello: 'xx',
            textContent: 'PAUSE'
        }));
    });

    it('should be initialed and disposed with player', function () {
        const el = document.getElementById('my-play-button');
        expect(el).toEqual(jasmine.objectContaining({
            nodeName: 'DIV',
            nodeType: 1,
            // className: 'my-play-button',
            role: 'button'
        }));
    });

    it('A register Component should be accessed via player.UI[name]', function () {
        const Component = larkplayer.Component;
        expect(this.player.UI.thisIsMyPlayButton instanceof Component).toBe(true);
    });

    it('We can pass options to component via options.UI[name]', function () {
        const el = document.getElementById('my-play-button');
        expect(el).toEqual(jasmine.objectContaining({
            nodeName: 'DIV',
            nodeType: 1,
            title: 'this_title_may_change_your_life',
            className: 'my-play-button this_class_name_will_be_assigned',
            role: 'button'
        }));

        expect(this.player.options.UI.thisIsMyPlayButton).toEqual(jasmine.objectContaining({
            className: 'this_class_name_will_be_assigned',
            title: 'this_title_may_change_your_life'
        }));
    });

    it('dispose() should remove DOM element and some references', function () {
        let el = document.getElementById('my-play-button');
        expect(el.nodeType === 1).toBe(true);

        const myPlayButtomReference = this.player.UI.thisIsMyPlayButton;
        expect(!!myPlayButtomReference.player).toBe(true);
        expect(myPlayButtomReference.el.nodeType === 1).toBe(true);
        expect(myPlayButtomReference.options).toEqual(jasmine.any(Object));

        this.player.dispose();

        el = document.getElementById('my-play-button');
        expect(el).toBeNull();
        expect(myPlayButtomReference.player).toBeNull();
        expect(myPlayButtomReference.el).toBeNull();
        expect(myPlayButtomReference.options).toBeNull();
    });
});


