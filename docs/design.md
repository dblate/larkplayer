# 设计文档

## 背景

业务发展需要

调研社区播放器，有挺多不错的播放器，但是有一些点不太适合我们：

* 与某些大型库强绑定
    * 比如 jQuery React 等
* 功能揉在一起
    * 随着业务的发展，不同功能叠加在一起势必是不可取的
    * 不同场景需求不同

其实 [videojs](https://github.com/videojs)(还有几个类似的)做的挺不错，但是有几点让我觉得不太舒服：

* 核心模块中有一半以上的代码是我们用不上的（是有点死脑经哈 :) ）
* UI 模块编写不方便
    * UI 是用户最直观的感受之一，这不得不让我们重视

那就自己动手，丰衣足食咯

当然也不是完全重新造轮子，社区已有的功能实现拿来用即可，在我们关心的方面多雕琢下就行了

## 名词解释

* MSE: [Media Source Extension](https://www.w3.org/TR/media-source/)
* larkplayer: 播放器名称 :)

## 设计目标

* 功能稳定且强大
    * 尽量少出 bug
    * 该有的功能得有
* 灵活扩展
    * 方便地添加／删除功能
    * 方便地自定义 UI

## 设计思路及折衷

### 设计思路

对业务而言，播放器无非两部分：功能和样式

两者本身的质量自然是不可忽视的，而另一方面就是如何让它们更灵活了。不管是自己用还是给别人用，场景总是在变的，在改变中存活下来甚至变得更好，这是最重要的

功能和样式的质量只能看基本功了。而灵活方面，也已经早有先驱了，那就是 __插件的机制__

从大的角度看，播放器以后将如下图一样，包含它的核心模块以及它的插件们

[img]

### 折衷

这个折衷其实是名字的折衷

按照上述设计思路，larkplayer 应该只包含核心功能，它的样式应该以 larkplayer-ui-default 之类的形势提供。但是播放器样式在我们业务中实在太常用了，因此打算将包含默认样式的播放器叫 larkplayer，真正的核心模块就叫 larkplayer-kernel 好了，给那些完全不需要我们样式，想要自己重新定制的朋友们提供


## 设计

### 基本介绍

[初始化参数及提供的 api](https://github.com/dblate/larkplayer/blob/master/docs/player.md)

### 结构图及说明

如下图所示，播放器主要由以下几个模块组成：

* Html5 处理 html5 video 兼容性问题，自定义 api
* Event 事件机制，代理原生事件并提供自定义事件的能力
* Plugin 插件机制，为不同类型的插件提供接口及运行机制
* Helper 辅助模块

[img]

### 流程图

需要吗？

### 各模块介绍

#### Html5

* html5 video 兼容性处理，如全屏等
* 自定义 api

跟 Html5 类似，还可以建立一个 Flash 模块，然后再在上面搭一层，处理 Html5 和 Flash 的切换，即可同时支持这两种技术。但按照目前的趋势来看，不考虑支持 Flash，暂时按下不表

#### Event

Event 算是比较核心的一个模块。由于涉及到对原生事件的代理，因此跟 [EventEmitter](https://github.com/Olical/EventEmitter) 还是有所差别，还需要结合浏览器提供的事件（addEventLister 等）

特点：

* 代理系统事件
    * 提供 on off one trigger 方法
    * 能通过用户交互触发，也能手动触发
* 允许自定义事件
    * 自定义事件名及参数
    * 有类似原生事件的冒泡机制（仅在 Event 绑定的元素和事件间有效）

支持的参数，见[player api 中 event 相关](https://github.com/dblate/larkplayer/blob/master/docs/player.md#Player+event_suspend)

这里直接使用的 videojs 中的 event 实现，下面还是让我厚着脸皮来讲一下思路吧

##### 总体介绍

数据：

有类似下面的结构即可，能通过元素找到对应的事件及回调函数

```javascript
{
    el: {
        click: [func1, func2],
        mouseover: [func3]
    }
}
```

方法：

* 通过对数据的查询与更新实现事件的手动绑定与触发
* 通过浏览器提供的方法绑定事件，使得用户交互也可以触发
* 设计与原生 event 对象类似的参数以实现冒泡的效果

##### 流程图

给一个 on 和 trigger 的流程图（由于 off 与 on 类似，one 可以经由 on 与 off 简单组合实现，故不予详述）

on

[img]

trigger

[img]

### Plugin

插件模块是命根子，目前插件分为 3 类：

* UI 插件，样式相关
* MediaSource 插件，基于 MSE 提供更多视频格式支持
* Plugin 其他插件


#### UI 插件

__特点__

* 与 DOM 交互
* 与播放器交互
* 组件化
    * 逻辑与视图的结合（就没有搞数据驱动了，我可不想搞着搞着去重新设计一个 MVVM 框架，我也设计不出来..）
    * 组件间组合

__实现__

提供 Component 类：

* 构造函数
    * 接收 player 和 props 参数
    * 提供 this.player 与播放器交互
    * 提供 this.options 获取组件参数
    * 提供 this.el 指向组件 DOM 元素
    * 组件的逻辑写在构造函数里（别说了，没有其他生命周期）
* 方法
    * createEl: 返回组件 DOM 元素，为了写起来方便，提供 jsx 语法支持 :)
    * dispose: 销毁组件
    * static createElement: 用于实现组件间组合，不过通过 js 手写实在是不方便，已经通过 jsx 语法糖掩盖（突然感觉有点像巧克力味的屎）
    * static register 绑定组件
* 其他
    * larkplayer 有一些工具方法提供，编写插件时会方便点
        * DOM 提供一些对 DOM 的便捷操作
        * Events 提供事件相关方法


__如何编写插件__

* 继承 Component 类并实现 createEl dispose 方法，在构造函数中书写组件逻辑
* 通过 Component.register(class, options) 绑定插件（插件名默认为首字母小写的类名，options.name 可手动指定插件名）
* 播放器初始化时通过 options.UI.name传递参数
* 播放器初始化完成后通过 player.UI.name 访问插件实例

详见 [《UI 插件编写示例》]()

__初始化时机__

播放器构造函数中初始化，所有绑定的组件都会被渲染并添加到播放器 DOM 容器中

__注意事项__

* 如果要选择 this.el 的子元素，需要将上下文设置为 this.el，因为此时元素还未被插入到 html 中

#### MediaSource 插件

__特点__

影响播放器对视频资源的解析及播放

__实现__

提供 MediaSourceHandler 类

* 构造函数
    * 接收 player 和 options 参数
    * 提供 this.player 与播放器交互
    * 提供 this.options 接收参数
* 方法
    * src: 处理视频资源
    * play: 播放视频
    * dispose: 销毁插件
    * static canPlay: 判断能否支持当前视频类型
    * static select: 筛选能支持当前视频类型的插件
    * static register: 绑定插件

__如何编写插件__

* 继承 MediaSourceHandler 类并实现 src play dispose 方法，以及 canPlay 静态方法
* 通过 MediaSourceHandler.register(class, options) 绑定（插件名默认为首字母小写的类名，options.name 可手动指定插件名）
* 播放器初始化时通过 options.MS.name传递参数

详见 [《MediaSource 插件编写》]()

__初始化及调用时机__

* 播放器初始化时，如果存在视频资源，则选择合适的插件处理视频
* 视频链接改变时，选择合适的插件处理视频
* 视频播放时，如果当前有 MediaSource 插件正在运行，优先调用插件的 play 方法

#### 普通插件

__特点__

没想好有什么特点，姑且认为他们只是简单的调用播放器的 api，比如从上次播放的位置继续播放之类的

__实现__

提供 Plugin 类

* 构造函数
    * 接收 player options 参数
    * 提供 this.player
    * 提供 this.options
* 方法
    * dispose: 销毁插件
    * static register: 静态方法，绑定插件

__如何编写插件__

* 继承 Plugin 类，并实现 dispose 方法
* 通过 Plugin.register(class, options) 绑定，options.name 可指定插件名（插件名默认为首字母小写的类名，options.name 可手动指定插件名）
* 播放器初始化时通过 options.plugin.name 传递参数
* 播放器初始化完成后通过 player.plugin.name 访问插件实例

详见 [《普通插件编写》]()

__初始化时机__

播放器构造函数中初始化插件

#### plugin store

有负责插件存取的方法即可，不予详述

#### Helper

Helper 这个名字不知道是否准确，拍脑袋想的

主要包含含非核心的模块或工具函数

* DOM: 操作 DOM 的一些便捷方法
* Log: 记录软件运行过程中的一系列事件和状态
    * 记录
    * 读取
* utils：工具函数集合


