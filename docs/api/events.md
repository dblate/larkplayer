## Functions

<dl>
<dt><a href="#on">on(el, eventName, fn, [options])</a></dt>
<dd><p>绑定事件</p>
</dd>
<dt><a href="#off">off(el, eventName, fn, [options])</a></dt>
<dd><p>注销事件</p>
</dd>
<dt><a href="#one">one(el, eventName, fn, [options])</a></dt>
<dd><p>绑定事件且该事件只执行一次</p>
</dd>
<dt><a href="#trigger">trigger(el, eventName, [initialDict])</a></dt>
<dd><p>触发事件</p>
</dd>
</dl>

<a name="on"></a>

## on(el, eventName, fn, [options])
绑定事件

**Kind**: global function  
**Https://dom.spec.whatwg.org/#dictdef-eventlisteneroptions**: 查看其他可选项  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要绑定事件的 DOM 元素 |
| eventName | <code>string</code> | 事件名 |
| fn | <code>function</code> | 回调函数 |
| [options] | <code>Object</code> \| <code>boolean</code> | 事件触发方式设置。可选，默认为 false |

<a name="off"></a>

## off(el, eventName, fn, [options])
注销事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要注销事件的 DOM 元素 |
| eventName | <code>string</code> | 事件名 |
| fn | <code>function</code> | 要注销的函数名 |
| [options] | <code>Object</code> \| <code>boolean</code> | 事件触发方式设置 |

<a name="one"></a>

## one(el, eventName, fn, [options])
绑定事件且该事件只执行一次

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要绑定事件的 DOM 元素 |
| eventName | <code>string</code> | 事件名 |
| fn | <code>function</code> | 回调函数 |
| [options] | <code>Object</code> \| <code>boolean</code> | 事件触发方式设置。可选，默认为 false |

<a name="trigger"></a>

## trigger(el, eventName, [initialDict])
触发事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 触发事件的元素 |
| eventName | <code>string</code> | 事件名 |
| [initialDict] | <code>Object</code> | 一些其他设置，可选 |
| initialDict.bubbles | <code>boolean</code> | 是否冒泡，默认 false |
| initialDict.cancelable | <code>boolean</code> | 是否可取消，默认 false |
| initialDict.detail | <code>Mixed</code> | 随事件传递的自定义数据，默认 null |

