/**
 * @file DOM CESHI
 * @author yuhui06
 * @date 2018/4/23
 */

describe('DOM', function () {
    var DOM = larkplayer.DOM;

    it('isEl()', function () {
        expect(DOM.isEl(document.createElement('span'))).toBe(true);
        expect(DOM.isEl({nodeType: 1})).toBe(true);
        expect(DOM.isEl({})).toBe(false);
        expect(DOM.isEl('string')).toBe(false);
        expect(DOM.isEl('')).toBe(false);
        expect(DOM.isEl([])).toBe(false);
    });

    it('createElement()', function () {
        const className = 'test-el';
        const title = 'title';
        const customAttr = 'customAttr';
        const el1 = DOM.createElement('span', {className, title, customAttr});
        expect(DOM.isEl(el1)).toBe(true);
        expect(el1).toEqual(jasmine.objectContaining({
            className,
            title,
            customAttr
        }));
        expect(el1.getAttribute('class')).toBe(className);
        // className 属性应当特殊处理
        expect(el1.hasAttribute('classname')).toBe(false);
        expect(el1.getAttribute('title')).toBe(title);
        expect(el1.getAttribute('customAttr')).toBe(customAttr);

        const el2 = DOM.createElement('div', null, el1);
        expect(el2.hasChildNodes(el1)).toBe(true);

        const el3 = DOM.createElement('div', null, el1, el2);
        expect(el3.hasChildNodes(el1)).toBe(true);
        expect(el3.hasChildNodes(el2)).toBe(true);
    });

    it('prependTo()', function () {
        const parentEl = document.createElement('div');
        const childEl1 = document.createElement('span');
        const childEl2 = document.createElement('div');
        parentEl.appendChild(childEl1);
        DOM.prependTo(childEl2, parentEl);
        expect(parentEl.firstChild).toBe(childEl2);
    });

    it('hasClass()', function () {
        const el = document.createElement('div');
        el.className = 'hello dblate';
        expect(DOM.hasClass(el, 'hello')).toBe(true);
        expect(DOM.hasClass(el, 'dblate')).toBe(true);
        expect(DOM.hasClass(el, 'el')).toBe(false);
    });

    it('addClass()', function () {
        const el = document.createElement('div');
        DOM.addClass(el, 'hello');
        DOM.addClass(el, 'dblate');
        expect(el).toHaveClass('hello');
        expect(el).toHaveClass('dblate');
    });

    it('removeClass()', function () {
        const el = document.createElement('div');
        el.className = 'hello dblate';
        DOM.removeClass(el, 'hello');
        expect(el).not.toHaveClass('hello');
        expect(el).toHaveClass('dblate');
    });

    it('toggleClass()', function () {
        const el = document.createElement('div');
        el.className = 'hello dblate';
        DOM.toggleClass(el, 'dblate');
        DOM.toggleClass(el, 'yuhui06');
        expect(el).toHaveClass('hello');
        expect(el).not.toHaveClass('dblate');
        expect(el).toHaveClass('yuhui06');
    });

    it('setAttributes()', function () {
        const el = document.createElement('div');
        DOM.setAttributes(el, {
            class: 'hello dblate',
            title: 'test',
            hello: 'hello',
            isReal: true,
            notReal: false
        });

        expect(el.getAttribute('class')).toBe('hello dblate');
        expect(el.getAttribute('title')).toBe('test');
        expect(el.getAttribute('hello')).toBe('hello');
        expect(el.hasAttribute('isReal')).toBe(true);
        expect(el.hasAttribute('notReal')).toBe(false);
    });

    it('getAttributes', function () {
        const html = `
            <div class="innter-div-class" id="innter-div-id" role="button" hello=
            "hello">
                <video
                    id="inner-video-id"
                    class="inner-video-class"
                    src="https://baidu.com"
                    duration="3:50"
                    muted="muted"
                    controls="true"
                    autoplay
                    playsinline
                    loop
                >
                </vide>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);

        const innerDiv = document.getElementById('innter-div-id');
        const innerVideo = document.getElementById('inner-video-id');

        expect(DOM.getAttributes(innerDiv)).toEqual(jasmine.objectContaining({
            class: 'innter-div-class',
            id: 'innter-div-id',
            role: 'button',
            hello: 'hello'
        }));

        expect(DOM.getAttributes(innerVideo)).toEqual(jasmine.objectContaining({
            // video 上的属性均经过处理，无论值写成哪种形式，在获取时均为 true
            id: 'inner-video-id',
            class: 'inner-video-class',
            src: 'https://baidu.com',
            duration: '3:50',
            muted: true,
            controls: true,
            autoplay: true,
            playsinline: true,
            loop: true
        }));

        document.body.removeChild(document.getElementById('innter-div-id'));
    });

    it('emptyEl()', function () {
        const html = `
            <div id="test-el">
                <div class="hellp">hellp</div>
                <div class="xx">
                    <span>jasmine</span>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);

        const el = document.getElementById('test-el');
        DOM.emptyEl(el);
        expect(el.childNodes.length).toBe(0);
       
        document.body.removeChild(document.getElementById('test-el')); 
    });

});













