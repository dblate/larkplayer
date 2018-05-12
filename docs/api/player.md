<a name="Player"></a>

## Player
**Kind**: global class  

* [Player](#Player)
    * [.poster([poster])](#Player+poster) ⇒ <code>boolean</code>
    * [.preload([preload])](#Player+preload) ⇒ <code>boolean</code>
    * [.autoplay([autoplay])](#Player+autoplay) ⇒ <code>boolean</code>
    * [.loop([loop])](#Player+loop) ⇒ <code>boolean</code>
    * [.muted([muted])](#Player+muted) ⇒ <code>boolean</code>
    * [.defaultMuted([defaultMuted])](#Player+defaultMuted) ⇒ <code>boolean</code>
    * [.controls([controls])](#Player+controls) ⇒ <code>boolean</code>
    * [.controlsList([controlsList])](#Player+controlsList) ⇒ <code>DOMTokenList</code>
    * [.playsinline([playsinline])](#Player+playsinline) ⇒ <code>boolean</code>
    * [.playbackRate([playbackRate])](#Player+playbackRate) ⇒ <code>boolean</code>
    * [.defaultPlaybackRate([defaultPlaybackRate])](#Player+defaultPlaybackRate) ⇒ <code>boolean</code>
    * [.volume([volume])](#Player+volume) ⇒ <code>boolean</code>
    * [.error()](#Player+error) ⇒ <code>MediaError</code> \| <code>null</code>
    * [.currentSrc()](#Player+currentSrc) ⇒ <code>string</code>
    * [.networkState()](#Player+networkState) ⇒ <code>number</code>
    * [.buffered()](#Player+buffered) ⇒ [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)
    * [.readyState()](#Player+readyState) ⇒ <code>number</code>
    * [.seeking()](#Player+seeking) ⇒ <code>boolean</code>
    * [.duration()](#Player+duration) ⇒ <code>number</code> \| <code>NaN</code>
    * [.paused()](#Player+paused) ⇒ <code>boolean</code>
    * [.played()](#Player+played) ⇒ [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)
    * [.seekable()](#Player+seekable) ⇒ [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)
    * [.ended()](#Player+ended) ⇒ <code>boolean</code>
    * [.videoWidth()](#Player+videoWidth) ⇒ <code>number</code> \| <code>NaN</code>
    * [.videoHeight()](#Player+videoHeight) ⇒ <code>number</code> \| <code>NaN</code>
    * [.dispose()](#Player+dispose)
    * [.width([value])](#Player+width) ⇒ <code>number</code> \| <code>NaN</code>
    * [.height([value])](#Player+height) ⇒ <code>number</code> \| <code>NaN</code>
    * [.isFullscreen()](#Player+isFullscreen) ⇒ <code>boolean</code>
    * [.requestFullscreen()](#Player+requestFullscreen)
    * [.exitFullscreen()](#Player+exitFullscreen)
    * [.play()](#Player+play)
    * [.pause()](#Player+pause)
    * [.load()](#Player+load)
    * [.reset()](#Player+reset)
    * [.currentTime([seconds])](#Player+currentTime) ⇒ <code>number</code>
    * [.remainingTime()](#Player+remainingTime) ⇒ <code>number</code>
    * [.bufferedEnd()](#Player+bufferedEnd) ⇒ <code>boolean</code>
    * [.src([src])](#Player+src) ⇒ <code>string</code>
    * [.source([source])](#Player+source) ⇒ <code>Array</code>
    * ["loadstart"](#Player+event_loadstart)
    * ["suspend"](#Player+event_suspend)
    * ["abort"](#Player+event_abort)
    * ["error"](#Player+event_error)
    * ["emptied"](#Player+event_emptied)
    * ["stalled"](#Player+event_stalled)
    * ["loadedmetadata"](#Player+event_loadedmetadata)
    * ["loadeddata"](#Player+event_loadeddata)
    * ["canplay"](#Player+event_canplay)
    * ["canplaythrough"](#Player+event_canplaythrough)
    * ["playing"](#Player+event_playing)
    * ["waiting"](#Player+event_waiting)
    * ["seeking"](#Player+event_seeking)
    * ["seeked"](#Player+event_seeked)
    * ["ended"](#Player+event_ended)
    * ["durationchange"](#Player+event_durationchange)
    * ["timeupdate"](#Player+event_timeupdate)
    * ["progress"](#Player+event_progress)
    * ["play"](#Player+event_play)
    * ["pause"](#Player+event_pause)
    * ["ratechange"](#Player+event_ratechange)
    * ["resize"](#Player+event_resize)
    * ["volumechange"](#Player+event_volumechange)
    * ["firstplay"](#Player+event_firstplay)
    * ["fullscreenchange" (data)](#Player+event_fullscreenchange)
    * ["fullscreenerror"](#Player+event_fullscreenerror)
    * ["srcchange" (src)](#Player+event_srcchange)

<a name="Player+poster"></a>

### player.poster([poster]) ⇒ <code>boolean</code>
获取或设置 poster 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 poster 的值  

| Param | Type | Description |
| --- | --- | --- |
| [poster] | <code>string</code> | 封面图 |

<a name="Player+preload"></a>

### player.preload([preload]) ⇒ <code>boolean</code>
获取或设置 preload 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 preload 的值  

| Param | Type | Description |
| --- | --- | --- |
| [preload] | <code>string</code> | 自动下载策略，可选值为 none, metadata, auto |

<a name="Player+autoplay"></a>

### player.autoplay([autoplay]) ⇒ <code>boolean</code>
获取或设置 autoplay 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 autoplay 的值  

| Param | Type | Description |
| --- | --- | --- |
| [autoplay] | <code>boolean</code> | 是否自动播放，默认 false，由于浏览器策略，移动端大多无法自动播放 |

<a name="Player+loop"></a>

### player.loop([loop]) ⇒ <code>boolean</code>
获取或设置 loop 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 loop 的值  

| Param | Type | Description |
| --- | --- | --- |
| [loop] | <code>boolean</code> | 是否循环播放，默认 false |

<a name="Player+muted"></a>

### player.muted([muted]) ⇒ <code>boolean</code>
获取或设置 muted 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 muted 的值  

| Param | Type | Description |
| --- | --- | --- |
| [muted] | <code>boolean</code> | 是否静音，默认 false |

<a name="Player+defaultMuted"></a>

### player.defaultMuted([defaultMuted]) ⇒ <code>boolean</code>
获取或设置 defaultMuted 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 defaultMuted 的值  

| Param | Type | Description |
| --- | --- | --- |
| [defaultMuted] | <code>boolean</code> | 是否默认静音，默认 false |

<a name="Player+controls"></a>

### player.controls([controls]) ⇒ <code>boolean</code>
获取或设置 controls 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 controls 的值  

| Param | Type | Description |
| --- | --- | --- |
| [controls] | <code>boolean</code> | 是否显示控制条，默认 false |

<a name="Player+controlsList"></a>

### player.controlsList([controlsList]) ⇒ <code>DOMTokenList</code>
获取或设置 controlsList 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>DOMTokenList</code> - 不传参时返回当前 controlsList 的值  

| Param | Type | Description |
| --- | --- | --- |
| [controlsList] | <code>string</code> | 对控制条的一些设置，可选值为 nodownload, nofullscreen, noremoteplayback     比如 'nodownload nofullscreen' |

<a name="Player+playsinline"></a>

### player.playsinline([playsinline]) ⇒ <code>boolean</code>
获取或设置 playsinline 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 playsinline 的值  

| Param | Type | Description |
| --- | --- | --- |
| [playsinline] | <code>boolean</code> | 是否内联播放，IOS10 及以上有效，默认 true |

<a name="Player+playbackRate"></a>

### player.playbackRate([playbackRate]) ⇒ <code>boolean</code>
获取或设置 playbackRate 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 playbackRate 的值  

| Param | Type | Description |
| --- | --- | --- |
| [playbackRate] | <code>boolean</code> | 播放速率，默认为 1.0 |

<a name="Player+defaultPlaybackRate"></a>

### player.defaultPlaybackRate([defaultPlaybackRate]) ⇒ <code>boolean</code>
获取或设置 defaultPlaybackRate 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 defaultPlaybackRate 的值  

| Param | Type | Description |
| --- | --- | --- |
| [defaultPlaybackRate] | <code>boolean</code> | 默认播放速率，默认为 1.0 |

<a name="Player+volume"></a>

### player.volume([volume]) ⇒ <code>boolean</code>
获取或设置 volume 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 不传参时返回当前 volume 的值  

| Param | Type | Description |
| --- | --- | --- |
| [volume] | <code>boolean</code> | 播放速率，默认为 1，可选值为 0~1 |

<a name="Player+error"></a>

### player.error() ⇒ <code>MediaError</code> \| <code>null</code>
获取 error 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>MediaError</code> \| <code>null</code> - 出错时返回 MediaError 对象，否则返回 null  
**See**: https://html.spec.whatwg.org/multipage/media.html#mediaerror  
<a name="Player+currentSrc"></a>

### player.currentSrc() ⇒ <code>string</code>
获取 currentSrc 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>string</code> - 当前视频链接  
<a name="Player+networkState"></a>

### player.networkState() ⇒ <code>number</code>
获取 networkState 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 当前播放器的网络状态  
**See**: https://html.spec.whatwg.org/multipage/media.html#network-states  
<a name="Player+buffered"></a>

### player.buffered() ⇒ [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)
获取 buffered 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges) - 当前已缓冲的区间  
**See**: https://html.spec.whatwg.org/multipage/media.html#dom-media-buffered  
<a name="Player+readyState"></a>

### player.readyState() ⇒ <code>number</code>
获取 readyState 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 当前 readyState 的值  
**See**: https://html.spec.whatwg.org/multipage/media.html#dom-media-readystate  
<a name="Player+seeking"></a>

### player.seeking() ⇒ <code>boolean</code>
获取 seeking 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - seeking  
**See**: https://html.spec.whatwg.org/multipage/media.html#dom-media-seek  
<a name="Player+duration"></a>

### player.duration() ⇒ <code>number</code> \| <code>NaN</code>
获取 duration 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> \| <code>NaN</code> - 视频总时长  
<a name="Player+paused"></a>

### player.paused() ⇒ <code>boolean</code>
获取 paused 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 当前是否处于暂停状态  
<a name="Player+played"></a>

### player.played() ⇒ [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)
获取 played 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges) - 当前真正已播放过的时间范围，假设从时刻 A 直接跳到 B，A B 之间的时间并不算已经播放过  
<a name="Player+seekable"></a>

### player.seekable() ⇒ [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges)
获取 seekable 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: [<code>TimeRanges</code>](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges) - 当前可流畅切换的时间范围  
<a name="Player+ended"></a>

### player.ended() ⇒ <code>boolean</code>
获取 ended 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 是否已播放完成  
<a name="Player+videoWidth"></a>

### player.videoWidth() ⇒ <code>number</code> \| <code>NaN</code>
获取 videoWidth 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> \| <code>NaN</code> - 视频原始宽度（注意不是播放器宽度）  
<a name="Player+videoHeight"></a>

### player.videoHeight() ⇒ <code>number</code> \| <code>NaN</code>
获取 videoHeight 的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> \| <code>NaN</code> - 视频原始高度（注意不是播放器高度）  
<a name="Player+dispose"></a>

### player.dispose()
销毁播放器

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+width"></a>

### player.width([value]) ⇒ <code>number</code> \| <code>NaN</code>
获取或设置播放器的宽度

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> \| <code>NaN</code> - 不传参数则返回播放器当前宽度  

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>number</code> | 要设置的播放器宽度值，可选 |

<a name="Player+height"></a>

### player.height([value]) ⇒ <code>number</code> \| <code>NaN</code>
获取或设置播放器的高度

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> \| <code>NaN</code> - 不传参数则返回播放器当前高度  

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>number</code> | 要设置的播放器高度值，可选 |

<a name="Player+isFullscreen"></a>

### player.isFullscreen() ⇒ <code>boolean</code>
判断当前是否处于全屏状态

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 返回当前全屏状态  
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
加载当前视频的资源，一般不需手动调用，链接更新时会自动加载

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+reset"></a>

### player.reset()
重置播放器
会移除播放器的 src source 属性，并重置各 UI 样式

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+currentTime"></a>

### player.currentTime([seconds]) ⇒ <code>number</code>
获取／设置当前时间

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 不传参数则返回视频当前时刻  

| Param | Type | Description |
| --- | --- | --- |
| [seconds] | <code>number</code> | 以秒为单位，要设置的当前时间的值。可选 |

<a name="Player+remainingTime"></a>

### player.remainingTime() ⇒ <code>number</code>
获取视频剩下的时长

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> - 总时长 - 已播放时长 = 剩下的时长  
<a name="Player+bufferedEnd"></a>

### player.bufferedEnd() ⇒ <code>boolean</code>
判断当前视频是否已缓冲到最后

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>boolean</code> - 当前视频是否已缓冲到最后  
<a name="Player+src"></a>

### player.src([src]) ⇒ <code>string</code>
获取或设置当前视频的 src 属性的值

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>string</code> - 不传参数则返回当前视频的 src 或 currentSrc  

| Param | Type | Description |
| --- | --- | --- |
| [src] | <code>string</code> | 要设置的 src 属性的值，可选 |

<a name="Player+source"></a>

### player.source([source]) ⇒ <code>Array</code>
获取或设置播放器的 source

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Array</code> - 若不传参则获取 source 数据  

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>Array</code> | 视频源，可选 |

<a name="Player+event_loadstart"></a>

### "loadstart"
The user agent begins looking for media data

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-loadstart](https://html.spec.whatwg.org/multipage/media.html#event-media-loadstart) for detail  
<a name="Player+event_suspend"></a>

### "suspend"
The user agent is intentionally not currently fetching media data

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-suspend](https://html.spec.whatwg.org/multipage/media.html#event-media-suspend) for detail  
<a name="Player+event_abort"></a>

### "abort"
The user agent stops fetching the media data before it is completely downloaded, but not due to an error

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-abort](https://html.spec.whatwg.org/multipage/media.html#event-media-abort) for detail  
<a name="Player+event_error"></a>

### "error"
An error occurs while fetching the media data or the type of the resource is not supported media format

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-error](https://html.spec.whatwg.org/multipage/media.html#event-media-error) for detail  
<a name="Player+event_emptied"></a>

### "emptied"
A media element whose networkState was previously not in the NETWORK_EMPTY state has just switched to that state

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-emptied](https://html.spec.whatwg.org/multipage/media.html#event-media-emptied) for detail  
<a name="Player+event_stalled"></a>

### "stalled"
The user agent is trying to fetch media data, but data is unexpectedly not forthcoming

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-stalled](https://html.spec.whatwg.org/multipage/media.html#event-media-stalled) for detail  
<a name="Player+event_loadedmetadata"></a>

### "loadedmetadata"
The user agent has just determined the duration and dimensions of the media resource and the text tracks are ready

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-loadedmetadata](https://html.spec.whatwg.org/multipage/media.html#event-media-loadedmetadata) for detail  
<a name="Player+event_loadeddata"></a>

### "loadeddata"
The user agent can render the media data at the current playback position for the first time

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-loadeddata](https://html.spec.whatwg.org/multipage/media.html#event-media-loadeddata) for detail  
<a name="Player+event_canplay"></a>

### "canplay"
The user agent can resume playback of the media data, but estimates that if playback were to be started now, the media resource could not be rendered at the current playback rate up to its end without having to stop for further buffering of content

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-canplay](https://html.spec.whatwg.org/multipage/media.html#event-media-canplay) for detail  
<a name="Player+event_canplaythrough"></a>

### "canplaythrough"
The user agent estimates that if playback were to be started now, the media resource could be rendered at the current playback rate all the way to its end without having to stop for further buffering

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-canplaythrough](https://html.spec.whatwg.org/multipage/media.html#event-media-canplaythrough) for detail  
<a name="Player+event_playing"></a>

### "playing"
Playback is ready to start after having been paused or delayed due to lack of media data

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-playing](https://html.spec.whatwg.org/multipage/media.html#event-media-playing) for detail  
<a name="Player+event_waiting"></a>

### "waiting"
Playback has stopped because the next frame is not available, but the user agent expects that frame to become available in due course

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-waiting](https://html.spec.whatwg.org/multipage/media.html#event-media-waiting) for detail  
<a name="Player+event_seeking"></a>

### "seeking"
The seeking IDL attribute changed to true, and the user agent has started seeking to a new position

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-seeking](https://html.spec.whatwg.org/multipage/media.html#event-media-seeking) for detail  
<a name="Player+event_seeked"></a>

### "seeked"
The seeking IDL attribute changed to false after the current playback position was changed

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-seeked](https://html.spec.whatwg.org/multipage/media.html#event-media-seeked) for detail  
<a name="Player+event_ended"></a>

### "ended"
Playback has stopped because the end of the media resource was reached

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-ended](https://html.spec.whatwg.org/multipage/media.html#event-media-ended) for detail  
<a name="Player+event_durationchange"></a>

### "durationchange"
The duration attribute has just been updated

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-durationchange](https://html.spec.whatwg.org/multipage/media.html#event-media-durationchange) for detail  
<a name="Player+event_timeupdate"></a>

### "timeupdate"
The current playback position changed as part of normal playback or in an especially interesting way, for example discontinuously

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-timeupdate](https://html.spec.whatwg.org/multipage/media.html#event-media-timeupdate) for detail  
<a name="Player+event_progress"></a>

### "progress"
The user agent is fetching media data

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-progress](https://html.spec.whatwg.org/multipage/media.html#event-media-progress) for detail  
<a name="Player+event_play"></a>

### "play"
The element is no longer paused. Fired after the play() method has returned, or when the autoplay attribute has caused playback to begin

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-play](https://html.spec.whatwg.org/multipage/media.html#event-media-play) for detail  
<a name="Player+event_pause"></a>

### "pause"
The element has been paused. Fired after the pause() method has returned

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-pause](https://html.spec.whatwg.org/multipage/media.html#event-media-pause) for detail  
<a name="Player+event_ratechange"></a>

### "ratechange"
Either the defaultPlaybackRate or the playbackRate attribute has just been updated

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: https://html.spec.whatwg.org/multipage/media.html#event-media-ratechange  
<a name="Player+event_resize"></a>

### "resize"
One or both of the videoWidth and videoHeight attributes have just been updated

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-resize](https://html.spec.whatwg.org/multipage/media.html#event-media-resize) for detail  
<a name="Player+event_volumechange"></a>

### "volumechange"
Either the volume attribute or the muted attribute has changed. Fired after the relevant attribute's setter has returned

**Kind**: event emitted by [<code>Player</code>](#Player)  
**See**: html spec [event-media-volumechange](https://html.spec.whatwg.org/multipage/media.html#event-media-volumechange) for detail  
<a name="Player+event_firstplay"></a>

### "firstplay"
在视频第一次播放时触发，只会触发一次

**Kind**: event emitted by [<code>Player</code>](#Player)  
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
<a name="Player+event_srcchange"></a>

### "srcchange" (src)
srcchange 时触发

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | 更换后的视频地址 |

