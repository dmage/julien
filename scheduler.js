Scheduler = module.exports = function Scheduler(tasks) {
    this._queue = [];
    this._activeTasks = 0;
    this._lastWasAt = 0;
    this._nextAt = 0;
    this._timer = null;
}

Scheduler.prototype.throttle = 0;
Scheduler.prototype.concurrentLimit = Number.POSITIVE_INFINITY;

Scheduler.prototype.addTask = function addTask(f, runAt) {
    var _this = this,
        _queue = _this._queue,
        task = {
            f: f,
            runAt: runAt || 0,
        };

    for (var i = _queue.length - 1; i >= -1; --i) {
        if (i == -1 || task.runAt >= _queue[i].runAt) {
            _queue.splice(i + 1, 0, task);
            break;
        }
    }
    _this._setupTimer();
}

Scheduler.prototype._processQueue = function _processQueue() {
    var _this = this,
        _queue = _this._queue,
        now = +new Date();

    if (_queue.length > 0) {
        if (_queue[0].runAt <= now + 1) { // + 1 because setTimeout may fire a bit early
            console.log(+new Date(), this.toString(), 'dispatching task', {lag: now - _queue[0].runAt});
            var task = _queue.shift();
            _this._dispatch(task);
        } else {
            console.log(+new Date(), this.toString(), 'head task not ready');
        }
    } else {
        console.log(+new Date(), this.toString(), 'empty queue');
    }

    if (_queue.length > 0) {
        _this._setupTimer();
    }
}

Scheduler.prototype._setupTimer = function _setupTimer() {
    var _this = this,
        _queue = _this._queue,
        now = +new Date(),
        delay;

    if (_this._queue.length === 0) {
        console.log(+new Date(), this.toString(), 'no more tasks');
        return;
    }

    if (_this._activeTasks >= _this.concurrentLimit) {
        console.log(+new Date(), this.toString(), 'too many tasks');
        return;
    }

    var nextAt = Math.max(_this._lastWasAt + _this.throttle, _queue[0].runAt);
    delay = nextAt - now;
    if (delay < 0) {
        delay = 0;
    }
    if (delay !== delay) {
        throw new Error("invalid delay for setTimeout: " + delay);
    }

    nextAt = now + delay;
    if (_this._timer === null || _this._nextAt > nextAt) {
        clearTimeout(_this._timer);

        _this._nextAt = nextAt;
        console.log(+new Date(), this.toString(), 'new timer', delay, {nextAt: nextAt});
        _this._timer = setTimeout(function() {
            _this._lastWasAt = +new Date();
            _this._timer = null;

            _this._processQueue();
        }, delay);
    } else {
        console.log(+new Date(), this.toString(), 'keep old timer');
    }
}

Scheduler.prototype._dispatch = function _dispatch(task) {
    var _this = this,
        _queue = this._queue;

    _this._activeTasks += 1;
    task.f(function() {
        _this._activeTasks -= 1;
        _this._setupTimer();
    }, task);
}
