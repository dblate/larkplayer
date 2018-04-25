<h1 align="left">larkplayer</h1>

<p align="left">
An extendable html5 video player, supports mp4 m3u8 and other format.
</p>

<p align="left">
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/v/larkplayer.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/dm/larkplayer.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/github/license/dblate/larkplayer.svg?style=flat-square" alt="License"></a>
</p>

<p align="left">
    English | <a href="./readme-cn.md">中文</a>
</p>

## Overview

* Solve most compatibility issues, such as full screen, mobile inline playback, etc
* Provide an event mechanism to proxy native events and allow custom events
* Provide plugin mechanism to support multiple plugin types
* Provide custom style, adaptive pc and mobile
* Pure javascript, no specific framework dependencies

You can experience it through [screenshots](https://github.com/dblate/larkplayer/tree/master/screenshots) or [online example](https://s.codepen.io/dblate/debug/qojzZZ/ZoMBajEzGyDk) 



## Download

NPM
```
npm install larkplayer
```

CDN
```
<link rel="stylesheet" href="https://unpkg.com/larkplayer@latest/dist/larkplayer.css" />
<script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
```

## Quick Start

#### Via script

```html
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer quick start</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/larkplayer@latest/dist/larkplayer.css">
</head>
<body>
    <video id="my-video" src="https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4" width="400" height="300" controls>
       Please upgrade or replace your browser to support html5 video 
    </video>
 
    <script type="text/javascript" src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
    <script type="text/javascript">
        var player = larkplayer('my-video', {
            width: 640,
            height: 360
        }, function () {
            console.log('player is ready');
        });

        player.on('firstplay', function () {
            console.log('firstplay');
        });

        // support all the standard events
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

#### Via npm & es6


```javascript
import larkplayer from 'larkplayer';

const player = larkplayer('video-el');

```

## Document


* [Design](./docs/design.md)
* [Plugin writing example](./docs/plugin)

__API__

* [Player](./docs/api/player.md)
* [Events](./docs/api/events.md)
* [DOM](./docs/api/dom.md)



## Future Work

* ~~support both pc and mobile~~
* ~~support hls(m3u8) format([larkplayer-hls]())~~
* add unit test
* support flv format
* support vr

## License
larkplayer is [MIT licensed](./LICENSE)
