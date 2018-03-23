<h1 align="left">larkplayer</h1>

<p align="left">
html5 播放器，支持 pc 与移动端，支持 m3u8 mp4 等格式。
</p>

<p align="left">
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/v/larkplayer.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/github/license/dblate/larkplayer.svg?style=flat-square" alt="License"></a>
</p>

<h3>简介</h3>

larkplayer 是一款轻量级的 html5 播放器，无其他库的依赖

有如下特性

* 事件机制，可通过 on off one trigger 处理原生及自定义事件
* 插件机制，支持自定义插件开发
* 自定义 UI（适应 pc 与移动端）

[在线示例](https://s.codepen.io/dblate/debug/qojzZZ/ZoMBajEzGyDk)

<h3>截图</h3>

__pc__

<img alt="larkplayer pc screenshot" src="https://raw.githubusercontent.com/dblate/larkplayer/master/screenshots/larkplayer-pc.png" width="640" height="360">

__wap__

<img alt="larkplayer wap screenshot" src="https://raw.githubusercontent.com/dblate/larkplayer/master/screenshots/larkplayer-mobile.png" width="640" height="360">

<h3>下载</h3>

npm
```
npm install larkplayer
```

cdn
```
<link rel="stylesheet" href="https://unpkg.com/larkplayer@latest/dist/larkplayer.min.css" />
<script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.min.js"></script>
```

<h3>快速上手</h3>

<h4>通过 script 的方式</h4>

```html
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer quick start</title>
    <!-- 此 cdn 只是拿来作为示例使用，生产环境中请使用自己的 cdn -->
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/larkplayer@latest/dist/larkplayer.css">
</head>
<body>
    <video id="my-video" src="https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4" width="400" height="300" controls>
        请升级浏览器以支持 html5 video
    </video>
 
    <script type="text/javascript" src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
    <script type="text/javascript">
        // js 文件以 umd 的形式包装，以 script 的形式引用时，larkplayer 会直接挂载在 window 上
        var player = larkplayer('my-video', {
            // options 对象用于设置一些其他属性，可选
            width: 640,
            height: 360
        }, function () {
            // player ready 时的回调函数，可选
            console.log('player is ready');
        });

        // 支持自定义 firstplay 事件，每个视频播放时只触发一次
        player.on('firstplay', function () {
            console.log('firstplay');
        });

        // 支持所有的 html5 标准事件
        player.on('play', function () {
            console.log('play');
        });
        player.on('ended', function () {
            console.log('ended');
            player.src('http://www.w3school.com.cn/i/movie.ogg');
            player.play();
            
            // larkplayer 同时也提供对 source 标签的处理方法
            // player.source([{
            //     src: 'http://www.w3school.com.cn/i/movie.ogg',
            //     // type 参数可选
            //     type: 'video/ogg'
            // }, {
            //     src: 'http://www.w3school.com.cn/i/movie.mp4'
            // }]);
        });
    </script>
</body>
</html>
```

<h4>通过 npm + es6 的方式</h4>

* require 和 import 使用方式相似，毕竟目前 import 也是转化为 require 来使用的

```javascript
import larkplayer from 'larkplayer';

const player = larkplayer('video-el');

```

<h3>文档</h3>

[GitBook](https://dblate.gitbooks.io/larkplayer/content/gai-lan.html)上的文档正在建设中 ;)

[docs](https://github.com/dblate/larkplayer/tree/master/docs)目录下有各个模块的 api 文档
* [player](https://github.com/dblate/larkplayer/blob/master/docs/player.md)
* [dom](https://github.com/dblate/larkplayer/blob/master/docs/dom.md)
* [events](https://github.com/dblate/larkplayer/blob/master/docs/events.md)
* [plugin](https://github.com/dblate/larkplayer/blob/master/docs/plugin.md)

<h3>后续规划</h3>

2018/3/7 前增加以下功能
* 支持 vr 视频
* ~~支持 hls(m3u8) 格式~~ √（[larkplayer-hls](https://github.com/dblate/larkplayer-hls)）
* 支持 flv 格式
* ~~同步支持 pc 与移动端的使用~~ √
