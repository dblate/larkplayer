window.triggerEvent = function (el, eventName) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    return !el.dispatchEvent(event);
};