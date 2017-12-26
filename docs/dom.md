## Constants

<dl>
<dt><a href="#$">$</a> ⇒ <code>Element</code> | <code>null</code></dt>
<dd><p>通过选择器和上下文（可选）找到一个指定元素</p>
</dd>
<dt><a href="#$$">$$</a> ⇒ <code>NodeList</code></dt>
<dd><p>通过选择器和上下文（可选）找到所有符合的元素</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isNonBlankString">isNonBlankString(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>检测一个字符串是否包含任何非空格的字符</p>
</dd>
<dt><a href="#throwIfWhitespace">throwIfWhitespace(str)</a></dt>
<dd><p>如果字符串中包含空格，则抛出错误</p>
</dd>
<dt><a href="#classRegExp">classRegExp(className)</a> ⇒ <code>Regexp</code></dt>
<dd><p>生成一个正则表达式，用于检查一个元素的 className 字符串中是否包含特定的 className</p>
</dd>
<dt><a href="#isReal">isReal()</a> ⇒ <code>boolean</code></dt>
<dd><p>是否处于浏览器环境中</p>
</dd>
<dt><a href="#isEl">isEl(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>判断一个变量是否是 DOM element</p>
</dd>
<dt><a href="#createQuerier">createQuerier(method)</a> ⇒ <code>function</code></dt>
<dd><p>创建一个 DOM 查询函数，这个函数在原有方法的基础上有额外的指定上下文的功能</p>
</dd>
<dt><a href="#createEl">createEl([tagName], [properties], [attributes], content)</a> ⇒ <code>Element</code></dt>
<dd><p>创建 DOM 元素</p>
</dd>
<dt><a href="#createElement">createElement(tagName, [props], child)</a> ⇒ <code>Element</code></dt>
<dd><p>创建一个元素，并能添加 props 和 子元素</p>
<p>vjs 的 createEl 将 props 和 attrs 分成了两个参数，但是我们的业务没必要这么做
而且每次想要传 child 参数的时候，还得先传 attrs 参数让我觉得很烦</p>
</dd>
<dt><a href="#textContent">textContent(el, text)</a> ⇒ <code>Element</code></dt>
<dd><p>更改 DOM 元素中的文本节点（整个文本内容都会被替换掉）</p>
</dd>
<dt><a href="#normalizeContent">normalizeContent(content)</a> ⇒ <code>Array</code></dt>
<dd><p>将要插入到 DOM 元素中的内容标准化</p>
<p>使用 createTextNode 而不是 createElement 避免 XSS 漏洞</p>
</dd>
<dt><a href="#isTextNode">isTextNode(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>判断一个变量是否是 textNode</p>
</dd>
<dt><a href="#prependTo">prependTo(child, parent)</a></dt>
<dd><p>将一个元素插入到另一个中作为第一个子元素</p>
</dd>
<dt><a href="#parent">parent(el, classForSelector)</a> ⇒ <code>Element</code> | <code>null</code></dt>
<dd><p>返回指定元素的最近的命中选择器的父元素</p>
</dd>
<dt><a href="#hasClass">hasClass(el, classToCheck)</a> ⇒ <code>boolean</code></dt>
<dd><p>检查指定元素是否包含指定 class</p>
</dd>
<dt><a href="#addClass">addClass(el, classToAdd)</a> ⇒ <code>Element</code></dt>
<dd><p>给指定元素增加 class</p>
</dd>
<dt><a href="#removeClass">removeClass(el, classToRemove)</a> ⇒ <code>Element</code></dt>
<dd><p>移除指定元素的指定 class</p>
</dd>
<dt><a href="#toggleClass">toggleClass(el, classToToggle, predicate)</a> ⇒ <code>Element</code></dt>
<dd><p>增加或删除一个元素上的指定的 class</p>
</dd>
<dt><a href="#setAttributes">setAttributes(el, attributes)</a></dt>
<dd><p>设置元素的属性</p>
</dd>
<dt><a href="#getAttributes">getAttributes(el)</a> ⇒ <code>Object</code></dt>
<dd><p>1) boolean 的属性，其值为 true/false</p>
</dd>
<dt><a href="#getAttribute">getAttribute(el, attribute)</a> ⇒ <code>string</code></dt>
<dd><p>获取元素的指定属性，element.getAttribute 换一种写法</p>
</dd>
<dt><a href="#setAttribute">setAttribute(el, attr, value)</a></dt>
<dd><p>设置元素的指定属性 element.setAttribute 换一种写法</p>
</dd>
<dt><a href="#removeAttribute">removeAttribute(el, attribute)</a></dt>
<dd><p>移除元素上的指定属性 element.removeAttribute 换一种写法</p>
</dd>
<dt><a href="#blockTextSelection">blockTextSelection()</a></dt>
<dd><p>当拖动东西的时候，尝试去阻塞选中文本的功能</p>
</dd>
<dt><a href="#unblockTextSelection">unblockTextSelection()</a></dt>
<dd><p>关闭对文本选中功能的阻塞</p>
</dd>
<dt><a href="#getBoundingClientRect">getBoundingClientRect(el)</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>同原生的 getBoundingClientRect 方法一样，确保兼容性</p>
<p>在一些老的浏览器（比如 IE8）提供的属性不够时，此方法会手动补全</p>
<p>另外，一些浏览器不支持向 ClientRect/DOMRect 对象中添加属性，所以我们选择创建一个新的对象，
并且把 ClientReact 中的标准属性浅拷贝过来（ x 和 y 没有拷贝，因为这个属性支持的并不广泛）</p>
</dd>
<dt><a href="#findPostion">findPostion(el)</a> ⇒ <code>Object</code></dt>
<dd><p>1) clientLeft/clientTop 获取一个元素的左/上边框的宽度，不包括 padding 和 margin 的值</p>
</dd>
<dt><a href="#getPointerPosition">getPointerPosition(el, event)</a> ⇒ <code><a href="#DOM..Coordinates">Coordinates</a></code></dt>
<dd><p>1) offsetWidth/offsetHeight: 元素宽／高，包括 border padding width/height scrollbar
     2) pageX/pageY: 点击的 x/y 坐标，相对于 document，是个绝对值（当有滚动条时会把滚动条的距离也计算在内）
     3) changedTouches: touch 事件中的相关数据</p>
</dd>
<dt><a href="#emptyEl">emptyEl(el)</a> ⇒ <code>Element</code></dt>
<dd><p>清空一个元素</p>
</dd>
<dt><a href="#appendContent">appendContent(el, content)</a> ⇒ <code>Element</code></dt>
<dd><p>向元素内插入内容</p>
</dd>
<dt><a href="#insertContent">insertContent(el, content)</a> ⇒ <code>Element</code></dt>
<dd><p>替换元素的内容
感觉名字起得不怎么好</p>
</dd>
<dt><a href="#replaceContent">replaceContent(el, content)</a> ⇒ <code>Element</code></dt>
<dd><p>同 insertContent
insertContent 是 vjs 里的函数，但我感觉名字起的不好，我想用这个</p>
</dd>
</dl>

<a name="$"></a>

## $ ⇒ <code>Element</code> \| <code>null</code>
通过选择器和上下文（可选）找到一个指定元素

**Kind**: global constant  
**Returns**: <code>Element</code> \| <code>null</code> - 被选中的元素或 null  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | css 选择器，反正最后都会被 querySelector 处理，你看着传吧 |
| 上下文环境。可选，默认为 | <code>Element</code> \| <code>string</code> | document |

<a name="$$"></a>

## $$ ⇒ <code>NodeList</code>
通过选择器和上下文（可选）找到所有符合的元素

**Kind**: global constant  
**Returns**: <code>NodeList</code> - 被选中的元素列表，如果没有符合条件的元素，空列表  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | css 选择器，反正最后都会被 querySelectorAll 处理，你看着传吧 |
| 上下文环境。可选，默认为 | <code>Element</code> \| <code>string</code> | document |

<a name="isNonBlankString"></a>

## isNonBlankString(str) ⇒ <code>boolean</code>
检测一个字符串是否包含任何非空格的字符

**Kind**: global function  
**Returns**: <code>boolean</code> - 是否包含非空格的字符  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | 待检查的字符串 |

<a name="throwIfWhitespace"></a>

## throwIfWhitespace(str)
如果字符串中包含空格，则抛出错误

**Kind**: global function  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | 待检查的字符串 |

<a name="classRegExp"></a>

## classRegExp(className) ⇒ <code>Regexp</code>
生成一个正则表达式，用于检查一个元素的 className 字符串中是否包含特定的 className

**Kind**: global function  
**Returns**: <code>Regexp</code> - 用于检查该类名是否存在于一个元素的 className 字符串中  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | 就是为了他！ |

<a name="isReal"></a>

## isReal() ⇒ <code>boolean</code>
是否处于浏览器环境中

**Kind**: global function  
<a name="isEl"></a>

## isEl(value) ⇒ <code>boolean</code>
判断一个变量是否是 DOM element

**Kind**: global function  
**Returns**: <code>boolean</code> - 是否是 DOM element  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Mixed</code> | 待检查的变量 |

<a name="createQuerier"></a>

## createQuerier(method) ⇒ <code>function</code>
创建一个 DOM 查询函数，这个函数在原有方法的基础上有额外的指定上下文的功能

**Kind**: global function  
**Returns**: <code>function</code> - 查询 DOM 用的函数  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | 方法名 |

<a name="createEl"></a>

## createEl([tagName], [properties], [attributes], content) ⇒ <code>Element</code>
创建 DOM 元素

**Kind**: global function  
**Returns**: <code>Element</code> - el 创建的元素  

| Param | Type | Description |
| --- | --- | --- |
| [tagName] | <code>string</code> | 元素类型。可选，默认 div |
| [properties] | <code>Object</code> | 元素 prop 属性。可选，默认无 |
| [attributes] | <code>Object</code> | 元素 attr 属性。可选，默认无 |
| content | <code>string</code> \| <code>Element</code> \| <code>TextNode</code> \| <code>Array</code> \| <code>function</code> | 元素内容。可选，默认无 |

<a name="createElement"></a>

## createElement(tagName, [props], child) ⇒ <code>Element</code>
创建一个元素，并能添加 props 和 子元素

vjs 的 createEl 将 props 和 attrs 分成了两个参数，但是我们的业务没必要这么做
而且每次想要传 child 参数的时候，还得先传 attrs 参数让我觉得很烦

**Kind**: global function  
**Returns**: <code>Element</code> - el 创建的元素  
**Todo**

- [ ] 先写一个这个函数自己用，后面看有没有必要把 createEl 函数换掉


| Param | Type | Description |
| --- | --- | --- |
| tagName | <code>string</code> | DOM 元素标签名 |
| [props] | <code>Object</code> | 要到 DOM 元素上的属性。注意，这里直接是 el.propName = value 的形式，如果涉及到 attrs，建议后续用 setAttrbute 自己添加 |
| child | <code>Element</code> \| <code>string</code> | 元素的子元素，参数个数不限。可以没有，也可以有多个 |

<a name="textContent"></a>

## textContent(el, text) ⇒ <code>Element</code>
更改 DOM 元素中的文本节点（整个文本内容都会被替换掉）

**Kind**: global function  
**Returns**: <code>Element</code> - el 更改后的 DOM 元素  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 将要改变文本节点的 DOM 元素 |
| text | <code>string</code> | 要添加的文本 |

<a name="normalizeContent"></a>

## normalizeContent(content) ⇒ <code>Array</code>
将要插入到 DOM 元素中的内容标准化

使用 createTextNode 而不是 createElement 避免 XSS 漏洞

**Kind**: global function  
**Returns**: <code>Array</code> - 标准化后的内容  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> \| <code>Element</code> \| <code>TextNode</code> \| <code>Array</code> \| <code>function</code> | - string: 标准化为 text node        - Element/TextNode: 不做任何处理        - Array: 遍历处理数组元素        - Function: 先运行得到结果再处理 |

<a name="isTextNode"></a>

## isTextNode(value) ⇒ <code>boolean</code>
判断一个变量是否是 textNode

**Kind**: global function  
**Returns**: <code>boolean</code> - 是否是 textNode  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Mixed</code> | 待检查的变量 |

<a name="prependTo"></a>

## prependTo(child, parent)
将一个元素插入到另一个中作为第一个子元素

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| child | <code>Element</code> | 最终的子元素 |
| parent | <code>Element</code> | 最终的父元素 |

<a name="parent"></a>

## parent(el, classForSelector) ⇒ <code>Element</code> \| <code>null</code>
返回指定元素的最近的命中选择器的父元素

**Kind**: global function  
**Returns**: <code>Element</code> \| <code>null</code> - 选择器命中的最近的父元素列表  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要寻找父元素的指定元素 |
| classForSelector | <code>string</code> | 目前只支持 class 选择器 |

<a name="hasClass"></a>

## hasClass(el, classToCheck) ⇒ <code>boolean</code>
检查指定元素是否包含指定 class

**Kind**: global function  
**Returns**: <code>boolean</code> - 元素上是否包含指定 class  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 宿主元素 |
| classToCheck | <code>string</code> | 待检查的 class |

<a name="addClass"></a>

## addClass(el, classToAdd) ⇒ <code>Element</code>
给指定元素增加 class

**Kind**: global function  
**Returns**: <code>Element</code> - 添加完 class 后的元素  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要添加 class 的元素 |
| classToAdd | <code>string</code> | 要添加的 class |

<a name="removeClass"></a>

## removeClass(el, classToRemove) ⇒ <code>Element</code>
移除指定元素的指定 class

**Kind**: global function  
**Returns**: <code>Element</code> - 移除指定 class 后的元素  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要移除 class 的元素 |
| classToRemove | <code>string</code> | 要移除的 class |

<a name="toggleClass"></a>

## toggleClass(el, classToToggle, predicate) ⇒ <code>Element</code>
增加或删除一个元素上的指定的 class

**Kind**: global function  
**Returns**: <code>Element</code> - 改变完 class 后的元素  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 将要改变 class 的元素 |
| classToToggle | <code>string</code> | 要添加或删除的 class |
| predicate | <code>function</code> \| <code>boolean</code> | 添加或删除 class 的依据（额外的判断条件） |

<a name="setAttributes"></a>

## setAttributes(el, attributes)
设置元素的属性

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要设置属性的元素 |
| attributes | <code>Object</code> | 要设置的属性集合 |

<a name="getAttributes"></a>

## getAttributes(el) ⇒ <code>Object</code>
1) boolean 的属性，其值为 true/false

**Kind**: global function  
**Returns**: <code>Object</code> - 以 key/value 形式存储的属性  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要获取属性的元素 |

<a name="getAttribute"></a>

## getAttribute(el, attribute) ⇒ <code>string</code>
获取元素的指定属性，element.getAttribute 换一种写法

**Kind**: global function  
**Returns**: <code>string</code> - 获取的属性值  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要获取属性的元素 |
| attribute | <code>string</code> | 要获取的属性名 |

<a name="setAttribute"></a>

## setAttribute(el, attr, value)
设置元素的指定属性 element.setAttribute 换一种写法

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要设置属性的元素 |
| attr | <code>string</code> | 要设置的属性 |
| value | <code>Mixed</code> | 要设置的属性的值 |

<a name="removeAttribute"></a>

## removeAttribute(el, attribute)
移除元素上的指定属性 element.removeAttribute 换一种写法

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要移除属性的元素 |
| attribute | <code>string</code> | 要移除的属性名 |

<a name="blockTextSelection"></a>

## blockTextSelection()
当拖动东西的时候，尝试去阻塞选中文本的功能

**Kind**: global function  
<a name="unblockTextSelection"></a>

## unblockTextSelection()
关闭对文本选中功能的阻塞

**Kind**: global function  
<a name="getBoundingClientRect"></a>

## getBoundingClientRect(el) ⇒ <code>Object</code> \| <code>undefined</code>
同原生的 getBoundingClientRect 方法一样，确保兼容性

在一些老的浏览器（比如 IE8）提供的属性不够时，此方法会手动补全

另外，一些浏览器不支持向 ClientRect/DOMRect 对象中添加属性，所以我们选择创建一个新的对象，
并且把 ClientReact 中的标准属性浅拷贝过来（ x 和 y 没有拷贝，因为这个属性支持的并不广泛）

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要获取 ClientRect 对象的元素 |

<a name="findPostion"></a>

## findPostion(el) ⇒ <code>Object</code>
1) clientLeft/clientTop 获取一个元素的左/上边框的宽度，不包括 padding 和 margin 的值

**Kind**: global function  
**Returns**: <code>Object</code> - 包含位置信息的对象  
**See**: http://ejohn.org/blog/getboundingclientrect-is-awesome/  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要获取位置的元素 |

<a name="getPointerPosition"></a>

## getPointerPosition(el, event) ⇒ [<code>Coordinates</code>](#DOM..Coordinates)
1) offsetWidth/offsetHeight: 元素宽／高，包括 border padding width/height scrollbar
     2) pageX/pageY: 点击的 x/y 坐标，相对于 document，是个绝对值（当有滚动条时会把滚动条的距离也计算在内）
     3) changedTouches: touch 事件中的相关数据

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 被点击的元素 |
| event | <code>Event</code> | 点击事件 |

<a name="emptyEl"></a>

## emptyEl(el) ⇒ <code>Element</code>
清空一个元素

**Kind**: global function  
**Returns**: <code>Element</code> - 移除所有子元素后的元素  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 要清空的元素 |

<a name="appendContent"></a>

## appendContent(el, content) ⇒ <code>Element</code>
向元素内插入内容

**Kind**: global function  
**Returns**: <code>Element</code> - 被塞了新内容的元素  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 父元素 |
| content | <code>string</code> \| <code>Element</code> \| <code>TextNode</code> \| <code>Array</code> \| <code>function</code> | 待插入的内容，会先经过 normalizeContent 处理 |

<a name="insertContent"></a>

## insertContent(el, content) ⇒ <code>Element</code>
替换元素的内容
感觉名字起得不怎么好

**Kind**: global function  
**Returns**: <code>Element</code> - el 替换内容后的元素  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 父元素 |
| content | <code>string</code> \| <code>Element</code> \| <code>TextNode</code> \| <code>Array</code> \| <code>function</code> | 参见 normalizeContent 中参数描述 {@link: dom:normalizeContent} |

<a name="replaceContent"></a>

## replaceContent(el, content) ⇒ <code>Element</code>
同 insertContent
insertContent 是 vjs 里的函数，但我感觉名字起的不好，我想用这个

**Kind**: global function  
**Returns**: <code>Element</code> - el 替换内容后的元素  
**Todo**

- [ ] 看可不可以直接把 insertContent 函数去掉（需考虑到后续对 vjs 插件的影响）;


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | 父元素 |
| content | <code>string</code> \| <code>Element</code> \| <code>TextNode</code> \| <code>Array</code> \| <code>function</code> | 参见 normalizeContent 中参数描述 {@link: dom:normalizeContent} |

