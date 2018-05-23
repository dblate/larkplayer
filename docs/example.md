# 使用示例

## 最简单的情况

如果只是想要播放 mp4 这类 html5 video 原生就支持的视频格式，并且并不需要任何的额外样式，那么直接使用 larkplayer.js 即可。

通过 larkplayer 可以方便地创建、销毁播放器，监听各类事件并调用各种 api。

```javascript
// 可以通过将 js 文件下载到本地引用，也可以通过 npm 的方式
// larkplayer 既支持 script 标签的方式，也支持模块化 require
<script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>

// larkplayer 第一个参数可以是通过 DOM 选择器获取的 DOM 元素，也可以是元素 id
// 如果是 video 元素或其 id，则会围绕此 video 元素构建播放器，video 元素上的各个属性会保留（自动转化为参数）
// 如果是其他元素，比如 div，则会以此 div 作为容器构建播放器
var player = larkplayer('video-container', {
  width: 640,
  height: 360,
  src: 'https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4',
  controls: true,
  // 隐藏原生控制条中的下载按钮
  controlsList: 'nodownload',
  // 循环播放
  loop: true,
  // 2 倍速播放
  playbackRate: 2,
  // 50% 音量
  volume: 0.5,
  // 静音播放
  muted: true,
  // “内联”播放
  playsinline: true,
  poster: 'https://github.com/dblate/larkplayer/blob/master/screenshots/poster.jpg',
  // 预下载视频高宽、时长等基础信息
  preload: 'metadata',
  // src 和 source 均是提供视频资源，source 可以提供多个使得浏览器自动选择
  // src 和 source 一般不同时设置，使用一种即可
  source: [{
    src: 'https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4',
    type: 'video/mp4'
  }, {
    src: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
    type: 'application/x-mpegURL'
  }]
}, function () {
  console.log('player is ready!');
});

player.on('firstplay', function () {
  var duration = player.duration();
  // 跳转到视频中间
  player.currentTime(duration / 2);
});

player.on('play', function () {
  // play 和 firstplay 事件不同，每次暂停后恢复播放，会再次触发 play 事件，而 firstplay 只在每个视频第一次播放时触发
  console.log('play');
});

player.on('ended', function () {
  console.log('play complete!');
  
  // 播放下一个视频
  player.src('http://www.w3school.com.cn/i/movie.ogg');
  player.play();
});

player.play();

// 播放器有一套自定义事件的机制，如果你有需求场景，可以使用此功能
// 实际上播放器内部的所有事件都是通过此机制处理的
// 在插件开发时，会经常用到

function callback(event) {
  console.log('这是一个事件回调函数');
  console.log('在处理 player 的自定义事件时，通过 event.detail 传递自定义的数据', event.detail);
}

// 监听自定义事件
player.on('custom_event', callback);

// 触发自定义事件
player.trigger('custom_event', {
  detail: 'hello, we can pass any data through this prop',
  // 虽然你可能并不关心，但确实可以通过 bubbles 设置该事件是否冒泡
  bubbles: false,
  // 设置该事件是否可以被 event.preventDefault() 取消
  cancelable: false
}));

// 注销自定义事件
// 事件注销跟 removeEventListener 一样，必须指定之前注册时的事件名和函数名
player.off('custom_event', callback);
```
更多事件和 api 可以参考 [Player](https://github.com/dblate/larkplayer/blob/master/docs/api/player.md) 文档

## 皮肤

很多时候我们还是想要一套自定义的样式。播放器已经通过 larkplayer-ui 插件提供了一款自适应 pc 与移动端的样式，你可以在此基础上做一些修改，也可以重新开发一套样式（参考 [UI 插件示例](./plugin/ui-plugin-example.md)）

要使用 larkplayer-ui 插件，直接将其引入即可
```javascript
  <script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
  <script src="https://unpkg.com/larkplayer-ui@latest/dist/larkplayer-ui.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/larkplayer-ui@latest/dist/larkplayer-ui.css" />

  // 后续按正常流程使用 larkplayer 即可，larkplayer-ui 插件在引入时即会运行
  
  // larkplayer-ui 本身也可以接受一些参数以及更灵活的配置，但由于目前使用的人比较少，场景有限，所以在灵活性上也没花太多功夫，这里就懒得写了
  // 如果有其他的使用场景，可以提交 issue 或者 pull request，一起来完善
```

## hls

如果要播放 m3u8 文件，在移动端基本已经原生支持，不用过多处理；在 pc 端，可以使用 larkplayer-hls 插件

```javascript
  <script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
  <script type="text/javascript" src="https://unpkg.com/larkplayer-hls@latest/dist/larkplayer-hls.js"></script>
  // em.. 假设你皮肤插件也想一起使用
  <script src="https://unpkg.com/larkplayer-ui@latest/dist/larkplayer-ui.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/larkplayer-ui@latest/dist/larkplayer-ui.css" />
  
  // 后续跟以前一样使用即可
  var player = larkplayer('video-container', options, ready);
  
  // larkplayer-hls 还接受一些参数，不过使用者一般都不用关心，这里就不列举了~
  // 实在有需要可以查看 larkplayer-hls 插件的 github 
```
