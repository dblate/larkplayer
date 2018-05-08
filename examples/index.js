/**
 * @file larkplayer with plugins demo
 * @author yuhui06
 * @date 2018/5/8
 */

function loadJs(src) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.onload = function () {
            resolve(src + ' load success!');
        }
        script.onerror = function () {
            reject(src + ' load fail..');
        }

        document.head.appendChild(script);
    });
}

function loadCss(href) {
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.onload = function () {
            resolve(href + ' load success!');
        }
        link.onerror = function () {
            reject(href + ' load fail..');
        }

        document.head.appendChild(link);
    });
}

function loadScript(src) {
    return /\.js/.test(src) ? loadJs(src) : loadCss(src);
}

function getResult(resource) {
    var result = []
    for (var plugin in resource) {
        if (resource[plugin].length) {
            // result = result.concat(resource[plugin].map(src => loadScript(src).then(value => )));
            result = result.concat(resource[plugin].map(src => {
                var logContainer = larkplayer.DOM.$('#log');
                var logEl = larkplayer.DOM.createElement('div', {
                    className: 'downloading'
                }, 'Downloading ' + src + ' ...');
                logContainer.appendChild(logEl);

                return loadScript(src).then(value => {
                    var logEl = larkplayer.DOM.createElement('div', {
                        className: 'downloaded'
                    }, 'Download ' + src + ' completed!');
                    logContainer.appendChild(logEl);
                });
            }));
        }
    }
    return result;
}

function loadAllPlugins() {
    return Promise.all(getResult(getResource()));
}

function getResource() {
    return JSON.parse(localStorage.getItem('plugin-resource') || '{}');
}

var player;
var playUrlInput = larkplayer.DOM.$('#play-url');
function initialPlayer() {
    var width = Math.min(document.body.clientWidth, 640);
    player = larkplayer('player', {
        width: width,
        height: width * 9 / 16,
        src: playUrlInput.value,
        controls: true,
        loop: true
    });
}

function updateCheckbox() {
    var resource = getResource();
    var checkboxList = larkplayer.DOM.$$('.plugin-list__plugin');
    for (var i = 0; i < checkboxList.length; i++) {
        var name = checkboxList[i].getAttribute('name');
        if (resource[name] && resource[name].length) {
            checkboxList[i].checked = true;
        } else {
            checkboxList[i].checked = false;
        }
    }
}

function bindEvents() {
    // checkbox
    var timeouthandler = null;
    var checkboxList = larkplayer.DOM.$$('.plugin-list__plugin');
    for (var i = 0; i < checkboxList.length; i++) {
        var resource = getResource();

        checkboxList[i].addEventListener('change', function () {
            var scriptUrl = this.getAttribute('script-url').split(',');
            var name = this.getAttribute('name');
            resource[name] = resource[name] || [];

            if (this.checked) {
                scriptUrl.forEach(url => (!resource[name].includes(url) && resource[name].push(url)));
            } else {
                scriptUrl.forEach(url => {resource[name] = resource[name].filter(src => src !== url)});
            }

            localStorage.setItem('plugin-resource', JSON.stringify(resource));

            clearTimeout(timeouthandler);
            timeouthandler = setTimeout(function () {
                location.reload();
            }, 1500);
        }, false);
    }

    // input
    var playUrlInput = larkplayer.DOM.$('#play-url');
    playUrlInput.addEventListener('change', function () {
        player.src(playUrlInput.value);
    }, false);
}

function initial() {
    updateCheckbox();
    bindEvents();
    loadAllPlugins()
        .then(values => initialPlayer())
        .catch(err => alert('下载插件失败：' + err));
}

initial();



