#!/usr/bin/env node
var Scheduler = require('./scheduler'),
    Sender = require('./sender');

var net = require('./modules/net');
var http = require('http');

var sender = new Sender();
sender._do_send = function _do_send(queue) {
    console.log(+new Date(), queue);
    queue.forEach(function(data) {
        var path = '/api/write?object=dmage-host&signal=' + data.name + '&value=' + data.value;
        http.get({
            hostname: 'dmage.ru',
            port: 3000,
            path: path,
            method: 'GET'
        }, function() {
        });
    });
}

var config = [
    { check: new net(), delay: 5000 }
];

var initTasks = new Scheduler();
initTasks.throttle = 100;
initTasks.concurrentLimit = 1;

var periodicTasks = new Scheduler();
periodicTasks.throttle = 0;
periodicTasks.concurrentLimit = 10;

config.forEach(function(cfg) {
    var periodic = function(cb, task) {
        cfg.check.run(function(result) {
            sender.dispatch(result);
            periodicTasks.addTask(periodic, task.runAt + cfg.delay);
            cb();
        });
    };

    var init = function(cb) {
        cfg.check.run(function(result) {
            sender.dispatch(result);
            periodicTasks.addTask(periodic, +new Date() + cfg.delay);
            cb();
        });
    };

    initTasks.addTask(init);
});
