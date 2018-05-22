<h1 align="left">larkplayer</h1>

<p align="left">
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/v/larkplayer.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/dm/larkplayer.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/github/license/dblate/larkplayer.svg?style=flat-square" alt="License"></a>
</p>

中文｜[English](./readme-en.md)

## 简介

larkplayer 是一款轻量级、可扩展的 html5 播放器

* 体积小巧，uglify + gzip < 12kb
* 解决大部分兼容性问题，如全屏、移动端内联播放等
* 提供事件机制，支持自定义事件
* 提供插件机制，支持多种插件类型
* 原生 javascript 编写，无特定框架依赖

通过将非必需的功能转化为插件，达到功能间的解耦，并使得在不同的场景间的切换能更加灵活

可以通过[已有插件](./docs/plugin/plugin-list.md)（hls、vr、ui..）或[编写自定义插件](./docs/plugin)来丰富播放器的功能

更多细节请查看[设计文档](./docs/design.md)

说了那么多可能不如一个[在线示例](https://dblate.github.io/larkplayer/examples/)来的实在~

## 下载

NPM
```
npm install larkplayer
```

CDN
```
<script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
```

## 快速上手

#### 通过 script 的方式

```html
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer quick start</title>
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

#### 通过 npm + es6 的方式


```javascript
import larkplayer from 'larkplayer';

const player = larkplayer('video-el');

```

## 文档

* [Player](./docs/api/player.md)
* [Events](./docs/api/events.md)
* [DOM](./docs/api/dom.md)
* [使用示例](./docs/example.md)


## 如何贡献代码

* fork 或 clone 代码到本地
* 修改代码
* 使用 [fecs](http://fecs.baidu.com/api) 检查 js 代码规范，并修复对应问题
    * 在项目根目录下执行 fecs src （更多选项可参考 [fecs_eslint_wiki](https://github.com/ecomfe/fecs/wiki/ESLint)）
    * 修复所有级别为 ERROR 的提示
    * 建议修复所有级别为 WARN 的提示
* 执行测试，并修复对应问题
    * 切换到 test 目录，并执行 karma start
    * 修复未通过的测试
* 提交 pull request

## Change Log
[CHANGELOG](./CHANGELOG.md)

## License
larkplayer is [MIT licensed](./LICENSE)
