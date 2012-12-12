exports = module.exports = function Scheduler(tasks, resultHandler) {
    this._queue = [];
    this._tasks = tasks;
    this.resultHandler = resultHandler;

    this.run();
}

exports.prototype.run = function run() {
    this.firstRun();
    this.processQueue();
}

exports.prototype.busyWaitDelay = 1000;

exports.prototype.firstRunDelay = 100;

exports.prototype.dispatch = function dispatch(task, callback) {
    var _this = this,
        _queue = this._queue;

    task.run(function(result) {
        _this.resultHandler(result);

        var now = +new Date();
        task._runAt += task.delay;
        if (task._runAt < now) {
            console.log('task too slow', task);

            var n = Math.floor((now - task._runAt)/task.delay);
            task._runAt += (n + 1)*task.delay;
        }

        for (var i = _queue.length - 1; i >= -1; --i) {
            if (i == -1 || task._runAt >= _queue[i]._runAt) {
                _queue.splice(i + 1, 0, task);
                break;
            }
        }

        if (callback) {
            callback();
        }
    });
}

exports.prototype.firstRun = function firstRun() {
    var _this = this,
        _tasks = _this._tasks,
        firstRunDelay = _this.firstRunDelay;

    if (_tasks.length == 0) {
        return;
    }

    var task = _tasks.shift();
    task._runAt = +new Date();
    this.dispatch(task, function() {
        setTimeout(function() {
            _this.firstRun();
        }, firstRunDelay);
    });
}

exports.prototype.processQueue = function processQueue() {
    var _this = this,
        _queue = _this._queue;

    var now = +new Date();
    if (_queue.length > 0 && _queue[0]._runAt < now) {
        var task = _queue.shift();
        _this.dispatch(task);
    }

    var delay = _this.busyWaitDelay;
    if (_queue.length > 0) {
        delay = _queue[0]._runAt - now;
    }

    setTimeout(function() {
        _this.processQueue();
    }, delay);
}
