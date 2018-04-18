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
<dt><a href="#on">on(elem, type, fn)</a></dt>
<dd><p>向元素注册监听函数</p>
</dd>
<dt><a href="#trigger">trigger(elem, event, hash)</a></dt>
<dd><p>触发事件</p>
</dd>
<dt><a href="#off">off(elem, type, [fn])</a></dt>
<dd><p>1) 请按照参数顺序传参数</p>
</dd>
<dt><a href="#one">one(elem, type, fn)</a></dt>
<dd><p>在指定事件下，只触发指定函数一次</p>
</dd>
</dl>

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

## on(elem, type, fn)
向元素注册监听函数

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> \| <code>Object</code> | 要绑定事件的元素 |
| type | <code>string</code> \| <code>Array</code> | 事件类型，可以是数组的形式 |
| fn | <code>function</code> | 要注册的回调函数 |

<a name="trigger"></a>

## trigger(elem, event, hash)
触发事件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | 宿主元素 |
| event | <code>string</code> | 事件类型 |
| hash | <code>Mixed</code> | 事件触发时，传入的数据 |

<a name="off"></a>

## off(elem, type, [fn])
1) 请按照参数顺序传参数

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | 要移除事件的元素 |
| type | <code>string</code> \| <code>Array</code> | 事件类型。可选，如果没有 type 参数，则移除该元素上所有的事件 |
| [fn] | <code>function</code> | 要移除的指定的函数。可选，如果没有此参数，则移除该 type 上的所有事件 |

<a name="one"></a>

## one(elem, type, fn)
在指定事件下，只触发指定函数一次

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | 要绑定事件的元素 |
| type | <code>string</code> \| <code>Array</code> | 绑定的事件类型 |
| fn | <code>function</code> | 注册的回调函数 |

