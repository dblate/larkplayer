/**
 * @file larkplayer CESHI
 * @author yuhui06
 * @date 2018/4/23
 */

describe('larkplayer', function () {
    beforeEach(function () {
        const html = `
            <div id="test-id">
                <div class="div-class" id="div-id">
                <video class="video-class" id="video-id" controls></video>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);
    });

    afterEach(function () {
        document.body.removeChild(document.getElementById('test-id'));
    });

    // it('"el" should be an id or element', function () {
    //     expect(larkplayer).toThrowError();
    // });

    it('initial via an id or element', function () {
        const player1 = larkplayer('div-id');
        expect(!!player1.play).toBe(true);

        const player2 = larkplayer(document.getElementById('div-id'));
        expect(!!player2.play).toBe(true);

        player1.dispose();
        player2.dispose();
        // @todo 验证抛异常的情况
    });

    it('initial via video or other tag', function () {
        const player1 = larkplayer('div-id');
        expect(!!player1.play).toBe(true);
        expect(player1.el).toHaveClass('larkplayer');
        expect(player1.el.id).toBe('div-id-video-larkplayer');

        const player2 = larkplayer('video-id');
        expect(!!player2.play).toBe(true);
        expect(player2.el).toHaveClass('larkplayer');
        expect(player2.el.id).toBe('video-id-larkplayer');

        player1.dispose();
        player2.dispose();
    });

    it('all apis work fine', function () {
        const width = 480;
        const height = 270;
        const src = 'https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4';
        const callback = jasmine.createSpy('callback');
        const player = larkplayer('video-id', {width, height, src}, callback);

        // callback 会放在 setTimeout 中调用
        setTimeout(function () {
            expect(callback).toHaveBeenCalledTimes(1);
        }, 2);

        expect(player.dispose).toEqual(jasmine.any(Function));

        expect(player.width()).toBe(width);
        expect(player.height()).toBe(height);

        expect(player.controls()).toBe(true);
        player.controls(false);
        expect(player.controls()).toBe(false);

        expect(player.isFullscreen()).toBe(false);
        player.requestFullscreen();
        expect(player.isFullscreen()).toBe(true);
        player.exitFullscreen();
        expect(player.isFullscreen()).toBe(false);

        expect(player.paused()).toBe(true);
        expect(player.play).toEqual(jasmine.any(Function));
        expect(player.pause).toEqual(jasmine.any(Function));
        expect(player.load).toEqual(jasmine.any(Function));
        expect(player.reset).toEqual(jasmine.any(Function));

        expect(player.played() instanceof TimeRanges).toBe(true);
        expect(player.currentTime()).toEqual(jasmine.any(Number));
        expect(player.duration()).toEqual(jasmine.any(Number));
        expect(player.remainingTime()).toEqual(jasmine.any(Number));
        expect(player.buffered() instanceof TimeRanges).toBe(true);
        expect(player.bufferedEnd()).toEqual(jasmine.any(Boolean));
        expect(player.seeking()).toEqual(jasmine.any(Boolean));
        expect(player.seekable() instanceof TimeRanges).toBe(true);
        expect(player.ended()).toEqual(jasmine.any(Boolean));
        expect(player.networkState()).toBeGreaterThan(0);
        expect(player.videoWidth()).toEqual(jasmine.any(Number));
        expect(player.videoHeight()).toEqual(jasmine.any(Number));
        expect(player.playsinline).toEqual(jasmine.any(Function));
        expect(player.loop).toEqual(jasmine.any(Function));
        expect(player.crossOrigin).toEqual(jasmine.any(Function));
        expect(player.preload).toEqual(jasmine.any(Function));
        expect(player.autoplay).toEqual(jasmine.any(Function));
        expect(player.muted).toEqual(jasmine.any(Function));
        expect(player.defaultMuted).toEqual(jasmine.any(Function));

        expect(player.volume()).toEqual(jasmine.any(Number));
        player.volume(0.5);
        expect(player.volume()).toBe(0.5);

        expect(player.src()).toBe(src);
        expect(player.source).toEqual(jasmine.any(Function));

        expect(player.playbackRate()).toBe(1);
        player.playbackRate(5);
        expect(player.playbackRate()).toBe(5);

        expect(player.defaultPlaybackRate()).toEqual(jasmine.any(Number));
        expect(player.poster()).toEqual(jasmine.any(String));

        player.dispose();
    });
});