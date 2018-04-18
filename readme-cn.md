<h1 align="left">larkplayer</h1>

<p align="left">
一款可扩展的 html5 播放器，支持 pc 与移动端，支持 m3u8 mp4 等格式
</p>

<p align="left">
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/v/larkplayer.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/github/license/dblate/larkplayer.svg?style=flat-square" alt="License"></a>
</p>

<p align="left">
    [English](https://github.com/dblate/larkplayer)|中文
</p>

<h3>简介</h3>

* 解决大部分兼容性问题，如全屏、移动端内联播放等
* 提供事件机制，代理原生事件并允许自定义事件
* 提供插件机制，支持多种插件类型
* 提供自定义样式，自适应 pc 与移动端
* 原生 javascript 编写，无特定框架依赖

可以通过 [截图](https://github.com/dblate/larkplayer/tree/master/screenshots) 或 [在线示例](https://s.codepen.io/dblate/debug/qojzZZ/ZoMBajEzGyDk) 来感受效果


<h3>下载</h3>

NPM
```
npm install larkplayer
```

CDN
```
<link rel="stylesheet" href="https://unpkg.com/larkplayer@latest/dist/larkplayer.css" />
<script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
```

<h3>快速上手</h3>

<h4>通过 script 的方式</h4>

```html
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer quick start</title>
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
            width: 640,
            height: 360
        }, function () {
            console.log('player is ready');
        });

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

* [Player](https://github.com/dblate/larkplayer/blob/master/docs/api/player.md)
* [Events](https://github.com/dblate/larkplayer/blob/master/docs/api/events.md)
* [DOM](https://github.com/dblate/larkplayer/blob/master/docs/api/dom.md)

* [设计文档](https://github.com/dblate/larkplayer/blob/master/docs/design.md)
* [插件编写](https://github.com/dblate/larkplayer/blob/master/docs/plugin)


<h3>如何贡献代码</h3>

* fork 或 clone 代码到本地
* 修改代码
* 使用 [fecs](http://fecs.baidu.com/api) 检查 js 代码规范，并修复对应问题
    * 在项目根目录下执行 fecs src/js （更多选项可参考 [fecs_eslint_wiki](https://github.com/ecomfe/fecs/wiki/ESLint)）
    * 修复所有级别为 ERROR 的提示
    * 建议修复所有级别为 WARN 的提示
* 提交 pull request


<h3>后续规划</h3>

~~2018/3/7 前增加以下功能~~
* 支持 vr 视频
* ~~支持 hls(m3u8) 格式~~ √（[larkplayer-hls](https://github.com/dblate/larkplayer-hls)）
* 支持 flv 格式
* ~~同步支持 pc 与移动端的使用~~ √
