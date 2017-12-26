<a name="module_obj"></a>

## obj
Object 相关方法

**Date**: 2017/11/2  
**Author**: yuhui06@baidu.com  

* [obj](#module_obj)
    * _static_
        * [.isObject(value)](#module_obj.isObject) ⇒ <code>boolean</code>
        * [.isPlain(value)](#module_obj.isPlain) ⇒ <code>boolean</code>
        * [.each(obj, fn)](#module_obj.each)
    * _inner_
        * [~obj:EachCallback](#module_obj..obj_EachCallback) : <code>function</code>

<a name="module_obj.isObject"></a>

### obj.isObject(value) ⇒ <code>boolean</code>
1) typeof null 的值是 object

**Kind**: static method of [<code>obj</code>](#module_obj)  
**Returns**: <code>boolean</code> - 该变量是否是对象  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Mixed</code> | 待检查的变量 |

<a name="module_obj.isPlain"></a>

### obj.isPlain(value) ⇒ <code>boolean</code>
判断一个变量是否是“纯粹”的对象

**Kind**: static method of [<code>obj</code>](#module_obj)  
**Returns**: <code>boolean</code> - 该变量是否是纯粹的对象  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Mixed</code> | 任意 js 变量 |

<a name="module_obj.each"></a>

### obj.each(obj, fn)
迭代对象

**Kind**: static method of [<code>obj</code>](#module_obj)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | 要迭代的对象 |
| fn | <code>EachCallback</code> | 每次迭代时调用的函数，具体参见 EachCallback 定义 |

<a name="module_obj..obj_EachCallback"></a>

### obj~obj:EachCallback : <code>function</code>
**Kind**: inner typedef of [<code>obj</code>](#module_obj)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Mixed</code> | 对象目前的 key 所对应的值 |
| key | <code>string</code> | 对象目前的 key |

