## UI 插件编写

### 如何编写

* 继承 Component 类并实现 createEl dispose 方法，在构造函数中书写组件逻辑
* 通过 Component.register(class, options) 绑定插件（插件名默认为首字母小写的类名，options.name 可手动指定插件名）
* 播放器初始化时通过 options.UI.name传递参数
* 播放器初始化完成后通过 player.UI.name 访问插件实例

Component:

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

### 使用 jsx

* 通过 [babel-plugin-transform-react-jsx](https://www.npmjs.com/package/babel-plugin-transform-react-jsx) 编译 jsx 语法
* 设置 pragma 参数为 Component.createElement
* 可参考 larkplayer Gruntfile.js


### 代码示例

一个错误提示插件如下所示，在播放器初始化时，ErrorDialog 将被添加进播放器 DOM 容器中

```javascript
    import {Component, DOM, Events} from 'larkplayer';

    class Dialog extends Component {
        constructor(player, options) {
            super(player, options);

            // 绑定下 this，否则 handleClose 方法中的 this 就指向该方法绑定的 DOM 元素上了
            this.handleClose = this.handleClose.bind(this);

            this.closeEl = DOM.$('.dialog__close', this.el);
            Events.on(this.closeEl, 'click', this.handleClose);
        }

        handleClose() {
            this.el.style.display = 'none';
        }

        createEl() {
            this.options = Object.assign({
                className: '',
                title: '',
                cnt: ''
            }, this.options);

            return (
                <div className={classnames('dialog', this.options.className)}>
                    <i className="dialog__close">close</i>
                    <h1 class="dialog__title">{this.options.title}</h1>
                    <p class="dialog__cnt">{this.options.cnt}</p>
                </div>
            );
        }
    }

    class ErrorDialog extends Component {
        constructor(player, options) {
            super(player, options);

            this.show = this.show.bind(this);
            this.player.on('error', this.show);
        }

        show(event) {
            this.el.style.display = 'block';
        }

        createEl() {
            return (
                <Dialog 
                    className={classnames('error-dialog', this.options.className)}
                    title="Error"
                    cnt="Video play error, plz try again later."
                />
            );
        }
    }

    // 绑定插件
    Component.register(ErrorDialog);

    // 在播放器初始化时传参
    const player = larkplayer('video-el', {
        UI: {
            // 插件名称默认为首字母小写的类名
            // 可通过 Component.register(ErrorDialog, {name: 'another_name'}) 指定名称
            errorDialog: {}
        }
    });

    // 播放器初始化后调用
    player.UI.errorDialog.show();

```