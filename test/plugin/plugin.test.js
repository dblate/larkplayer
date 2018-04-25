/**
 * @file Plugin CHAJIAN CESHI
 * @author yuhui06
 * @date 2018/4/23
 */

describe('Plugin', function () {
    const Plugin = larkplayer.Plugin;

    beforeEach(function () {
        const html = `
            <div id="test-id">
                <div id="test-el1"></div>
                <div id="test-el2"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);
    });

    afterEach(function () {
        document.body.removeChild(document.getElementById('test-id'));
    });

    it('should be initialed and disposed with player', function () {
        let initialed = 0;
        let disposed = 0;
        class MyPlugin1 extends Plugin {
            constructor(player, options) {
                super(player, options);
                initialed++;
            }

            dispose() {
                disposed++;
                super.dispose();
            }
        }
        Plugin.register(MyPlugin1);

        const player = larkplayer('test-el1');
        expect(initialed).toBe(1);

        player.dispose();
        expect(disposed).toBe(1);
    });

    it('can be accessed by player.plugin[name]', function () {
        class MyPlugin2 extends Plugin {}
        class MyPlugin3 extends Plugin {}

        Plugin.register(MyPlugin2);
        Plugin.register(MyPlugin3, {name: 'my_plugin_3'});

        const player = larkplayer('test-el1');

        expect(player.plugin.myPlugin2 instanceof MyPlugin2).toBe(true);
        expect(player.plugin.my_plugin_3 instanceof MyPlugin3).toBe(true);
        expect(!!player.plugin.my_plugin_3.player).toBe(true);
        expect(!!player.plugin.my_plugin_3.options).toBe(true);

        player.dispose();
    });

    it('can pass options via options.plugin[name]', function () {
        let initialOptions;
        let pluginOptions = {
            email: 'yuhui06@gmail.com',
            title: 'default options'
        };
        class MyPlugin4 extends Plugin {
            constructor(player, options) {
                super(player, options);

                initialOptions = this.options;
            }
        }
        Plugin.register(MyPlugin4, {name: 'my_plugin_4'});

        const player = larkplayer('test-el1', {
            plugin: {
                my_plugin_4: pluginOptions
            }
        });

        expect(initialOptions).toEqual(jasmine.objectContaining(pluginOptions));

        player.dispose();
    });

});


