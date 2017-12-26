<a name="Player"></a>

## Player
**Kind**: global class  

* [Player](#Player)
    * [new Player(tag, [options], [ready])](#new_Player_new)
    * [.dispose()](#Player+dispose)
    * [.createEl()](#Player+createEl) ⇒ <code>Element</code>
    * [.reset()](#Player+reset)
    * [.paused()](#Player+paused) ⇒ <code>boolean</code>
    * [.played()](#Player+played) ⇒ <code>number</code>
    * [.currentTime([seconds])](#Player+currentTime) ⇒ <code>number</code> \| <code>undefined</code>
    * [.source([source])](#Player+source) ⇒ <code>Array</code> \| <code>undefined</code>

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
<a name="Player+createEl"></a>

### player.createEl() ⇒ <code>Element</code>
创建播放器 DOM （将 video 标签包裹在一层 div 中，全屏及添加其他子元素时需要）

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Element</code> - el 播放器 DOM  
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

### player.currentTime([seconds]) ⇒ <code>number</code> \| <code>undefined</code>
获取／设置 当前时间

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>number</code> \| <code>undefined</code> - 不传参时返回视频当前时刻；传参数时设置视频当前时刻，返回 undefined  

| Param | Type | Description |
| --- | --- | --- |
| [seconds] | <code>number</code> | 秒数，可选。                  传参则设置视频当前时刻                  不传参，则获取视频当前时刻 |

<a name="Player+source"></a>

### player.source([source]) ⇒ <code>Array</code> \| <code>undefined</code>
获取播放器 source 数据或者设置 source 标签

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Array</code> \| <code>undefined</code> - 若不传参则获取 source 数据；传参则设置 source 标签，返回 undefined  

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>Array</code> | 视频源，可选 |

