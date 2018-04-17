## MediaSource 插件编写
    
MediaSource 插件基于 MSE 为播放器提供更多视频格式支持

### 如何编写

* 继承 MediaSourceHandler 类并实现 src play dispose 方法，以及 canPlay 静态方法
* 通过 MediaSourceHandler.register(class, options) 绑定（插件名默认为首字母小写的类名，options.name 可手动指定插件名）
* 播放器初始化时通过 options.MS.name传递参数

MediaSourceHandler:

* 构造函数
    * 接收 player 和 options 参数
    * 提供 this.player 与播放器交互
    * 提供 this.options 接收参数
* 方法
    * src: 处理视频资源
    * play: 播放视频
    * dispose: 销毁插件
    * static canPlay: 判断能否支持当前视频类型
    * static select: 筛选能支持当前视频类型的插件
    * static register: 绑定插件

### 代码示例

```javascript
    import larkplayer from 'larkplayer';
    import Hls from 'hls.js';

    const MediaSourceHandler = larkplayer.MediaSourceHandler;

    // 编写 hls 插件
    class HlsMediaSourceHandler extends MediaSourceHandler {
        constructor(player, options) {
            super(player, options);

            this.player.isReady = false;

            this.hls = new Hls(options);

            this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                this.player.triggerReady();
            });

            this.hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            this.handleMediaError();
                            break;
                        case Hls.ErrorTypes.NETWORK_ERROR:
                        default:
                            this.hls.destroy();
                            break;
                    }
                }
            });
        }

        src(src) {
            this.player.isReady = false;
            this.hls.attachMedia(this.player.tech.el);
            this.hls.loadSource(src);
        }

        internalPlay() {
            const playReturn = this.player.techGet('play');
            if (playReturn && playReturn.then) {
                playReturn.then(null, err => {
                    console.error(err);
                });
            }
        }

        play() {
            if (this.player.isReady) {
                this.internalPlay();
            } else {
                this.player.ready(() => {
                    this.internalPlay();
                });
            }
        }

        handleMediaError() {
            const now = Date.now();
            const minRecoverInterval = 3000;

            if (!this.recoverDecodingErrorDate || (now - this.recoverDecodingErrorDate) > minRecoverInterval) {
                this.recoverDecodingErrorDate = now;
                this.hls.recoverMediaError();
            } else if (!this.recoverSwapAudioCodecDate || (now - this.recoverSwapAudioCodecDate) > minRecoverInterval) {
                this.recoverSwapAudioCodecDate = now;
                this.hls.swapAudioCodec();
                this.hls.recoverMediaError();
            } else {
                this.hls.destroy();
            }
        }

        dispose() {
            if (this.hls instanceof Hls) {
                this.hls.destroy();
                if (this.hls.bufferTimer) {
                    clearInterval(this.hls.bufferTimer);
                    this.hls.bufferTimer = undefined;
                }
            }
            this.hls = null;
        }


        static canPlay(src, type) {
            const fileExtReg = /\.m3u8?/i;
            const typeReg = /application\/((x-mpegURL)|(vnd\.apple\.mpegurl))/i;

            return Hls.isSupported() && (typeReg.test(type) || fileExtReg.test(src));
        }
    }

    // 绑定插件，将名称设置为 hls
    MediaSourceHandler.register(HlsMediaSourceHandler, {name: 'hls'});

    // 调用
    const player = larkplayer('video-el', {
        MS: {
            // 通过 options.MS.hls 传参
            hls: {}
        }
    })
```