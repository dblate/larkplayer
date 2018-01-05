<a name="Player"></a>

## Player
**Kind**: global class  

* [Player](#Player)
    * [new Player(tag, [options], [ready])](#new_Player_new)
    * [.dispose()](#Player+dispose)
    * [.width([value])](#Player+width) ⇒ <code>number</code>
    * [.height([value])](#Player+height) ⇒ <code>number</code>
    * [.dimension(dimension, value)](#Player+dimension) ⇒ <code>number</code>
    * [.isFullscreen([isFs])](#Player+isFullscreen) ⇒ <code>boolean</code>
    * [.requestFullscreen()](#Player+requestFullscreen)
    * [.exitFullscreen()](#Player+exitFullscreen)
    * [.play()](#Player+play)
    * [.pause()](#Player+pause)
    * [.load()](#Player+load)
    * [.reset()](#Player+reset)
    * [.paused()](#Player+paused) ⇒ <code>boolean</code>
    * [.played()](#Player+played) ⇒ <code>number</code>
    * [.currentTime([seconds])](#Player+currentTime) ⇒ <code>number</code>
    * [.duration()](#Player+duration) ⇒ <code>number</code>
    * [.remainingTime()](#Player+remainingTime) ⇒ <code>number</code>
    * [.buffered()](#Player+buffered) ⇒ <code>TimeRanges</code>
    * [.bufferedEnd()](#Player+bufferedEnd) ⇒ <code>boolean</code>
    * [.seeking()](#Player+seeking) ⇒ <code>boolean</code>
    * [.seekable()](#Player+seekable) ⇒ <code>boolean</code>
    * [.ended()](#Player+ended) ⇒ <code>boolean</code>
    * [.networkState()](#Player+networkState) ⇒ <code>number</code>
    * [.videoWidth()](#Player+videoWidth) ⇒ <code>number</code>
    * [.videoHeight()](#Player+videoHeight) ⇒ <code>number</code>
    * [.volume([decimal])](#Player+volume) ⇒ <code>number</code>
    * [.src([src])](#Player+src) ⇒ <code>string</code>
    * [.source([source], source[0)](#Player+source) ⇒ <code>Array</code> \| <code>undefined</code>
    * [.playbackRate([playbackRate])](#Player+playbackRate) ⇒ <code>number</code>
    * [.defaultPlaybackRate([playbackRate])](#Player+defaultPlaybackRate) ⇒ <code>number</code>
    * ["loadstart" (event)](#Player+event_loadstart)
    * ["play" (event)](#Player+event_play)
    * ["event" (event)](#Player+event_event)
    * ["canplay" (event)](#Player+event_canplay)
    * ["canplaythrough" (event)](#Player+event_canplaythrough)
    * ["playing" (event)](#Player+event_playing)
    * ["seeking" (event)](#Player+event_seeking)
    * ["seeked" (event)](#Player+event_seeked)
    * ["firstplay"](#Player+event_firstplay)
    * ["pause" (event)](#Player+event_pause)
    * ["ended" (event)](#Player+event_ended)
    * ["durationchange" (event)](#Player+event_durationchange)
    * ["timeupdate" (event)](#Player+event_timeupdate)
    * ["fullscreenchange" (data)](#Player+event_fullscreenchange)
    * ["fullscreenerror"](#Player+event_fullscreenerror)

<a name="new_Player_new"></a>

### new Player(tag, [options], [ready])
初始化一个播放器实例


| Param | Type | Description |
| --- | --- | --- |
| tag | <code>Element</code> | HTML5 video tag |
| [options] | <code>Object</code> | 配置项。可选 |
| [ready] | <code>function</code> | 播放器初始化完成后执行的函数 |

<a name="Player+dispose"></a>

### player.dispose()
销毁播放器

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+width"></a>

### player.width([value]) ⇒ <code>number</code>
获取或设置播放器的宽度

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 不传参数则返回播放器当前宽度  
**Todo**

- [ ] 未完成


| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>number</code> | 要设置的播放器宽度值，可选 |

<a name="Player+height"></a>

### player.height([value]) ⇒ <code>number</code>
获取或设置播放器的高度

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 不传参数则返回播放器当前高度  
**Todo**

- [ ] 未完成


| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>number</code> | 要设置的播放器高度值，可选 |

<a name="Player+dimension"></a>

### player.dimension(dimension, value) ⇒ <code>number</code>
获取或设置播放器的高宽

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 对应属性的值  
**Todo**

- [ ] 未完成


| Param | Type | Description |
| --- | --- | --- |
| dimension | <code>string</code> | 属性名：width/height |
| value | <code>number</code> | 要设置的值 |

<a name="Player+isFullscreen"></a>

### player.isFullscreen([isFs]) ⇒ <code>boolean</code>
获取／设置当前全屏状态标志

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参则返回当前全屏状态  

| Param | Type | Description |
| --- | --- | --- |
| [isFs] | <code>boolean</code> | 全屏状态标志 |

<a name="Player+requestFullscreen"></a>

### player.requestFullscreen()
进入全屏
会先尝试浏览器提供的全屏方法，如果没有对应方法，则进入由 css 控制的全屏样式

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+exitFullscreen"></a>

### player.exitFullscreen()
退出全屏

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+play"></a>

### player.play()
播放视频

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+pause"></a>

### player.pause()
暂停播放

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+load"></a>

### player.load()
加载当前视频的资源

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+reset"></a>

### player.reset()
重置播放器
会移除播放器的 src source 属性，并重置各 UI 样式

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+paused"></a>

### player.paused() ⇒ <code>boolean</code>
判断当前是否是暂停状态

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 当前是否是暂停状态  
<a name="Player+played"></a>

### player.played() ⇒ <code>number</code>
获取已播放时长

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 当前已经播放的时长，以秒为单位  
<a name="Player+currentTime"></a>

### player.currentTime([seconds]) ⇒ <code>number</code>
获取／设置当前时间

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 不传参数则返回视频当前时刻  

| Param | Type | Description |
| --- | --- | --- |
| [seconds] | <code>number</code> | 以秒为单位，要设置的当前时间的值。可选 |

<a name="Player+duration"></a>

### player.duration() ⇒ <code>number</code>
获取当前视频总时长

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 视频总时长，如果视频未初始化完成，可能返回 NaN  
<a name="Player+remainingTime"></a>

### player.remainingTime() ⇒ <code>number</code>
获取视频剩下的时长

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 总时长 - 已播放时长 = 剩下的时长  
<a name="Player+buffered"></a>

### player.buffered() ⇒ <code>TimeRanges</code>
获取当前已缓冲的范围

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>TimeRanges</code> - 当前已缓冲的范围（buffer 有自己的 TimeRanges 对象）  
<a name="Player+bufferedEnd"></a>

### player.bufferedEnd() ⇒ <code>boolean</code>
判断当前视频是否已缓冲到最后

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 当前视频是否已缓冲到最后  
<a name="Player+seeking"></a>

### player.seeking() ⇒ <code>boolean</code>
判断当前视频是否处于 seeking（跳转中） 状态

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 是否处于跳转中状态  
<a name="Player+seekable"></a>

### player.seekable() ⇒ <code>boolean</code>
判断当前视频是否可跳转到指定时刻

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 前视频是否可跳转到指定时刻  
<a name="Player+ended"></a>

### player.ended() ⇒ <code>boolean</code>
判断当前视频是否已播放完成

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 当前视频是否已播放完成  
<a name="Player+networkState"></a>

### player.networkState() ⇒ <code>number</code>
获取当前视频的 networkState 状态

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 当前视频的 networkState 状态  
**Todo**

- [ ] 补充 networkState 各状态说明

<a name="Player+videoWidth"></a>

### player.videoWidth() ⇒ <code>number</code>
获取当前播放的视频的原始宽度

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 当前视频的原始宽度  
<a name="Player+videoHeight"></a>

### player.videoHeight() ⇒ <code>number</code>
获取当前播放的视频的原始高度

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 当前视频的原始高度  
<a name="Player+volume"></a>

### player.volume([decimal]) ⇒ <code>number</code>
获取或设置播放器声音大小

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 不传参数则返回当前视频声音大小  

| Param | Type | Description |
| --- | --- | --- |
| [decimal] | <code>number</code> | 要设置的声音大小的值（0~1），可选 |

<a name="Player+src"></a>

### player.src([src]) ⇒ <code>string</code>
获取或设置当前视频的 src 属性的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>string</code> - 不传参数则返回当前视频的 src 或 currentSrc  

| Param | Type | Description |
| --- | --- | --- |
| [src] | <code>string</code> | 要设置的 src 属性的值，可选 |

<a name="Player+source"></a>

### player.source([source], source[0) ⇒ <code>Array</code> \| <code>undefined</code>
获取或设置播放器的 source

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Array</code> \| <code>undefined</code> - 若不传参则获取 source 数据；传参则设置 source 标签，返回 undefined  

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>Array</code> | 视频源，可选 |
| source[0 | <code>Object</code> | source 数组中的对象 |
| source[0].src | <code>string</code> | src 属性 |
| source[0].type | <code>string</code> | type 属性，用于标识视频类型，如 'video/mp4'，可选，如果不填播放器会根据文件后缀尝试自动补充 |

<a name="Player+playbackRate"></a>

### player.playbackRate([playbackRate]) ⇒ <code>number</code>
获取或设置当前视频的播放速率

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 不传参数则返回当前视频的播放速率  

| Param | Type | Description |
| --- | --- | --- |
| [playbackRate] | <code>number</code> | 要设置的播放速率的值，可选 |

<a name="Player+defaultPlaybackRate"></a>

### player.defaultPlaybackRate([playbackRate]) ⇒ <code>number</code>
获取或设置当前视频的默认播放速率

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 不传参数则返回当前视频的默认播放速率  

| Param | Type | Description |
| --- | --- | --- |
| [playbackRate] | <code>number</code> | 要设置的默认播放速率的值，可选 |

<a name="Player+event_loadstart"></a>

### "loadstart" (event)
loadstart 时触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_play"></a>

### "play" (event)
视频播放时触发，无论是第一次播放还是暂停、卡顿后恢复播放

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_event"></a>

### "event" (event)
视频播放因为下一帧没准备好而暂时停止，但是客户端正在努力缓冲中时触发
简单来讲，在视频卡顿或视频跳转到指定位置时触发，在暂停、视频播放完成、视频播放出错时不会触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_canplay"></a>

### "canplay" (event)
视频能开始播发时触发，并不保证能流畅的播完

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_canplaythrough"></a>

### "canplaythrough" (event)
如果从当前开始播放，视频估计能流畅的播完时触发此事件

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_playing"></a>

### "playing" (event)
Playback is ready to start after having been paused or delayed due to lack of media data.

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: https://html.spec.whatwg.org/#mediaevents  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_seeking"></a>

### "seeking" (event)
视频跳转到指定时刻时触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_seeked"></a>

### "seeked" (event)
视频跳转到某一时刻完成后触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_firstplay"></a>

### "firstplay"
在视频第一次播放时触发，只会触发一次

**Kind**: event emitted by [<code>Player</code>](#Player)  
<a name="Player+event_pause"></a>

### "pause" (event)
视频暂停时触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_ended"></a>

### "ended" (event)
视频播放完成时触发，如果设置了 loop 属性为 true，播放完成后可能不触发此事件

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_durationchange"></a>

### "durationchange" (event)
视频时长发生改变时触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_timeupdate"></a>

### "timeupdate" (event)
视频当前时刻更新时触发，一般 1s 内会触发好几次

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | 事件触发时浏览器自带的 event 对象 |

<a name="Player+event_fullscreenchange"></a>

### "fullscreenchange" (data)
在进入／退出全屏时触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | 全屏相关的数据 |
| data.isFullscreen | <code>boolean</code> | 当前是否是全屏状态 |

<a name="Player+event_fullscreenerror"></a>

### "fullscreenerror"
在全屏时出错时触发

**Kind**: event emitted by [<code>Player</code>](#Player)  
