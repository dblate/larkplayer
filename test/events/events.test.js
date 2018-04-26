/**
 * @file Events test
 * @author yuhui06
 * @date 2018/4/27
 */

describe('Events', function () {
    const Events = larkplayer.Events;

    it('on()', function () {
        const el = document.createElement('div');
        let invoked = 0;
        function callback() {
            invoked++;
        }

        Events.on(el, 'click', callback);
        Events.on(el, 'something', callback);

        triggerEvent(el, 'click');
        expect(invoked).toBe(1);

        triggerEvent(el, 'something');
        expect(invoked).toBe(2);
    });

    it('off()', function () {
        const el = document.createElement('div');
        let invoked = 0;
        function callback() {
            invoked++;
        }

        Events.on(el, 'click', callback);
        triggerEvent(el, 'click');
        expect(invoked).toBe(1);

        Events.off(el, 'click', callback);
        triggerEvent(el, 'click');
        expect(invoked).toBe(1);
    });

    it('one()', function () {
        const el = document.createElement('div');
        let invoked = 0;
        function callback() {
            invoked++;
        }

        Events.one(el, 'click', callback);

        triggerEvent(el, 'click');
        expect(invoked).toBe(1);

        triggerEvent(el, 'click');
        expect(invoked).toBe(1);
    });

    it('trigger()', function () {
        const el = document.createElement('div');
        let invoked = 0;
        let dispatchedEvent;
        const initialDict = {
            bubbles: true,
            cancelable: true,
            detail: 'detail'
        };

        function callback(event) {
            invoked++;
            dispatchedEvent = event;
        }

        Events.on(el, 'test_trigger', callback);
        Events.trigger(el, 'test_trigger', initialDict);
        expect(invoked).toBe(1);
        expect(dispatchedEvent).toEqual(jasmine.objectContaining(initialDict));
    });
});


