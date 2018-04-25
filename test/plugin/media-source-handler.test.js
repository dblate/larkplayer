/**
 * @file MediaSourceHandler CHAJIAN CESHI
 * @author yuhui06
 * @date 2018/4/24
 */

describe('MediaSourceHandler', function () {
    const MediaSourceHandler = larkplayer.MediaSourceHandler;
    const playUrl = 'https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4';
    const playUrl2 = 'https://baikebcs.bdimg.com/baike-other/cool.mp4';
    const html = `
        <div id="test-id">
            <div id="test-el1"></div>
            <div id="test-el2"></div>
        </div>
    `;

    it('call timing', function () {
        document.body.insertAdjacentHTML('afterbegin', html);

        let initialed = 0;
        let disposed = 0;
        class MyMS1 extends MediaSourceHandler {
            constructor(player, options) {
                super(player, options);
                initialed++;
            }

            dispose() {
                disposed++;
                super.dispose();
            }

            static canPlay(src, type) {
                return true;
            }
        }
        MediaSourceHandler.register(MyMS1, {name: 'ms_1'});

        // 初始化时 src && canPlay(src) => new MyMS1()
        const player = larkplayer('test-el1', {src: playUrl});
        expect(initialed).toBe(1);

        // src 改变时
        player.src(playUrl2);
        expect(disposed).toBe(1);
        expect(initialed).toBe(2);

        player.dispose();
        expect(disposed).toBe(2);

        MediaSourceHandler.unregister('ms_1');
        document.body.removeChild(document.getElementById('test-id'));
    });

    it('select MS by canPlay func', function () {
        document.body.insertAdjacentHTML('afterbegin', html);

        let initialed2 = 0;
        let initialed3 = 0;
        class MyMS2 extends MediaSourceHandler {
            constructor(player, options) {
                super(player, options);
                initialed2++;
            }
            static canPlay(src, type) {
                return false;
            }
        }
        MediaSourceHandler.register(MyMS2, {name: 'ms_2'});

        class MyMS3 extends MediaSourceHandler {
            constructor(player, options) {
                super(player, options);
                initialed3++;
            }
            static canPlay(src, type) {
                return true;
            }
        }
        MediaSourceHandler.register(MyMS3, {name: 'ms_3'});

        const player = larkplayer('test-el1', {src: playUrl});
        expect(initialed3).toBe(1);
        expect(initialed2).toBe(0);

        player.dispose();

        MediaSourceHandler.unregister('ms_2');
        MediaSourceHandler.unregister('ms_3');
        document.body.removeChild(document.getElementById('test-id'));
    });

    it('invoke MS\'s src() and play() first when MS is available', function () {
        document.body.insertAdjacentHTML('afterbegin', html);

        let playCount = 0;
        let srcCount = 0;
        class MS4 extends MediaSourceHandler {
            play() {
                playCount++;
            }
            src() {
                srcCount++;
            }

            static canPlay(src, type) {
                return true;
            }
        }
        MediaSourceHandler.register(MS4, {name: 'ms_4'});

        const player = larkplayer('test-el1', {src: playUrl});
        // 初始化时如果有 src，则会调用合适的 MS 处理
        expect(srcCount).toBe(1);

        player.play();
        expect(playCount).toBe(1);

        player.src(playUrl2);
        expect(srcCount).toBe(2);

        player.dispose();
        MediaSourceHandler.unregister('ms_4');
        document.body.removeChild(document.getElementById('test-id'));
    });

    it('can get options via options.MS[name]', function () {
        document.body.insertAdjacentHTML('afterbegin', html);
        const initialOptions = {
            title: 'this options will be passed in player initial',
            email: 'yuhui06@gmail.com'
        };
        let gettedOptions;
        class MS5 extends MediaSourceHandler {
            constructor(player, options) {
                super(player, options);
                gettedOptions = this.options
            }

            static canPlay(src, type) {
                return true;
            }
        }
        MediaSourceHandler.register(MS5, {name: 'ms_5'});

        const player = larkplayer('test-el1', {
            src: playUrl,
            MS: {
                ms_5: initialOptions
            }
        });

        expect(gettedOptions).toEqual(jasmine.objectContaining(initialOptions));

        player.dispose();
        MediaSourceHandler.unregister('ms_5');
        document.body.removeChild(document.getElementById('test-id'));
    });
});


