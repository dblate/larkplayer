describe('Events', function () {
    var Events = larkplayer.Events;

    beforeEach(function () {
        this.el = document.createElement('div');
        this.callback1 = jasmine.createSpy('callback1');
        this.callback2 = jasmine.createSpy('callback2');
    });

    it('single event single callback', function () {
        Events.on(this.el, 'click', this.callback1);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'click');
        expect(this.callback1).toHaveBeenCalledTimes(2);

        Events.trigger(this.el, 'click', this.callback1);
        expect(this.callback1).toHaveBeenCalledTimes(3);

        Events.off(this.el, 'click', this.callback1);
        triggerEvent(this.el, 'click');
        Events.trigger(this.el, 'click', this.callback1);
        expect(this.callback1).toHaveBeenCalledTimes(3);

        Events.one(this.el, 'click', this.callback2);
        triggerEvent(this.el, 'click');
        expect(this.callback2).toHaveBeenCalledTimes(1);
        triggerEvent(this.el, 'click');
        expect(this.callback2).toHaveBeenCalledTimes(1);
    });

    it('single event multiple callbacks', function () {
        Events.on(this.el, 'click', this.callback1);
        Events.on(this.el, 'click', this.callback2);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'click');
        expect(this.callback1).toHaveBeenCalledTimes(2);
        expect(this.callback2).toHaveBeenCalledTimes(2);

        Events.trigger(this.el, 'click');
        expect(this.callback1).toHaveBeenCalledTimes(3);
        expect(this.callback2).toHaveBeenCalledTimes(3);

        Events.off(this.el, 'click');
        triggerEvent(this.el, 'click');
        Events.trigger(this.el, 'click');
        expect(this.callback1).toHaveBeenCalledTimes(3);
        expect(this.callback2).toHaveBeenCalledTimes(3);

        Events.one(this.el, 'click', this.callback1);
        Events.one(this.el, 'click', this.callback2);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'click');
        Events.trigger(this.el, 'click');
        expect(this.callback1).toHaveBeenCalledTimes(4);
    });

    it('multiple events single callback', function () {
        Events.on(this.el, ['click', 'mouseover'], this.callback1);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'mouseover');
        expect(this.callback1).toHaveBeenCalledTimes(2);

        Events.trigger(this.el, 'click');
        expect(this.callback1).toHaveBeenCalledTimes(3);
        Events.trigger(this.el, 'mouseover');
        expect(this.callback1).toHaveBeenCalledTimes(4);

        Events.off(this.el, ['click', 'mouseover']);
        triggerEvent(this.el, 'click');
        Events.trigger(this.el, 'mouseover');
        expect(this.callback1).toHaveBeenCalledTimes(4);

        Events.one(this.el, ['click', 'mouseout'], this.callback2);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'mouseout');
        triggerEvent(this.el, 'mouseout');
        Events.trigger(this.el, 'click');
        Events.trigger(this.el, 'mouseout');
        expect(this.callback2).toHaveBeenCalledTimes(2);
    });

    it('multiple events multiple callbacks', function () {
        Events.on(this.el, ['click', 'keydown'], this.callback1);
        Events.on(this.el, ['click', 'keydown'], this.callback2);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'keydown');
        expect(this.callback1).toHaveBeenCalledTimes(2);
        expect(this.callback2).toHaveBeenCalledTimes(2);

        Events.trigger(this.el, 'click');
        Events.trigger(this.el, 'keydown');
        expect(this.callback1).toHaveBeenCalledTimes(4);
        expect(this.callback2).toHaveBeenCalledTimes(4);

        Events.off(this.el, ['click', 'keydown']);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'keydown');
        Events.trigger(this.el, 'click');
        Events.trigger(this.el, 'keydown');
        expect(this.callback1).toHaveBeenCalledTimes(4);
        expect(this.callback2).toHaveBeenCalledTimes(4);

        Events.one(this.el, ['click', 'keydown'], this.callback1);
        Events.one(this.el, ['click', 'keydown'], this.callback2);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'keydown');
        Events.trigger(this.el, 'click');
        Events.trigger(this.el, 'keydown');
        expect(this.callback1).toHaveBeenCalledTimes(6);
        expect(this.callback2).toHaveBeenCalledTimes(6);
    });

    it('remove all events', function () {
        Events.on(this.el, ['click', 'keyup'], this.callback1);
        Events.on(this.el, ['click', 'keyup'], this.callback2);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'keyup');
        Events.trigger(this.el, 'click');
        expect(this.callback1).toHaveBeenCalledTimes(3);
        expect(this.callback2).toHaveBeenCalledTimes(3);

        Events.off(this.el);
        triggerEvent(this.el, 'click');
        triggerEvent(this.el, 'keyup');
        Events.trigger(this.el, 'click');
        Events.trigger(this.el, 'keyup');
        expect(this.callback1).toHaveBeenCalledTimes(3);
        expect(this.callback2).toHaveBeenCalledTimes(3)
    });
});


