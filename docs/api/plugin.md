## Constants

<dl>
<dt><a href="#pluginStore">pluginStore</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#isPluginExist">isPluginExist(name)</a> ⇒ <code>boolean</code></dt>
<dd><p>判断 plugin 的名称是否已存在</p>
</dd>
<dt><a href="#getPlugin">getPlugin(name)</a> ⇒ <code>function</code></dt>
<dd><p>通过名称获取对应过的 plugin</p>
</dd>
<dt><a href="#registerPlugin">registerPlugin(name, plugin)</a></dt>
<dd><p>注册 plugin
此方法会被赋值到 larkplayer 上（larkplayer.registerPlugin = registerPlugin）
后续调用时，我们一般从 larkplayer 上调用</p>
</dd>
<dt><a href="#deregisterPlugin">deregisterPlugin(name)</a></dt>
<dd><p>注销 plugin</p>
</dd>
</dl>

<a name="pluginStore"></a>

## pluginStore
**Kind**: global constant  
<a name="isPluginExist"></a>

## isPluginExist(name) ⇒ <code>boolean</code>
判断 plugin 的名称是否已存在

**Kind**: global function  
**Returns**: <code>boolean</code> - 指定名称是否已存在  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | plugin 名称 |

<a name="getPlugin"></a>

## getPlugin(name) ⇒ <code>function</code>
通过名称获取对应过的 plugin

**Kind**: global function  
**Returns**: <code>function</code> - 要获取的 plugin  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 要获取的 plugin 的名称 |

<a name="registerPlugin"></a>

## registerPlugin(name, plugin)
注册 plugin
此方法会被赋值到 larkplayer 上（larkplayer.registerPlugin = registerPlugin）
后续调用时，我们一般从 larkplayer 上调用

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 要注册的 plugin 的名称 |
| plugin | <code>function</code> | 要注册的 plugin 函数。                   plugin 的 this 在运行时会被指定为 player |

<a name="deregisterPlugin"></a>

## deregisterPlugin(name)
注销 plugin

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>name</code> | 要注销的 plugin 名称 |

