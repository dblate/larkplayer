import evented from '../../src/js/events/evented';

describe('evented', function () {
    beforeEach(function () {
        this.el = document.createElement('span');
        this.callback = jasmine.createSpy('callback');
    });

    it('evented with eventBusKey', function () {
        var o = {};
        evented(o, {eventBusKey: this.el});
        expect(o.on).toEqual(jasmine.any(Function));
        expect(o.off).toEqual(jasmine.any(Function));
        expect(o.one).toEqual(jasmine.any(Function));
        expect(o.trigger).toEqual(jasmine.any(Function));

        o.on('click', this.callback);
        triggerEvent(this.el, 'click');
        o.trigger('click', this.callback);
        expect(this.callback).toHaveBeenCalledTimes(2);

        o.off('click');
        triggerEvent(this.el, 'click');
        o.trigger('click');
        expect(this.callback).toHaveBeenCalledTimes(2);
    });

    it('evented without eventBusKey', function () {
        var o = {};
        evented(o);
        expect(o.on).toEqual(jasmine.any(Function));
        expect(o.off).toEqual(jasmine.any(Function));
        expect(o.one).toEqual(jasmine.any(Function));
        expect(o.trigger).toEqual(jasmine.any(Function));

        o.on('click', this.callback);
        o.trigger('click');
        expect(this.callback).toHaveBeenCalledTimes(1);
        o.off('click');
        o.trigger('click');
        expect(this.callback).toHaveBeenCalledTimes(1);
    });
});