var Scheduler = require('./scheduler');

Sender = module.exports = function Sender(config) {
    config = config || {};

    this._sendQueue = [];
    this._scheduler = new Scheduler();
    this._scheduler.throttle = config.delay || 1000;
    this._scheduler.toString = function() { return "[Sender._scheduler]"; };
}

Sender.prototype.dispatch = function dispatch(values) {
    var _this = this,
        _scheduler = _this._scheduler,
        _sendQueue = _this._sendQueue,
        args = [_sendQueue.length, 0].concat(values);

    Array.prototype.splice.apply(_sendQueue, args);

    if (_scheduler._timer === null) {
        _scheduler._lastWasAt = _scheduler._lastWasAt || +new Date();
        _scheduler.addTask(function() {
            _this._send();
        });
    }
}

Sender.prototype._send = function _send() {
    var _this = this,
        _q = _this._sendQueue;

    if (_q.length > 0) {
        _this._sendQueue = [];
        _this._do_send(_q);
    }
}

Sender.prototype._do_send = function _do_send(queue) {
    console.log(+new Date(), queue);
}
