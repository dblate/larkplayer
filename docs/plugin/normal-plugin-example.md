## 普通插件


### 如何编写

* 继承 Plugin 类，并实现 dispose 方法
* 通过 Plugin.register(class, options) 绑定，options.name 可指定插件名（插件名默认为首字母小写的类名，options.name 可手动指定插件名）
* 播放器初始化时通过 options.plugin.name 传递参数
* 播放器初始化完成后通过 player.plugin.name 访问插件实例

Plugin:

* 构造函数
    * 接收 player options 参数
    * 提供 this.player
    * 提供 this.options
* 方法
    * dispose: 销毁插件
    * static register: 静态方法，绑定插件
    
### 代码示例

```javascript
    import larkplayer from 'larkplayer';

    const Plugin = larkplayer.Plugin;

    // 编写插件
    class Hello extends Plugin {
        constructor(player, options) {
            super(player, options);

            this.player.on('play', this.say);
        }

        say() {
            alert('hello!');
        }

        dispose() {
            this.player.off('play', this.say);
            super.dispose();
        }
    }

    // 注册插件
    Plugin.register(Hello, {name: 'hello'});

    // 传参（当然这个例子不需要参数..）
    const player = larkplayer('video-el', {
        plugin: {
            hello: {}
        }

    });

    // 访问插件（插件一般都不需要手动访问 & 控制）
    player.plugin.hello.say();
```
