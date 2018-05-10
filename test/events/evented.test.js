/**
 * @file evented test
 * @author yuhui06
 * @date 2018/4/27
 */

import evented from '../../src/events/evented';

describe('evented', function () {
    beforeEach(function () {
        this.el = document.createElement('span');
        this.callback = jasmine.createSpy('callback');
    });

    it('all methods', function () {
        const obj1 = {};
        let invoked = 0;

        function callback() {
            invoked++;
        }

        evented(obj1);
        obj1.on('something', callback);
        obj1.trigger('something');
        expect(invoked).toBe(1);
        obj1.off('something', callback);
        obj1.trigger('something');
        expect(invoked).toBe(1);

        obj1.one('another_thing', callback);
        obj1.trigger('another_thing');
        expect(invoked).toBe(2);
        obj1.trigger('another_thing');
        expect(invoked).toBe(2);
    });
});


