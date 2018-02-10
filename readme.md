<h1 align="left">larkplayer</h1>

<p align="left">
轻量级 html5 播放器
</p>

<p align="left">
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/v/larkplayer.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/github/license/dblate/larkplayer.svg?style=flat-square" alt="License"></a>
</p>

<h3>简介</h3>

<b>目前只支持移动端，pc 端样式还未开发完成</b>

larkplayer 是一款轻量级的 html5 播放器，无任何其他库的依赖，拥有原生及自定义的事件和方法

larkplayer 有如下特性

* 事件机制，可通过 on off one trigger 处理事件
* 插件机制，支持自定义插件开发
* 自定义样式

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

```html
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer quick start</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/larkplayer@latest/dist/larkplayer.min.css" ／>
</head>
<body>
    <video id="my-video" src="https://baikebcs.bdimg.com/baike-other/cool.mp4" width="400" height="300" controls>
        请升级浏览器以支持 html5 video
    </video>
 
    <script type="text/javascript" src="https://unpkg.com/larkplayer@latest/dist/larkplayer.min.js"></script>
    <script type="text/javascript">
        // js 文件以 umd 的形式包装，以 script 的形式引用时，larkplayer 会直接挂载在 window 上
        var player = larkplayer('my-video');
        // 支持所有的 html5 标准事件
        player.on('play', function () {
            console.log('play');
        });
        // 支持自定义 firstplay 事件，每个视频播放时只触发一次
        player.on('firstplay', function () {
            console.log('firstplay');
        });
        player.on('ended', function () {
            console.log('ended');
            player.src('http://www.w3school.com.cn/i/movie.ogg');
            
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
* 支持 hls(m3u8) 格式
* 支持 flv 格式
* 同步支持 pc 与移动端的使用
