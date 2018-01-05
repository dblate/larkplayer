<h3>简介</h3>
larkplayer 是一款<strong>移动端</strong>的播放器，基于 html5 video 标签构建。保留 vieo 标签 所有原生的属性、方法和事件，同时也增加了一些自定义方法和事件

larkplayer 有如下特性

* 事件机制，可通过 on off one trigger 处理事件
* 插件机制，可开发自定义插件附加到播放器上
* 自定义样式

<b>如需更加详细的文档，请参见[GitBook](https://dblate.gitbooks.io/larkplayer/content/kuai-su-shang-shou.html)</b>

<h3>快速上手</h3>

<h4>下载</h4>
```
npm install larkplayer
```
<h4>使用</h4>

<h5>通过模块化引用</h5>

```javascript
const larkplayer = require('larkplayer');
// 传入的 my-html5-video 应当是已存在的 video 标签的 id
larkplayer('my-html5-video', {
    // 支持所有的 html5 标准属性
    width: 100,
    height: 100,
    src: 'https://xxx/xxx.mp4',
    // 支持自定义的 source 方法，用于处理 video 中的 source 标签
    source: [{
        src: 'https://xxx/a.m3u8',
        // type 属性可选
        type: 'application/x-mpegURL'
    }, {
        src: 'https://xxx/b.mp4',
        type: 'video/mp4'
    }]
});
// 支持所有的 html5 标准事件
larkplayer.on('player', event => {
    console.log('play')
});
larkplayer.on('pause', event => {
    console.log('pause');
});
// 支持自定义 firstplay 事件，每个视频时播放只触发一次
larkplayer.on('firstplay', event => {
    console.log('Firstplay triggered only once when video played');
});
```

<h5>以 script 的方式使用</h5>

dist 目录下有对应的打包好的 js 和 css 文件， 要以 script 标签的形式插入到 html 中，直接引用即可。

```html
<!DOCTYPE html>
<html>
<head>
    <title>test larkplayer</title>
    <link rel="stylesheet" type="text/css" href="./node_modules/larkplayer/dist/larkplayer.min.css">
</head>
<body>
    <video id="my-video" src="https://baikebcs.bdimg.com/baike-other/cool.mp4" width="400" height="300" controls></video>
    <script type="text/javascript" src="./node_modules/larkplayer/dist/larkplayer.min.js"></script>
    <script type="text/javascript">
        // js 文件以 umd 的形式包装，以 script 的形式引用时，larkplayer 会直接挂载在 window 上
        var player = larkplayer('my-video');
        player.on('play', function () {
            console.log('play');
        });
        player.on('firstplay', function () {
            console.log('firstplay');
        });
        player.on('ended', function () {
            console.log('ended');
            player.src('http://www.w3school.com.cn/i/movie.ogg');
        });
    </script>
</body>
</html>
```
