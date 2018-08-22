# 设计文档

## 背景

短视频业务兴起，web player 不可或缺，市面上已有的播放器太过"成熟"，一个 SDK 中包含了大而全的功能，动辄几百 KB。

在业务相对简单时，可能还需要费劲去剔除部分功能；在开发业务定制功能时，没有一个规范而舒适的方式来开发与组织，随着业务扩展代码难以管理。

因此设计这样一个简单并且易扩展的播放器，用以支持业务从简单到复杂的演变。

## 名词解释

* MSE: [Media Source Extension](https://www.w3.org/TR/media-source/), API allowing media data to be accessed from HTML video and audio elements

## 设计目标

 * 简单，对于简单的场景提供简单的解决方案，理解代码洁癖患者，同时避免不必要的维护成本
 * 易扩展，随着业务发展渐进增强

## 设计思路

* HTML5 技术选型，接口、属性、行为交互等方面参考 W3C WHATWG 标准
* 对内采用 DOM Event 作为通信机制
* 对外采用插件机制实现依赖反转，在播放器扩展时尽可能减少各功能间的耦合


## 播放器设计

### 基本介绍

[初始化参数及提供的 api](https://github.com/dblate/larkplayer/blob/master/docs/player.md)

### 结构图及说明

如下图所示，播放器主要由以下几个模块组成：

* Html5 处理 html5 video 兼容性问题，基于 video 已有的方法，提供自定义 api
* Event 事件机制，代理原生事件并提供自定义事件的能力
* Plugin 插件机制，为不同类型的插件提供接口及运行机制
* Helper 辅助模块

<img alt="larkplayer player structure" src="http://baikebcs.bdimg.com/front-end/larkplayer/larkplayer-player-structure.png" >

下面详细再介绍下 Event 和 Plugin 模块

### Event 模块

由于大量的事件都是通过与用户交互触发，因此直接使用 DOM 的 Event 机制即可

* 使用 addEventListener、removeEventListener 完成事件绑定与注销
* 使用 CustomEvent 实现自定义事件功能
* 使用 dispatchEvent 实现手动触发事件功能


### Plugin 模块

插件分为 3 类：

* UI 插件，样式相关
* MediaSource 插件，基于 MSE 提供更多视频格式支持
* 其他插件


#### UI 插件

__特点__

* 与 DOM 交互
* 与播放器交互
* 组件化
    * 逻辑与视图的结合
    * 组件间组合
    * 支持 jsx 语法，写起来方便点

__实现__

提供 Component 类：

* 构造函数
    * 接收 player 和 props 参数
    * 提供 this.player 与播放器交互
    * 提供 this.options 获取组件参数
    * 提供 this.el 指向组件 DOM 元素
    * 组件的逻辑写在构造函数里（别说了，没有其他生命周期）
* 方法
    * createEl: 返回组件 DOM 元素（提供 jsx 语法支持）
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
* 播放器初始化时通过 options.UI.name 传递参数
* 播放器初始化完成后通过 player.UI.name 访问插件实例

详见 [《UI 插件编写示例》](./plugin/ui-plugin-example.md)

__初始化时机__

播放器构造函数中初始化，所有绑定的组件都会被渲染并添加到播放器 DOM 容器中

__注意事项__

* 在组件构造函数中，如果要选择 this.el 的子元素，需要将上下文设置为 this.el，因为此时元素还未被插入到 html 中


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

详见 [《MediaSource 插件编写》](./plugin/media-source-plugin-example.md)

__初始化及调用时机__

* 播放器初始化时，如果存在视频资源，则选择合适的插件处理视频
* 视频链接改变时，选择合适的插件处理视频
* 视频播放时，如果当前有 MediaSource 插件正在运行，优先调用插件的 play 方法

#### 普通插件

__特点__

没想好有什么特点，姑且认为他们只是简单的调用播放器的 api，比如断点续播之类的

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

详见 [《普通插件编写》](./plugin/normal-plugin-example.md)

__初始化时机__

播放器构造函数中初始化插件

#### plugin store

有负责插件存取的方法即可，不予详述

