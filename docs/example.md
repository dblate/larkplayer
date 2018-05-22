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
  poster: 'https://',
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
```
