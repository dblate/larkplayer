<h3>简介</h3>
larkplayer 是一款移动端的播放器，基于 html5 video 标签构建。保留 vieo 标签 所有原生的属性、方法和事件，同时也增加了一些自定义方法和事件

larkplayer 有如下特性

* 事件机制，可通过 on off one trigger 处理事件
* 插件机制，可开发自定义插件附加到播放器上
* 自定义样式

<h3>快速上手</h3>

<h4>下载</h4>
```
npm install larkplayer
```
<h4>使用</h4>

<h5>通过模块化引用</h5>

```
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

要以 script 标签的形式插入到 html 中，需要先用 grunt 构建代码

1. 下载 grunt-cli
    * npm install -g grunt-cli
2. 下载 npm 依赖
    * npm install
3. 执行构建
    * grunt
构建完成后，应当在 dist 目录下能得到相关的 js css 及 min.js min.css 文件。

grunt 编译后的文件以 umd 的形式包装，所以可以直接通过 script 的方式引入， larkplayer 会被挂载在 window 上

```
<html>
    <head>
        <link rel="stylesheet" href="./dist/larkplayer.min.css">
        <title>larkplayer demo</title>
    </head>
    <body>
        <video id="my-html5-video" src="https://xxx/xxx.mp4" width="400" height="300" />
        <script scr="./dist/larkplayer.min.js"></script>
        <script>
            <!-- 注意这里传入的 id 应当是 video 标签的 id -->
            larkplayer('my-html5-video');
        </script>
    </body>
<html>
```
