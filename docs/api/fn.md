## Functions

<dl>
<dt><a href="#bind">bind(fn, thisArg)</a> ⇒ <code>function</code></dt>
<dd><p>绑定函数到指定的上下文</p>
</dd>
<dt><a href="#throttle">throttle(fn, wait)</a> ⇒ <code>Funtion</code></dt>
<dd><p>限制函数的执行的频率</p>
</dd>
</dl>

<a name="bind"></a>

## bind(fn, thisArg) ⇒ <code>function</code>
绑定函数到指定的上下文

**Kind**: global function  
**Returns**: <code>function</code> - 该函数会在指定的上下文中执行  
**Todo**

- [ ] videojs 在返回的函数上还加了 guid 做更加个性化的处理，目前暂时用不上就没写


| Param | Type | Description |
| --- | --- | --- |
| fn | <code>Funtion</code> | 要绑定上下文的函数 |
| thisArg | <code>Object</code> | 函数要绑定的上下文 |

<a name="throttle"></a>

## throttle(fn, wait) ⇒ <code>Funtion</code>
限制函数的执行的频率

**Kind**: global function  
**Returns**: <code>Funtion</code> - 限制了执行频率的函数  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | 要控制执行频率的函数 |
| wait | <code>number</code> | 函数的执行间隔大于等于此数值（单位：ms） |

