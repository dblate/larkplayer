## Members

<dl>
<dt><a href="#isPassiveSupported">isPassiveSupported</a></dt>
<dd><p>是否支持 passive event listeners
passive event listeners 可以提升页面的滚动性能</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#目前">目前</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#cleanUpEvents">cleanUpEvents(elem, type)</a></dt>
<dd><p>清理事件相关的数据(Clean up the listener cache and dispatchers)</p>
</dd>
<dt><a href="#handleMultipleEvents">handleMultipleEvents(func, elem, types, callback)</a></dt>
<dd><p>循环 types 数组，给每个 type 都执行指定的方法</p>
<p>将需要在不同函数里执行的循环操作抽离出来</p>
</dd>
<dt><a href="#fixEvent">fixEvent(event)</a> ⇒ <code>Object</code></dt>
<dd><p>修复事件，使其具有标准的属性</p>
</dd>
<dt><a href="#on">on(要绑定事件的元素／对象，这里允许, 事件类型，可以是数组的形式, fn)</a></dt>
<dd><p>向元素注册监听函数</p>
</dd>
<dt><a href="#trigger">trigger(事件类型, hash)</a></dt>
<dd><p>触发事件</p>
</dd>
<dt><a href="#off">off(elem, 事件类型。可选，如果没有, [要移除的指定的函数。可选，如果没有此参数，则移除该])</a></dt>
<dd><p>1) 请按照参数顺序传参数</p>
</dd>
<dt><a href="#one">one(elem, type, 注册的回调函数)</a></dt>
<dd><p>在指定事件下，只触发指定函数一次</p>
</dd>
</dl>

<a name="isPassiveSupported"></a>

## isPassiveSupported
是否支持 passive event listeners
passive event listeners 可以提升页面的滚动性能

**Kind**: global variable  
**See**: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md  
<a name="目前"></a>

## 目前
**Kind**: global constant  
<a name="cleanUpEvents"></a>

## cleanUpEvents(elem, type)
清理事件相关的数据(Clean up the listener cache and dispatchers)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | 待清理的元素 |
| type | <code>string</code> | 待清理的事件类型 |

<a name="handleMultipleEvents"></a>

## handleMultipleEvents(func, elem, types, callback)
循环 types 数组，给每个 type 都执行指定的方法

将需要在不同函数里执行的循环操作抽离出来

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | 要循环执行的函数 |
| elem | <code>Element</code> | 宿主元素 |
| types | <code>Array</code> | 类型数组 |
| callback | <code>function</code> | 要注册的回调函数 |

<a name="fixEvent"></a>

## fixEvent(event) ⇒ <code>Object</code>
修复事件，使其具有标准的属性

**Kind**: global function  
**Returns**: <code>Object</code> - 修复后的事件  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Event</code> \| <code>Object</code> | 待修复的事件 |

<a name="on"></a>

## on(要绑定事件的元素／对象，这里允许, 事件类型，可以是数组的形式, fn)
向元素注册监听函数

**Kind**: global function  
**Todo**

- [ ] explain


| Param | Type | Description |
| --- | --- | --- |
| 要绑定事件的元素／对象，这里允许 | <code>Element</code> \| <code>Object</code> | Object 是考虑到后面讲事件处理作为一种能力赋予任何一个对象 |
| 事件类型，可以是数组的形式 | <code>string</code> \| <code>Array</code> |  |
| fn | <code>function</code> | 要注册的回调函数 |

<a name="trigger"></a>

## trigger(事件类型, hash)
触发事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| 事件类型 | <code>string</code> |  |
| hash | <code>Mixed</code> | 事件触发时，传入的数据 |

<a name="off"></a>

## off(elem, 事件类型。可选，如果没有, [要移除的指定的函数。可选，如果没有此参数，则移除该])
1) 请按照参数顺序传参数

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | 要移除事件的元素 |
| 事件类型。可选，如果没有 | <code>string</code> \| <code>Array</code> | type 参数，则移除该元素上所有的事件 |
| [要移除的指定的函数。可选，如果没有此参数，则移除该] | <code>function</code> | type 上的所有事件 |

<a name="one"></a>

## one(elem, type, 注册的回调函数)
在指定事件下，只触发指定函数一次

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | 要绑定事件的元素 |
| type | <code>string</code> \| <code>Array</code> | 绑定的事件类型 |
| 注册的回调函数 | <code>function</code> |  |

