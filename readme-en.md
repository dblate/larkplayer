<h1 align="left">larkplayer</h1>

<p align="left">
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/v/larkplayer.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/npm/dm/larkplayer.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/larkplayer"><img src="https://img.shields.io/github/license/dblate/larkplayer.svg?style=flat-square" alt="License"></a>
</p>

<p align="left">
    English | <a href="https://github.com/dblate/larkplayer">中文</a>
</p>

## Overview

larkplayer is a light and flexible web player

* Lightweight, uglify + gzip < 13kb
* Solve most compatibility issues, such as full screen, mobile inline playback, etc
* Provide an event mechanism to proxy native events and allow custom events
* Provide plugin mechanism to support multiple plugin types
* Pure javascript, no specific framework dependencies

We separate many functions into [plugins](./docs/plugins/plugin-list), also you can [build your own plugin](./docs/plugins)

Check out [live examples](./examples)

## Download

NPM
```
npm install larkplayer
```

CDN
```
<script src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
```

## Quick Start

#### Via script

```html
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer quick start</title>
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


## Change Log
[CHANGELOG](./CHANGELOG.md)

## License
larkplayer is [MIT licensed](./LICENSE)
