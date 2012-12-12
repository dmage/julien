Sender = module.exports = function Sender(config) {
    config = config || {};

    this._sendQueue = [];

    this._sendTimer = null;
    this._sendAt = null;

    this._delay = config.delay || 1000;
}

Sender.prototype.dispatch = function dispatch(values) {
    var _this = this,
        _sendQueue = _this._sendQueue,
        args = [_sendQueue.length, 0].concat(values),
        delay;

    Array.prototype.splice.apply(_sendQueue, args);

    if (_this._sendTimer === null) {
        if (_this._sendAt === null) {
            delay = _this._delay;
        } else {
            delay = _this.sendAt - +new Date();
        }

        if (delay <= 0) {
            _this._send();
        } else {
            _this._sendTimer = setTimeout(function() {
                _this._send();
            }, delay);
        }
    }
}

Sender.prototype._send = function _send() {
    var _this = this,
        _q = _this._sendQueue;

    if (_q.length > 0) {
        _this._sendQueue = [];
        _this._do_send(_q);

        _this._sendAt = +new Date() + _this._delay;
        _this._sendTimer = setTimeout(function() {
            _this._send();
        }, _this._delay);
    } else {
        _this._sendTimer = null;
    }
}

Sender.prototype._do_send = function _do_send(queue) {
    console.log(+new Date(), queue);
}
